#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

cd /opt/express/xray
wget https://s3.dualstack.us-east-2.amazonaws.com/aws-xray-assets.us-east-2/xray-daemon/aws-xray-daemon-linux-2.x.zip
apt-get -y install unzip
unzip aws-xray-daemon-linux-2.x.zip
cp cfg.local.yaml cfg.yaml

# Then we have to sudo su -
# Set AWS ACCESS KEYS or run aws configure 
# Set AWS_REGION then run xray
# export AWS_REGION="eu-west-1"
# ./xray --log-level dev --log-file /var/log/xray-daemon.log &

# If fails then check the log
