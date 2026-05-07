import { useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import httpClient from '../../utils/htttpClient';

export const FormDemo = (props: any) => {

    

    const phongTro: any = () => {
        return (
            <>
                <h5>Quản lý phòng trọ</h5>
                <div className="p-grid p-formgrid">
                    <div className="p-col-12 p-mb-4 p-lg-4 p-mb-lg-4">
                        <InputText
                            type="number"
                            placeholder="Số điện phòng 1"
                
                        />
                    </div>

                    <div className="p-col-12 p-mb-4 p-lg-4 p-mb-lg-4">
                        <InputText
                            type="number"
                            placeholder="Số điện phòng 2"
                        />
                    </div>

                    <div className="p-col-12 p-mb-4 p-lg-4 p-mb-lg-4">
                        <InputText
                            type="number"
                            placeholder="Số điện phòng 3"
                        />
                    </div>
                </div>
                <div className="p-col-12">
                    <div className="card">
                        <Button
                            label={"Khởi động"}
                            className="p-mr-2 p-mb-2"
                            onClick={() => {

                            }}
                        />
                    </div>
                </div>
            </>
        );
    };


    return (
        <div className="p-grid dashboard">
            <div className="p-col-12 p-lg-12">
                {phongTro()}
            </div>
        </div>
    )
}
