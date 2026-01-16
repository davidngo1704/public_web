import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useRef, useState, useEffect, useContext } from 'react';
import { RTLContext } from '../App';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import httpClient from '../utils/htttpClient';

export default function ChatComponent() {
    const hostname = window.location.hostname;
    const domain = hostname.replace(/\.com$/, '');
    const [agents, setAgents] = useState<any[]>([]);
    const [agent, setAgent] = useState<any>("");
    const [loading, setLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<any>([]);

    useEffect(() => {
        (async () => {
            try {
                setAgent(domain);

                let dataRes = await httpClient.getMethod("file/download-text?filepath=%2Fvar%2Flib%2FApiGateway%2FConfigs%2FSystemConfig%2Fagents.json");

                let data = JSON.parse(dataRes);

                setAgents(data || []);


            } catch (error) {
            }
        })();
    }, []);

    const menu10 = useRef<any>(null);
    const menu8 = useRef<any>(null);
    const isRTL = useContext(RTLContext)
    const chatcontainer = useRef<any>(null);

    // Hàm cuộn xuống cuối khung chat
    const scrollToBottom = () => {
        setTimeout(() => {
            const el = chatcontainer.current;
            if (el) {
                el.scroll({
                    top: el.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
    };

    const addMessage = (message: string, isOwner: boolean) => {
        setChatMessages((prevMessages: any) => {
            let newChatMessages = [...prevMessages];

            if (isOwner) {
                // Tin nhắn của user luôn tạo entry mới
                newChatMessages.push({ messages: [message], from: null });
            }
            else {
                if (newChatMessages.length === 0) {
                    // Nếu chưa có tin nhắn nào, tạo mới
                    newChatMessages.push({
                        messages: [message],
                        from: 'Trợ lý', url: 'assets/demo/images/avatar/ionibowcher.png'
                    });
                } else {
                    let lastMessage = newChatMessages[newChatMessages.length - 1];
                    // Nếu tin nhắn cuối cùng từ assistant, append vào
                    if (lastMessage.from) {
                        lastMessage.messages.push(message);
                    }
                    // Nếu tin nhắn cuối cùng từ user, tạo entry mới
                    else {
                        newChatMessages.push({
                            messages: [message],
                            from: 'Trợ lý', url: 'assets/demo/images/avatar/ionibowcher.png'
                        });
                    }
                }
            }
            return newChatMessages;
        });

        // Cuộn xuống sau khi thêm tin nhắn
        scrollToBottom();
    }

    const onChatKeydown = async (event: any) => {
        if (event.key === 'Enter') {
            // Chặn gửi tin nhắn mới khi đang chờ phản hồi
            if (loading) return;

            let message = event.target.value;
            if (!message || message.trim() === '') return; // Kiểm tra tin nhắn rỗng

            // Clear ô input
            event.target.value = '';

            // 1. Hiển thị tin nhắn của User ngay lập tức
            addMessage(message, true);

            // 2. Bật trạng thái loading để hiện "Đang nhập..."
            setLoading(true);
            scrollToBottom();

            (async () => {
                try {
                    // Gọi API
                    const { reply } = await httpClient.postMethod(`${domain}/chat/`, { message: message, agent: agent });

                    // Giả lập độ trễ nhỏ để trải nghiệm mượt mà hơn (tùy chọn)
                    setTimeout(() => {
                        addMessage(reply, false);
                        setLoading(false); // Tắt loading sau khi nhận phản hồi
                    }, 200);

                } catch (error) {
                    // Xử lý khi API lỗi
                    setTimeout(() => {
                        addMessage("Hệ thống đang bận, vui lòng thử lại sau.", false);
                        setLoading(false);
                    }, 200);
                }
            })();
        }
    }
  
    return (
        <>
            <div className="p-col-12 p-lg-3">
                <div className="card height-100">
                    <div className="card-header">
                        <h5>Đoạn chat</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu10.current?.toggle(event)}></Button>
                            <Menu ref={menu10} popup model={[{ label: 'Update', icon: 'pi pi-fw pi-refresh' }, { label: 'Edit', icon: 'pi pi-fw pi-pencil' }]}></Menu>
                        </div>
                    </div>
                    <ul className="widget-bestsellers" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <li>
                            {
                                agents.map((agent, index) => (
                                    <div key={index} className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2"
                                        onClick={() => {
                                            setAgent(agent.value);
                                            alert(agent.value);
                                        }}
                                    >
                                        <img src={agent.avatar} alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                        <span>{agent.name}</span>
                                        <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                                    </div>
                                ))
                            }
                        </li>
                    </ul>
                </div>
            </div>

            <div className="p-col-12 p-lg-9">
                <div className="card height-100">
                    <div className="card-header">
                        <h5>Chat</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu8.current?.toggle(event)}></Button>
                            <Menu ref={menu8} popup model={[{ label: 'View Media', icon: 'pi pi-fw pi-images' }, { label: 'Starred Messages', icon: 'pi pi-fw pi-star-o' }, { label: 'Search', icon: 'pi pi-fw pi-search' }]}></Menu>
                        </div>
                    </div>
                    <div className="widget-chat">
                        <ul ref={chatcontainer}>
                            {
                                chatMessages && chatMessages.map((chatMessage: any, i: any) => {
                                    const last = i === chatMessages.length - 1;
                                    return <li key={i} className={classNames('p-d-flex p-ai-start', { 'from': chatMessage.from, 'own p-jc-end': !chatMessage.from, 'p-mb-3': !last, 'p-mb-1': last })}>
                                        {chatMessage.url && <img src={chatMessage.url} alt="avatar" className={classNames({ 'p-mr-2': !isRTL, 'p-ml-2': isRTL })} />}
                                        <div className={classNames('messages p-d-flex p-flex-column', { 'p-ai-start': chatMessage.from, 'p-ai-end': !chatMessage.from })}>
                                            {
                                                chatMessage.messages.map((message: any, i: any) => {
                                                    const first = i === 0
                                                    return <span key={i} className={classNames('message', { 'cyan-bgcolor': chatMessage.from, 'pink-bgcolor': !chatMessage.from, 'p-mt-1': !first })}>
                                                        {message}
                                                    </span>
                                                })
                                            }
                                        </div>
                                    </li>
                                })
                            }

                            {/* --- PHẦN HIỂN THỊ ĐANG NHẬP (Typing Indicator) --- */}
                            {loading && (
                                <li className="p-d-flex p-ai-start from p-mb-1">
                                    <img
                                        src="assets/demo/images/avatar/ionibowcher.png"
                                        alt="avatar"
                                        className={classNames({ 'p-mr-2': !isRTL, 'p-ml-2': isRTL })}
                                    />
                                    <div className="messages p-d-flex p-flex-column p-ai-start">
                                        <span className="message cyan-bgcolor" style={{ display: 'flex', alignItems: 'center' }}>
                                            <i className="pi pi-spin pi-spinner" style={{ marginRight: '8px', fontSize: '0.8rem' }}></i>
                                            <span style={{ fontStyle: 'italic', opacity: 0.8 }}>Đang nhập...</span>
                                        </span>
                                    </div>
                                </li>
                            )}
                            {/* ------------------------------------------------ */}

                        </ul>
                        <div className="p-inputgroup write-message p-mt-3">
                            <span className="p-inputgroup-addon">
                                <Button type="button" icon="pi pi-plus-circle" className="p-button-text p-button-plain" onClick={() => {
                                    alert("lol");
                                }}></Button>
                            </span>
                            <InputText
                                placeholder={loading ? "Đang chờ trả lời..." : "Nhập tin nhắn"}
                                onKeyDown={onChatKeydown}
                                disabled={loading} // Khóa ô nhập khi đang loading
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                {
                    agents.filter(a => a.value === domain).map((agent, index) => (
                        <Button label={"Deploy " + agent.name} className="p-mr-2 p-mb-2" onClick={async () => {
                            let response = await httpClient.postMethod('linux/execute', { command: `bash /var/lib/ApiGateway/source_code/agents/${agent.value}/deploy.sh` });
                            alert(response)
                        }} />
                    ))
                }

            </div>
        </>
    );
}