#!/usr/bin/env bash
#
# run.sh — build and run the app-wat (WORLD ADVANCED TECHNOLOGY) Spring Boot app.
#
# Usage:
#   ./run.sh            Build the jar (if needed) and run it            [default]
#   ./run.sh dev        Run straight from source with Maven (hot dev)
#   ./run.sh build      Only build the runnable jar
#   ./run.sh clean      Delete the build output (target/)
#   ./run.sh help       Show this help
#
# Flags (any mode):
#   --skip-tests        Do not run unit tests during the build (faster)
#
# Environment (all optional — sensible defaults are applied below):
#   PORT                      HTTP port                       (default 9090)
#   WAT_DATA_DIR              H2 database directory           (default ./data)
#   WAT_ADMIN_USER            Superadmin username             (default NGWA23)
#   WAT_ADMIN_PASSWORD_HASH   Superadmin BCrypt hash          (default: built-in)
#   WAT_MAIL_ENABLED          Enable email sending (true)     (default false)
#   MAIL_HOST/PORT/USERNAME/PASSWORD   SMTP server settings
#
# Example:
#   PORT=8081 WAT_DATA_DIR=/var/lib/watapp ./run.sh

# --- Safety flags -----------------------------------------------------------
# -e  : exit immediately if any command fails
# -u  : treat use of an unset variable as an error
# -o pipefail : a pipeline fails if ANY command in it fails (not just the last)
set -euo pipefail

# --- Always work from the project root --------------------------------------
# ${BASH_SOURCE[0]} is this script's path; cd to its directory so the script
# works no matter where it is called from.
cd "$(dirname "${BASH_SOURCE[0]}")"

# --- Configuration (env var OR default) -------------------------------------
# ${VAR:-default} means "use $VAR if set, otherwise use default".
# 'export' makes these visible to the Java process we launch below.
export PORT="${PORT:-9090}"
export WAT_DATA_DIR="${WAT_DATA_DIR:-./data}"

MVNW="./mvnw"                 # the project's bundled Maven (no global install needed)
JAR="target/app-wat.jar"      # produced by `mvn package` (finalName=app-wat)
MVN_FLAGS="-B -ntp"           # -B batch/non-interactive, -ntp hide transfer spam

# --- Parse arguments --------------------------------------------------------
CMD="run"                     # default command when none is given
SKIP_TESTS=""
for arg in "$@"; do
  case "$arg" in
    run|dev|build|clean|help) CMD="$arg" ;;
    --skip-tests)             SKIP_TESTS="-DskipTests" ;;
    *) echo "Unknown argument: $arg (try: ./run.sh help)"; exit 2 ;;
  esac
done

# --- Helpers ----------------------------------------------------------------
# Make the Maven wrapper executable (git sometimes drops the +x bit).
chmod +x "$MVNW" 2>/dev/null || true

# Portable usage text (a here-doc prints the block verbatim until the marker).
usage() {
  cat <<'EOF'
run.sh — build and run the app-wat (WORLD ADVANCED TECHNOLOGY) Spring Boot app.

Commands:
  ./run.sh            Build the jar (if needed) and run it            [default]
  ./run.sh dev        Run straight from source with Maven (hot dev)
  ./run.sh build      Only build the runnable jar
  ./run.sh clean      Delete the build output (target/)
  ./run.sh help       Show this help

Flags:
  --skip-tests        Skip unit tests during the build (faster)

Environment (optional; defaults in parentheses):
  PORT (9090)                      HTTP port
  WAT_DATA_DIR (./data)            H2 database directory
  WAT_ADMIN_USER (NGWA23)          Superadmin username
  WAT_ADMIN_PASSWORD_HASH          Superadmin BCrypt hash (built-in default)
  WAT_MAIL_ENABLED (false)         Enable email sending
  MAIL_HOST/PORT/USERNAME/PASSWORD SMTP server settings

Example:
  PORT=8081 WAT_DATA_DIR=/var/lib/watapp ./run.sh
EOF
}

print_banner() {
  echo "────────────────────────────────────────────────────────"
  echo " app-wat  →  http://localhost:${PORT}"
  echo " admin    →  http://localhost:${PORT}/admin  (user: ${WAT_ADMIN_USER:-NGWA23})"
  echo " data dir →  ${WAT_DATA_DIR}"
  echo "────────────────────────────────────────────────────────"
}

# Build the fat jar. `package` compiles, (optionally) tests, and bundles
# everything into one runnable jar under target/.
build_jar() {
  echo "==> Building $JAR ..."
  "$MVNW" $MVN_FLAGS clean package $SKIP_TESTS
}

# --- Commands ---------------------------------------------------------------
case "$CMD" in
  help)
    usage
    ;;

  clean)
    # Remove build artifacts; '|| true' so it still succeeds if target/ is gone.
    echo "==> Cleaning target/ ..."
    "$MVNW" $MVN_FLAGS clean
    ;;

  build)
    build_jar
    echo "==> Done: $JAR"
    ;;

  dev)
    # Run from source via the Spring Boot Maven plugin. Best for development:
    # no separate packaging step, and it restarts quickly on rebuild.
    print_banner
    echo "==> Starting (Maven spring-boot:run). Ctrl+C to stop."
    "$MVNW" $MVN_FLAGS spring-boot:run
    ;;

  run)
    # Build the jar only if it is missing, then launch it with plain java.
    # This mirrors how the app runs in production / inside the Docker image.
    [ -f "$JAR" ] || build_jar
    print_banner
    echo "==> Starting $JAR with Java $(java -version 2>&1 | head -1). Ctrl+C to stop."
    # 'exec' replaces this shell with the Java process so Ctrl+C / signals and
    # the exit code pass straight through (important when run under systemd/CI).
    exec java -jar "$JAR"
    ;;
esac
