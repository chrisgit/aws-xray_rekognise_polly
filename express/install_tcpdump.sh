#!/bin/bash
apt-get update
apt-get install software-properties-common
apt-get install tcpdump

# Check XRAY messages with tcpdump -i lo udp port 2000 -vv -X
