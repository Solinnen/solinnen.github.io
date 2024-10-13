---
title: "Miniconda guide"
description: Miniconda is a tool for managing Python virtual environments. It allows each project to define its own set of dependencies...
date: 2020-05-09
---

Miniconda is a tool for managing Python virtual environments. It allows to define its own set of dependencies for each project (including the python version).

For example, you have 2 projects. The first, for some reason, requires Django framevork 4.2, and the second requires 1.11. You need to have two versions of the same module on your server at the same time and somehow specify which module to use — Miniconda solves this problem.

*Miniconda, unlike Anaconda, contains only a minimum of packages to work with; Anaconda, on the other hand, includes a bunch of junk that you can always manually install if needed.*

### Installation

{{< highlight bash "lineNos=true" >}}
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
{{< /highlight >}}

When installing, I recommend leaving the default settings.

### Useful commands

List environments:
```bash
conda info --envs
```

Create new environment:
```bash
conda create --name <env_name> python=3.12
```

Or:
```bash
conda env create -f environment.yml
```

Activate:
```bash
conda activate <env_name>
```

Deactivate:
```bash
conda deactivate
```

Remove environment:
```bash
conda remove --all -n <env_name>
```

Clear package cache:
```bash
conda clean --all
```

We can use environment.yml file. It stores a project name, list of dependencies, python version, etc. In fact, it allows you to deploy the project with just one command:
```bash
conda env create -f environment.yml
```

It is created either manually or like this (the names and versions of all installed dependencies from your python environment will be placed there):
```bash
conda env export > environment.yml
```

In case of using this command, it is assumed that you manually created a virtual environment on the machine. Be careful not to add anything extra to this file, otherwise it will just take up disk space.


### How to create a virtual environment for an existing project

We create a virtual environment. I remind you that it is desirable that the name of the environment matches the name of your project, the name of the project directory, the remote repository, etc.

```bash
conda create --name test python=3.7.2
```

Try to run the project executable:
```bash
python main.py
```

Most likely, you will get an error that a certain module is missing. Install it (pymongo, for example):
```bash
pip install pymongo
```

We try to run again, install the required module again, and so on until it works.
```bash
python main.py
pip install dnspython

python main.py
pip install sox

python main.py
pip install gtts
...

python main.py # done
```

Thus, you will have the necessary minimum of dependencies required for your project.

```bash
conda env export > environment.yml
```

You can check that everything works without errors by removing your environment and installing it from environment.yml.