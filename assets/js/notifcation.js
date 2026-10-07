document.addEventListener("DOMContentLoaded", function () {

const notificationBtn =
    document.getElementById("notificationBtn");

const notificationDropdown =
    document.getElementById("notificationDropdown");

const notificationBadge =
    document.getElementById("notificationBadge");

const notificationList =
    document.getElementById("notificationList");


// ========================================
// HIỂN THỊ THÔNG BÁO
// ========================================

function show(message) {

    const notice =
        document.querySelector(".notice");

    if (!notice) {
        return;
    }

    notice.textContent =
        `${message}`;

    notice.style.display =
        "block";

    clearTimeout(
        window.noticeTimer
    );

    window.noticeTimer =
        setTimeout(function () {

            notice.style.display =
                "none";

        }, 3000);

}


// ========================================
// ĐẾM THÔNG BÁO CHƯA ĐỌC
// ========================================

function loadUnreadCount() {

    fetch("/notifications/unread-count")

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            const count =
                Number(data.total) || 0;

            notificationBadge.textContent =
                count;

            if (count === 0) {

                notificationBadge.classList.add("hidden");

            } else {

                notificationBadge.classList.remove("hidden");

            }

        });

}


// ========================================
// LOAD THÔNG BÁO
// ========================================

function loadNotifications() {

    fetch("/notifications")

        .then(function (response) {

            return response.json();

        })

        .then(function (notifications) {

            notificationList.innerHTML = "";


            if (
                !notifications ||
                notifications.length === 0
            ) {

                notificationList.innerHTML = `
                    <div class="notification-empty">
                        Không có thông báo mới
                    </div>
                `;

                loadUnreadCount();

                return;

            }


            notifications.forEach(function (notification) {

                const item =
                    document.createElement("div");


                item.className =
                    "notification-item";


                // ========================================
                // KIỂM TRA CHƯA ĐỌC
                // ========================================

                if (
                    notification.is_read === 0 ||
                    notification.is_read === false
                ) {

                    item.classList.add("unread");

                }


                // ========================================
                // THỜI GIAN
                // ========================================

                let time = "";

                if (notification.created_at) {

                    time =
                        notification.created_at
                            .replace("T", " ")
                            .slice(0, 16);

                }


                // ========================================
                // NỘI DUNG THÔNG BÁO
                // ========================================

                item.innerHTML = `

                    <div class="notification-content">

                        <h4>
                            ${notification.notification_title}
                        </h4>

                        <p>
                            ${notification.notification_content}
                        </p>

                        <span class="notification-time">
                            ${time}
                        </span>

                    </div>

                    <button
                        class="notification-delete"
                        type="button"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Xóa
                    </button>

                `;


                // ========================================
                // NÚT XÓA
                // ========================================

                const deleteBtn =
                    item.querySelector(".notification-delete");


                deleteBtn.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        fetch(
                            `/notifications/${notification.notification_id}`,
                            {
                                method: "DELETE"
                            }
                        )

                            .then(function (response) {

                                if (!response.ok) {
                                    return;
                                }


                                // Xóa thông báo khỏi giao diện
                                item.remove();


                                // Cập nhật số thông báo chưa đọc
                                loadUnreadCount();


                                // Hiển thị thông báo
                                show(`Đã xóa thông báo`);


                                // Nếu xóa hết thông báo
                                if (
                                    notificationList.children.length === 0
                                ) {

                                    notificationList.innerHTML = `
                                        <div class="notification-empty">
                                            Không có thông báo mới
                                        </div>
                                    `;

                                }

                            });

                    }
                );


                // ========================================
                // CLICK VÀO THÔNG BÁO
                // ========================================

                item.addEventListener(
                    "click",
                    function () {

                        const isUnread =
                            notification.is_read === 0 ||
                            notification.is_read === false;


                        if (isUnread) {

                            fetch(
                                `/notifications/${notification.notification_id}/read`,
                                {
                                    method: "PUT"
                                }
                            )

                                .then(function () {

                                    notification.is_read = 1;

                                    item.classList.remove("unread");

                                    loadUnreadCount();

                                    show(`Đã đánh dấu thông báo là đã đọc`);

                                    goToNotificationPage(
                                        notification
                                    );

                                });

                        } else {

                            goToNotificationPage(
                                notification
                            );

                        }

                    }
                );


                notificationList.appendChild(item);

            });


            loadUnreadCount();

        });

}


// ========================================
// CHUYỂN TRANG THEO LOẠI THÔNG BÁO
// ========================================

function goToNotificationPage(notification) {

    const title =
        (notification.notification_title || "")
            .toLowerCase();

    const content =
        (notification.notification_content || "")
            .toLowerCase();


    if (
        title.includes("đơn hàng") ||
        content.includes("đơn hàng")
    ) {

        window.location.href =
            "qldonhang.html";

        return;

    }


    if (
        title.includes("đánh giá") ||
        title.includes("bình luận") ||
        content.includes("đánh giá") ||
        content.includes("bình luận")
    ) {

        window.location.href =
            "qldanhgiavabinhluan.html";

        return;

    }


    if (
        title.includes("phản hồi") ||
        content.includes("phản hồi")
    ) {

        window.location.href =
            "qlphanhoi.html";

        return;

    }


    if (
        title.includes("tin nhắn") ||
        title.includes("tin nhắn mới") ||
        content.includes("tin nhắn")
    ) {

        window.location.href =
            "mess.html";

        return;

    }


    if (
        title.includes("người dùng") ||
        title.includes("tài khoản") ||
        title.includes("đăng ký") ||
        content.includes("người dùng") ||
        content.includes("tài khoản") ||
        content.includes("đăng ký")
    ) {

        window.location.href =
            "qlnguoidung.html";

        return;

    }

}


// ========================================
// MỞ / ĐÓNG DROPDOWN
// ========================================

notificationBtn.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        notificationDropdown.classList.toggle("show");

        loadNotifications();

    }
);


document.addEventListener(
    "click",
    function (event) {

        if (
            !notificationDropdown.contains(event.target) &&
            !notificationBtn.contains(event.target)
        ) {

            notificationDropdown.classList.remove("show");

        }

    }
);


// ========================================
// LOAD LẦN ĐẦU
// ========================================

loadNotifications();


// ========================================
// TỰ ĐỘNG CẬP NHẬT SỐ THÔNG BÁO
// ========================================

setInterval(function () {

    loadUnreadCount();

}, 5000);

});
