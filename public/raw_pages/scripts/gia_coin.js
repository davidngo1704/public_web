/* PARTICLES - Giữ nguyên logic tạo hiệu ứng */
for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 8 + Math.random() * 10 + "s";
    p.style.animationDelay = Math.random() * 5 + "s";
    document.body.appendChild(p);
}

const domain = "192.168.1.9";
const COIN_API = `http://${domain}:1704/file/download-text?filepath=%2Fvar%2Flib%2FApiGateway%2Fdata%2Fconfigs%2Fdanh_sach_coin.json`;

function formatPrice(price) {
    if (price >= 10) return price.toFixed(2);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(3);
}

async function loadCoins() {
    try {
        const res = await fetch(COIN_API);
        const raw = await res.json();
        if (!raw.ok) throw new Error("Load coin.json failed");

        const coins = JSON.parse(raw.data);
        const header = document.getElementById("coinHeader");

        const map = {};
        const streams = [];

        coins.forEach(c => {
            const div = document.createElement("div");
            div.className = "coin";
            
            // Logic hiển thị tên thay thế
            let displayName = c;
            if(c === "XAU") displayName = "VÀNG";

            div.innerHTML = `${displayName}<br><span id="${c}" class="price">--</span>`;
            header.appendChild(div);

            // Mapping: Binance Futures vẫn dùng format symbol + usdt
            map[`${c.toLowerCase()}usdt`] = c;
            streams.push(`${c.toLowerCase()}usdt@ticker`);
        });

        startWS(map, streams);
    } catch (error) {
        console.error("Lỗi khi tải danh sách coin:", error);
    }
}

function startWS(map, streams) {
    // THAY ĐỔI: URL của Binance Futures (USDT-M)
    const ws = new WebSocket("wss://fstream.binance.com/ws");

    ws.onopen = () => {
        console.log("Đã kết nối Binance Futures WebSocket");
        ws.send(JSON.stringify({
            method: "SUBSCRIBE",
            params: streams,
            id: 1
        }));
    };

    ws.onmessage = e => {
        const d = JSON.parse(e.data);
        
        // Kiểm tra nếu dữ liệu không có symbol (d.s) thì bỏ qua
        if (!d.s) return;

        const id = map[d.s.toLowerCase()];
        if (!id) return;

        const el = document.getElementById(id);
        if (!el) return;

        // d.c: Giá đóng cửa hiện tại
        // d.P: Phần trăm thay đổi giá trong 24h
        const price = formatPrice(Number(d.c));
        const pct = Number(d.P).toFixed(2);

        // Cập nhật giao diện
        el.className = "price " + (pct >= 0 ? "green" : "red");
        el.textContent = `$${price}`;

        // Hiệu ứng nháy khi có giá mới
        el.classList.add("tick");
        setTimeout(() => el.classList.remove("tick"), 250);
    };

    ws.onerror = err => console.error("Lỗi WebSocket:", err);
    ws.onclose = () => console.log("Đã đóng kết nối WebSocket");
}

loadCoins();