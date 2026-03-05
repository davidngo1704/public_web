
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

source ~/.bashrc

nvm -v

nvm install 16.20.2

nvm use v16.20.2

nvm alias default v16.20.2

npm install -g firebase-tools@11.30.0

npm run build

firebase deploy --only hosting