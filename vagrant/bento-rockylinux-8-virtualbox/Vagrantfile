Vagrant.configure("2") do |config|
  config.vm.box = "bento/rockylinux-8"
  config.vm.define 'bento-rockylinux-8'
  config.vm.provider "virtualbox"

  config.ssh.insert_key = false

  config.vm.hostname = "kubetools-cluster"
  config.vm.network "private_network", ip: "192.168.56.21" # if not internet connection enable dhcp in "Host Metwork Manager"

  config.vm.provider "virtualbox" do |v|
    v.memory = 8192
    v.cpus = 4
    v.linked_clone = true
    v.customize ['modifyvm', :id, '--audio', 'none']
    v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
  end
end
