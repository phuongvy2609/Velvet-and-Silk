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
// NÚT THÊM VOUCHER
// ========================================

const addVoucherBtn =
    document.getElementById("addVoucherBtn");

const addVoucherOverlay =
    document.getElementById("addVoucherOverlay");

const saveVoucherBtn =
    document.getElementById("saveVoucherBtn");

const cancelVoucherBtn =
    document.getElementById("cancelVoucherBtn");


// ========================================
// MỞ FORM THÊM VOUCHER
// ========================================

if (addVoucherBtn) {

    addVoucherBtn.addEventListener("click", function () {

        document.getElementById("formTitle").textContent =
            "THÊM VOUCHER";

        document.getElementById("editVoucherId").value =
            "";

        document.getElementById("voucherName").value =
            "";

        document.getElementById("voucherType").value =
            "";

        document.getElementById("voucherValue").value =
            "";

        document.getElementById("voucherMinOrder").value =
            "";

        document.getElementById("voucherStartDate").value =
            "";

        document.getElementById("voucherEndDate").value =
            "";

        document.getElementById("voucherQuantity").value =
            "";

        document.getElementById("voucherStatus").value =
            "";

        addVoucherOverlay.style.display =
            "flex";

    });

}


// ========================================
// ĐÓNG FORM
// ========================================

if (cancelVoucherBtn) {

    cancelVoucherBtn.addEventListener("click", function () {

        addVoucherOverlay.style.display =
            "none";

        show(
            `Đã hủy thao tác!`
        );

    });

}


// ========================================
// DANH SÁCH VOUCHER
// ========================================

let vouchers = [];


// ========================================
// XÁC ĐỊNH TRẠNG THÁI VOUCHER
// ========================================

function getVoucherStatus(voucher) {

    // ========================================
    // ADMIN ĐÃ TẮT VOUCHER
    // ========================================

    if (
        String(voucher.status).toLowerCase() ===
        "inactive"
    ) {

        return "Đã tắt";

    }


    // ========================================
    // LẤY THỜI GIAN HIỆN TẠI
    // ========================================

    const now =
        new Date();


    // ========================================
    // NGÀY BẮT ĐẦU
    // ========================================

    const startDate =
        new Date(voucher.start_date);


    // ========================================
    // NGÀY KẾT THÚC
    // ========================================

    const endDate =
        new Date(voucher.end_date);


    // ========================================
    // CHƯA BẮT ĐẦU
    // ========================================

    if (now < startDate) {

        return "Chưa bắt đầu";

    }


    // ========================================
    // ĐÃ HẾT HẠN
    // ========================================

    if (now > endDate) {

        return "Đã hết hạn";

    }


    // ========================================
    // HẾT LƯỢT SỬ DỤNG
    // ========================================

    if (Number(voucher.quantity) <= 0) {

        return "Hết lượt sử dụng";

    }


    // ========================================
    // ĐANG HOẠT ĐỘNG
    // ========================================

    return "Đang hoạt động";

}


// ========================================
// LƯU VOUCHER
// ========================================

if (saveVoucherBtn) {

    saveVoucherBtn.addEventListener("click", function () {

        const id =
            document.getElementById(
                "editVoucherId"
            ).value;


        const data = {

            voucher_type:
                document.getElementById(
                    "voucherType"
                ).value,

            voucher_value:
                document.getElementById(
                    "voucherValue"
                ).value,

            min_order:
                document.getElementById(
                    "voucherMinOrder"
                ).value,

            start_date:
                document.getElementById(
                    "voucherStartDate"
                ).value,

            end_date:
                document.getElementById(
                    "voucherEndDate"
                ).value,

            quantity:
                document.getElementById(
                    "voucherQuantity"
                ).value,

            status:
                document.getElementById(
                    "voucherStatus"
                ).value,

            voucher_code:
                document.getElementById(
                    "voucherName"
                ).value

        };


        // ========================================
        // SỬA VOUCHER
        // ========================================

        if (id) {

            fetch(
                "/updatevoucher/" + id,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            )

            .then(function (res) {

                return res.text();

            })

            .then(function (data) {

                if (data === "ok") {

                    show(
                        `Sửa voucher "${id}" thành công!`
                    );

                    addVoucherOverlay.style.display =
                        "none";

                    document.getElementById(
                        "editVoucherId"
                    ).value = "";

                    loadVouchers();

                } else {

                    show(
                        `Sửa voucher "${id}" thất bại!`
                    );

                }

            })

            .catch(function () {

                show(
                    `Không thể kết nối đến máy chủ khi sửa voucher!`
                );

            });

        }


        // ========================================
        // THÊM VOUCHER
        // ========================================

        else {

            fetch(
                "/addvoucher",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            )

            .then(function (res) {

                return res.text()
                    .then(function (text) {

                        return {

                            status:
                                res.status,

                            text:
                                text

                        };

                    });

            })

            .then(function (result) {

                if (
                    result.status >= 200 &&
                    result.status < 300 &&
                    result.text === "ok"
                ) {

                    show(
                        `Thêm voucher "${data.voucher_code}" thành công!`
                    );

                    addVoucherOverlay.style.display =
                        "none";

                    loadVouchers();

                } else {

                    show(
                        `Thêm voucher "${data.voucher_code}" thất bại! ${result.text}`
                    );

                }

            })

            .catch(function () {

                show(
                    `Không thể kết nối đến máy chủ khi thêm voucher!`
                );

            });

        }

    });

}


