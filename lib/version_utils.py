from distutils.version import StrictVersion
from pathlib import Path
from subprocess import run
import re
from typing import List

from pkg_resources import parse_version


def get_previous_tag(tag_prefix):
    result = run(['git', 'describe', '--tags', f'--match={tag_prefix}-[1-9]*', '--abbrev=0'], capture_output=True)
    if result.stderr:
        print(result.stderr.decode(), flush=True)
    
    if result.returncode or not result.stdout:
        return None

    return result.stdout.decode().strip()


def has_source_code_changed(src: Path, prev_tag: str, ignore: List[str]):
    ignore_str = ' '.join(map(lambda x: f'\':!{x}\'', ignore))
    print(f'Detecting changes in {src} since {prev_tag}', flush=True)
    args = list(filter(bool, ['git', 'diff', '--name-only',
                              'HEAD', prev_tag, '--', '.', ignore_str]))
    result = run(args, cwd=src, capture_output=True)

    if result.stderr:
        print(result.stderr.decode(), flush=True)

    if result.stdout:
        print(result.stdout.decode(), flush=True)

    return bool(result.stdout)

def natural_sort_key(s, _nsre=re.compile('([0-9]+)')):
    return [int(text) if text.isdigit() else text.lower()
            for text in _nsre.split(s)]

def get_latest_version(tag_prefix: str):
    result = run(['git', 'tag', '--list', f'{tag_prefix}-[1-9]*'], capture_output=True)

    if result.stderr:
        print(result.stderr.decode(), flush=True)

    if result.returncode or not result.stdout:
        return None
    
    tags = result.stdout.decode().splitlines()
    latest_tag = sorted(tags, key=natural_sort_key)[-1]

    return int(
        re.sub(rf'^{tag_prefix}-', '', latest_tag))


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


def set_version(tag_prefix: str, version: int) -> None:
    print(f'Tagging with {tag_prefix}-{version}', flush=True)
    run(['git', 'tag', f'{tag_prefix}-{version}'], check=True)
    run(['git', 'push', '--tags'], check=True)
