
const backChat =
    document.getElementById("backChat");

const sendChat =
    document.getElementById("sendChat");

const chatInput =
    document.getElementById("chatInput");

const chatContent =
    document.getElementById("chatContent");

const emojiButton =
    document.getElementById("emojiButton");

const emojiBox =
    document.getElementById("emojiBox");

const imageButton =
    document.getElementById("imageButton");

const imageInput =
    document.getElementById("imageInput");

const fileButton =
    document.getElementById("fileButton");

const fileInput =
    document.getElementById("fileInput");


// =================================
// BIẾN KIỂM TRA MỞ CHAT
// =================================

let showWelcome = false;


// =================================
// KIỂM TRA ĐĂNG NHẬP
// =================================

checkLogin();

function checkLogin() {

    fetch("/get-user")

        .then(function (res) {

            return res.json();

        })

        .then(function (data) {

            if (!data.user) {

                show(
                    "Vui lòng đăng nhập để trò chuyện với shop!"
                );

                window.location.href =
                    "/dangnhap.html";

                return;

            }

            checkOpenChat();

        });

}


// =================================
// KIỂM TRA CÓ BẤM ICON CHAT KHÔNG
// =================================

function checkOpenChat() {

    sessionStorage.removeItem("openChat");

    loadMessages(true);

}


// =================================
// QUAY LẠI
// =================================

if (backChat) {

    backChat.addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );

}


// =================================
// GỬI TEXT
// =================================

if (sendChat) {

    sendChat.addEventListener(
        "click",
        function () {

            sendMessage();

        }
    );

}


// =================================
// NHẤN ENTER
// =================================

if (chatInput) {

    chatInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


// =================================
// GỬI TEXT
// =================================

function sendMessage() {

    const message =
        chatInput.value.trim();

    if (message === "") {

        return;

    }

    fetch(
        "/chat/send",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                message_type: "text",

                message_text: message

            })

        }
    )

        .then(function (res) {

            return res.text();

        })

        .then(function (data) {

            if (data === "ok") {

                chatInput.value = "";

                if (emojiBox) {

                    emojiBox.style.display =
                        "none";

                }

                loadMessages(true);

            } else {

                show(
                    "Gửi tin nhắn thất bại!"
                );

            }

        });

}


// =================================
// EMOJI
// =================================

if (emojiButton) {

    emojiButton.addEventListener(
        "click",
        function () {

            if (
                emojiBox.style.display ===
                "flex"
            ) {

                emojiBox.style.display =
                    "none";

            } else {

                emojiBox.style.display =
                    "flex";

            }

        }
    );

}


// =================================
// CHỌN EMOJI
// =================================

document.addEventListener(
    "emoji-click",
    function (event) {

        if (!chatInput) {

            return;

        }

        chatInput.value +=
            event.detail.unicode;

        chatInput.focus();

    }
);


// =================================
// ICON ẢNH
// =================================

if (imageButton && imageInput) {

    imageButton.addEventListener(
        "click",
        function () {

            imageInput.click();

        }
    );

}


// =================================
// GỬI ẢNH
// =================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                imageInput.files[0];

            if (!file) {

                return;

            }

            const formData =
                new FormData();

            formData.append(
                "image",
                file
            );

            fetch(
                "/chat/send-image",
                {

                    method: "POST",

                    body: formData

                }
            )

                .then(function (res) {

                    return res.json();

                })

                .then(function (data) {

                    if (data.success) {

                        imageInput.value = "";

                        loadMessages(true);

                    } else {

                        show(
                            "Gửi ảnh thất bại!"
                        );

                    }

                });

        }
    );

}


// =================================
// ICON FILE
// =================================

if (fileButton && fileInput) {

    fileButton.addEventListener(
        "click",
        function () {

            fileInput.click();

        }
    );

}


// =================================
// GỬI FILE
// =================================

if (fileInput) {

    fileInput.addEventListener(
        "change",
        function () {

            const file =
                fileInput.files[0];

            if (!file) {

                return;

            }

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            fetch(
                "/chat/send-file",
                {

                    method: "POST",

                    body: formData

                }
            )

                .then(function (res) {

                    return res.json();

                })

                .then(function (data) {

                    if (data.success) {

                        fileInput.value = "";

                        loadMessages(true);

                    } else {

                        show(
                            "Gửi file thất bại!"
                        );

                    }

                });

        }
    );

}




// =================================
// LẤY LỊCH SỬ CHAT
// =================================

