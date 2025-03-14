import os
import re
import socket

def get_local_ip():
    """Get the local IP address of the machine."""
    hostname = socket.gethostname()
    return socket.gethostbyname(hostname)

def update_env_file(env_file_path, key, new_value):
    """Update the specified key in the .env file with a new value."""
    with open(env_file_path, 'r') as file:
        lines = file.readlines()

    updated_lines = []
    for line in lines:
        if line.startswith(key):
            updated_lines.append(f'{key} = "{new_value}"\n')
        else:
            updated_lines.append(line)

    with open(env_file_path, 'w') as file:
        file.writelines(updated_lines)

if __name__ == "__main__":
    env_file_path = ".env"  # Path to your .env file
    key_to_update = "REACT_APP_BASE_API_URL"
    local_ip = get_local_ip()
    react_local_port = 4400  # Replace with the port you want to use
    new_value = f"http://{local_ip}:{react_local_port}/"

    if os.path.exists(env_file_path):
        update_env_file(env_file_path, key_to_update, new_value)
        print(f"Updated {key_to_update} to {new_value} in {env_file_path}")
    else:
        print(f"Error: {env_file_path} not found.")