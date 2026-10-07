function load(file, id) {

    fetch(file)

        .then(function (res) {

            if (!res.ok) {
                return;
            }

            return res.text();

        })

        .then(function (data) {

            if (!data) {
                return;
            }

            const element =
                document.getElementById(id);

            if (!element) {
                return;
            }

            element.innerHTML = data;

            // ===============================
            // LOAD CART COUNT
            // ===============================

            if (id === "header") {
                loadCartCount();
            }

            // ===============================
            // KIỂM TRA ĐĂNG NHẬP
            // ===============================

            fetch("/get-user")
                .then(function (res) {

                    return res.json();

                })
                .then(function (data) {

                    const logoutItem =
                        document.querySelector("#logoutItem");

                    const exploreButton =
                        document.querySelector("#exploreButton");

                    if (!data.user) {

                        if (logoutItem) {
                            logoutItem.style.display = "none";
                        }

                        if (exploreButton) {
                            exploreButton.style.display = "block";
                        }

                    } else {

                        if (logoutItem) {
                            logoutItem.style.display = "block";
                        }

                        if (exploreButton) {
                            exploreButton.style.display = "none";
                        }
                    }
                });

            // ===============================
            // USER MENU
            // ===============================

            const userElement =
                document.querySelector(".user");

            const uElement =
                document.querySelector(".u");

            if (uElement && userElement) {

                uElement.onclick = function (e) {

                    e.stopPropagation();

                    userElement.style.display =
                        "block";
                };
            }

            // ===============================
            // SEARCH
            // ===============================

            const searchElement =
                document.querySelector(".search");

            const klElement =
                document.querySelector(".kl");

            if (klElement && searchElement) {

                klElement.onclick = function (e) {

                    e.stopPropagation();

                    searchElement.style.display =
                        "block";

                    searchElement.focus();
                };

                searchElement.onclick =
                    function (e) {

                        e.stopPropagation();

                    };

                searchElement.onkeydown =
                    function (e) {

                        if (e.key === "Enter") {

                            const keyword =
                                searchElement.value.trim();

                            if (keyword !== "") {

                                window.location.href =
                                    "sanpham.html?search=" +
                                    encodeURIComponent(keyword);
                            }
                        }
                    };
            }

            // ===============================
            // LOGOUT USER
            // ===============================

            const logoutBtn =
                document.querySelector("#logoutBtn");

            if (logoutBtn) {

                logoutBtn.onclick =
                    function (e) {

                        e.preventDefault();

                        const confirmLogout =
                            confirm(
                                "Bạn có chắc muốn đăng xuất không?"
                            );

                        if (!confirmLogout) {
                            return;
                        }

                        fetch("/logout-user", {

                            method: "POST",

                            credentials: "same-origin"

                        })

                            .then(function (res) {

                                return res.text();

                            })

                            .then(function (data) {

                                if (data === "ok") {

                                    show(
                                        `Đăng xuất User thành công!`
                                    );

                                    setTimeout(
                                        function () {

                                            window.location.href =
                                                "/dangnhap.html";

                                        },
                                        1000
                                    );
                                } else {

                                    show(
                                        `Đăng xuất User thất bại!`
                                    );
                                }
                            });
                    };
            }

            // ===============================
            // LOGOUT ADMIN
            // ===============================

            const adminLogoutBtn =
                document.querySelector(
                    "#adminLogoutBtn"
                );

            if (adminLogoutBtn) {

                adminLogoutBtn.onclick =
                    function (e) {

                        e.preventDefault();

                        const confirmLogout =
                            confirm(
                                "Bạn có chắc muốn đăng xuất không?"
                            );

                        if (!confirmLogout) {
                            return;
                        }

                        fetch("/logout-admin", {

                            method: "POST",

                            credentials: "same-origin"

                        })

                            .then(function (res) {

                                return res.text();

                            })

                            .then(function (data) {

                                if (data === "ok") {

                                    show(
                                        `Đăng xuất Admin thành công!`
                                    );

                                    window.location.href =
                                        "/dangnhap.html";

                                } else {

                                    show(
                                        `Đăng xuất Admin thất bại!`
                                    );
                                }
                            });
                    };
            }

            // ===============================
            // SAU KHI LOAD HEADER/FOOTER
            // KIỂM TRA LẠI CHAT
            // ===============================

            updateChatNotification();

        });
}


// ========================================
// CLICK RA NGOÀI
// ========================================

window.onclick = function () {

    const userElement =
        document.querySelector(".user");

    const searchElement =
        document.querySelector(".search");

    if (userElement) {

        userElement.style.display =
            "none";
    }

    if (searchElement) {

        searchElement.style.display =
            "none";
    }
};


