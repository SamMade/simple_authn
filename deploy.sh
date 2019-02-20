#!/bin/bash

# dev:   ./deploy.sh
# prod:  ./deploy.sh prod
STAGE=${2:-dev}
PROJECT=${1}-$STAGE

# Change the suffix on the bucket to something unique!
BUCKET=$PROJECT-cloudformation
TOKEN=$(openssl rand -base64 12)
SUPPORT_EMAIL=${3}

# make a build directory to store artifacts
mkdir -p dist
rm -f dist/output.yaml

# make the deployment bucket in case it doesn't exist
aws s3 mb s3://$BUCKET 

# generate next stage yaml file
aws cloudformation package                   \
    --template-file SamTemplate.yaml            \
    --output-template-file dist/output.yaml \
    --s3-bucket $BUCKET                      

# the actual deployment step
aws cloudformation deploy                     \
    --template-file dist/output.yaml          \
    --stack-name $PROJECT                     \
    --capabilities CAPABILITY_IAM             \
    --parameter-overrides                     \
        StageName=$STAGE                      \
        ProjectName=$PROJECT                  \
        SecretToken=$TOKEN                    \
        SiteName=${1}                         \
        SupportEmailDomain=$SUPPORT_EMAIL
