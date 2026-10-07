let allContacts = [];

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
    setTimeout(function () {

        notice.style.display =
            "none";

    }, 3000);

}

function displayContacts(contacts) {


const contactList =
    document.querySelector(".contact-list");

if (!contactList) {
    return;
}

contactList.innerHTML = "";

if (contacts.length === 0) {

    contactList.innerHTML = `
        <tr>
            <td colspan="7">
                Không tìm thấy phản hồi nào
            </td>
        </tr>
    `;

    return;
}


contacts.forEach(function (contact) {

    const tr =
        document.createElement("tr");

    let statusClass = "";

    if (contact.status === "Đã đọc") {

        statusClass =
            "status-read";

    } else {

        statusClass =
            "status-unread";
    }


    let date = "";

    if (contact.created_at) {

        date =
            String(contact.created_at)
                .replace("T", " ")
                .slice(0, 16);
    }


    tr.innerHTML = `
        <td>
            ${contact.id}
        </td>

        <td>
            ${contact.name || ""}
        </td>

        <td>
            <span
                class="email-click"
                data-id="${contact.id}"
                data-email="${contact.email || ""}"
            >
                ${contact.email || ""}
            </span>
        </td>

        <td>
            ${contact.mess || ""}
        </td>

        <td>
            <span class="${statusClass}">
                ${contact.status || "Chưa đọc"}
            </span>
        </td>

        <td>
            ${date}
        </td>

        <td>
            <button
                class="delete-btn"
                data-id="${contact.id}"
                title="Xóa phản hồi"
            >
                <i class="fa-solid fa-trash"></i>
                Xóa
            </button>
        </td>
    `;


    contactList.appendChild(tr);

});


addContactEvents();


}

function addContactEvents() {


const emailButtons =
    document.querySelectorAll(".email-click");


emailButtons.forEach(function (emailButton) {

    emailButton.addEventListener(
        "click",
        function () {

            const id =
                this.dataset.id;

            const emailAddress =
                this.dataset.email;


            // ========================================
            // ĐỔI TRẠNG THÁI THÀNH ĐÃ ĐỌC
            // ========================================

            fetch(
                "/readContact",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        id: id
                    })
                }
            )
                .then(
                    function (response) {

                        if (!response.ok) {

                            show(
                                "Không thể cập nhật trạng thái phản hồi!"
                            );

                            return null;
                        }

                        return response.text();

                    },
                    function () {

                        show(
                            "Không thể kết nối đến máy chủ!"
                        );

                        return null;

                    }
                )
                .then(
                    function (result) {

                        if (result === null) {
                            return;
                        }


                        const contact =
                            allContacts.find(
                                function (item) {

                                    return String(item.id) ===
                                        String(id);

                                }
                            );


                        if (contact) {

                            contact.status =
                                "Đã đọc";
                        }


                        const searchInput =
                            document.querySelector(
                                "#searchInput"
                            );

                        const filterSelect =
                            document.querySelector(
                                "#filterSelect"
                            );


                        if (
                            searchInput &&
                            filterSelect &&
                            (
                                searchInput.value.trim() !== "" ||
                                filterSelect.value !== "all"
                            )
                        ) {

                            filterContacts();

                        } else {

                            displayContacts(
                                allContacts
                            );
                        }


                        // ========================================
                        // MỞ GMAIL SOẠN THƯ
                        // ========================================

                        const subject =
                            "Phản hồi từ Velvet & Silk";


                        const body =


                           `╭───────────────୨୧───────────────╮
                                 🌸  𝓥𝓮𝓵𝓿𝓮𝓽 & 𝓢𝓲𝓵𝓴  🌸
                            ╰───────────────୨୧───────────────╯

                            Xin chào Quý khách,
                            💗 Velvet & Silk cảm ơn Quý khách đã liên hệ với shop. 💗

                            ✦ NỘI DUNG PHẢN HỒI ✦

                            [Nhập nội dung phản hồi tại đây]

                            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                            💌 Nếu Quý khách cần thêm thông tin về sản phẩm quần áo, size, giá hoặc đơn hàng, vui lòng liên hệ lại với Velvet & Silk.
                            🎀 Velvet & Silk luôn sẵn sàng hỗ trợ Quý khách.
                            🩷 Cảm ơn Quý khách đã tin tưởng và lựa chọn Velvet & Silk.
                            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                            Trân trọng,

                            ✨ VELVET & SILK ✨
                            🌷 Shop thời trang nữ 🌷
                            Thời trang • Phong cách • Thanh lịch
                            💫 Chúc Quý khách một ngày thật xinh đẹp! 💫`;


                         const gmailUrl =
                            "https://mail.google.com/mail/u/velvetandsilk26@gmail.com/?view=cm&fs=1" +
                            "&to=" +
                            encodeURIComponent(emailAddress) +
                            "&su=" +
                            encodeURIComponent(subject) +
                            "&body=" +
                            encodeURIComponent(body);

                        fetch("/create-contact-reply-notification", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                email: emailAddress
                            })
                        })
                        .then(function () {
                            window.open(gmailUrl, "_blank");
                        });

                    }
                );

        }
    );

});


// ========================================
// XÓA PHẢN HỒI
// ========================================

const deleteButtons =
    document.querySelectorAll(".delete-btn");


deleteButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const id =
                this.dataset.id;


            const confirmDelete =
                confirm(
                    `Bạn có chắc muốn xóa phản hồi "${id}" này không?`
                );


            if (!confirmDelete) {
                return;
            }


            fetch(
                "/deleteContact",
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        id: id
                    })
                }
            )
                .then(
                    function (response) {

                        if (!response.ok) {

                            show(
                                "Không thể xóa phản hồi!"
                            );

                            return null;
                        }

                        return response.text();

                    },
                    function () {

                        show(
                            "Không thể kết nối đến máy chủ!"
                        );

                        return null;

                    }
                )
                .then(
                    function (result) {

                        if (result === null) {
                            return;
                        }


                        allContacts =
                            allContacts.filter(
                                function (contact) {

                                    return String(
                                        contact.id
                                    ) !== String(id);

                                }
                            );


                        const searchInput =
                            document.querySelector(
                                "#searchInput"
                            );

                        const filterSelect =
                            document.querySelector(
                                "#filterSelect"
                            );


                        if (
                            searchInput &&
                            filterSelect &&
                            (
                                searchInput.value.trim() !== "" ||
                                filterSelect.value !== "all"
                            )
                        ) {

                            filterContacts();

                        } else {

                            displayContacts(
                                allContacts
                            );
                        }


                        show(
                            `Đã xóa phản hồi "${id}" thành công!`
                        );

                    }
                );

        }
    );

});


}

function filterContacts() {


const searchInput =
    document.querySelector("#searchInput");

const filterSelect =
    document.querySelector("#filterSelect");


let keyword = "";

if (searchInput) {

    keyword =
        searchInput.value
            .trim()
            .toLowerCase();
}


let status = "all";

if (filterSelect) {

    status =
        filterSelect.value
            .toLowerCase();
}


const filteredContacts =
    allContacts.filter(
        function (contact) {

            const id =
                String(
                    contact.id || ""
                ).toLowerCase();


            const name =
                String(
                    contact.name || ""
                ).toLowerCase();


            const email =
                String(
                    contact.email || ""
                ).toLowerCase();


            const mess =
                String(
                    contact.mess || ""
                ).toLowerCase();


            const contactStatus =
                String(
                    contact.status ||
                    "Chưa đọc"
                ).toLowerCase();


            const date =
                contact.created_at
                    ? String(
                        contact.created_at
                    )
                        .replace("T", " ")
                        .slice(0, 16)
                        .toLowerCase()
                    : "";


            const matchSearch =

                id.includes(keyword) ||

                name.includes(keyword) ||

                email.includes(keyword) ||

                mess.includes(keyword) ||

                contactStatus.includes(keyword) ||

                date.includes(keyword);


            let matchStatus = true;


            if (status === "read") {

                matchStatus =
                    contact.status ===
                    "Đã đọc";
            }


            if (status === "unread") {

                matchStatus =
                    !contact.status ||
                    contact.status ===
                    "Chưa đọc";
            }


            return (
                matchSearch &&
                matchStatus
            );

        }
    );


displayContacts(
    filteredContacts
);


if (filteredContacts.length === 0) {

    show(
        "Không tìm thấy phản hồi phù hợp!"
    );

} else {

    show(
        `Tìm thấy ${filteredContacts.length} phản hồi phù hợp!`
    );
}


}

function createSearchFilter() {


const searchFilter =
    document.querySelector("#searchFilter");


if (!searchFilter) {
    return;
}


searchFilter.innerHTML = `

    <div class="search-filter">

        <div class="search-filter-input">

            <i class="fa-solid fa-magnifying-glass"></i>

            <input
                type="text"
                id="searchInput"
                placeholder="Tìm kiếm phản hồi..."
            >

        </div>


        <div class="search-filter-select">

            <select id="filterSelect">

                <option value="all">
                    Tất cả
                </option>

                <option value="read">
                    Đã đọc
                </option>

                <option value="unread">
                    Chưa đọc
                </option>

            </select>

        </div>


        <button
            type="button"
            id="searchFilterBtn"
            class="search-filter-btn"
        >

            <i class="fa-solid fa-magnifying-glass"></i>

            Tìm kiếm

        </button>


        <button
            type="button"
            id="searchFilterReset"
            class="search-filter-reset"
        >

            <i class="fa-solid fa-rotate-left"></i>

            Đặt lại

        </button>

    </div>

`;


const searchInput =
    document.querySelector("#searchInput");

const filterSelect =
    document.querySelector("#filterSelect");

const searchFilterBtn =
    document.querySelector("#searchFilterBtn");

const searchFilterReset =
    document.querySelector("#searchFilterReset");


searchFilterBtn.addEventListener(
    "click",
    function () {

        filterContacts();

    }
);


searchInput.addEventListener(
    "keydown",
    function (e) {

        if (e.key === "Enter") {

            filterContacts();

        }

    }
);


filterSelect.addEventListener(
    "change",
    function () {

    }
);


searchFilterReset.addEventListener(
    "click",
    function () {

        searchInput.value =
            "";

        filterSelect.value =
            "all";


        displayContacts(
            allContacts
        );


        show(
            "Đã đặt lại tìm kiếm và bộ lọc!"
        );

    }
);


}

function getContacts() {

fetch("/getContact")
    .then(
        function (response) {

            if (!response.ok) {

                show(
                    "Không thể lấy danh sách phản hồi!"
                );

                return null;
            }

            return response.json();

        },
        function () {

            show(
                "Không thể kết nối đến máy chủ!"
            );

            return null;

        }
    )
    .then(
        function (data) {

            if (!data) {
                return;
            }


            allContacts =
                data;


            displayContacts(
                allContacts
            );

        }
    );


}

document.addEventListener(
"DOMContentLoaded",
function () {


    createSearchFilter();

    getContacts();

}


);
