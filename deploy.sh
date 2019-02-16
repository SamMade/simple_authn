#!/bin/bash

# dev:   ./deploy.sh
# prod:  ./deploy.sh prod
STAGE=${1:-dev}
PROJECT=sam-tutorial-$STAGE

# Change the suffix on the bucket to something unique!
BUCKET=$PROJECT-2018-12
TOKEN=$(openssl rand -base64 12)

# make a build directory to store artifacts
rm -rf build
mkdir build

# make the deployment bucket in case it doesn't exist
aws s3 mb s3://$BUCKET 

# generate next stage yaml file
aws cloudformation package                   \
    --template-file SamTemplate.yaml            \
    --output-template-file build/output.yaml \
    --s3-bucket $BUCKET                      

# the actual deployment step
aws cloudformation deploy                     \
    --template-file build/output.yaml         \
    --stack-name $PROJECT                     \
    --capabilities CAPABILITY_IAM             \
    --parameter-overrides                     \
        ProjectName=$PROJECT                  \
        SecretToken=$TOKEN

