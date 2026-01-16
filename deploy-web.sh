cd /var/lib/ApiGateway/source_code/DashboardWeb

npm run build

cd build

tar -cvf ../build.tar *

cd /var/lib/ApiGateway/source_code/DashboardWeb

bash sub-script-deploy.sh