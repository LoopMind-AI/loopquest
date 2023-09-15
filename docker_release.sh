#!/bin/bash
TAG=prod
# TAG=staging

docker build -t loopquest-frontend:$TAG -f Dockerfile.frontend .
docker tag loopquest-frontend:$TAG jinyuloopmind/loopquest-frontend:$TAG
docker push jinyuloopmind/loopquest-frontend:$TAG

docker build -t loopquest-backend:$TAG -f Dockerfile.backend .
docker tag loopquest-backend:$TAG jinyuloopmind/loopquest-backend:$TAG
docker push jinyuloopmind/loopquest-backend:$TAG