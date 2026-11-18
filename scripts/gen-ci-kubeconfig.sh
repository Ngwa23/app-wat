#!/usr/bin/env bash
#
# gen-ci-kubeconfig.sh
# -----------------------------------------------------------------------------
# Creates a SCOPED ServiceAccount for CI deploys and emits a portable kubeconfig
# (CA embedded, long-lived token) for the app-wat Kubernetes cluster, then
# base64-encodes it for the GitHub Actions `KUBECONFIG` secret.
#
# WHY a ServiceAccount instead of admin.conf?
#   admin.conf is full cluster-admin. This script instead grants the CI user:
#     - `edit` rights ONLY inside the `watapps` namespace (RoleBinding), and
#     - the minimum cluster-wide right to get/create that namespace.
#   If the token leaks, the blast radius is one namespace, not the cluster.
#
# PREREQUISITES:
#   - Run this from a machine that can already reach the cluster AS AN ADMIN
#     (e.g. with /etc/kubernetes/admin.conf). Point kubectl at it first:
#         export KUBECONFIG=/path/to/admin.conf
#   - `kubectl` on PATH. `gh` CLI only needed if you let this script upload.
#
# USAGE:
#   ./scripts/gen-ci-kubeconfig.sh                 # writes ci-kubeconfig + .b64
#   ./scripts/gen-ci-kubeconfig.sh --upload        # also runs `gh secret set`
# -----------------------------------------------------------------------------
set -euo pipefail

# ---- Settings (edit here if your cluster differs) ---------------------------
NAMESPACE="watapps"                          # Target namespace for the app.
SA_NAME="github-deployer"                     # ServiceAccount used by CI.
CLUSTER_NAME="kubernetes"                     # Name recorded in the kubeconfig.
SERVER_URL="https://192.168.100.12:6443"      # Cluster API server.
TOKEN_SECRET="${SA_NAME}-token"               # Secret that holds the long-lived token.
REPO="Ngwa23/app-wat"                         # GitHub repo for --upload.
OUT="ci-kubeconfig"                           # Output kubeconfig file.
OUT_B64="ci-kubeconfig.b64"                   # Base64 of the above (the secret value).

# ---- Portable base64 decode (GNU uses -d, BSD/macOS uses -D) -----------------
b64d() { base64 --decode 2>/dev/null || base64 -D; }

echo ">> Using cluster: ${SERVER_URL} (context: $(kubectl config current-context))"
echo ">> Verifying admin access..."
kubectl version --request-timeout=10s >/dev/null

# ---- 1) Namespace ------------------------------------------------------------
echo ">> Ensuring namespace '${NAMESPACE}' exists..."
kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

# ---- 2) ServiceAccount -------------------------------------------------------
echo ">> Creating ServiceAccount '${SA_NAME}'..."
kubectl -n "${NAMESPACE}" create serviceaccount "${SA_NAME}" \
  --dry-run=client -o yaml | kubectl apply -f -

# ---- 3) RBAC -----------------------------------------------------------------
# 3a) Full edit rights, but ONLY inside the watapps namespace.
echo ">> Granting 'edit' inside '${NAMESPACE}'..."
kubectl -n "${NAMESPACE}" create rolebinding "${SA_NAME}-edit" \
  --clusterrole=edit \
  --serviceaccount="${NAMESPACE}:${SA_NAME}" \
  --dry-run=client -o yaml | kubectl apply -f -

# 3b) Minimal cluster-wide right so the CI job's `kubectl create namespace`
#     (idempotent apply) does not get 'forbidden'. get/list/create only.
echo ">> Granting minimal cluster-wide namespace get/create..."
kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: watapps-namespace-manager
rules:
  - apiGroups: [""]
    resources: ["namespaces"]
    verbs: ["get", "list", "create"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: ${SA_NAME}-namespace-manager
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: watapps-namespace-manager
subjects:
  - kind: ServiceAccount
    name: ${SA_NAME}
    namespace: ${NAMESPACE}
EOF

# ---- 4) Long-lived token secret (k8s 1.24+ no longer auto-creates one) -------
echo ">> Creating a non-expiring token Secret for the ServiceAccount..."
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: ${TOKEN_SECRET}
  namespace: ${NAMESPACE}
  annotations:
    kubernetes.io/service-account.name: ${SA_NAME}
type: kubernetes.io/service-account-token
EOF

# ---- 5) Wait for the control plane to populate the token ---------------------
echo ">> Waiting for the token to be issued..."
TOKEN=""
for _ in $(seq 1 15); do
  TOKEN="$(kubectl -n "${NAMESPACE}" get secret "${TOKEN_SECRET}" \
            -o jsonpath='{.data.token}' 2>/dev/null | b64d || true)"
  [ -n "${TOKEN}" ] && break
  sleep 1
done
if [ -z "${TOKEN}" ]; then
  echo "!! Token was not populated. Check the token-controller on the cluster." >&2
  exit 1
fi

# ---- 6) Extract the cluster CA certificate -----------------------------------
echo ">> Extracting cluster CA certificate..."
CA_FILE="$(mktemp)"
trap 'rm -f "${CA_FILE}"' EXIT
kubectl -n "${NAMESPACE}" get secret "${TOKEN_SECRET}" \
  -o jsonpath='{.data.ca\.crt}' | b64d > "${CA_FILE}"

# ---- 7) Assemble the portable kubeconfig -------------------------------------
echo ">> Writing ${OUT}..."
rm -f "${OUT}"
kubectl config set-cluster "${CLUSTER_NAME}" \
  --server="${SERVER_URL}" \
  --certificate-authority="${CA_FILE}" \
  --embed-certs=true \
  --kubeconfig="${OUT}"
kubectl config set-credentials "${SA_NAME}" \
  --token="${TOKEN}" \
  --kubeconfig="${OUT}"
kubectl config set-context "default" \
  --cluster="${CLUSTER_NAME}" \
  --user="${SA_NAME}" \
  --namespace="${NAMESPACE}" \
  --kubeconfig="${OUT}"
kubectl config use-context "default" --kubeconfig="${OUT}"

# ---- 8) Smoke test with the new restricted credentials -----------------------
echo ">> Verifying the scoped kubeconfig can see '${NAMESPACE}'..."
KUBECONFIG="${OUT}" kubectl get pods -n "${NAMESPACE}" >/dev/null && echo "   OK"

# ---- 9) Base64-encode for the GitHub secret ----------------------------------
base64 < "${OUT}" | tr -d '\n' > "${OUT_B64}"
echo ">> Wrote ${OUT_B64} (paste its contents as the KUBECONFIG secret)."

# ---- 10) Optional upload via gh ----------------------------------------------
if [ "${1:-}" = "--upload" ]; then
  echo ">> Uploading KUBECONFIG secret to ${REPO}..."
  gh secret set KUBECONFIG --repo "${REPO}" < "${OUT_B64}"
  echo "   Done."
else
  echo
  echo "Next: add the secret, then delete the plaintext files."
  echo "  gh secret set KUBECONFIG --repo ${REPO} < ${OUT_B64}"
  echo "  # ...or paste ${OUT_B64} in repo Settings > Secrets > Actions"
  echo "  rm -f ${OUT} ${OUT_B64}      # remove plaintext creds when done"
fi