// ========================================
// TÌM KIẾM
// ========================================

function timKiem() {

    const searchInput =
        document.querySelector("#searchInput");

    if (!searchInput) {
        return;
    }

    const keyword =
        searchInput.value.trim();

    if (keyword !== "") {

        window.location.href =
            "sanpham.html?search=" +
            encodeURIComponent(keyword);
    }
}


// ========================================
// CART COUNT
// ========================================

async function loadCartCount() {

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    const response =
        await fetch(
            "/cart-count?time=" + Date.now()
        );

    const data =
        await response.json();

    localStorage.setItem(
        "cartCount",
        data.total
    );

    if (data.total > 0) {

        cartCount.textContent =
            data.total;

        cartCount.style.display =
            "flex";

    } else {

        cartCount.textContent =
            "";

        cartCount.style.display =
            "none";
    }
}


// ========================================
// UPDATE CART ICON
// ========================================

function updateCartIcon() {

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    const total =
        Number(
            localStorage.getItem("cartCount")
        ) || 0;

    if (total > 0) {

        cartCount.textContent =
            total;

        cartCount.style.display =
            "flex";

    } else {

        cartCount.textContent =
            "";

        cartCount.style.display =
            "none";
    }
}


window.addEventListener(
    "storage",
    function (e) {

        if (e.key === "cartCount") {

            updateCartIcon();
        }
    }
);


// ========================================
// CHAT NOTIFICATION
// ========================================

function updateChatNotification() {

    const chatIcon =
        document.querySelector(".chat-icon");

    if (!chatIcon) return;

    // ========================================
    // ĐANG Ở TRANG CHAT
    // ========================================

    if (
        window.location.pathname.includes("chat.html")
    ) {

        removeChatNotification();

        return;
    }

    // ========================================
    // KIỂM TRA ĐĂNG NHẬP TRƯỚC
    // ========================================

    fetch("/get-user")

        .then(function (res) {

            return res.json();

        })

        .then(function (data) {

            // Chưa đăng nhập
            if (!data.user) {

                removeChatNotification();

                return null;
            }

            // Đã đăng nhập mới lấy tin nhắn
            return fetch(
                "/chat/messages?time=" + Date.now()
            );

        })

        .then(function (res) {

            if (!res) return null;

            if (
                res.status === 401 ||
                res.status === 403
            ) {

                return null;
            }

            return res.json();

        })

        .then(function (messages) {

            if (!messages) return;

            // Lấy tin shop gửi
            const shopMessages =
                messages.filter(function (message) {

                    return (
                        message.sender === "admin" ||
                        message.sender === "shop"
                    );

                });

            if (shopMessages.length === 0) {

                removeChatNotification();

                return;
            }

            // Tin cuối cùng đã đọc
            const lastReadId =
                Number(
                    localStorage.getItem(
                        "chatLastReadId"
                    ) || 0
                );

            // Tin chưa đọc
            const unreadMessages =
                shopMessages.filter(function (message) {

                    return (
                        Number(message.id) >
                        lastReadId
                    );

                });

            const unreadCount =
                unreadMessages.length;

            if (unreadCount > 0) {

                showChatNotification(unreadCount);

            } else {

                removeChatNotification();

            }

        });

}


// ========================================
// HIỂN THỊ SỐ TRÊN ICON CHAT
// ========================================

function showChatNotification(count) {

    const chatIcon =
        document.querySelector(".chat-icon");

    if (!chatIcon) {
        return;
    }

    let notification =
        chatIcon.querySelector(
            ".chat-notification"
        );

    if (!notification) {

        notification =
            document.createElement("span");

        notification.classList.add(
            "chat-notification"
        );

        chatIcon.appendChild(
            notification
        );
    }

    if (count > 99) {

        notification.textContent =
            "99+";

    } else {

        notification.textContent =
            count;
    }
}


// ========================================
// XÓA SỐ THÔNG BÁO
// ========================================

function removeChatNotification() {

    const chatIcon =
        document.querySelector(".chat-icon");

    if (!chatIcon) {
        return;
    }

    const notification =
        chatIcon.querySelector(
            ".chat-notification"
        );

    if (notification) {

        notification.remove();
    }
}



// ========================================
// CLICK CHAT ICON
// ========================================

document.addEventListener(
    "click",
    function (e) {

        const chatIcon =
            e.target.closest("#chatIcon");

        if (!chatIcon) {
            return;
        }

        sessionStorage.setItem(
            "openChat",
            "true"
        );

        window.location.href =
            "chat.html";
    }
);


// ========================================
// LOAD HEADER + FOOTER
// ========================================

load("header.html", "header");

load("footer.html", "footer");