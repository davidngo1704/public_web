import React from "react";
import httpClient from "../../utils/htttpClient";

export const TongQuatBlockchain = () => {
    const [data, setData] = React.useState<any>();

    React.useEffect(() => {
        (async() =>{
            const response = await httpClient.postMethod("http://192.168.1.9:1704/linux/execute", {
                command: "cd /var/lib/ApiGateway/blockchain/functions && source .venv/bin/activate && python get_tong_tai_san.py"
            });
            setData(JSON.parse(response));
        })();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Tổng quan Blockchain</h1>
            
            <h2>Tài sản Spot</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Symbol</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Số lượng</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Giá</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tổng USDT</th>
                    </tr>
                </thead>
                <tbody>
                    {data.spot.map((item: any, index: number) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.symbol}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.quantity}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.price?.toFixed(4)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.total_usdt?.toFixed(4)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <h2>Vị thế Future</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Symbol</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Giá vào lệnh</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ký quỹ</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Đòn bẩy</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Exchange</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Giá hiện tại</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Khối lượng USDT</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Khối lượng Coin</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>PnL USDT</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>PnL Coin</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Thực tế USDT</th>
                    </tr>
                </thead>
                <tbody>
                    {data.future.map((item: any, index: number) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.symbol}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.gia_vao_lenh}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.ky_quy}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.don_bay}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.exchange}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.price?.toFixed(4)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.volume_usdt?.toFixed(4)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.volume_coin?.toFixed(4)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', color: item.pnl_usdt < 0 ? 'red' : 'green' }}>{item.pnl_usdt?.toFixed(4)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', color: item.pnl_coin < 0 ? 'red' : 'green' }}>{item.pnl_coin?.toFixed(4)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.real_usdt?.toFixed(4)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <h2>Tổng kết</h2>
            <div style={{ marginBottom: '20px' }}>
                <p><strong>Tổng USDT Spot:</strong> {data.total_usdt_spot?.toFixed(4)}</p>
                <p><strong>Tổng USDT Future:</strong> {data.total_usdt_future?.toFixed(4)}</p>
                <p><strong>Tổng tất cả:</strong> {data.all_total?.toFixed(4)}</p>
            </div>
        </div>
    );
}