git submodule add -b production https://github.com/tungpham31/Apollon.git deployment_environment -f
cd deployment_environment
git submodule init
git submodule update --force
cd client
rm -f .gitignore
npm install
bower install
grunt --force
cd ..
git add --all
git commit -am "AWS Push"
git aws.push
