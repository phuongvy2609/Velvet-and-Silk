function initNotifications() {

const notificationIcon = 
    document.querySelector(".notification-icon"); 

const notificationDropdown = 
    document.getElementById("notificationDropdown"); 

const notificationList = 
    document.getElementById("notificationList"); 

const notificationCount = 
    document.getElementById("notificationCount"); 


if ( 
    !notificationIcon || 
    !notificationDropdown || 
    !notificationList || 
    !notificationCount 
) { 

    return false; 

} 


// ======================================== 
// LẤY THÔNG BÁO 
// ======================================== 

function loadNotifications() { 

    fetch("/user-notifications") 

        .then(function (res) { 

            return res.json(); 

        }) 

        .then(function (notifications) { 

            notificationList.innerHTML = ""; 


            if ( 
                !notifications || 
                notifications.length === 0 
            ) { 

                notificationList.innerHTML = ` 
                    <div class="notification-empty"> 
                        Không có thông báo 
                    </div> 
                `; 

                notificationCount.style.display = 
                    "none"; 

                return; 

            } 


            // ======================================== 
            // ĐẾM CHƯA ĐỌC 
            // ======================================== 

            let unreadCount = 0; 


            notifications.forEach( 
                function (notification) { 

                    if ( 
                        notification.is_read === 0 || 
                        notification.is_read === false 
                    ) { 

                        unreadCount++; 

                    } 

                } 
            ); 


            if (unreadCount > 0) { 

                notificationCount.textContent = 
                    unreadCount; 

                notificationCount.style.display = 
                    "block"; 

            } else { 

                notificationCount.style.display = 
                    "none"; 

            } 


            // ======================================== 
            // HIỂN THỊ 
            // ======================================== 

            notifications.forEach( 
                function (notification) { 

                    const item = 
                        document.createElement("div"); 


                    item.className = 
                        "notification-item"; 


                    if ( 
                        notification.is_read === 0 || 
                        notification.is_read === false 
                    ) { 

                        item.classList.add("unread"); 

                    } 


                    item.innerHTML = ` 

                        <div class="notification-title"> 
                            ${notification.notification_title || ""} 
                        </div> 

                        <div class="notification-message"> 
                            ${notification.notification_content || ""} 
                        </div> 

                        <div class="notification-time"> 
                            ${formatTime( 
                                notification.created_at 
                            )} 
                        </div> 

                    `; 

                    const deleteButton = 
                        document.createElement("button"); 

                    deleteButton.className = 
                        "notification-delete"; 

                    deleteButton.innerHTML = 
                        '<i class="fa-solid fa-trash"></i> Xóa'; 

                    deleteButton.addEventListener( 
                        "click", 
                        function (event) { 

                            event.stopPropagation(); 

                            fetch( 
                                `/user-notifications/${notification.notification_id}`, 
                                { 
                                    method: "DELETE" 
                                } 
                            ) 
                                .then(function (res) { 

                                    return res.json(); 

                                }) 
                                .then(function (data) { 

                                    if (data.success) { 

                                        show(`Đã xóa thông báo`); 

                                        item.remove(); 

                                        loadNotifications(); 

                                    } 

                                }); 

                        } 
                    ); 

                    item.appendChild(deleteButton); 

                    // ======================================== 
                    // CLICK THÔNG BÁO 
                    // ======================================== 

                    item.addEventListener( 
                        "click", 
                        function () { 

                            fetch( 
                                `/user-notifications/${notification.notification_id}/read`, 
                                { 
                                    method: "PUT" 
                                } 
                            ) 

                                .then(function () { 

                                    show(`Đã đánh dấu thông báo là đã đọc`); 

                                    notification.is_read = 
                                        1; 


                                    if ( 
                                        notification.notification_type === "order" && 
                                        notification.order_id 
                                    ) { 

                                        window.location.href = 
                                            `xemchitiet.html?order_id=${notification.order_id}`; 

                                        return; 

                                    } 


                                    loadNotifications(); 

                                }); 

                        } 

                    ); 


                    notificationList.appendChild(item); 

                } 
            ); 

        }); 

} 


// ======================================== 
// FORMAT THỜI GIAN 
// ======================================== 

function formatTime(time) { 

    const date = 
        new Date(time); 

    return date.toLocaleString( 
        "vi-VN", 
        { 
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric", 
            hour: "2-digit", 
            minute: "2-digit" 
        } 
    ); 

} 


// ======================================== 
// BẤM ICON CHUÔNG 
// ======================================== 

notificationIcon.addEventListener( 
    "click", 
    function (event) { 

        event.preventDefault(); 

        event.stopPropagation(); 

        notificationDropdown.classList.toggle( 
            "show" 
        ); 


        if ( 
            notificationDropdown.classList.contains( 
                "show" 
            ) 
        ) { 

            loadNotifications(); 

        } 

    } 
); 


// ======================================== 
// BẤM RA NGOÀI 
// ======================================== 

document.addEventListener( 
    "click", 
    function (event) { 

        const notificationBox = 
            document.querySelector(".notification-box"); 


        if ( 
            notificationBox && 
            !notificationBox.contains(event.target) 
        ) { 

            notificationDropdown.classList.remove( 
                "show" 
            ); 

        } 

    } 
); 


// ======================================== 
// TẢI BAN ĐẦU 
// ======================================== 

loadNotifications(); 


// ======================================== 
// TỰ ĐỘNG CẬP NHẬT 
// ======================================== 

setInterval( 
    function () { 

        loadNotifications(); 

    }, 
    5000 
); 


return true; 


}

// ========================================
// CHỜ HTML LOAD
// ========================================

document.addEventListener(
"DOMContentLoaded",
function () {


    const notificationTimer = 
        setInterval( 
            function () { 

                if (initNotifications()) { 

                    clearInterval( 
                        notificationTimer 
                    ); 

                } 

            }, 
            100 
        ); 

} 

);
