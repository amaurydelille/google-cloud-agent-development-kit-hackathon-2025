#!/bin/bash

set -e

echo "Starting deployment..."

# Variables
APP_DIR="/home/$(whoami)/google-cloud-agent-development-kit-hackathon-2025/backend"
SERVICE_NAME="fastapi-backend"

# Update requirements.txt to include FastAPI and Uvicorn
echo "fastapi>=0.104.1" >> $APP_DIR/requirements.txt
echo "uvicorn[standard]>=0.24.0" >> $APP_DIR/requirements.txt

# Install Python dependencies
echo "Installing Python dependencies..."
cd $APP_DIR
pip3 install -r requirements.txt

# Copy systemd service file
echo "Setting up systemd service..."
sudo cp /home/$(whoami)/google-cloud-agent-development-kit-hackathon-2025/deploy-scripts/fastapi-backend.service /etc/systemd/system/
sudo sed -i "s/amaurydelille92500/$(whoami)/g" /etc/systemd/system/fastapi-backend.service

# Set permissions
sudo chown -R www-data:www-data $APP_DIR
sudo chmod +x $APP_DIR/src/main.py

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME

# Configure nginx
echo "Configuring nginx..."
sudo cp /home/$(whoami)/google-cloud-agent-development-kit-hackathon-2025/deploy-scripts/nginx-config /etc/nginx/sites-available/fastapi-backend
sudo ln -sf /etc/nginx/sites-available/fastapi-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config and restart
sudo nginx -t
sudo systemctl restart nginx

# Get external IP
EXTERNAL_IP=$(curl -s http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip -H "Metadata-Flavor: Google")

echo "Deployment complete!"
echo "Your backend is accessible at: http://$EXTERNAL_IP"
echo "Health check: http://$EXTERNAL_IP/health"
echo ""
echo "Service status:"
sudo systemctl status $SERVICE_NAME --no-pager -l 