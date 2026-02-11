#!/bin/bash

# Dừng script nếu có lỗi
set -e

# --- BIẾN CẤU HÌNH ---
APP_NAME="ApiGateway"
URL="https://raw.githubusercontent.com/davidngo1704/script/HEAD/SourceCode"
TEMP_BIN="/root/SourceCode_temp"
INSTALL_DIR="/usr/local/bin/$APP_NAME"
INSTALL_BIN="$INSTALL_DIR/SourceCode"
SERVICE_FILE="/etc/systemd/system/$APP_NAME.service"
DATA_DIR="/var/lib/$APP_NAME"
LOG_DIR="/var/log/$APP_NAME"
SWAP_SIZE="2G" # Dung lượng RAM ảo muốn thêm

echo "--- BẮT ĐẦU QUÁ TRÌNH THIẾT LẬP HỆ THỐNG ---"

# 1. Cấu hình Múi giờ Việt Nam
echo "--- Thiết lập múi giờ Asia/Ho_Chi_Minh ---"
sudo timedatectl set-timezone Asia/Ho_Chi_Minh

# 2. Tạo RAM ảo (Swap)
echo "--- Kiểm tra và tạo RAM ảo (Swap) $SWAP_SIZE ---"
if grep -q "swap" /etc/fstab; then
    echo "Swap đã được cấu hình trước đó. Bỏ qua bước này."
else
    # Tạo file swap
    sudo fallocate -l $SWAP_SIZE /swapfile
    # Phân quyền chỉ root đọc ghi
    sudo chmod 600 /swapfile
    # Thiết lập vùng swap
    sudo mkswap /swapfile
    # Kích hoạt swap
    sudo swapon /swapfile
    # Lưu cấu hình vĩnh viễn
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    # Tinh chỉnh Swappiness (ưu tiên dùng RAM thật trước)
    sudo sysctl vm.swappiness=10
    echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
    echo "Đã tạo thành công Swap $SWAP_SIZE"
fi

# 3. Cập nhật và Cài đặt công cụ
echo "--- Cập nhật gói và cài đặt SSH, Curl, Git, Certificates ---"
sudo apt update -y
sudo apt install -y openssh-server curl git ca-certificates ufw

# 4. Cấu hình SSH & User
echo "--- Cấu hình SSH và Password root ---"
sudo sed -i 's/^#*PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
sudo sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
# Lưu ý: Mật khẩu để dạng clear text trong script rất nguy hiểm
echo "root:dai17041998" | sudo chpasswd
sudo systemctl enable --now ssh

# 5. Cấu hình Tường lửa (UFW) - MỞ TOÀN BỘ
echo "--- Cấu hình tường lửa: MỞ TẤT CẢ CÁC CỔNG ---"
# Đặt chính sách mặc định là CHO PHÉP (ALLOW) tất cả kết nối đến
sudo ufw default allow incoming
sudo ufw default allow outgoing
sudo ufw --force enable
echo "Đã mở toàn bộ firewall."

# 6. Tải và Cài đặt SourceCode
echo "--- Tải SourceCode từ GitHub ---"
sudo curl -L $URL -o $TEMP_BIN
sudo chmod +x $TEMP_BIN

# Tạo thư mục và di chuyển file
sudo mkdir -p "$DATA_DIR" "$LOG_DIR" "$INSTALL_DIR"
sudo mv "$TEMP_BIN" "$INSTALL_BIN"

# Phân quyền
sudo chmod -R 777 "$DATA_DIR"
sudo chown -R root:root "$INSTALL_DIR"
sudo chown -R root:root "$LOG_DIR"

# 7. Tạo và Chạy Systemd Service
echo "--- Thiết lập Systemd Service ---"
sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=$APP_NAME Service
After=network.target

[Service]
ExecStart=$INSTALL_BIN
WorkingDirectory=$DATA_DIR
Restart=always
RestartSec=5
User=root
Environment=DOTNET_ENVIRONMENT=Production
Environment=DOTNET_DATAPATH=$DATA_DIR
StandardOutput=append:$LOG_DIR/output.log
StandardError=append:$LOG_DIR/error.log

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now "$APP_NAME.service"

echo "----------------------------------------------------"
echo "TẤT CẢ ĐÃ SẴN SÀNG!"
echo "IP của bạn là: $(hostname -I | awk '{print $1}')"
echo "RAM ảo (Swap): Đã thêm $SWAP_SIZE"
echo "Firewall: Đã mở tất cả cổng (Allow All)"
echo "SSH: root / dai17041998"
echo "----------------------------------------------------"