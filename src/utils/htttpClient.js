import axios from "axios";

const getFullUrl = (url) => {
    const apiGatewayEndpoint = localStorage.getItem("apiGatewayEndpoint") || "";
    if (!apiGatewayEndpoint || url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    const path = url.startsWith("/") ? url : `/${url}`;

    return `${apiGatewayEndpoint}${path}`;
};
async function uploadFile(url, filepath, filename, file) {
    const fullUrl = getFullUrl(url);

    const serverUrl = `${fullUrl}?filepath=${encodeURIComponent(filepath || '')}&filename=${filename}`;

    try {
        let body;
        let contentType;

        if (typeof file === 'string') {
            // Nếu file là string, sử dụng trực tiếp
            body = file;
            contentType = "text/plain";
        } else {
            // Nếu file là File/Blob object, chuyển đổi sang ArrayBuffer
            body = await file.arrayBuffer();
            contentType = "application/octet-stream";
        }

        const response = await fetch(serverUrl, {
            method: "POST",
            headers: {
                "Content-Type": contentType
            },
            body: body
        });

        const result = await response.text();
        return result;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
}

function generateDownloadUrl(pathArray) {
    // 1. Định nghĩa phần gốc của đường dẫn vật lý trên ổ đĩa

    const savedRootFolder = localStorage.getItem('rootFolder');

    const rootPath = savedRootFolder || "D:/ApiGateway\\";

    let subPath = pathArray.join("\\");

    if (rootPath.startsWith("D:/") || rootPath.startsWith("D:\\")) {
        subPath = pathArray.join("\\");
    } else {
        subPath = pathArray.join("/");
    }
    
    // 2. Nối các phần tử trong mảng bằng dấu gạch chéo ngược "\"
    
    // 3. Kết hợp lại thành đường dẫn đầy đủ
    const fullPath = rootPath + subPath;
    
    // 4. Mã hóa toàn bộ đường dẫn để đưa vào tham số URL
    const encodedPath = encodeURIComponent(fullPath);
    
    // 5. Trả về chuỗi kết quả cuối cùng
    return "file/download-text?filepath=" + encodedPath;
}

const httpClient = {
    getMethod: async (url) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.get(fullUrl);
        if (status === 200 && ok) {
            return data;
        }
        return null;
    },
    getFileData: async (array) => {
        const fullUrl = getFullUrl(generateDownloadUrl(array));
        const { status, data: { ok, data } } = await axios.get(fullUrl);
        if (status === 200 && ok) {
            return data;
        }
        return null;
    },
    getRawMethod: async (url) => {
        const fullUrl = getFullUrl(url);
        const { status, data} = await axios.get(fullUrl);
        if (status === 200) {
            return data;
        }
        return null;
    },
    getFile: async (url, asString = false) => {
        const fullUrl = getFullUrl(url);
        try {
            const response = await axios.get(fullUrl, {
                responseType: asString ? 'text' : 'blob'
            });
            
            if (response.status === 200) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error("Get file failed:", error);
            return null;
        }
    },
    postMethod: async (url, payload) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.post(fullUrl, payload);
        if (status === 200 && ok) {
            return data;
        }
        return null;
    },
    putMethod: async (url, payload) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.put(fullUrl, payload);
        if (status === 200 && ok) {
            return data;
        }
        return null;
    },
    deleteMethod: async (url) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.delete(fullUrl);
        if (status === 200 && ok) {
            return data;
        }
        return null;
    },
    uploadFile
}
export default httpClient;