// ========================================
// HIỂN THỊ VOUCHER
// ========================================

function renderVouchers(data) {

    const list =
        document.querySelector(
            ".voucher-list"
        );


    if (!list) {

        return;

    }


    list.innerHTML = "";


    // ========================================
    // KHÔNG CÓ KẾT QUẢ
    // ========================================

    if (data.length === 0) {

        list.innerHTML = `

            <tr>

                <td
                    colspan="11"
                    style="text-align: center;"
                >

                    Không tìm thấy voucher nào

                </td>

            </tr>

        `;

        return;

    }


    // ========================================
    // HIỂN THỊ DANH SÁCH
    // ========================================

    data.forEach(function (voucher) {

        const voucherStatus =
            getVoucherStatus(voucher);


        list.innerHTML += `

            <tr>

                <td>
                    ${voucher.voucher_id}
                </td>

                <td>
                    ${voucher.voucher_code}
                </td>

                <td>
                    ${voucher.voucher_type}
                </td>

                <td>
                    ${voucher.voucher_value}
                </td>

                <td>
                    ${voucher.min_order}
                </td>

                <td>
                    ${formatDate(
                        voucher.start_date
                    )}
                </td>

                <td>
                    ${formatDate(
                        voucher.end_date
                    )}
                </td>

                <td>
                    ${voucher.quantity}
                </td>

                <td>
                    ${voucherStatus}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        data-id="${voucher.voucher_id}"
                    >

                        <i
                            class="fa-solid fa-wrench"
                        ></i>

                        Sửa

                    </button>

                </td>

                <td>

                    <button
                        class="delete-btn"
                        data-id="${voucher.voucher_id}"
                    >

                        <i
                            class="fa-solid fa-trash"
                        ></i>

                        Xóa

                    </button>

                </td>

            </tr>

        `;

    });

}


// ========================================
// XÓA VOUCHER
// ========================================

function deleteVoucher(id) {

    const confirmDelete =
        confirm(
            "Bạn có chắc muốn xóa voucher này không?"
        );


    if (!confirmDelete) {

        return;

    }


    fetch(
        "/deletevoucher/" + id,
        {

            method: "DELETE"

        }
    )

    .then(function (res) {

        return res.text();

    })

    .then(function (data) {

        if (data === "ok") {

            show(
                `Xóa voucher "${id}" thành công!`
            );

            loadVouchers();

        } else {

            show(
                `Xóa voucher "${id}" thất bại!`
            );

        }

    })

    .catch(function () {

        show(
            `Không thể kết nối đến máy chủ khi xóa voucher "${id}"!`
        );

    });

}


// ========================================
// GẮN SỰ KIỆN NÚT XÓA
// ========================================

document.addEventListener(
    "click",
    function (e) {

        if (
            e.target.closest(".delete-btn")
        ) {

            const button =
                e.target.closest(
                    ".delete-btn"
                );


            const id =
                button.getAttribute(
                    "data-id"
                );


            deleteVoucher(id);

        }

    }
);


// ========================================
// SỬA VOUCHER
// ========================================

