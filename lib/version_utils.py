from pathlib import Path
import subprocess
import re
from typing import List


def get_previous_tag(tag_prefix):
    [status, prev_tag] = subprocess.getstatusoutput(
        f'git describe --tags --match={tag_prefix}-[1-9]* --abbrev=0')

    if status or not prev_tag:
        return None

    return prev_tag


def has_source_code_changed(src: Path, prev_tag: str, ignore: List[str]):
    ignore_str = ' '.join(map(lambda x: f'\':!{x}\'', ignore))
    print(f'Detecting changes in {src} since {prev_tag}', flush=True)
    args = list(filter(bool, ['git', 'diff', '--name-only',
                              'HEAD', prev_tag, '--', '.', ignore_str]))
    changed_files = subprocess.run(args, cwd=src, capture_output=True)
    if changed_files.stderr:
        print(changed_files.stderr.decode())
    if changed_files.stdout:
        print(changed_files.stdout.decode())
    return bool(changed_files.stdout)


def get_latest_version(tag_prefix: str):
    [status, tags] = subprocess.getstatusoutput(
        f'git tag --list --sort=taggerdate {tag_prefix}-[1-9]*')

    if status or not tags:
        return None

    return int(
        re.sub(rf'^{tag_prefix}-', '', tags.splitlines()[-1]))


def get_version(src: Path, tag_prefix: str, ignore: List[str]) -> tuple[bool, int]:
    prev_tag = get_previous_tag(tag_prefix)

    if prev_tag:
        if has_source_code_changed(src, prev_tag, ignore) is False:
            version = re.sub(rf'^{tag_prefix}-', '', prev_tag)
            return False, version

    latest_version = get_latest_version(tag_prefix)

    if latest_version:
        new_version = latest_version + 1
    else:
        new_version = 1

    return True, new_version


def set_version(tag_prefix: str, version: int) -> str:
    subprocess.getstatusoutput(f'git tag "{tag_prefix}-{version}"')
    [status, output] = subprocess.getstatusoutput(
        'git push --tags > /dev/null')

    return output if status else ''
