cd ../..
rm -rf deployment-environment
git clone -b production https://github.com/tungpham31/Apollon.git deployment-environment
cd deployment-environment
cd client
rm -f .gitignore
npm install
bower install
grunt --force
cd ..
git add --all
git commit -am "AWS Push"
# add server/dist
sh /deployment/AWSDevTools/Linux/AWSDevTools-RepositorySetup.sh
git aws.push
