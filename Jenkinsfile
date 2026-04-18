pipeline {
    agent any

    environment {
        PROJECT_DIR    = '/workspace/crow-chat'
        BACKEND_IMAGE  = 'crow-chat-backend'
        FRONTEND_IMAGE = 'crow-chat-frontend'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        // ── 1. Verify workspace ───────────────────────────────────
        stage('Checkout') {
            steps {
                sh 'ls ${PROJECT_DIR}'
            }
        }

        // ── 2. Validate compose file ──────────────────────────────
        stage('Validate') {
            steps {
                sh '''
                    cd ${PROJECT_DIR}
                    docker compose config -q
                    echo "docker-compose.yml is valid"
                '''
            }
        }

        // ── 3. Build images in parallel ───────────────────────────
        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        sh '''
                            cd ${PROJECT_DIR}
                            docker build \
                              -t ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                              -t ${BACKEND_IMAGE}:latest \
                              ./backend
                        '''
                    }
                }
                stage('Build Frontend') {
                    steps {
                        sh '''
                            cd ${PROJECT_DIR}
                            docker build \
                              --build-arg REACT_APP_BACKEND_URL=http://localhost:5000 \
                              -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                              -t ${FRONTEND_IMAGE}:latest \
                              ./frontend
                        '''
                    }
                }
            }
        }

        // ── 4. Smoke test — verify images exist ───────────────────
        stage('Smoke Test') {
            steps {
                sh '''
                    echo "--- Verifying built images ---"

                    docker image inspect ${BACKEND_IMAGE}:latest > /dev/null 2>&1 \
                      && echo "PASS: backend image exists" \
                      || (echo "FAIL: backend image missing" && exit 1)

                    docker image inspect ${FRONTEND_IMAGE}:latest > /dev/null 2>&1 \
                      && echo "PASS: frontend image exists" \
                      || (echo "FAIL: frontend image missing" && exit 1)

                    echo "Smoke test passed"
                '''
            }
        }

        // ── 5. Deploy ─────────────────────────────────────────────
        stage('Deploy') {
            environment {
                DATABASE_URL = credentials('neon-database-url')
            }
            steps {
                sh '''
                    # Create shared network
                    docker network create chat-net 2>/dev/null || true

                    # Remove old containers
                    docker stop chat-backend chat-frontend 2>/dev/null || true
                    docker rm   chat-backend chat-frontend 2>/dev/null || true

                    # Start backend
                    docker run -d \
                      --name chat-backend \
                      --network chat-net \
                      --restart unless-stopped \
                      -p 5000:5000 \
                      -e DATABASE_URL="${DATABASE_URL}" \
                      -e PORT=5000 \
                      -e CLIENT_URL=http://localhost:3000 \
                      ${BACKEND_IMAGE}:latest

                    # Start frontend
                    docker run -d \
                      --name chat-frontend \
                      --network chat-net \
                      --restart unless-stopped \
                      -p 3000:80 \
                      ${FRONTEND_IMAGE}:latest

                    echo "Deployed build #${BUILD_NUMBER}"
                    echo "Frontend → http://localhost:3000"
                    echo "Backend  → http://localhost:5000"
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded — build #${BUILD_NUMBER}"
        }
        failure {
            echo "Pipeline failed — check logs above"
            sh 'docker stop chat-backend chat-frontend 2>/dev/null || true'
        }
        cleanup {
            sh 'docker image prune -f || true'
        }
    }
}
