#!/bin/bash

# Get the IP address of the connected wireless network
IP_ADDRESS=$(ip addr show wlo1 | grep "inet\b" | awk '{print $2}' | cut -d/ -f1)

# Check if IP_ADDRESS is not empty
if [ -z "$IP_ADDRESS" ]; then
  echo "No wireless connection found or unable to retrieve IP address."
  exit 1
fi

# Define the .env file path
ENV_FILE=".env"

# Replace 'localhost' with the IP address in the .env file
sed -i "s|http://[^:]*:4400/|http://$IP_ADDRESS:4400/|g" $ENV_FILE

echo "Updated REACT_APP_BASE_API_URL in $ENV_FILE to http://$IP_ADDRESS:4400/"