function editVoucher(id) {

    const voucher =
        vouchers.find(
            function (item) {

                return String(
                    item.voucher_id
                ) === String(id);

            }
        );


    if (!voucher) {

        show(
            `Không tìm thấy voucher "${id}"!`
        );

        return;

    }


    // ========================================
    // ĐỔI TIÊU ĐỀ FORM
    // ========================================

    document.getElementById(
        "formTitle"
    ).textContent =
        "SỬA VOUCHER";


    // ========================================
    // LƯU ID VOUCHER
    // ========================================

    document.getElementById(
        "editVoucherId"
    ).value =
        voucher.voucher_id;


    // ========================================
    // ĐIỀN MÃ VOUCHER
    // ========================================

    document.getElementById(
        "voucherName"
    ).value =
        voucher.voucher_code || "";


    // ========================================
    // ĐIỀN LOẠI VOUCHER
    // ========================================

    document.getElementById(
        "voucherType"
    ).value =
        voucher.voucher_type || "";


    // ========================================
    // ĐIỀN GIÁ TRỊ VOUCHER
    // ========================================

    document.getElementById(
        "voucherValue"
    ).value =
        voucher.voucher_value || "";


    // ========================================
    // ĐIỀN ĐƠN TỐI THIỂU
    // ========================================

    document.getElementById(
        "voucherMinOrder"
    ).value =
        voucher.min_order || "";


    // ========================================
    // ĐIỀN NGÀY BẮT ĐẦU
    // ========================================

    if (voucher.start_date) {

        document.getElementById(
            "voucherStartDate"
        ).value =
            formatInputDateTime(
                voucher.start_date
            );

    }
    else {

        document.getElementById(
            "voucherStartDate"
        ).value = "";

    }


    // ========================================
    // ĐIỀN NGÀY KẾT THÚC
    // ========================================

    if (voucher.end_date) {

        document.getElementById(
            "voucherEndDate"
        ).value =
            formatInputDateTime(
                voucher.end_date
            );

    }
    else {

        document.getElementById(
            "voucherEndDate"
        ).value = "";

    }


    // ========================================
    // ĐIỀN SỐ LƯỢNG
    // ========================================

    document.getElementById(
        "voucherQuantity"
    ).value =
        voucher.quantity || "";


    // ========================================
    // ĐIỀN TRẠNG THÁI
    // ========================================

    document.getElementById(
        "voucherStatus"
    ).value =
        voucher.status || "";


    // ========================================
    // MỞ FORM
    // ========================================

    addVoucherOverlay.style.display =
        "flex";

}


// ========================================
// GẮN SỰ KIỆN NÚT SỬA
// ========================================

document.addEventListener(
    "click",
    function (e) {

        if (
            e.target.closest(".edit-btn")
        ) {

            const button =
                e.target.closest(
                    ".edit-btn"
                );


            const id =
                button.getAttribute(
                    "data-id"
                );


            editVoucher(id);

        }

    }
);


// ========================================
// LOAD VOUCHER
// ========================================

function loadVouchers() {

    fetch("/getvouchers")

        .then(function (res) {

            return res.json();

        })

        .then(function (data) {

            vouchers =
                data;

            renderVouchers(
                vouchers
            );

        })

        .catch(function () {

            show(
                `Không thể tải danh sách voucher!`
            );

        });

}


// ========================================
// FORMAT NGÀY CHO INPUT DATETIME-LOCAL
// KHÔNG BỊ NHẢY GIỜ
// ========================================

function formatInputDateTime(date) {

    if (!date) {

        return "";

    }

    const value =
        String(date);

    return value
        .replace("T", " ")
        .slice(0, 16);

}


// ========================================
// FORMAT NGÀY
// ========================================

function formatDate(date) {

    if (!date) {

        return "";

    }


    return String(date)
        .replace("T", " ")
        .slice(0, 16);

}


// ========================================
// TẠO BỘ LỌC TRẠNG THÁI
// ========================================

function loadVoucherFilter() {

    const filterSelect =
        document.getElementById(
            "filterSelect"
        );


    if (!filterSelect) {

        return;

    }


    filterSelect.innerHTML = `

        <option value="">
            -- Lọc trạng thái --
        </option>

        <option value="Đang hoạt động">
            Đang hoạt động
        </option>

        <option value="Chưa bắt đầu">
            Chưa bắt đầu
        </option>

        <option value="Đã hết hạn">
            Đã hết hạn
        </option>

        <option value="Hết lượt sử dụng">
            Hết lượt sử dụng
        </option>

        <option value="Đã tắt">
            Đã tắt
        </option>

    `;

}


// ========================================
// TÌM KIẾM + LỌC VOUCHER
// ========================================

