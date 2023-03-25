from os import getenv
from setuptools import setup

setup(
    name='kubetools',
    version=f'0.{getenv("LIB_VERSION")}.0',
    author="Igor Bari",
    package_dir={"kubetools": "lib"}
)
