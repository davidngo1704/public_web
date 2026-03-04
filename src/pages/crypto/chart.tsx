

import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import { useState } from "react";
import httpClient from "../../utils/htttpClient";


export const DaintChart = () => {
    const [activeCoinIndex, setActiveCoinIndex] = useState(0);
    const [config, setConfig] = React.useState<any>({});
    React.useEffect(() => {
        (async () => {

            let configData = JSON.parse(await httpClient.getFileData(["data", "config", "web", "config.json"]));

            setConfig(configData);
            
        })();
    }, []);
    return (
        <>
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
                <TabPanel header="XAUT-USDT">
                    <iframe src={config.endpoint_nen_nhat_xau_usdt} width="100%" height="700px"></iframe>
                </TabPanel>
                <TabPanel header="BTC-USDT">
                    <iframe src={config.endpoint_nen_nhat_xau_usdt} width="100%" height="700px"></iframe>
                </TabPanel>
                <TabPanel header="ETH-USDT">
                    <iframe src={config.endpoint_nen_nhat_xau_usdt} width="100%" height="700px"></iframe>
                </TabPanel>

            </TabView>

        </>
    );
}