#!/bin/bash

# ----------------------------------------------------------------------------
# Uninstall Docker if installed via Snap
# ----------------------------------------------------------------------------
if snap list | grep -q docker; then
    echo "Docker found in Snap. Uninstalling..."
    sudo snap remove docker
else
    echo "Docker is not installed via Snap."
fi

# ----------------------------------------------------------------------------
# Update package list and install Docker using APT
# ----------------------------------------------------------------------------
echo "Updating package list..."
sudo apt-get update

echo "Installing required packages..."
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker's official GPG key
echo "Adding Docker's official GPG key..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc > /dev/null

# Add the Docker APT repository
echo "Adding Docker APT repository..."
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine, CLI, and Containerd
echo "Installing Docker..."
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "Docker and Docker Compose installation completed successfully!"
