import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview"
import React, { useState } from "react";
import httpClient from "../../utils/htttpClient";

export const Coin = () => {
    const [dropdownItem, setDropdownItem] = useState<any>(null);
    const [input1, setInput1] = React.useState<any>(50);
    const [captiens, setCaptiens] = React.useState<any>();
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeCoinIndex, setActiveCoinIndex] = useState(0);
    
    React.useEffect(() => {
        (async () => {
            let dataRes = await httpClient.getFileData(["data", "crypto", "bingx", "danh_sach_coin.json"]);

            setCaptiens(JSON.parse(dataRes));
            

        })();
    }, []);

    return (
        <div className="card">
            <TabView
                activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}
            >
                <TabPanel
                    header="Sàn Crypto Tập Trung"
                >
                    <TabView
                        activeIndex={activeCoinIndex} 
                        onTabChange={(e) => {
                            (async () => {
                                switch (e.index) {
                                    case 0:
                                    {
                                        
                                        break;
                                    }
                                    
                                }

                            })();
                            setActiveCoinIndex(e.index);
                        }}
                    >
                        <TabPanel header="Bingx">
                            <div className="card">
                                <div className="p-formgroup-inline">
                                    <div className="p-field p-col-12 p-md-3">
                                        <label htmlFor="state">Cặp tiền</label>
                                        <Dropdown
                                            id="state" 
                                            value={dropdownItem} 
                                            onChange={(e) => setDropdownItem(e.value)} 
                                            options={captiens} 
                                            optionLabel="name" 
                                            placeholder="Select One"
                                        ></Dropdown>
                                    </div>
                                    <div className="p-field">
                                        <InputText id="firstname1"
                                            value={input1} onChange={(e) => { setInput1(e.target.value); }}
                                            type="text" placeholder="Số tiền"
                                        />
                                    </div>
                                    <Button label="LONG"
                                        onClick={async () => {
                                            alert(JSON.stringify(dropdownItem))
                                        }}
                                    ></Button>
                                    <Button label="SHORT"
                                        onClick={async () => {

                                        }}
                                    ></Button>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="Binance">

                        </TabPanel>
                        <TabPanel header="OKX">

                        </TabPanel>
                        <TabPanel header="Bybit">

                        </TabPanel>
                        <TabPanel header="Bitget">

                        </TabPanel>

                    </TabView>

                </TabPanel>

            </TabView>
        </div>
    )
}

