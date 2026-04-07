cd /var/lib/ApiGateway/web/public_web/

npm run build

cd build

tar -cvf ../build.tar *

cd /var/lib/ApiGateway/web/public_web/

bash sub-script-deploy.sh