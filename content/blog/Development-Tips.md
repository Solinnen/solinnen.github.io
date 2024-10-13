---
title: "Development tips"
description: My personal recommendations for installing Arch Linux on Raspberry Pi 3. Suitable for other platforms as well.
date: 2020-05-10
---

- Avoid memory leaks, use as little RAM as possible, keep your code clean. For example, Example: I created a script that has nothing but an infinite loop with `time.sleep()`. Together with the `tmux` session (discussed below), it occupies 12.2 megabytes of RAM, although this script can simply be turned off during inactivity, especially if the time interval is large enough. For example, more than 10 minutes.

- For clarity, it is important to use the same namings for the virtual environment, project root directory, gitlab/github project name, tmux session, database name, and so on.

- Don't store data locally, use a database server instead. Exceptions: configs and cache. In other cases, I recommend cloud-based MongoDB Atlas.

- Always keep in mind that one day you may move from one server to another. Or even worse - suddenly lose access to the server or accidentally delete something. This is why you should have up-to-date versions of the code stored on gitlab/github. This is why it is worth separating your project server and database server.

- Your project should be easy to deploy with just a couple of commands. For example, `start.sh`.


## Any service can work in two modes

1. Constantly, performing some actions/handling some events.
2. Periodically start up, do something and then turn off, freeing up RAM.

Is worth determining which category the service will belong.

All python services should be placed in separate miniconda environments to avoid dependency conflicts. For example, the ta-lib library requires Python version = 3.5 to work, and aiogram >= 3.6 to work. Different projects require different versions of python.


## Services running all the time

Typical project structure:

- `main.py` - main executable file, usually one is enough. If more is required, it is better to use command line arguments.
- `config.py` - separate from `main.py`.
- `environment.yml` - generated using [miniconda](/blog/miniconda/).
- `start.sh` - this script creates a tmux session for the project. A universal example that I use:

{{< highlight bash "lineNos=true" >}}
#!/bin/bash

ARGS=("$@")
SESSION=${PWD##*/} # tmux session name = directory name

if ! [[ $(tmux ls | grep $SESSION) ]]; then
	tmux new-session -d -s $SESSION

	tmux send-keys 'conda activate ' $SESSION C-m # virtual environment name = tmux session name
	tmux send-keys 'python main.py' C-m
fi

# if executed with the -d argument, runs in daemon mode
if ! [[ $ARGS = "-d" || $ARGS = "--daemon" ]]; then
	tmux attach-session -t $SESSION
fi
{{< /highlight >}}

Each process should be placed in a separate tmux shell. This will allow you to detach from the process and return to the terminal. Tmux cheat sheet:
1. https://www.ocf.berkeley.edu/~ckuehl/tmux/
2. https://tmuxcheatsheet.com/



## Scheduled services

Linux has a built-in scheduler `cron`. Read about cron in my [post](/blog/task-scheduling/).

Typical project structure:

- `main.py` - main executable file, usually one is enough. If more is required, it is better to use command line arguments.
- `config.py` - separate from `main.py`.
- `environment.yml` - generated using [miniconda](/blog/miniconda/).
- `start.sh` - this script creates a tmux session for the project. A universal example that I use:

{{< highlight bash "lineNos=true" >}}
#!/bin/bash

# otherwise you won't be able to log into the conda environment
CONDA_BASE=$(conda info --base)

source $CONDA_BASE/etc/profile.d/conda.sh

SESSION=${PWD##*/} # direcroty name
conda activate $SESSION

python main.py
{{< /highlight >}}