git submodule add -f -b production https://github.com/tungpham31/Apollon.git deployment-environment
cd deployment-environment
git submodule init
git submodule update --force
git fetch --all
git reset --hard origin/production
cd client
rm -f .gitignore
npm install
bower install
grunt --force
cd ..
git add --all
git commit -am "AWS Push"
mkdir -p .gitAWS
git aws.push
