const server_bingx = "192.168.1.9";
const url_bingx = `http://${server_bingx}:1704/linux/execute`;

let BINGX_TOTAL_MONEY = 0;
let BINGX_TOTAL_PNL = 0;

// global flag used by redirect logic
window.HAS_FUTURE_DATA = window.HAS_FUTURE_DATA || false;


const headers_bingx = {
    "Content-Type": "application/json",
};

async function call3ApisAtOnce() {

    const requests = [
        fetch(url_bingx, {
            method: "POST",
            headers: headers_bingx,
            body: JSON.stringify({
                command: "cd /var/lib/ApiGateway/blockchain/bingx && source .venv/bin/activate && python xem_vi_the.py",
            }),
        }),
        fetch(url_bingx, {
            method: "POST",
            headers: headers_bingx,
            body: JSON.stringify({
                command: "cd /var/lib/ApiGateway/blockchain/bingx && source .venv/bin/activate && python balance_future.py",
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

async function main() {
    const results = await call3ApisAtOnce();

    const parsedResults = parseAllResponses(results);

    const future = parsedResults[0];
    if (future && future.length > 0) {
        window.HAS_FUTURE_DATA = true;
    }
    // const spot = parsedResults[1];

    const balanceFuture = parsedResults[1];

    document.getElementById("money_goc_bingx").innerHTML = "(Tiền: " + balanceFuture.equity?.toFixed(1) + "$)";

    BINGX_TOTAL_MONEY = balanceFuture.equity;
    BINGX_TOTAL_PNL = balanceFuture.unrealized_pnl;

    sessionStorage.setItem('BINGX_TOTAL_MONEY', BINGX_TOTAL_MONEY);
    sessionStorage.setItem('BINGX_TOTAL_PNL', BINGX_TOTAL_PNL);

    if (balanceFuture.unrealized_pnl >= 0) {
        document.getElementById("lai_lo_bingx").innerHTML = "(Lãi: " + balanceFuture.unrealized_pnl?.toFixed(1) + "$)";
        document.getElementById("lai_lo_bingx").style.color = "#00ff00";
        document.getElementById("lai_lo_bingx").style.textShadow = "0 0 5px #00ff00";
    } else {
        document.getElementById("lai_lo_bingx").innerHTML = "(Lỗ: " + Math.abs(balanceFuture.unrealized_pnl)?.toFixed(1) + "$)";
        document.getElementById("lai_lo_bingx").style.color = "#dc2626";
        document.getElementById("lai_lo_bingx").style.textShadow = "0 0 5px #dc2626";
    }


    let futureHTML = "";

    if (future) {
        futureHTML = future.map(item => `
                <tr>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.symbol.replace("-USDT", "")}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center;color:#dc2626;font-weight:700"> ${item.positionSide}_X${item.leverage}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.avgPrice}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.markPrice}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.liquidationPrice}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center">${item.positionValue}</td>
                    <td style="border:1px solid #e5e7eb;padding:10px;text-align:center;color:${item.unrealizedProfit > 0 ? '#00ff00' : '#dc2626'};font-weight:700"> ${item.unrealizedProfit}</td>
                </tr>
        `).join("");
    }

    document.getElementById("bingx_future_body_row").innerHTML = futureHTML;

};

main();

