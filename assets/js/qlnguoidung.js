
// LƯU TOÀN BỘ NGƯỜI DÙNG
let allUsers = [];


// ========================================
// HIỂN THỊ THÔNG BÁO
// ========================================

function show(message) {

    const notice =
        document.querySelector(".notice");

    if (!notice) {
        return;
    }

    notice.textContent = `${message}`;

    notice.style.display = "block";

    clearTimeout(window.noticeTimer);

    window.noticeTimer =
        setTimeout(function () {

            notice.style.display = "none";

        }, 3000);
}


// ========================================
// LẤY DANH SÁCH NGƯỜI DÙNG
// ========================================

fetch('/getalluser')
    .then(function (res) {

        if (
            res.status === 401 ||
            res.status === 403
        ) {

            window.location.href =
                "../index.html";

            return null;
        }

        if (!res.ok) {

            show(
                `Không thể lấy danh sách người dùng!`
            );

            return null;
        }

        return res.json();

    })

    .then(function (data) {

        if (!data) {
            return;
        }

        // Lưu toàn bộ dữ liệu
        allUsers = data;

        const userlist =
            document.querySelector(".user-list");

        if (!userlist) {
            return;
        }

        userlist.innerHTML = "";

        data.forEach(function (user) {

            userlist.innerHTML += `

                <tr>

                    <td>
                        ${user.id}
                    </td>

                    <td>
                        ${user.fullname || ""}
                    </td>

                    <td class="email-cell">
                        ${user.email || ""}
                    </td>

                    <td>
                        ${user.phone || ""}
                    </td>

                    <td> 
                        ${
                            user.role === 'admin'
                                ? `<span class="membership-rank chua-co">
                                        Không có
                                </span>`
                                : `<span class="membership-rank ${
                                    user.membership_rank === 'Hạng Đồng'
                                        ? 'rank-dong'
                                        : user.membership_rank === 'Hạng Bạc'
                                            ? 'rank-bac'
                                            : user.membership_rank === 'Hạng Vàng'
                                                ? 'rank-vang'
                                                : user.membership_rank === 'Hạng Kim Cương'
                                                    ? 'rank-kim-cuong'
                                                    : 'chua-co'
                                }">
                                    ${user.membership_rank || 'Chưa có'}
                                </span>`
                        }
                    </td>

                    <td>
                        ${user.role || ""}
                    </td>

                    <td>
                        ${
                            user.created_at
                                ? user.created_at
                                    .replace("T", " ")
                                    .slice(0, 16)
                                : ""
                        }
                    </td>

                    <td>

                        <button class="delete-btn">

                            <i class="fa-solid fa-trash"></i>

                            Xóa

                        </button>

                    </td>

                </tr>

            `;

        });
    })

    .catch(function () {

        show(
            `Không thể kết nối đến máy chủ!`
        );

    });


// ========================================
// XÓA NGƯỜI DÙNG
// ========================================

