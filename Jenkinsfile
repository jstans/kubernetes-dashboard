pipeline {
    agent any
    
    environment {
        PULUMI_CLOUD_URL = 'https://s3.console.aws.amazon.com/s3/buckets/<my-pulumi-state-bucket>/.pulumi'
        PULUMI_PREVIEW = true
    }

    stages {
        stage ("Checkout code") {
            steps {
                // The examples repo contains several repos. To avoid checking out every single project under it,
                // upload this project into your own repo.
                git url: "git@github.com:your-repo/azure-ts-appservice-springboot.git",
                    // Set your credentials id value here.
                    // See https://jenkins.io/doc/book/using/using-credentials/#adding-new-global-credentials
                    credentialsId: "youCredentialsId",
                    // You could define a new stage that specifically runs for, say, feature/* branches
                    // and run only "pulumi preview" for those.
                    branch: "master"
            }
        }
        
        stage ("Install dependencies") {
            steps {
                sh "curl -fsSL https://get.pulumi.com | sh"
                sh "$HOME/.pulumi/bin/pulumi version"
            }
        }
        
        stage ("Pulumi up") {
            steps {
                nodejs(nodeJSInstallationName: "node 8.9.4") {
                    withEnv(["PATH+PULUMI=$HOME/.pulumi/bin"]) {
                        sh "cd infrastructure && npm install"
                        sh "pulumi login --cloud-url ${PULUMI_CLOUD_URL}"
                        sh "pulumi stack select ${PULUMI_STACK} --cwd infrastructure/"
                        if (PULUMI_PREVIEW) {
                            sh "pulumi preview --cwd infrastructure/"
                        } else {
                            sh "pulumi up --yes --cwd infrastructure/"
                        }
                    }
                }
            }
        }
    }
}