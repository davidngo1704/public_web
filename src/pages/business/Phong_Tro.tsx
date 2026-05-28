
import React, { useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { getObjectById } from '../../utils/firebase_service';


export const PhongTro = (props: any) => {

    const [du_lieu_phong_tro_1, setDuLieuPhongTro_1] = useState<RoomApiData>();
    const [du_lieu_phong_tro_2, setDuLieuPhongTro_2] = useState<RoomApiData>();
    const [du_lieu_phong_tro_3, setDuLieuPhongTro_3] = useState<RoomApiData>();

    React.useEffect(() => {
        (async () => {
            var data = await getObjectById("data_common", "du_lieu_phong_tro");

            let phongTro1 = JSON.parse(data?.phong_1) || {};
            let phongTro2 = JSON.parse(data?.phong_2) || {};
            let phongTro3 = JSON.parse(data?.phong_3) || {};

            setDuLieuPhongTro_1(phongTro1);
            setDuLieuPhongTro_2(phongTro2);
            setDuLieuPhongTro_3(phongTro3);

            console.log("Dữ liệu phòng trọ:", phongTro1, phongTro2, phongTro3);

            alert("Đã tải dữ liệu phòng trọ thành công.");
        })();
    }, []);

    type RoomApiData = {
        code: string;
        electricityPrice: number;
        month: number;
        year: number;
        price: number;
        electricityNumber: number;
        name: string;
        history: {
            electricityNumber: number;
        }
    };


    const [roomData, setRoomData] = useState<RoomApiData[]>([]);

    // số điện hiện tại nhập cho từng phòng
    const [electricityInputs, setElectricityInputs] = useState<Record<string, string>>({
        phong_1: '',
        phong_2: '',
        phong_3: ''
    });

    // nội dung text kết quả cho từng phòng
    const [roomMessages, setRoomMessages] = useState<Record<string, string>>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const formatVND = (value: number) =>
        value.toLocaleString('vi-VN', { minimumFractionDigits: 0 });

    const handleElectricityInputChange = (code: string, value: string) => {
        setElectricityInputs(prev => ({
            ...prev,
            [code]: value
        }));
    };

    const calculateBills = async () => {
        try {
            setIsCalculating(true);

            const phong_1 = Number(electricityInputs["phong_1"]);

            const phong_2 = Number(electricityInputs["phong_2"]);

            const phong_3 = Number(electricityInputs["phong_3"]);

            const lastMonthElectricityNumber_phong_1 = Number(du_lieu_phong_tro_1?.electricityNumber);
            const lastMonthElectricityNumber_phong_2 = Number(du_lieu_phong_tro_2?.electricityNumber);
            const lastMonthElectricityNumber_phong_3 = Number(du_lieu_phong_tro_3?.electricityNumber);

            const usedElectricity_phong_1 = Math.max(0, phong_1 - lastMonthElectricityNumber_phong_1);
            const usedElectricity_phong_2 = Math.max(0, phong_2 - lastMonthElectricityNumber_phong_2);
            const usedElectricity_phong_3 = Math.max(0, phong_3 - lastMonthElectricityNumber_phong_3);

            const electricityCost_phong_1 = usedElectricity_phong_1 * Number(du_lieu_phong_tro_1?.electricityPrice);
            const electricityCost_phong_2 = usedElectricity_phong_2 * Number(du_lieu_phong_tro_2?.electricityPrice);
            const electricityCost_phong_3 = usedElectricity_phong_3 * Number(du_lieu_phong_tro_3?.electricityPrice);

            const total_phong_1 = electricityCost_phong_1 + Number(du_lieu_phong_tro_1?.price);
            const total_phong_2 = electricityCost_phong_2 + Number(du_lieu_phong_tro_2?.price);
            const total_phong_3 = electricityCost_phong_3 + Number(du_lieu_phong_tro_3?.price);

            const message_phong_1 =
                    `Phòng của ${du_lieu_phong_tro_1?.name} (tháng ${du_lieu_phong_tro_1?.month}) tổng tiền trọ hết ${formatVND(total_phong_1)} đồng.\n` +
                    `Trong đó:\n` +
                    `- Tiền nhà là ${formatVND(Number(du_lieu_phong_tro_1?.price))} đồng.\n` +
                    `- Tiền điện ${formatVND(electricityCost_phong_1)} dùng ${usedElectricity_phong_1} số điện (tháng này: ${phong_1} số) (tháng trước chốt: ${lastMonthElectricityNumber_phong_1} số).`;
 

            const message_phong_2 =
                    `Phòng của ${du_lieu_phong_tro_2?.name} (tháng ${du_lieu_phong_tro_2?.month}) tổng tiền trọ hết ${formatVND(total_phong_2)} đồng.\n` +
                    `Trong đó:\n` +
                    `- Tiền nhà là ${formatVND(Number(du_lieu_phong_tro_2?.price))} đồng.\n` +
                    `- Tiền điện ${formatVND(electricityCost_phong_2)} dùng ${usedElectricity_phong_2} số điện (tháng này: ${phong_2} số) (tháng trước chốt: ${lastMonthElectricityNumber_phong_2} số).`;
 

            const message_phong_3 =
                    `Phòng của ${du_lieu_phong_tro_3?.name} (tháng ${du_lieu_phong_tro_3?.month}) tổng tiền trọ hết ${formatVND(total_phong_3)} đồng.\n` +
                    `Trong đó:\n` +
                    `- Tiền nhà là ${formatVND(Number(du_lieu_phong_tro_3?.price))} đồng.\n` +
                    `- Tiền điện ${formatVND(electricityCost_phong_3)} dùng ${usedElectricity_phong_3} số điện (tháng này: ${phong_3} số) (tháng trước chốt: ${lastMonthElectricityNumber_phong_3} số).`;
 
                    
            let roomMessagesTemp: Record<string, string> = {};

            roomMessagesTemp["phong_1"] = message_phong_1;
            roomMessagesTemp["phong_2"] = message_phong_2;
            roomMessagesTemp["phong_3"] = message_phong_3;

            setRoomMessages(roomMessagesTemp);
        } finally {
            setIsCalculating(false);
        }
    };
    const toast = useRef<any>(null);
    
    const saveData = async () => {
        try {
            setIsSaving(true);

            let currentRoomData = roomData;

        
            // Kiểm tra xem đã nhập số điện cho tất cả các phòng chưa
            const hasAllInputs = currentRoomData.every((room: RoomApiData) => {
                const input = electricityInputs[room.code];
                return input && !isNaN(Number(input));
            });

            if (!hasAllInputs) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Cảnh báo',
                    detail: 'Vui lòng nhập số điện cho tất cả các phòng',
                    life: 3000
                });
                return;
            }

            // Chuẩn bị dữ liệu để gửi lên API
            const updatedData = currentRoomData.map((room: RoomApiData) => {
                const currentInput = Number(electricityInputs[room.code]);

                // Tính toán tháng và năm mới
                let newMonth = room.month + 1;
                let newYear = room.year;

                if (newMonth > 12) {
                    newMonth = 1;
                    newYear = newYear + 1;
                }

                // Cập nhật lịch sử: đẩy electricityNumber hiện tại xuống electricityNumber1
                // và giá trị mới vào electricityNumber
                const newHistory = {
                    electricityNumber1: room.history.electricityNumber,
                    electricityNumber: currentInput
                };

                return {
                    ...room,
                    month: newMonth,
                    year: newYear,
                    electricityNumber: currentInput,
                    history: newHistory
                };
            });

      
            const requestBody = {
                value: updatedData
            };

        
            // Cập nhật state với dữ liệu mới
            setRoomData(updatedData);

            // Hiển thị thông báo thành công
            alert("Dữ liệu đã được lưu thành công!");

        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
            alert("Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    const phongTro: any = () => {
        return (
            <>
                <h5>Quản lý phòng trọ</h5>
                <div className="p-grid p-formgrid">
                    <div className="p-col-12 p-mb-4 p-lg-4 p-mb-lg-4">
                        <InputText
                            type="number"
                            placeholder="Số điện phòng 1"
                            value={electricityInputs.phong_1}
                            onChange={(e) => handleElectricityInputChange('phong_1', e.target.value)}
                        />
                    </div>

                    <div className="p-col-12 p-mb-4 p-lg-4 p-mb-lg-4">
                        <InputText
                            type="number"
                            placeholder="Số điện phòng 2"
                            value={electricityInputs.phong_2}
                            onChange={(e) => handleElectricityInputChange('phong_2', e.target.value)}
                        />
                    </div>

                    <div className="p-col-12 p-mb-4 p-lg-4 p-mb-lg-4">
                        <InputText
                            type="number"
                            placeholder="Số điện phòng 3"
                            value={electricityInputs.phong_3}
                            onChange={(e) => handleElectricityInputChange('phong_3', e.target.value)}
                        />
                    </div>
                </div>
                <div className="p-col-12">
                    <div className="card">
                   
                        <Button
                            label={isCalculating ? "Đang xử lý..." : "Tính toán"}
                            className="p-mr-2 p-mb-2"
                            onClick={calculateBills}
                            disabled={isCalculating || isSaving}
                        />
                        <Button
                            label={isSaving ? "Đang lưu..." : "Lưu lại"}
                            className="p-mr-2 p-mb-2"
                            onClick={saveData}
                            disabled={isCalculating || isSaving}
                        />
                        <h4 style={{ whiteSpace: 'pre-line', userSelect: 'text', cursor: 'text' }}>
                            {roomMessages.phong_1}
                        </h4>
                        <h4 style={{ whiteSpace: 'pre-line', userSelect: 'text', cursor: 'text' }}>
                            {roomMessages.phong_2}
                        </h4>
                        <h4 style={{ whiteSpace: 'pre-line', userSelect: 'text', cursor: 'text' }}>
                            {roomMessages.phong_3}
                        </h4>
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
