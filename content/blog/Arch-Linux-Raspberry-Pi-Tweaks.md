---
title: "Arch Linux on Raspberry Pi: post-install tweaks"
description: My personal recommendations for installing Arch Linux on Raspberry Pi 3. Suitable for other platforms as well.
date: 2020-05-11
---

My personal recommendations for installing Arch Linux on Raspberry Pi 3. Suitable for other platforms as well.

Arch installation guide:
https://archlinuxarm.org/platforms/armv8/broadcom/raspberry-pi-3

### First steps:

Installing the bash skin:
```bash
echo 'export PS1="\[\033[0;0;1;31m\]\u \[\033[0;0;0;37m\]\w\[\033[0;0;1;31m\] > \[\033[0;0;0;37m\]"' >> ~/.bashrc && source ~/.bashrc
```

Update the system:
```bash
pacman -Syyu
```

Install cron:

{{< highlight bash "lineNos=true" >}}
pacman -S cronie
systemctl enable cronie
systemctl start cronie
echo 'export EDITOR="nano"' >> ~/.bashrc && echo 'export VISUAL="nano"' >> ~/.bashrc && source ~/.bashrc
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

Create backup of `/etc/fstab`:

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



### FTP server

`bftpd` does not require additional settings, you can connect immediately after installation.

{{< highlight bash "lineNos=true" >}}
pacman -S bftpd
systemctl enable bftpd
systemctl restart bftpd
{{< /highlight >}}




### Tmux

`tmux` is a useful utility for creating bash sessions that can be connected and disconnected without interrupting the applications running in them:

```bash
pacman -S tmux
```

tmux manual:
1. https://www.ocf.berkeley.edu/~ckuehl/tmux/
2. https://tmuxcheatsheet.com/