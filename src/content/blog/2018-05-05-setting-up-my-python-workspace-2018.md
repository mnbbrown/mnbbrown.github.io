---
title: Setting up python, pipenv and jupyter notebook on Ubuntu 18.04
category: notes
publishedDate: 2018-05-05
---

Ubuntu 18.04 Bionic Beaver (the latest LTS version) was released last week. The little script below will get `pip3` and `pipenv` up and running.

```bash
# Install pip and pipenv
sudo apt install python3-pip python3-dev
pip3 install --user pipenv

# Add pipenv (and other python scripts) to PATH
echo "PATH=$HOME/.local/bin:$PATH" >> ~/.bashrc
source ~/.bashrc
```

Create a new project and install some dependencies (include jupyter)
```bash
mkdir project-name && cd project-name
pipenv install numpy matplotlib jupyter
```

Start a jupyter notebook
```bash
pipenv run jupyter notebook
```
