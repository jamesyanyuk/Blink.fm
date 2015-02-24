git submodule add -f https://github.com/tungpham31/Apollon.git deployment-environment
cd deployment-environment
git submodule init
git submodule update --force
git pull origin production -f
cd client
rm -f .gitignore
npm install
bower install
grunt --force
cd ..
echo "cd server" > aws-start.sh
echo "npm start" >> aws-start.sh
git add --all
git commit -am "AWS Push"
git aws.push
