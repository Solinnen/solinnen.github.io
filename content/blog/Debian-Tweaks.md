---
title: "Debian: post-install tweaks"
description: My personal recommendations for setting up Debian Stretch.
date: 2020-05-10
---

### First steps:

Installing the bash skin:
```bash
echo 'export PS1="\[\033[0;0;1;31m\]\u \[\033[0;0;0;37m\]\w\[\033[0;0;1;31m\] > \[\033[00m\]"' >> ~/.bashrc && source ~/.bashrc
```

Update the system:

{{< highlight bash "lineNos=true" >}}
apt update
apt upgrade
{{< /highlight >}}

### Swap file:

Make sure you don't have a swap yet:

```bash
free -h
```

Check available disk space:

```bash
df -h
```

Create a swap file:

```bash
fallocate -l 1.5G /swapfile
```

Make sure you reserve enough space:

```bash
ls -lh /swapfile
```

Turn it on:
{{< highlight bash "lineNos=true" >}}
chmod 600 /swapfile
mkswap /swapfile
swapon --priority 50 /swapfile
{{< /highlight >}}

Final check:

{{< highlight bash "lineNos=true" >}}
swapon --show
free -h
htop
{{< /highlight >}}

### Make sure that /swapfile is enabled after a restart:

Create backup of /etc/fstab:

```bash
cp /etc/fstab /etc/fstab.bak
```

Execute:

```bash
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Check:

```bash
cat /etc/fstab
```

### Make calls to swap more rare to improve performance:

We look at the current value:

```bash
cat /proc/sys/vm/swappiness
```

I have 60 there, and it might be good for ssd, but for a server with hdd, it's better to set value close to 0.

Change it:

```bash
sysctl vm.swappiness=10
```

We make sure that this setting is preserved after a restart:

```bash
nano /etc/sysctl.conf
```
Add the line `vm.swappiness=10` to the end of this file.

Then we look at the current value of vfs_cache_pressure parameter:

```bash
cat /proc/sys/vm/vfs_cache_pressure
```

Set vfs_cache_pressure equal to 50:
```bash
sysctl vm.vfs_cache_pressure=50
```

And again:
```bash
nano /etc/sysctl.conf
```

Add the line `vm.vfs_cache_pressure=50` to the end of the file.

### FTP server

`proftpd` does not require additional settings, you can connect immediately after installation.

```bash
apt install proftpd
```


### Tmux

`tmux` is a useful utility for creating bash sessions that can be connected and disconnected without interrupting the applications running in them:

```bash
pacman -S tmux
```

tmux manual:
1. https://www.ocf.berkeley.edu/~ckuehl/tmux/
2. https://tmuxcheatsheet.com/


### Miniconda

Python virtualization tool.

{{< highlight bash "lineNos=true" >}}
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
{{< /highlight >}}

When installing, I recommend leaving the default settings.


### Finishing

{{< highlight bash "lineNos=true" >}}
conda clean --all
apt autoremove
apt autoclean
{{< /highlight >}}