VAGRANTFILE_API_VERSION = '2'

require_relative 'setup.rb'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = 'ubuntu/trusty64'

  config.vm.define 'xray_demo' do |v|
    v.vm.provider 'virtualbox' do |vb|
      vb.customize ['setextradata', 'global', 'GUI/SuppressMessages', 'all']
      vb.customize ['modifyvm', :id, '--ioapic', 'on']
      vb.cpus = 1
      vb.memory = 1024
      vb.linked_clone = true
    end
    v.vm.hostname = 'xray-demo'

    v.vm.network 'forwarded_port', id: 'node_xray', host: 4000, guest: 4000, protocol: 'tcp'
    v.vm.synced_folder './express', '/tmp/express', create: true

    v.vm.provision 'shell', inline: Setup.install_node()
    v.vm.provision 'shell', inline: Setup.copy_to_opt()
    v.vm.provision 'shell', inline: Setup.install_tcpdump()
    v.vm.provision 'shell', inline: Setup.install_aws_cli()
    v.vm.provision 'shell', inline: Setup.install_xray_daemon()
    #v.vm.provision 'shell', inline: Setup.install_node_libraries()
    v.vm.post_up_message = Setup.post_up_message()
  end
end
