from setuptools import setup

setup(
    name='kubetools',
    version='0.0.1',
    author="Igor Bari",
    install_requires=['argon2-cffi'],
    package_dir={"kubetools": "lib"}
)
