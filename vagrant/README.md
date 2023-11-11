# Install VMware on Mac M2

https://www.youtube.com/watch?v=KvuXMMVkY1I

## Install Vagrant

```bash
brew install vagrant
```

## Install VMware Fusion Player

You need to redister to get free license

## Install Vagrant VMware utility

```bash
brew install vagrant-vmware-utility
```

## Install Vagrant VMware plugin

```bash
vagrant plugin install vagrant-vmware-desktop
```

Now you can start an arm based box which has `vmware_desktop`, `vmware_fusion`, `vmware` as provider.
