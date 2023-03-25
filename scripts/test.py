from setuptools import sandbox
from os import environ


environ['LIB_VERSION'] = str(3)
sandbox.run_setup('setup.py', ['bdist_wheel'])