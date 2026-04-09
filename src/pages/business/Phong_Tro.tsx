import { useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import httpClient from '../../utils/htttpClient';


export const PhongTro = (props: any) => {

    
    type RoomApiData = {
        code: string;
        electricityPrice: number;
        month: number;
        year: number;
        price: number;
        electricityNumber: number;
        name: string;
        history: {
            electricityNumber1: number;
            electricityNumber: number;
        }
    };

    const ELECTRICITY_API_URL = "https://rtafvndlc6mc6g5apdwzdjduma0sjicv.lambda-url.ap-southeast-2.on.aws/?id=89ce40e7-73e5-4f35-a3e4-22cf836e19ea";

    const [roomData, setRoomData] = useState<RoomApiData[]>([]);

    // số điện hiện tại nhập cho từng phòng
    const [electricityInputs, setElectricityInputs] = useState<Record<string, string>>({
        Phong1: '',
        Phong2: '',
        Phong3: ''
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

            let currentRoomData = roomData;

            // Nếu chưa có dữ liệu phòng thì gọi API
            if (!currentRoomData || currentRoomData.length === 0) {
                let data = await httpClient.getRawMethod(ELECTRICITY_API_URL);

                setRoomData(JSON.parse(data.value));
                currentRoomData = data;
            }

            const messages: Record<string, string> = {};

            currentRoomData.forEach((room: RoomApiData) => {
                const currentInput = electricityInputs[room.code];
                if (!currentInput) {
                    return;
                }

                const currentElectricityNumber = Number(currentInput);
                if (isNaN(currentElectricityNumber)) {
                    return;
                }

                const lastMonthElectricityNumber = room.electricityNumber;
                const usedElectricity = Math.max(0, currentElectricityNumber - lastMonthElectricityNumber);
                const electricityCost = usedElectricity * room.electricityPrice;
                const total = electricityCost + room.price;

                const message =
                    `Phòng của ${room.name} (tháng ${room.month}) tổng tiền trọ hết ${formatVND(total)} đồng.\n` +
                    `Trong đó:\n` +
                    `- Tiền nhà là ${formatVND(room.price)} đồng.\n` +
                    `- Tiền điện ${formatVND(electricityCost)} dùng ${usedElectricity} số điện (tháng này: ${currentElectricityNumber} số) (tháng trước chốt: ${lastMonthElectricityNumber} số).`;

                messages[room.code] = message;
            });

            setRoomMessages(messages);
        } finally {
            setIsCalculating(false);
        }
    };
    const toast = useRef<any>(null);
    
    const saveData = async () => {
        try {
            setIsSaving(true);

            let currentRoomData = roomData;

            // Nếu chưa có dữ liệu phòng thì gọi API
            if (!currentRoomData || currentRoomData.length === 0) {
                let data = await httpClient.getRawMethod(ELECTRICITY_API_URL);

                setRoomData(JSON.parse(data.value));
                currentRoomData = JSON.parse(data.value);
            }

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

            // Gọi API PUT để lưu dữ liệu
            await httpClient.putMethod(ELECTRICITY_API_URL, requestBody);

            // Cập nhật state với dữ liệu mới
            setRoomData(updatedData);

            // Hiển thị thông báo thành công
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã lưu dữ liệu số điện thành công',
                life: 3000
            });

        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể lưu dữ liệu. Vui lòng thử lại',
                life: 3000
            });
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
                            value={electricityInputs.Phong1}
                            onChange={(e) => handleElectricityInputChange('Phong1', e.target.value)}
                        />
                    </div>

                    <div className="p-col-12 p-mb-4 p-lg-4 p-mb-lg-4">
                        <InputText
                            type="number"
                            placeholder="Số điện phòng 2"
                            value={electricityInputs.Phong2}
                            onChange={(e) => handleElectricityInputChange('Phong2', e.target.value)}
                        />
                    </div>

                    <div className="p-col-12 p-mb-4 p-lg-4 p-mb-lg-4">
                        <InputText
                            type="number"
                            placeholder="Số điện phòng 3"
                            value={electricityInputs.Phong3}
                            onChange={(e) => handleElectricityInputChange('Phong3', e.target.value)}
                        />
                    </div>
                </div>
                <div className="p-col-12">
                    <div className="card">
                        <Button
                            label={"Khởi động"}
                            className="p-mr-2 p-mb-2"
                            onClick={() => {
                                // tải sẵn dữ liệu phòng trọ để sau này tính tiền nhanh hơn
                                (async () => {
                                    try {

                                        let data = await httpClient.getRawMethod(ELECTRICITY_API_URL);

                                        setRoomData(JSON.parse(data.value));

                                        alert("Đã tải dữ liệu phòng trọ thành công. Bạn có thể tiến hành tính toán ngay mà không cần chờ tải dữ liệu từ API nữa.");
                                    } catch (error) {
                                        console.error("Không thể tải dữ liệu phòng trọ", error);
                                    }
                                })();
                            }}
                        />
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
                            {roomMessages.Phong1}
                        </h4>
                        <h4 style={{ whiteSpace: 'pre-line', userSelect: 'text', cursor: 'text' }}>
                            {roomMessages.Phong2}
                        </h4>
                        <h4 style={{ whiteSpace: 'pre-line', userSelect: 'text', cursor: 'text' }}>
                            {roomMessages.Phong3}
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
