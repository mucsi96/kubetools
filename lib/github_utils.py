import os
import sys

from glob import glob
from os import getenv
from requests import post


def create_release(
    *,
    tag_prefix: str,
    version: int,
    access_token: str,
    body: str = ''
) -> str:
    if not access_token:
        print('GitHub access token is missing', flush=True, file=sys.stderr)
        exit(1)

    tag_name = f'{tag_prefix}-{version}'
    response = post(
        url=f'https://api.github.com/repos/{getenv("GITHUB_REPOSITORY")}/releases',
        headers={
            'Accept': 'application/vnd.github+json',
            'Authorization': f'Bearer {access_token}',
            'X-GitHub-Api-Version': '2022-11-28'
        },
        json={
            'tag_name': tag_name,
            'target_commitish': getenv('GITHUB_REF_NAME'),
            'name': tag_name,
            'generate_release_notes': True,
            'body': body
        }
    )

    if response.status_code == 201:
        release_id = response.json().get("id")
        print(f'Release created successfully! Release id: {release_id}', flush=True)
        return release_id
    else:
        print("Error creating release: ", response.content, file=sys.stderr, flush=True)
        exit(1)


def upload_release_asset(
    *,
    release_id: str,
    access_token: str,
    filename_pattern: str
):
    if not access_token:
        print('GitHub access token is missing', flush=True, file=sys.stderr)
        exit(1)
    
    local_file = glob(filename_pattern)[0]

    if not access_token:
        print(f'No file found matching {filename_pattern}', flush=True, file=sys.stderr)
        exit(1)

    with open(local_file, 'rb') as f:
        data = f.read()

    filename = os.path.split(local_file)[1]

    response = post(
        url=f'https://uploads.github.com/repos/{getenv("GITHUB_REPOSITORY")}/releases/{release_id}/assets',
        headers={
            'Accept': 'application/vnd.github+json',
            'Authorization': f'Bearer {access_token}',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/octet-stream'
        },
        data=data,
        params={
            'name': filename
        }
    )

    if response.status_code == 201:
        print(f'Asset uploaded successfully to release {release_id}!', flush=True)
    else:
        print("Error creating release: ", response.content, file=sys.stderr, flush=True)
        exit(1)
