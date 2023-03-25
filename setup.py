from os import getenv
from setuptools import find_packages, setup

setup(
    name='kubetools',
    version=f'0.{getenv("LIB_VERSION")}.0',
    author="Igor Bari",
    packages=find_packages(where='lib'),
    package_dir={"": "lib"}
)
