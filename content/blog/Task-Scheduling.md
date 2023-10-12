---
title: "Task scheduling with cron and rc.local"
description: Some projects can only be run intermittently, which saves a lot of resources.
date: 2020-11-26
draft: true
---

### Cron

Some projects can only be run intermittently, which saves a lot of resources. It is convenient to use the built-in cron scheduler for this.

It is important to run crontab as root.

Display current tasks:
```bash
crontab -l
```

Edit tasks:
```bash
crontab -e
```

Considering that most projects must to be launched while being in the same directory with them, you will first have to change directory and only then run the script.

For example, you can run `start.sh` every 10 minutes like this:
```bash
*/10 * * * * cd /root/projects/project_name && ./start.sh
```



More examples:

```bash
# Every 20 minutes:
*/20 * * * * <command>

# Each hour:
0 */2 * * * <command>

# Every 4 hours:
0 */4 * * * <command>

# Every day at 21:00:
0 21 * * * <command>

# Every Sunday at 00:00:
@weekly <command>
```

Here you can choose your options:

https://crontab.guru/



### rc.local: Automatic execution of commands after system startup

You should not use cron for this, it simply does not have the necessary functionality. Instead, the commands should be added to the `/etc/rc.local` file. This approach is considered obsolete, but it is much simpler than all the others.

Create/edit `/etc/rc.local`. (Important! This file may be located in `/etc/init.d/rc.local`, then you need to work with it)

```bash
nano /etc/rc.local
```

The template looks like this, paste:

{{< highlight bash "lineNos=true" >}}
#! /bin/bash
### BEGIN INIT INFO
# Provides:          my-start-script
# Required-Start:    \$local_fs \$syslog
# Required-Stop:     \$local_fs \$syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts my-start-script
# Description:       starts my-start-script using start-stop-daemon
### END INIT INFO

# put your script here

exit 0
{{< /highlight >}}

Don't remove the commented block at the top, it's required for `update-rc.d` to work. Before `exit 0` add something like the example below (where `-d` means detach/daemon mode):

```bash
cd /root/projects/project_name && ./start.sh -d
```

You can also run scripts as another user:

```bash
cd /root/projects/project_name && sudo -H -u user01 ./start.sh -d
```

Set file permissions:

```bash
chmod +x /etc/rc.local
```

{{< highlight bash "lineNos=true" >}}
systemctl daemon-reload
systemctl start rc-local
systemctl status rc-local
{{< /highlight >}}

If you get the error `Failed to enable unit: Unit file rc-local.service does not exist.` when you run the `systemctl start rc-local` and `systemctl status rc-local` commands, then follow the instructions below.

Create a file:

```bash
nano /etc/systemd/system/rc-local.service
```

With content:

{{< highlight txt "lineNos=true" >}}
[Unit]
 Description=/etc/rc.local Compatibility
 ConditionPathExists=/etc/rc.local

[Service]
 Type=forking
 ExecStart=/etc/rc.local start
 TimeoutSec=0
 StandardOutput=tty
 RemainAfterExit=yes
 SysVStartPriority=99

[Install]
 WantedBy=multi-user.target
{{< /highlight >}}

Then:

{{< highlight bash "lineNos=true" >}}
systemctl enable rc-local
systemctl start rc-local.service
systemctl status rc-local.service
{{< /highlight >}}

Check that the services are starting by rebooting.