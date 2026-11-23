// Jenkinsfile for app-wat (WORLD ADVANCED TECHNOLOGY website)
// Spring Boot 3.5.6 / Java 17 — built with the repo's Maven wrapper (Maven 3.9.10).
//
// Pipeline flow:
//   Checkout -> Build & Test (JaCoCo) -> SonarQube + Quality Gate
//            -> Package -> Docker build & push -> Deploy to Kubernetes
//
// Optional stages (Sonar, Docker push, Deploy) are gated by the parameters below,
// so the same file works for a plain CI build and a full CD run.

pipeline {
    agent any

    parameters {
        booleanParam(name: 'RUN_SONAR',    defaultValue: true,  description: 'Run SonarQube analysis + quality gate')
        booleanParam(name: 'DEPLOY_NEXUS', defaultValue: true,  description: 'Publish the artifact to Nexus (snapshots go to app-wat-snapshots)')
        booleanParam(name: 'PUSH_IMAGE',   defaultValue: true,  description: 'Build and push the Docker image')
        booleanParam(name: 'DEPLOY_K8S',   defaultValue: false, description: 'Apply the Kubernetes manifests')
    }

    environment {
        // --- Image coordinates: change REGISTRY to your registry (e.g. ghcr.io/you) ---
        REGISTRY   = 'docker.io/ngwaochang'
        IMAGE_NAME = 'app-wat'
        // Immutable, traceable tag: <pom version>-<build>-<short sha>
        // Keep in step with <version> in pom.xml.
        APP_VERSION = '3.0.1-SNAPSHOT'
        IMAGE_TAG   = "${APP_VERSION}-${BUILD_NUMBER}-${GIT_COMMIT.take(7)}"
        IMAGE       = "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

        // --- Jenkins credential IDs (create these in Manage Jenkins > Credentials) ---
        REGISTRY_CREDS = 'registry-credentials'   // username/password for the Docker registry
        SONAR_TOKEN    = credentials('sonar-token') // secret text; consumed by sonar-maven-plugin

        // Name of the SonarQube server configured in Manage Jenkins > System
        SONARQUBE_ENV = 'SonarQube'

        // Make the wrapper runnable regardless of git file-mode handling
        MVN = './mvnw -B -ntp'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }

    // Jenkins-managed JDK 17 (configure under Manage Jenkins > Tools).
    // Remove this block if your agents already expose a JDK 17 on PATH.
    tools {
        jdk 'jdk-17'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'chmod +x mvnw'
                sh '${MVN} -version'
            }
        }

        stage('Build & Test') {
            steps {
                // `verify` runs unit tests and produces the JaCoCo XML report
                // that SonarQube reads (target/site/jacoco/jacoco.xml).
                sh '${MVN} clean verify'
            }
            post {
                always {
                    junit testResults: 'target/surefire-reports/*.xml', allowEmptyResults: true
                    // Requires the "JaCoCo" plugin; harmless to drop if not installed.
                    jacoco execPattern: 'target/jacoco.exec',
                           classPattern: 'target/classes',
                           sourcePattern: 'src/main/java'
                }
            }
        }

        stage('SonarQube Analysis') {
            when { expression { return params.RUN_SONAR } }
            steps {
                withSonarQubeEnv("${SONARQUBE_ENV}") {
                    sh '${MVN} sonar:sonar -Dsonar.token=${SONAR_TOKEN}'
                }
            }
        }

        stage('Quality Gate') {
            when { expression { return params.RUN_SONAR } }
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Deploy to Nexus') {
            when { expression { return params.DEPLOY_NEXUS } }
            steps {
                // Publishes the built artifact to Nexus. Maven routes by version:
                // a *-SNAPSHOT version (current: 3.0.1-SNAPSHOT) goes to the
                // app-wat-snapshots repo; a release version goes to app-wat-releases.
                // Tests already ran in 'Build & Test', so skip them here.
                //
                // 'nexus-credentials' is a username/password credential (Manage
                // Jenkins > Credentials). settings.xml.example maps the bound
                // NEXUS_USERNAME/NEXUS_PASSWORD env vars onto the <server> ids.
                withCredentials([usernamePassword(
                        credentialsId: 'nexus-credentials',
                        usernameVariable: 'NEXUS_USERNAME',
                        passwordVariable: 'NEXUS_PASSWORD')]) {
                    sh '${MVN} deploy -DskipTests -s settings.xml.example'
                }
            }
        }

        stage('Docker Build & Push') {
            when { expression { return params.PUSH_IMAGE } }
            steps {
                script {
                    // Multi-stage Dockerfile in the repo builds the fat jar itself.
                    def img = docker.build("${IMAGE}", '--pull .')
                    docker.withRegistry("https://${REGISTRY}", "${REGISTRY_CREDS}") {
                        img.push()
                        img.push('latest')
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when { expression { return params.DEPLOY_K8S } }
            steps {
                // Requires `kubectl` on the agent and a kubeconfig credential.
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh '''
                        kubectl set image deployment/app-wat app-wat=${IMAGE} --record || \
                          kubectl apply -f deployment.yml -f service.yml
                        kubectl rollout status deployment/app-wat --timeout=120s
                    '''
                }
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'target/app-wat.jar', fingerprint: true, onlyIfSuccessful: true
            echo "Built ${IMAGE}"
        }
        failure {
            echo "Build failed: ${env.BUILD_URL}"
        }
        always {
            cleanWs()
        }
    }
}
