#!/bin/bash
pip install -r requirements.txt
pushd demo_app/client
yarn
popd
pushd server_lib
mvn install