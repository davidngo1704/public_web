#!/bin/bash

BOT_TOKEN="8387651261:AAE95Th3xYfQBeUrIsGJw1LfKN8hUcuvdqU"
CHAT_ID="5394829604"
MESSAGE="Đã deploy xong Web Frontend ReactJS"

if [ -z "$MESSAGE" ]; then
  echo "Usage: $0 \"your message\""
  exit 1
fi

curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d chat_id="${CHAT_ID}" \
  -d text="${MESSAGE}"