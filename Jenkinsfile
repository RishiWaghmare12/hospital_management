pipeline {
    agent any

    environment {
        IMAGE_NAME = "rishi008/hospitalmanagement" // lowercase is safer
        IMAGE_TAG = "1.0.0"
    }

    stages {

        stage('Try') {
            steps {
                echo "hello i have started CICD first time"
            }
        }

        stage('Checkout Code') {
            steps {
                 git url: 'https://github.com/RishiWaghmare12/hospital_management.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    def customImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                    env.IMAGE_ID = customImage.id
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push()
                    }
                }
            }
        }
    }

    post {
        success { echo "Docker image successfully built and pushed 🚀" }
        failure { echo "Pipeline failed ❌" }
    }
}