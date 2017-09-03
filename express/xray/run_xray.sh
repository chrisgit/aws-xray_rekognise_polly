#!/bin/bash

# Have to sudo su -
# Set AWS ACCESS KEYS or run aws configure 
# Set AWS_REGION then run xray

DEFAULT_AWS_REGION="eu-west-1"

# Will normally write the log to /var/log which will need root permissions
# In that case uncomment the below
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

echo
echo "Before running this script you need to set your AWS credentials in one of the following ways"
echo "Environment variables: export AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
echo "User settings (shared credentials): aws configure"
read -p "Do you want to continue? " -n 1 -r
echo 
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

if [[ -z "$AWS_REGION" ]]
then
  echo "AWS_REGION not set, using $DEFAULT_AWS_REGION"
  export AWS_REGION=$DEFAULT_AWS_REGION
fi

# We would normally write to /var/log but for development purposes you can use current folder
#./xray --log-level dev --log-file xray-daemon.log &
./xray --log-level dev --log-file /var/log/xray-daemon.log &

# If XRAY fails then check the log
