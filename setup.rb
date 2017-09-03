# Vagrantfile supporting methods
class Setup
  def self.install_node()
    code =<<EOF
      sudo apt-get install python-software-properties
      curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
      sudo apt-get install -y nodejs
      sudo apt-get install -y build-essential
EOF
  end

  def self.install_aws_cli()
    code =<<EOF
      apt-get install python-pip libyaml-dev libpython2.7-dev -y
      pip install awscli --ignore-installed six
EOF
  end

  def self.install_tcpdump()
    code =<<EOF
      apt-get update
      apt-get install software-properties-common
      apt-get install tcpdump
EOF
  end

  def self.copy_to_opt()
    code =<<EOF
      cd /opt
      cp -r /tmp/express express
      chown -R vagrant express
      chgrp -R vagrant express
EOF
  end

  def self.install_xray_daemon()
    code =<<EOF
      cd /opt/express/xray
      wget https://s3.dualstack.us-east-2.amazonaws.com/aws-xray-assets.us-east-2/xray-daemon/aws-xray-daemon-linux-2.x.zip
      apt-get -y install unzip
      unzip aws-xray-daemon-linux-2.x.zip
      cp cfg.local.yaml cfg.yaml
EOF
  end

  def self.install_node_libraries()
    return ''
    code =<<EOF
      cd /opt/express/awsservices
      npm install
EOF
  end

  def self.post_up_message()
    message =<<EOF
    ********************************************************************************************
    ********************************************************************************************

    Steps to complete the demo
    1. SSH into the VM with vagrant ssh (or use Putty), user and password is vagrant
    2. Elevate your status to root (sudo su -)
    3. Run aws configure and enter your AWS credentials (aws configure)
    4. Set the AWS region in the environment (export AWS_REGION="eu-west-1")
    5. Change the folder to /opt/express/xray (cd /opt/express/xray)
    6. Run the xray daemon in background (./xray --log-level dev --log-file /var/log/xray-daemon.log &)
    7. Change folder to /opt/express/awsservices (cd /opt/express/awsservices)
    8. Install the node libraries (npm install)
    9. Start the node service (npm start)
EOF
  end
end
