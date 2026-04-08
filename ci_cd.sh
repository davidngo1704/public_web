#!/bin/bash

TAR_FILE="/home/dai/actions-runner/_work/public_web/public_web/build.tar"
DEPLOY_DIR="/var/www/react-app"
DEFAULT_CONF="/etc/nginx/sites-available/default"

echo "=== Check nginx ==="
if ! command -v nginx &> /dev/null; then
    sudo apt update
    sudo apt install -y nginx
fi

echo "=== Prepare deploy directory ==="
mkdir -p "$DEPLOY_DIR"

echo "=== Clean old build ==="
sudo rm -rf ${DEPLOY_DIR:?}/*

echo "=== Extract build.tar ==="
sudo tar -xf "$TAR_FILE" -C "$DEPLOY_DIR"

echo "=== Set permission ==="
sudo chown -R www-data:www-data "$DEPLOY_DIR"

echo "=== Write Nginx default config (with static fix) ==="
cat <<EOF | sudo tee $DEFAULT_CONF > /dev/null
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root $DEPLOY_DIR;
    index index.html;

    server_name _;

    # Serve static files (không fallback index.html)
    location /static/ {
        try_files \$uri =404;
    }

    # Serve assets (không fallback index.html)
    location /assets/ {
        try_files \$uri =404;
    }

    # SPA fallback
    location / {
        try_files \$uri /index.html;
    }
}
EOF

echo "=== Enable default site ==="
sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

echo "=== Reload nginx ==="
sudo nginx -t
sudo systemctl reload nginx

echo "=== Deploy DONE ==="
echo "React app: http://<server-ip>/"
