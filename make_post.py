import os
import json
import subprocess
import requests

def get_git_repo_info():
    try:
        # Get the remote URL of the Git repository
        remote_url = subprocess.check_output(['git', 'config', '--get', 'remote.origin.url']).decode('utf-8').strip()

        # Extract the repository owner and name from the remote URL
        repo_owner, repo_name = remote_url.split('/')[-2:]
        repo_name = repo_name.rstrip('.git')

        return repo_owner, repo_name
    except subprocess.CalledProcessError:
        print("Error: Not a Git repository or Git not installed.")
        return None, None

def get_latest_release(repo_owner, repo_name, token):
    url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/releases/latest'
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

def get_project_title_and_id():
    with open('module.json', 'r', encoding='utf-8') as json_file:
        data = json.load(json_file)
        title = data.get('title', 'Project Title Not Found')
        id = data.get('id', 'Project ID Not Found')
        return title, id

def post_discord_webhook(webhook_url, embed_title, embed_description):
    # Create the payload for the webhook
    payload = {
        'embeds': [
            {
                'title': embed_title,
                'description': embed_description,
                'color': 0x00ff00  # You can customize the color (hex) of the embed
            }
        ]
    }

    # Make an HTTP POST request to the webhook URL
    headers = {'Content-Type': 'application/json'}
    response = requests.post(webhook_url, data=json.dumps(payload), headers=headers)

    # Check if the request was successful
    if response.status_code == 200 or response.status_code == 204:
        print("Webhook posted successfully.")
    else:
        print(f"Failed to post webhook. Status code: {response.status_code}")

def load_secrets():
    secrets_file_path = os.path.join(os.path.dirname(__file__), '..', 'SECRETS.json')

    try:
        with open(secrets_file_path, 'r') as secrets_file:
            secrets = json.load(secrets_file)
            return secrets
    except FileNotFoundError:
        print(f"SECRETS.json file not found at: {secrets_file_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Error decoding JSON in SECRETS.json file at: {secrets_file_path}")
        return {}

if __name__ == "__main__":
    # Get Git repository information
    repo_owner, repo_name = get_git_repo_info()

    if repo_owner and repo_name:
        secrets = load_secrets()

        # Get Discord webhook URL and GitHub token from secrets
        discord_webhook_url = secrets.get('DISCORD_WEBHOOK_URL')
        github_token = secrets.get('GITHUB_TOKEN')

        # Get the latest release information from GitHub
        latest_release = get_latest_release(repo_owner, repo_name, github_token)
        version = latest_release.get('tag_name', 'Version Not Found')
        description = latest_release.get('body', 'No description available for this release.')

        project_title, id = get_project_title_and_id()
        package_page_link = f"\n\n**Package Page**\n https://foundryvtt.com/packages/{id}"

        description += package_page_link

        # Get project title and id from module.json file


        # Post Discord webhook with the embed
        post_discord_webhook(discord_webhook_url, f'{project_title} - Version {version}', description)
    else:
        print("Unable to retrieve Git repository information.")
