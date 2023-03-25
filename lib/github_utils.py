from os import getenv
import sys
from requests import post


def create_release(
    *,
    tag_prefix: str,
    version: int,
    access_token: str,
    body: str = None
) -> str:
    if not access_token:
        print('GitHub access token is missing', flush=True, file=sys.stderr)
        exit(1)
        
    tag_name = f'{tag_prefix}-{version}'
    response = post(
        url=f'{getenv("GITHUB_API_URL")}/repos/{getenv("GITHUB_REPOSITORY")}/releases',
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
        print("Release created successfully!")
        release_id = response.json().get("id")
        print(f"Release ID: {release_id}")
        return release_id
    else:
        print("Error creating release: ", response.content)
        exit(1)
