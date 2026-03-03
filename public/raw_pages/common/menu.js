/**
 * Menu Loader - Tái sử dụng cho tất cả các trang
 * Sử dụng: Thêm <script src="common/menu.js"></script> vào HTML
 * Yêu cầu: Element có id="menuNav" phải tồn tại trong HTML
 */

(function() {
    const domain = "192.168.1.10";
    const MENU_API = `http://${domain}:1704/file/download-text?filepath=%2Fvar%2Flib%2FApiGateway%2Fdata%2Fconfigs%2Fmenu.json`;

    async function loadMenu() {
        try {
            const nav = document.getElementById("menuNav");
            if (!nav) {
                console.warn("Menu loader: Element #menuNav not found");
                return;
            }

            const res = await fetch(MENU_API);
            const raw = await res.json();
            if (!raw.ok) {
                throw new Error("Load menu.json failed");
            }

            const menu = JSON.parse(raw.data);

            // Clear existing menu items
            nav.innerHTML = "";

            // Render menu items
            menu.forEach(item => {
                const link = document.createElement("a");
                link.href = item.url;
                link.textContent = item.label;
                nav.appendChild(link);
            });
        } catch (error) {
            console.error("Error loading menu:", error);
            const nav = document.getElementById("menuNav");
            if (nav) {
                nav.innerHTML = '<span style="color: #ef4444;">Menu load failed</span>';
            }
        }
    }

    // Auto-load khi DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadMenu);
    } else {
        loadMenu();
    }
})();