function loadMessages(forceScroll) {

    let shouldScroll =
        false;

    let oldScrollTop =
        0;


    if (chatContent) {

        oldScrollTop =
            chatContent.scrollTop;


        const distanceFromBottom =
            chatContent.scrollHeight -
            chatContent.scrollTop -
            chatContent.clientHeight;


        if (distanceFromBottom < 100) {

            shouldScroll = true;

        }

    }


    if (forceScroll === true) {

        shouldScroll = true;

    }


    fetch("/chat/messages")

        .then(function (res) {

            if (
                res.status === 401 ||
                res.status === 403
            ) {

                window.location.href =
                    "/dangnhap.html";

                return null;

            }

            return res.json();

        })

        .then(function (messages) {

            if (!messages) {

                return;

            }


            // =================================
            // TIN SHOP
            // =================================

            const shopMessages =
                messages.filter(
                    function (message) {

                        return (
                            message.sender === "admin" ||
                            message.sender === "shop"
                        );

                    }
                );


            if (shopMessages.length > 0) {

                const lastShopMessage =
                    shopMessages[
                        shopMessages.length - 1
                    ];


                localStorage.setItem(
                    "chatLastReadId",
                    lastShopMessage.id
                );

            }


            if (!chatContent) {

                return;

            }


            // =================================
            // XÓA CHAT CŨ
            // =================================

            chatContent.innerHTML = "";


            let previousDate =
                "";


            // =================================
            // HIỂN THỊ TIN NHẮN
            // =================================

            messages.forEach(
                function (message) {

                    const date =
                        new Date(
                            message.created_at
                        );


                    const day =
                        String(
                            date.getUTCDate()
                        ).padStart(
                            2,
                            "0"
                        );


                    const month =
                        String(
                            date.getUTCMonth() + 1
                        ).padStart(
                            2,
                            "0"
                        );


                    const year =
                        date.getUTCFullYear();


                    const currentDate =
                        `${day}/${month}/${year}`;


                    // =================================
                    // NGÀY
                    // =================================

                    if (
                        currentDate !==
                        previousDate
                    ) {

                        const dateDivider =
                            document.createElement(
                                "div"
                            );


                        dateDivider.classList.add(
                            "chat-date-divider"
                        );


                        const dateText =
                            document.createElement(
                                "span"
                            );


                        dateText.textContent =
                            currentDate;


                        dateDivider.appendChild(
                            dateText
                        );


                        chatContent.appendChild(
                            dateDivider
                        );


                        previousDate =
                            currentDate;

                    }


                    // =================================
                    // ROW
                    // =================================

                    const row =
                        document.createElement(
                            "div"
                        );


                    if (
                        message.sender ===
                        "user"
                    ) {

                        row.classList.add(
                            "message-row",
                            "user-message"
                        );

                    } else {

                        row.classList.add(
                            "message-row",
                            "shop-message"
                        );

                    }


                    // =================================
                    // CONTENT
                    // =================================

                    const content =
                        document.createElement(
                            "div"
                        );


                    content.classList.add(
                        "message-content"
                    );


                    // =================================
                    // TEXT
                    // =================================

                    if (
                        message.message_type ===
                        "text"
                    ) {

                        const messageDiv =
                            document.createElement(
                                "div"
                            );


                        messageDiv.classList.add(
                            "chat-message"
                        );


                        messageDiv.textContent =
                            message.message_text;


                        content.appendChild(
                            messageDiv
                        );

                    }


                    // =================================
                    // ẢNH
                    // =================================

                    if (
                        message.message_type ===
                        "image"
                    ) {

                        const image =
                            document.createElement(
                                "img"
                            );


                        image.src =
                            message.file_url;


                        image.classList.add(
                            "chat-image"
                        );


                        image.alt =
                            "Ảnh đã gửi";


                        content.appendChild(
                            image
                        );

                    }


                    // =================================
                    // FILE
                    // =================================

                    if (
                        message.message_type ===
                        "file"
                    ) {

                        const fileDiv =
                            document.createElement(
                                "a"
                            );


                        fileDiv.href =
                            message.file_url;


                        fileDiv.target =
                            "_blank";


                        fileDiv.classList.add(
                            "file-message"
                        );


                        const icon =
                            document.createElement(
                                "i"
                            );


                        icon.className =
                            "fa-solid fa-file";


                        const span =
                            document.createElement(
                                "span"
                            );


                        span.textContent =
                            message.file_name ||
                            "File đã gửi";


                        fileDiv.appendChild(
                            icon
                        );


                        fileDiv.appendChild(
                            span
                        );


                        content.appendChild(
                            fileDiv
                        );

                    }


                    // =================================
                    // THỜI GIAN
                    // =================================

                    const hour =
                        String(
                            date.getUTCHours()
                        ).padStart(
                            2,
                            "0"
                        );


                    const minute =
                        String(
                            date.getUTCMinutes()
                        ).padStart(
                            2,
                            "0"
                        );


                    const timeDiv =
                        document.createElement(
                            "div"
                        );


                    timeDiv.classList.add(
                        "message-time"
                    );


                    const timeSpan =
                        document.createElement(
                            "span"
                        );


                    timeSpan.textContent =
                        `${hour}:${minute}`;


                    timeDiv.appendChild(
                        timeSpan
                    );


                    content.appendChild(
                        timeDiv
                    );


                    // =================================
                    // AVATAR
                    // =================================

                    const avatar =
                        document.createElement(
                            "div"
                        );


                    avatar.classList.add(
                        "message-avatar"
                    );


                    if (
                        message.sender ===
                        "user"
                    ) {

                        avatar.textContent =
                            "Bạn";

                    } else {

                        avatar.textContent =
                            "VS";

                    }


                    // =================================
                    // GHÉP
                    // =================================

                    if (
                        message.sender ===
                        "user"
                    ) {

                        row.appendChild(
                            content
                        );

                        row.appendChild(
                            avatar
                        );

                    } else {

                        row.appendChild(
                            avatar
                        );

                        row.appendChild(
                            content
                        );

                    }


                    chatContent.appendChild(
                        row
                    );

                }
            );


            // =================================
            // CÂU CHÀO
            // =================================

            if (showWelcome) {

                showWelcomeMessage();
            }


            // =================================
            // CUỘN
            // =================================

            if (shouldScroll) {

                scrollToBottom();

            } else {

                chatContent.scrollTop =
                    oldScrollTop;

            }

        });

}


// =================================
// CUỘN XUỐNG
// =================================

function scrollToBottom() {

    if (!chatContent) {

        return;

    }

    chatContent.scrollTop =
        chatContent.scrollHeight;

}


// =================================
// TỰ ĐỘNG CẬP NHẬT
// =================================

setInterval(function () {

    fetch("/get-user")

        .then(function (res) {
            return res.json();
        })

        .then(function (data) {

            if (!data.user) {
                return;
            }

            loadMessages(false);

        });

}, 2000);

