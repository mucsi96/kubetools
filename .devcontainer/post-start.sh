#!/bin/bash
sudo chown $(whoami) /var/run/docker.sock
sudo chown -R $(id -u):$(id -g) .kube