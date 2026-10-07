
let selectedUserId = null;
let customers = [];


// =================================
// HÀM HIỂN THỊ THÔNG BÁO
// =================================

function show(message) {

    const notice =
        document.querySelector(".notice");

    if (!notice) {

        return;

    }

    notice.textContent =
        message;

    notice.style.display =
        "block";

    clearTimeout(
        window.noticeTimer
    );

    window.noticeTimer =
        setTimeout(
            function () {

                notice.style.display =
                    "none";

            },
            2500
        );

}


// =================================
// LẤY ELEMENT
// =================================

const customerItems =
    document.getElementById("customerItems");

const customerName =
    document.getElementById("customerName");

const customerAvatar =
    document.getElementById("customerAvatar");

const chatInput =
    document.getElementById("chatInput");

const sendChat =
    document.getElementById("sendChat");

const chatContent =
    document.getElementById("chatContent");

const searchCustomer =
    document.getElementById("searchCustomer");

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

const backChat =
    document.getElementById("backChat");

const finishChat =
    document.getElementById("finishChat");

// =================================
// NÚT QUAY LẠI
// =================================

backChat.addEventListener(
    "click",
    function () {

        window.location.href =
            "/admin/dashboard.html";

    }
);


// =================================
// EMOJI
// =================================

const emojiPicker =
    emojiBox.querySelector("emoji-picker");


