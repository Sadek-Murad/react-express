#!/bin/bash

# Variables
namespace="nodejs-app"
backend_image_name="sadokiee/git-lab-backend:latest"  
frontend_image_name="sadokiee/git-lab-frontend:latest"  
domain="react.app.de"
docker_token="yourdockertoken"  
# End Variables

terraform init 
terraform apply -auto-approve



# remove previous backend docker images
echo "--------------------Remove Previous Backend build--------------------"
docker rmi -f $backend_image_name || true

# build new backend docker image with new tag
echo "--------------------Build new Backend Image--------------------"
docker build -t $backend_image_name ./Backend  

# remove previous frontend docker images
echo "--------------------Remove Previous Frontend build--------------------"
docker rmi -f $frontend_image_name || true

# build new frontend docker image with new tag
echo "--------------------Build new Frontend Image--------------------"
docker build -t $frontend_image_name ./Frontend  # Aktualisiere den Pfad zum Frontend-Verzeichnis, falls erforderlich

# Login to Docker Hub with token
echo "--------------------Login to Docker Hub with token--------------------"
echo $docker_token | docker login --username sadokiee --password-stdin  

# push the latest backend build to Docker Hub
echo "--------------------Pushing Backend Docker Image to Docker Hub--------------------"
docker push $backend_image_name

# push the latest frontend build to Docker Hub
echo "--------------------Pushing Frontend Docker Image to Docker Hub--------------------"
docker push $frontend_image_name

# create namespace
echo "--------------------creating Namespace--------------------"
kubectl create ns $namespace || true

# Deploy the application
echo "--------------------Deploy App--------------------"
kubectl apply -n $namespace -f k8s ./k8s

# Wait for application to be deployed
echo "--------------------Wait for all pods to be running--------------------"
sleep 60s

# Get ingress URL
echo "--------------------Ingress URL--------------------"
kubectl get ingress nodejs-app-ingress -n $namespace -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
echo " "
echo " "
echo "--------------------Application URL--------------------"
echo "http://nodejs.$domain"

