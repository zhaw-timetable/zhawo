# Deploy

https://medium.com/@francoisromain/vps-deploy-with-git-fea605f1303b

## cat post-receive

```
#!/bin/sh

# The production directory

TARGET="/srv/www/zhawo"

# A temporary directory for deployment

TEMP="/srv/tmp/zhawo"

# The Git repo

REPO="/srv/git/zhawo.git"

# Deploy the content to the temporary directory

mkdir -p $TEMP
git --work-tree=$TEMP --git-dir=$REPO checkout -f

cd $TEMP

# Do stuffs, like npm install…

npm install
npm run intall-both
npm run build

# Replace the production directory

# with the temporary directory

cd /
rm -rf $TARGET
mv $TEMP/source/backend/dist $TARGET

cd $TARGET
node dist
```
