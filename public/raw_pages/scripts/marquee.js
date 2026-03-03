function updateMarqueeValues() {
    // Get all the money values from the cards
    let totalMoney = parseFloat(sessionStorage.getItem('BINANCE_TOTAL_MONEY') || 0) +
                     parseFloat(sessionStorage.getItem('BINGX_TOTAL_MONEY') || 0) + 
                     parseFloat(sessionStorage.getItem('BYBIT_TOTAL_MONEY') || 0) + 
                     parseFloat(sessionStorage.getItem('BITGET_TOTAL_MONEY') || 0) + 
                     parseFloat(sessionStorage.getItem('OKX_TOTAL_MONEY') || 0);
                     
    let totalProfitLoss = parseFloat(sessionStorage.getItem('BINANCE_TOTAL_PNL') || 0) + 
                          parseFloat(sessionStorage.getItem('BINGX_TOTAL_PNL') || 0) + 
                          parseFloat(sessionStorage.getItem('BYBIT_TOTAL_PNL') || 0) + 
                          parseFloat(sessionStorage.getItem('BITGET_TOTAL_PNL') || 0) + 
                          parseFloat(sessionStorage.getItem('OKX_TOTAL_PNL') || 0);



    // Update marquee display
    const totalMoneyEl = document.getElementById('total-money');
    const totalProfitEl = document.getElementById('total-profit');

        document.getElementById("daint_time").innerHTML =  new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });

    if (totalMoneyEl) {
        totalMoneyEl.textContent = totalMoney.toFixed(2) + '$';
    }

    if (totalProfitEl) {
        totalProfitEl.textContent = totalProfitLoss.toFixed(2) + '$';
        // Change color based on positive/negative
        if (totalProfitLoss < 0) {
            totalProfitEl.classList.add('negative');
            totalProfitEl.classList.remove('positive');
        } else {
            totalProfitEl.classList.remove('negative');
            totalProfitEl.classList.add('positive');
        }
    }
}


updateMarqueeValues();
setInterval(updateMarqueeValues, 100);
