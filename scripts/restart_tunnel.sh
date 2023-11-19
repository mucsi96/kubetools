#!/bin/bash
kubectl delete pods --selector app=cloudflared --namespace cloudflare-tunnel