document.addEventListener(
    "click",
    function (e) {

        if (
            e.target.closest(".delete-btn")
        ) {

            const row =
                e.target.closest("tr");

            const id =
                row.children[0].innerText;

            const check =
                confirm(
                    `Bạn có chắc muốn xóa người dùng "${id}" này không?`
                );

            if (!check) {
                return;
            }


            fetch(
                "/deleteUser",
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

                .then(function (res) {

                    if (
                        res.status === 401 ||
                        res.status === 403
                    ) {

                        window.location.href =
                            "../index.html";

                        return null;
                    }

                    if (!res.ok) {

                        show(
                            `Xóa người dùng "${id}" thất bại!`
                        );

                        return null;
                    }

                    return res.text();

                })

                .then(function (data) {

                    if (!data) {
                        return;
                    }

                    if (data === "ok") {

                        show(
                            `Xóa người dùng "${id}" thành công!`
                        );


                        // Xóa dòng trên giao diện
                        row.remove();


                        // Xóa người dùng khỏi mảng
                        allUsers =
                            allUsers.filter(
                                function (user) {

                                    return String(
                                        user.id
                                    ) !== String(id);

                                }
                            );


                        // Nếu không còn người dùng
                        const userlist =
                            document.querySelector(
                                ".user-list"
                            );

                        if (
                            userlist &&
                            allUsers.length === 0
                        ) {

                            userlist.innerHTML = `

                                <tr>

                                    <td
                                        colspan="7"
                                        style="text-align: center;"
                                    >

                                        Không tìm thấy người dùng nào

                                    </td>

                                </tr>

                            `;

                        }

                    } else {

                        show(
                            `Xóa người dùng "${id}" thất bại!`
                        );

                    }

                })

                .catch(function () {

                    show(
                        `Không thể kết nối đến máy chủ!`
                    );

                });

        }

    }
);


// ========================================
// LOAD FORM TÌM KIẾM + LỌC
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchFilter =
            document.getElementById(
                "searchFilter"
            );

        if (!searchFilter) {
            return;
        }


        fetch("timkiemvaloc.html")

            .then(function (res) {

                if (!res.ok) {

                    show(
                        `Không thể tải bộ tìm kiếm và lọc!`
                    );

                    return null;
                }

                return res.text();

            })

            .then(function (html) {

                if (!html) {
                    return;
                }

                searchFilter.innerHTML = html;


                document.dispatchEvent(
                    new CustomEvent(
                        "searchFilterLoaded"
                    )
                );

            })

            .catch(function () {

                show(
                    `Không thể tải bộ tìm kiếm và lọc!`
                );

            });

    }
);


// ========================================
// TÌM KIẾM + LỌC
// ========================================