function searchAndFilterVouchers() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const filterSelect =
        document.getElementById(
            "filterSelect"
        );


    if (
        !searchInput ||
        !filterSelect
    ) {

        return;

    }


    // ========================================
    // LẤY TỪ KHÓA
    // ========================================

    const keyword =
        searchInput.value
            .trim()
            .toLowerCase();


    // ========================================
    // LẤY TRẠNG THÁI
    // ========================================

    const filterValue =
        filterSelect.value;


    // ========================================
    // LỌC DANH SÁCH
    // ========================================

    const result =
        vouchers.filter(
            function (voucher) {

                // ========================================
                // XÁC ĐỊNH TRẠNG THÁI
                // ========================================

                const voucherStatus =
                    getVoucherStatus(
                        voucher
                    );


                // ========================================
                // GỘP TOÀN BỘ DỮ LIỆU VOUCHER
                // ========================================

                const allData = [

                    voucher.voucher_id,

                    voucher.voucher_code,

                    voucher.voucher_type,

                    voucher.voucher_value,

                    voucher.min_order,

                    formatDate(
                        voucher.start_date
                    ),

                    formatDate(
                        voucher.end_date
                    ),

                    voucher.quantity,

                    voucherStatus

                ]
                .map(
                    function (value) {

                        return String(
                            value ?? ""
                        );

                    }
                )
                .join(" ")
                .toLowerCase();


                // ========================================
                // KIỂM TRA TÌM KIẾM
                // ========================================

                const matchSearch =

                    keyword === "" ||

                    allData.includes(
                        keyword
                    );


                // ========================================
                // KIỂM TRA TRẠNG THÁI
                // ========================================

                const matchFilter =

                    filterValue === "" ||

                    voucherStatus ===
                        filterValue;


                // ========================================
                // PHẢI ĐÚNG CẢ 2
                // ========================================

                return (
                    matchSearch &&
                    matchFilter
                );

            }
        );


    // ========================================
    // HIỂN THỊ KẾT QUẢ
    // ========================================

    renderVouchers(
        result
    );


    // ========================================
    // THÔNG BÁO KẾT QUẢ
    // ========================================

    if (result.length === 0) {

        show(
            `Không tìm thấy voucher phù hợp!`
        );

    }
    else {

        show(
            `Tìm thấy ${result.length} voucher phù hợp!`
        );

    }

}


// ========================================
// GẮN CHỨC NĂNG TÌM KIẾM
// ========================================

function setupVoucherSearch() {

    const searchFilterBtn =
        document.getElementById(
            "searchFilterBtn"
        );

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const searchFilterReset =
        document.getElementById(
            "searchFilterReset"
        );


    // ========================================
    // NÚT TÌM KIẾM
    // ========================================

    if (searchFilterBtn) {

        searchFilterBtn.onclick =
            function () {

                searchAndFilterVouchers();

            };

    }


    // ========================================
    // NHẤN ENTER
    // ========================================

    if (searchInput) {

        searchInput.onkeydown =
            function (e) {

                if (e.key === "Enter") {

                    searchAndFilterVouchers();

                }

            };

    }


    // ========================================
    // NÚT ĐẶT LẠI
    // ========================================

    if (searchFilterReset) {

        searchFilterReset.onclick =
            function () {

                // ========================================
                // XÓA TỪ KHÓA
                // ========================================

                if (searchInput) {

                    searchInput.value =
                        "";

                }


                // ========================================
                // BỎ LỌC
                // ========================================

                const filterSelect =
                    document.getElementById(
                        "filterSelect"
                    );


                if (filterSelect) {

                    filterSelect.value =
                        "";

                }


                // ========================================
                // HIỆN LẠI TẤT CẢ VOUCHER
                // ========================================

                renderVouchers(
                    vouchers
                );


                show(
                    `Đã đặt lại tìm kiếm và bộ lọc!`
                );

            };

    }

}


// ========================================
// LOAD BAN ĐẦU
// ========================================

setTimeout(
    function () {

        // ========================================
        // TẠO DANH SÁCH TRẠNG THÁI
        // ========================================

        loadVoucherFilter();


        // ========================================
        // LOAD DANH SÁCH VOUCHER
        // ========================================

        loadVouchers();


        // ========================================
        // GẮN NÚT TÌM KIẾM
        // ========================================

        setupVoucherSearch();

    },
    100
);