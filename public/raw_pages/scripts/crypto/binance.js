const server_binance = "192.168.1.13";
const url_binance = `http://${server_binance}:1704/linux/execute`;

let BINANCE_TOTAL_MONEY = 0;
let BINANCE_TOTAL_PNL = 0;

// global flag used by crypto.html redirect logic
window.HAS_FUTURE_DATA = window.HAS_FUTURE_DATA || false;


const headers_binance = {
    "Content-Type": "application/json",
};

async function call3ApisAtOnce() {

    const requests = [
        fetch(url_binance, {
            method: "POST",
            headers: headers_binance,
            body: JSON.stringify({
                command: "cd /var/lib/ApiGateway/blockchain/binance && source .venv/bin/activate && python get_vi_the_future.py",
            }),
        }),
        fetch(url_binance, {
            method: "POST",
            headers: headers_binance,
            body: JSON.stringify({
                command: "cd /var/lib/ApiGateway/blockchain/binance && source .venv/bin/activate && python get_future_balance.py",
            }),
        }),
    ];

    try {
        const responses = await Promise.all(requests);

        // nếu API trả JSON
        const results = await Promise.all(
            responses.map(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
        );

        return results;

    } catch (err) {
        throw err;
    }
}

function parseApiResponse(response) {
    if (!response?.ok) return null;

    let raw = response.data;

    if (typeof raw !== "string") {
        return raw; // phòng khi backend fix và trả object luôn
    }

    try {
        // trim + parse JSON
        return JSON.parse(raw.trim());
    } catch (err) {
        return null;
    }
}

function parseAllResponses(responses) {
    return responses.map((res, index) => {
        const parsed = parseApiResponse(res);
        return parsed;
    });
}

(async () => {
    const results = await call3ApisAtOnce();

    const parsedResults = parseAllResponses(results);

    const future = parsedResults[0];

    if (future && future.length > 0) {
        window.HAS_FUTURE_DATA = true;
    }

    const balanceFuture = parsedResults[1];

    document.getElementById("money_goc_binance").innerHTML = "(Tiền: " + balanceFuture.balance?.toFixed(1) + "$)";

    BINANCE_TOTAL_MONEY = balanceFuture.balance;
    BINANCE_TOTAL_PNL = balanceFuture.crossUnPnl;

    sessionStorage.setItem('BINANCE_TOTAL_MONEY', BINANCE_TOTAL_MONEY);
    sessionStorage.setItem('BINANCE_TOTAL_PNL', BINANCE_TOTAL_PNL);
    
    if (balanceFuture.crossUnPnl >= 0) {
        document.getElementById("lai_lo_binance").innerHTML = "(Lãi: " + balanceFuture.crossUnPnl?.toFixed(1) + "$)";
        document.getElementById("lai_lo_binance").style.color = "#00ff00";
        document.getElementById("lai_lo_binance").style.textShadow = "0 0 5px #00ff00";
    } else {
        document.getElementById("lai_lo_binance").innerHTML = "(Lỗ: " + Math.abs(balanceFuture.crossUnPnl)?.toFixed(1) + "$)";
        document.getElementById("lai_lo_binance").style.color = "#dc2626";
        document.getElementById("lai_lo_binance").style.textShadow = "0 0 5px #dc2626";
    }

    let futureHTML = "";

    if (future) {
        futureHTML = future.map(item => `
                <tr>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.symbol.replace("USDT", "")}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center;color:#dc2626;font-weight:700"> ${item.side}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.entry?.toFixed(2)}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.mark?.toFixed(2)}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.liquidation?.toFixed(2)}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.volume?.toFixed(2)}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center;color:${item.pnl > 0 ? '#00ff00' : '#dc2626'};font-weight:700"> ${item.pnl?.toFixed(2)}</td>
                </tr>
        `).join("");
    }

    document.getElementById("binance_future_body_row").innerHTML = futureHTML;


})();

