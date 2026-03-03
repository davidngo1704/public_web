
let OKX_TOTAL_MONEY = 0;
let OKX_TOTAL_PNL = 0;

// global flag used by redirect logic
window.HAS_FUTURE_DATA = window.HAS_FUTURE_DATA || false;

const server_okx = "192.168.1.13";
const url_okx = `http://${server_okx}:1704/linux/execute`;
const headers_okx = {
    "Content-Type": "application/json",
};

async function call3ApisAtOnce() {

    const requests = [
        fetch(url_okx, {
            method: "POST",
            headers: headers_okx,
            body: JSON.stringify({
                command: "cd /var/lib/ApiGateway/blockchain/okx && source .venv/bin/activate && python vi_the_future.py",
            }),
        }),
        fetch(url_okx, {
            method: "POST",
            headers: headers_okx,
            body: JSON.stringify({
                command: "cd /var/lib/ApiGateway/blockchain/okx && source .venv/bin/activate && python balance.py",
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

    const totalData = parsedResults[0];

    if (totalData && totalData.length > 0) {
        window.HAS_FUTURE_DATA = true;
    }

    const spot = parsedResults[1];

    document.getElementById("money_goc_okx").innerHTML = "(Tiền: " + spot.total_usd?.toFixed(1) + "$)";

    OKX_TOTAL_MONEY = spot.total_usd;
    OKX_TOTAL_PNL = spot.coins?.USDT?.upl;

    sessionStorage.setItem('OKX_TOTAL_MONEY', OKX_TOTAL_MONEY);
    sessionStorage.setItem('OKX_TOTAL_PNL', OKX_TOTAL_PNL);
    
    if (spot.coins?.USDT?.upl >= 0) {
        document.getElementById("lai_lo_okx").innerHTML = "(Lãi: " + spot.coins?.USDT?.upl?.toFixed(1) + "$)";
        document.getElementById("lai_lo_okx").style.color = "#00ff00";
        document.getElementById("lai_lo_okx").style.textShadow = "0 0 5px #00ff00";
    } else {
        document.getElementById("lai_lo_okx").innerHTML = "(Lỗ: " + Math.abs(spot.coins?.USDT?.upl)?.toFixed(1) + "$)";
        document.getElementById("lai_lo_okx").style.color = "#dc2626";
        document.getElementById("lai_lo_okx").style.textShadow = "0 0 5px #dc2626";
    }


    let futureHTML = "";

    if (totalData) {
        futureHTML = totalData.map(item => `
                <tr>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.symbol.replace("-USDT-SWAP", "")}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center;color:#dc2626;font-weight:700"> ${item.side !== "net" ? "LONG" : "SHORT" + "_X" + item.leverage}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.entry_price?.toFixed(2)}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.mark_price?.toFixed(2)}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.liquidation_price?.toFixed(2)}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${(item.leverage * item.margin)?.toFixed(2)}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center;color:${item.unrealized_pnl > 0 ? '#00ff00' : '#dc2626'};font-weight:700"> ${item.unrealized_pnl?.toFixed(2)}</td>
                </tr>
        `).join("");
    }

    document.getElementById("okx_body_row").innerHTML = futureHTML;


})();

