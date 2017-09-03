#!/bin/bash
apt-get install python-pip libyaml-dev libpython2.7-dev -y
pip install awscli --ignore-installed six

# Configure settings with aws configure
# Or change to root and aws configure
#sudo su -
#aws configure
