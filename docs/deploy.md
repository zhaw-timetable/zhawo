# Deploy

How to deploy?

Add the server repo as a remote called "deploy"

```
git remote add deploy ssh://psituser@160.85.252.131/srv/git/zhawo.git/
```

Push your code and deploy

```
git push deploy master
```

## Setup

How to setup on new server?

### Git Hooks

Used to simplify the deployment process.

#### User access and permission

On the server:

```
# add user to users group
sudo adduser <your-name> users

# Create the directories and set the permissions
sudo mkdir -p /srv/tmp/
sudo chgrp -R users /srv/tmp/
sudo chmod g+w /srv/tmp/

sudo mkdir -p /srv/www/
sudo chgrp -R users /srv/www/
sudo chmod g+w /srv/www/
```

`/srv/tmp/` is a temporary directory for deployment.

`/srv/www/` contains the actual production files

#### Create an empty Git repo

On the remote server:

```
sudo mkdir -p /srv/git/zhawo.git

# Init the repo as an empty git repository
cd /srv/git/zhawo.git
sudo git init --bare
```

Set the permissions on the Git repo:

```
cd /srv/git/zhawo.git

# Define group recursively to "users", on the directories
sudo chgrp -R users .

# Define permissions recursively, on the sub-directories
# g = group, + add rights, r = read, w = write, X = directories only
# . = curent directory as a reference
sudo chmod -R g+rwX .

# Sets the setgid bit on all the directories
sudo find . -type d -exec chmod g+s '{}' +

# Make the directory a Git shared repo
sudo git config core.sharedRepository group
```

#### Write a Git Hook to deploy the code

On the remote server:

```
cd /srv/git/zhawo.git/hooks

# create a post-receive file
sudo touch post-receive

# make it executable
sudo chmod +x post-receive
```

Edit the file content: `sudo vim /srv/git/zhawo.git/hooks/post-receive`

```
#!/bin/sh

# The production directory
TARGET="/srv/www/zhawo"

# A temporary directory for deployment
TEMP="/srv/tmp/zhawo"

# The Git repo
REPO="/srv/git/zhawo.git"

# Deploy the content to the temporary directory
echo "Checking out new files on production"
mkdir -p $TEMP
git --work-tree=$TEMP --git-dir=$REPO checkout -f

cd $TEMP
# Do stuffs, like npm install…
npm install
npm run install-both
npm run build

# Replace the production directory
# with the temporary directory
cd /
rm -rf $TARGET
mv $TEMP/source/backend  $TARGET

# Start Server
echo "Restarting app"
cd
sudo ./startZhawo.sh
```

_we explain sudo ./startZhawo.sh later_

#### Deploy from the local computer

Add the server repo as a remote called "deploy" in local git repo:

```
git remote add deploy ssh://<user-name>@<server-ip>/srv/git/zhawo.git/
```

### Making Node.js service always alive

Make SystemD Service on server: `sudo vim /etc/systemd/system/zhawo.service`

```
[Unit]
Description=Node.js Server ZhaWo

[Service]
PIDFile=/tmp/zhawo-99.pid
User=<user-name>
Group=users
Restart=always
KillSignal=SIGQUIT
WorkingDirectory=/srv/www/zhawo
ExecStart=/usr/bin/node /srv/www/zhawo/backend/dist/index.js

[Install]
WantedBy=multi-user.target
```

Restat systemd:

```
sudo systemctl daemon-reload
```

Manage service:

```
sudo systemctl start zhawo.service
sudo systemctl stop zhawo.service
sudo systemctl restart zhawo.service

# view logs
journalctl -u zhawo.service
```

Enable service so it will start up when the machine boots:

```
sudo systemctl enable zhawo.service
```

### Run systemctl/systemd services without password

Create bash file on remote server:`vim /home/<user-name>/startZhawo.sh`

```
#!/bin/bash
sudo systemctl stop zhawo.service
sudo systemctl start zhawo.service
```

Make script executable:

```
chmod +x startZhawo.sh
```

Add script to /etc/sudoers file (so can be started without password):

```
sudo visudo
```

Add line:

```
<user-name> ALL=(ALL) NOPASSWD: /home/<user-name>/startZhawo.sh
```

### Links

https://medium.com/@francoisromain/vps-deploy-with-git-fea605f1303b

https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/

https://hackernoon.com/making-node-js-service-always-alive-on-ubuntu-server-e20c9c0808e4

https://askubuntu.com/questions/692701/allowing-user-to-run-systemctl-systemd-services-without-password

https://stackoverflow.com/questions/24965160/use-sudoer-to-restart-server-in-post-receive-git-hook

https://superuser.com/questions/745762/how-to-execute-commands-as-root-in-git-post-receive-hook/745773#745773