document.addEventListener(
    "searchFilterLoaded",
    function () {

        const searchInput =
            document.getElementById(
                "searchInput"
            );

        const filterSelect =
            document.getElementById(
                "filterSelect"
            );

        const searchBtn =
            document.getElementById(
                "searchFilterBtn"
            );

        const resetBtn =
            document.getElementById(
                "searchFilterReset"
            );


        if (
            !searchInput ||
            !filterSelect ||
            !searchBtn ||
            !resetBtn
        ) {

            return;
        }


        // ========================================
        // BỘ LỌC QUYỀN
        // ========================================

        filterSelect.innerHTML = `

            <option value="">
                -- Lọc theo quyền --
            </option>

            <option value="all">
                Tất cả
            </option>

            <option value="admin">
                Admin
            </option>

            <option value="user">
                User
            </option>

        `;


        // ========================================
        // HIỂN THỊ DANH SÁCH NGƯỜI DÙNG
        // ========================================

        function displayUsers(users) {

            const userlist =
                document.querySelector(
                    ".user-list"
                );


            if (!userlist) {
                return;
            }


            userlist.innerHTML = "";


            // ========================================
            // KHÔNG CÓ KẾT QUẢ
            // ========================================

            if (users.length === 0) {

                userlist.innerHTML = `

                    <tr>

                        <td
                            colspan="7"
                            style="text-align: center;"
                        >

                            Không tìm thấy người dùng nào

                        </td>

                    </tr>

                `;

                return;
            }


            // ========================================
            // HIỂN THỊ KẾT QUẢ
            // ========================================

            users.forEach(
                function (user) {

                    userlist.innerHTML += `

                        <tr>

                            <td>
                                ${user.id}
                            </td>

                            <td>
                                ${user.fullname || ""}
                            </td>

                            <td class="email-cell">
                                ${user.email || ""}
                            </td>

                            <td>
                                ${user.phone || ""}
                            </td>

                            <td> 
                                ${
                                    user.role === 'admin'
                                        ? `<span class="membership-rank chua-co">
                                                Không có
                                        </span>`
                                        : `<span class="membership-rank ${
                                            user.membership_rank === 'Hạng Đồng'
                                                ? 'rank-dong'
                                                : user.membership_rank === 'Hạng Bạc'
                                                    ? 'rank-bac'
                                                    : user.membership_rank === 'Hạng Vàng'
                                                        ? 'rank-vang'
                                                        : user.membership_rank === 'Hạng Kim Cương'
                                                            ? 'rank-kim-cuong'
                                                            : 'chua-co'
                                        }">
                                            ${user.membership_rank || 'Chưa có'}
                                        </span>`
                                }
                            </td>

                            <td>
                                ${user.role || ""}
                            </td>

                            <td>
                                ${
                                    user.created_at
                                        ? user.created_at
                                            .replace("T", " ")
                                            .slice(0, 16)
                                        : ""
                                }
                            </td>

                            <td>

                                <button class="delete-btn">

                                    <i class="fa-solid fa-trash"></i>

                                    Xóa

                                </button>

                            </td>

                        </tr>

                    `;

                }
            );

        }


        // ========================================
        // HÀM TÌM KIẾM + LỌC
        // ========================================

        function filterUsers() {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const roleFilter =
                filterSelect.value
                    .toLowerCase();


            const result =
                allUsers.filter(
                    function (user) {


                        // ========================================
                        // TẤT CẢ THÔNG TIN TRONG BẢNG
                        // ========================================

                        const id =
                            String(
                                user.id || ""
                            )
                            .toLowerCase();


                        const fullname =
                            String(
                                user.fullname || ""
                            )
                            .toLowerCase();


                        const email =
                            String(
                                user.email || ""
                            )
                            .toLowerCase();


                        const phone =
                            String(
                                user.phone || ""
                            )
                            .toLowerCase();


                        const role =
                            String(
                                user.role || ""
                            )
                            .toLowerCase();


                        const createdAt =
                            String(
                                user.created_at || ""
                            )
                            .replace("T", " ")
                            .toLowerCase();


                        // ========================================
                        // TÌM KIẾM TẤT CẢ CỘT
                        // ========================================

                        const matchSearch =

                            id.includes(keyword) ||

                            fullname.includes(keyword) ||

                            email.includes(keyword) ||

                            phone.includes(keyword) ||

                            role.includes(keyword) ||

                            createdAt.includes(keyword);


                        // ========================================
                        // LỌC ADMIN / USER / TẤT CẢ
                        // ========================================

                        let matchRole = true;


                        if (
                            roleFilter !== "" &&
                            roleFilter !== "all"
                        ) {

                            matchRole =
                                role === roleFilter;

                        }


                        // ========================================
                        // KẾT HỢP TÌM KIẾM + LỌC
                        // ========================================

                        return (
                            matchSearch &&
                            matchRole
                        );

                    }
                );


            // ========================================
            // HIỂN THỊ KẾT QUẢ
            // ========================================

            displayUsers(result);


            // ========================================
            // THÔNG BÁO KẾT QUẢ TÌM KIẾM
            // ========================================

            if (result.length === 0) {

                show(
                    `Không tìm thấy người dùng phù hợp!`
                );

            } else {

                show(
                    `Tìm thấy ${result.length} người dùng phù hợp!`
                );

            }

        }


        // ========================================
        // NÚT TÌM KIẾM
        // CHỈ KHI BẤM NÚT MỚI TÌM
        // ========================================

        searchBtn.addEventListener(
            "click",
            function () {

                filterUsers();

            }
        );


        // ========================================
        // ENTER ĐỂ TÌM KIẾM
        // ========================================

        searchInput.addEventListener(
            "keydown",
            function (e) {

                if (e.key === "Enter") {

                    filterUsers();

                }

            }
        );


        // ========================================
        // CHỌN ADMIN / USER / TẤT CẢ
        // KHÔNG TỰ ĐỘNG TÌM
        // ========================================

        filterSelect.addEventListener(
            "change",
            function () {

                // Không gọi filterUsers()
                // Chỉ chọn bộ lọc.
                // Muốn lọc phải ấn Tìm kiếm.

            }
        );


        // ========================================
        // ĐẶT LẠI
        // ========================================

        resetBtn.addEventListener(
            "click",
            function () {

                searchInput.value = "";

                filterSelect.value = "";


                // Hiển thị lại toàn bộ người dùng
                displayUsers(allUsers);


                show(
                    `Đã đặt lại tìm kiếm và bộ lọc!`
                );

            }
        );

    }
);