emojiButton.addEventListener(
    "click",
    function () {

        if (
            emojiBox.style.display ==
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


if (emojiPicker) {

    emojiPicker.addEventListener(
        "emoji-click",
        function (event) {

            chatInput.value +=
                event.detail.unicode;

            chatInput.focus();

        }
    );

}


// =================================
// LẤY DANH SÁCH KHÁCH HÀNG
// =================================

function loadCustomers() {

    fetch(
        "/chat/admin/customers"
    )

        .then(function (res) {

            return res.json();

        })

        .then(function (data) {

            customers = data;

            showCustomers(
                customers
            );

        });

}


// =================================
// HIỂN THỊ KHÁCH HÀNG
// =================================

function showCustomers(list) {

    customerItems.innerHTML = "";

    if (list.length == 0) {

        customerItems.innerHTML = `
            <p class="no-customer">
                Không tìm thấy khách hàng
            </p>
        `;

        return;

    }


    list.forEach(
        function (customer) {

            const div =
                document.createElement("div");

            div.classList.add(
                "customer-item"
            );


            const name =
                document.createElement("span");

            name.classList.add(
                "customer-name"
            );

            name.innerText =
                customer.fullname;


            div.appendChild(
                name
            );


            const count =
                Number(
                    customer.unread_count
                ) || 0;


            if (count > 0) {

                const badge =
                    document.createElement("span");

                badge.classList.add(
                    "customer-badge"
                );

                badge.innerText =
                    count > 99
                        ? "99+"
                        : count;

                div.appendChild(
                    badge
                );

            }


            div.addEventListener(
                "click",
                function () {

                    selectedUserId =
                        customer.id;


                    customerName.innerText =
                        customer.fullname;


                    customerAvatar.innerText =
                        getAvatarName(
                            customer.fullname
                        );


                    searchCustomer.value =
                        "";


                    loadMessages();


                    fetch(
                        `/chat/admin/messages/${customer.id}/read`,
                        {
                            method: "PUT"
                        }
                    )
                        .then(
                            function (res) {

                                return res.text();

                            }
                        )
                        .then(
                            function (data) {

                                if (
                                    data == "ok"
                                ) {

                                    customer.unread_count =
                                        0;


                                    showCustomers(
                                        customers
                                    );


                                    loadChatBadge();

                                }

                            }
                        );

                }
            );


            customerItems.appendChild(
                div
            );

        }
    );

}


// =================================
// TÌM KIẾM KHÁCH HÀNG
// =================================

searchCustomer.addEventListener(
    "input",
    function () {

        const keyword =
            searchCustomer.value
                .toLowerCase()
                .trim();


        const result =
            customers.filter(
                function (customer) {

                    const name =
                        customer.fullname ||
                        "";


                    return name
                        .toLowerCase()
                        .includes(keyword);

                }
            );


        showCustomers(
            result
        );

    }
);


// =================================
// LẤY TIN NHẮN
// =================================

function loadMessages() {

    if (
        selectedUserId == null
    ) {

        return;

    }


    fetch(
        `/chat/admin/messages/${selectedUserId}`
    )

        .then(function (res) {

            if (!res.ok) {

                throw new Error();

            }

            return res.json();

        })

        .then(function (messages) {

            chatContent.innerHTML =
                "";


            // =================================
            // LƯU NGÀY TIN NHẮN TRƯỚC
            // =================================

            let previousDate = "";


            messages.forEach(
                function (message) {


                    // =================================
                    // LẤY NGÀY CỦA TIN NHẮN
                    // =================================

                    const dateText =
                        String(
                            message.created_at
                        );


                    const datePart =
                        dateText.substring(
                            0,
                            10
                        );


                    const dateParts =
                        datePart.split("-");


                    const year =
                        dateParts[0];

                    const month =
                        dateParts[1];

                    const day =
                        dateParts[2];


                    const currentDate =
                        day +
                        "/" +
                        month +
                        "/" +
                        year;


                    // =================================
                    // NẾU SANG NGÀY MỚI
                    // HIỆN NGÀY Ở GIỮA CHAT
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


                        const dateSpan =
                            document.createElement(
                                "span"
                            );


                        dateSpan.innerText =
                            currentDate;


                        dateDivider.appendChild(
                            dateSpan
                        );


                        chatContent.appendChild(
                            dateDivider
                        );


                        previousDate =
                            currentDate;

                    }


                    // =================================
                    // TẠO DÒNG TIN NHẮN
                    // =================================

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.classList.add(
                        "message-row"
                    );


                    if (
                        message.sender ==
                        "admin"
                    ) {

                        row.classList.add(
                            "user-message"
                        );

                    } else {

                        row.classList.add(
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
                    // TIN NHẮN TEXT
                    // =================================

                    if (
                        message.message_type ==
                        "text"
                    ) {

                        const messageDiv =
                            document.createElement(
                                "div"
                            );


                        messageDiv.classList.add(
                            "chat-message"
                        );


                        messageDiv.innerText =
                            message.message_text;


                        content.appendChild(
                            messageDiv
                        );

                    }


                    // =================================
                    // TIN NHẮN ẢNH
                    // =================================

                    if (
                        message.message_type ==
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
                    // TIN NHẮN FILE
                    // =================================

                    if (
                        message.message_type ==
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
                    // THỜI GIAN TIN NHẮN
                    // =================================

                    const time =
                        document.createElement(
                            "div"
                        );


                    time.classList.add(
                        "message-time"
                    );


                    const timePart =
                        dateText.substring(
                            11,
                            19
                        );


                    const timeParts =
                        timePart.split(":");


                    const hour =
                        timeParts[0];

                    const minute =
                        timeParts[1];


                    time.innerText =
                        hour +
                        ":" +
                        minute;


                    content.appendChild(
                        time
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
                        message.sender ==
                        "admin"
                    ) {

                        avatar.innerText =
                            "VS";

                    } else {

                        avatar.innerText =
                            getAvatarName(
                                customerName.innerText
                            );

                    }


                    // =================================
                    // VỊ TRÍ TIN NHẮN
                    // =================================

                    if (
                        message.sender ==
                        "admin"
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
            // CUỘN XUỐNG CUỐI
            // =================================

            chatContent.scrollTop =
                chatContent.scrollHeight;

        })

        .catch(function () {

            show(
                `Không thể tải tin nhắn`
            );

        });

}


// =================================
// ADMIN GỬI TEXT
// =================================

sendChat.addEventListener(
    "click",
    function () {

        const message =
            chatInput.value.trim();


        if (
            selectedUserId == null
        ) {

            show(
                `Vui lòng chọn khách hàng`
            );

            return;

        }


        if (
            message == ""
        ) {

            show(
                `Vui lòng nhập tin nhắn`
            );

            return;

        }


        fetch(
            "/chat/admin/send",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    user_id:
                        selectedUserId,

                    message:
                        message

                })

            }
        )

            .then(function (res) {

                return res.text();

            })

            .then(function (data) {

                if (
                    data == "ok"
                ) {

                    chatInput.value =
                        "";

                    emojiBox.style.display =
                        "none";


                    show(
                        `Gửi tin nhắn thành công`
                    );


                    loadMessages();

                } else {

                    show(
                        `Gửi tin nhắn thất bại`
                    );

                }

            })

            .catch(function () {

                show(
                    `Gửi tin nhắn thất bại`
                );

            });

    }
);


// =================================
// NHẤN ENTER ĐỂ GỬI
// =================================

chatInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key == "Enter"
        ) {

            event.preventDefault();

            sendChat.click();

        }

    }
);


// =================================
// AVATAR
// =================================

function getAvatarName(fullname) {

    if (!fullname) {

        return "?";

    }


    const words =
        fullname
            .trim()
            .split(/\s+/);


    if (
        words.length == 1
    ) {

        return words[0]
            .charAt(0)
            .toUpperCase();

    }


    const first =
        words[0]
            .charAt(0)
            .toUpperCase();


    const last =
        words[words.length - 1]
            .charAt(0)
            .toUpperCase();


    return first + last;

}


// =================================
// GỬI ẢNH
// =================================

imageButton.addEventListener(
    "click",
    function () {

        if (
            selectedUserId == null
        ) {

            show(
                `Vui lòng chọn khách hàng`
            );

            return;

        }


        imageInput.click();

    }
);


// =================================
// CHỌN ẢNH
// =================================

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


        formData.append(
            "user_id",
            selectedUserId
        );


        fetch(
            "/chat/admin/send-image",
            {

                method: "POST",

                body: formData

            }
        )

            .then(function (res) {

                return res.json();

            })

            .then(function (result) {

                if (
                    result.success
                ) {

                    show(
                        `Gửi ảnh thành công`
                    );

                    loadMessages();

                } else {

                    show(
                        `Gửi ảnh thất bại`
                    );

                }


                imageInput.value =
                    "";

            })

            .catch(function () {

                show(
                    `Gửi ảnh thất bại`
                );

                imageInput.value =
                    "";

            });

    }
);


// =================================
// GỬI FILE
// =================================

fileButton.addEventListener(
    "click",
    function () {

        if (
            selectedUserId == null
        ) {

            show(
                `Vui lòng chọn khách hàng`
            );

            return;

        }


        fileInput.click();

    }
);


// =================================
// CHỌN FILE
// =================================

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


        formData.append(
            "user_id",
            selectedUserId
        );


        fetch(
            "/chat/admin/send-file",
            {

                method: "POST",

                body: formData

            }
        )

            .then(function (res) {

                return res.json();

            })

            .then(function (result) {

                if (
                    result.success
                ) {

                    show(
                        `Gửi file thành công`
                    );

                    loadMessages();

                } else {

                    show(
                        `Gửi file thất bại`
                    );

                }


                fileInput.value =
                    "";

            })

            .catch(function () {

                show(
                    `Gửi file thất bại`
                );

                fileInput.value =
                    "";

            });

    }
);


// =================================
// CHẠY KHI MỞ TRANG
// =================================

loadCustomers();


// =================================
// BƯỚC 7: TỰ ĐỘNG CẬP NHẬT SỐ TIN NHẮN
// =================================

setInterval(function () {

    loadChatBadge();

    loadCustomers();

}, 2000);


finishChat.addEventListener(
    "click",
    function () {

        if (
            selectedUserId == null
        ) {

            show(
                "Vui lòng chọn khách hàng"
            );

            return;

        }


        fetch(
            `/chat/admin/finish/${selectedUserId}`,
            {
                method: "PUT"
            }
        )

            .then(function (res) {

                return res.text();

            })

            .then(function (data) {

                if (
                    data == "ok"
                ) {

                    show(
                        "Đã kết thúc tư vấn"
                    );


                    selectedUserId =
                        null;


                    customerName.innerText =
                        "Chọn khách hàng";


                    customerAvatar.innerText =
                        "?";


                    chatContent.innerHTML =
                        "";


                    loadCustomers();

                } else {

                    show(
                        "Không thể kết thúc tư vấn"
                    );

                }

            })

            .catch(function () {

                show(
                    "Không thể kết thúc tư vấn"
                );

            });

    }
);