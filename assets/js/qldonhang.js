
let allOrders = [];


// ===============================
// HIỂN THỊ THÔNG BÁO
// ===============================

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


// ===============================
// HÀM ĐỔI MÀU TRẠNG THÁI
// ===============================

function setStatusColor(select, status) {

    select.classList.remove(
        'status-cho',
        'status-dang',
        'status-giao',
        'status-xong',
        'status-huy'
    );


    if (status === 'Chờ xử lý') {

        select.classList.add(
            'status-cho'
        );

    } else if (status === 'Đang xử lý') {

        select.classList.add(
            'status-dang'
        );

    } else if (status === 'Đang giao') {

        select.classList.add(
            'status-giao'
        );

    } else if (status === 'Hoàn thành') {

        select.classList.add(
            'status-xong'
        );

    } else if (status === 'Đã hủy') {

        select.classList.add(
            'status-huy'
        );

    }

}


// ===============================
// HIỂN THỊ DANH SÁCH ĐƠN HÀNG
// ===============================

function displayOrders(orders) {

    const orderlist =
        document.querySelector(
            ".order-list"
        );


    if (!orderlist) {
        return;
    }


    orderlist.innerHTML = "";


    // ===============================
    // KHÔNG CÓ KẾT QUẢ
    // ===============================

    if (orders.length === 0) {

        orderlist.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align: center;"
                >

                    Không tìm thấy đơn hàng nào

                </td>

            </tr>

        `;

        return;
    }


    // ===============================
    // HIỂN THỊ ĐƠN HÀNG
    // ===============================

    orders.forEach(
        function (order) {

            orderlist.innerHTML += `

                <tr>

                    <td>
                        ${order.order_id}
                    </td>

                    <td>
                        ${order.ho || ""} ${order.ten || ""}
                    </td>

                    <td>
                        ${order.product_name || ""}
                    </td>

                    <td>
                        ${
                            Number(
                                order.total || 0
                            ).toLocaleString(
                                "vi-VN"
                            )
                        }đ
                    </td>

                    <td>

                        ${
                            order.order_date
                                ? String(
                                    order.order_date
                                )
                                    .replace(
                                        "T",
                                        " "
                                    )
                                    .slice(
                                        0,
                                        16
                                    )
                                : ""
                        }

                    </td>

                    <td>

                        <select
                            class="form-select"
                            data-id="${order.order_id}"
                            data-status="${order.status}"
                        >

                            <option
                                value="Chờ xử lý"
                                ${
                                    order.status ===
                                    "Chờ xử lý"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Chờ xử lý
                            </option>

                            <option
                                value="Đang xử lý"
                                ${
                                    order.status ===
                                    "Đang xử lý"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Đang xử lý
                            </option>

                            <option
                                value="Đang giao"
                                ${
                                    order.status ===
                                    "Đang giao"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Đang giao
                            </option>

                            <option
                                value="Hoàn thành"
                                ${
                                    order.status ===
                                    "Hoàn thành"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Hoàn thành
                            </option>

                            <option
                                value="Đã hủy"
                                ${
                                    order.status ===
                                    "Đã hủy"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Đã hủy
                            </option>

                        </select>

                    </td>

                    <td>

                        <button
                            type="button"
                            class="see-btn"
                        >

                            <i class="fa-solid fa-eye"></i>

                            Xem chi tiết

                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            data-id="${order.order_id}"
                        >

                            <i class="fa-solid fa-trash"></i>

                            Xóa

                        </button>

                    </td>

                </tr>

            `;

        }
    );


    // ===============================
    // ĐỔI MÀU TRẠNG THÁI
    // ===============================

    document
        .querySelectorAll(
            ".order-table .form-select"
        )
        .forEach(
            function (select) {

                setStatusColor(
                    select,
                    select.dataset.status
                );

            }
        );

}


// ===============================
// LẤY DANH SÁCH ĐƠN HÀNG
// ===============================

fetch(
    '/getallorders'
)

    .then(
        function (res) {

            if (
                res.status === 401 ||
                res.status === 403
            ) {

                window.location.href =
                    "../index.html";

                return null;
            }


            return res.json();

        }
    )

    .then(
        function (data) {

            if (!data) {
                return;
            }


            allOrders = data;


            displayOrders(
                allOrders
            );

        }
    )

    .catch(
        function () {

            show(
                `Không thể tải danh sách đơn hàng!`
            );

        }
    );


// ===============================
// XỬ LÝ THAY ĐỔI TRẠNG THÁI
// ===============================

document.addEventListener(
    "change",
    function (e) {

        if (
            !e.target.matches(
                ".order-table .form-select"
            )
        ) {

            return;
        }


        const select =
            e.target;


        const order_id =
            select.dataset.id;


        const statusMoi =
            select.value;


        const statusCu =
            select.dataset.status;


        // ===============================
        // QUY TẮC CHUYỂN TRẠNG THÁI
        // ===============================

        let hopLe = false;


        // Chờ xử lý
        if (
            statusCu === "Chờ xử lý"
        ) {

            if (
                statusMoi === "Đang xử lý" ||
                statusMoi === "Đã hủy"
            ) {

                hopLe = true;

            }

        }


        // Đang xử lý
        else if (
            statusCu === "Đang xử lý"
        ) {

            if (
                statusMoi === "Đang giao" ||
                statusMoi === "Đã hủy"
            ) {

                hopLe = true;

            }

        }


        // Đang giao
        else if (
            statusCu === "Đang giao"
        ) {

            if (
                statusMoi === "Hoàn thành"
            ) {

                hopLe = true;

            }

        }


        // Hoàn thành
        else if (
            statusCu === "Hoàn thành"
        ) {

            hopLe = false;

        }


        // Đã hủy
        else if (
            statusCu === "Đã hủy"
        ) {

            hopLe = false;

        }


        // ===============================
        // KHÔNG HỢP LỆ
        // ===============================

        if (!hopLe) {

            show(
                `Không thể cập nhật đơn hàng ${order_id} từ "${statusCu}" sang "${statusMoi}"!`
            );


            select.value =
                statusCu;


            setStatusColor(
                select,
                statusCu
            );


            return;
        }


        // ===============================
        // ĐỔI MÀU
        // ===============================

        setStatusColor(
            select,
            statusMoi
        );


        // ===============================
        // CẬP NHẬT DATABASE
        // ===============================

        fetch(
            `/orders/${order_id}/status`,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    status:
                        statusMoi

                })

            }
        )

            .then(
                function (res) {

                    if (
                        res.status === 401 ||
                        res.status === 403
                    ) {

                        window.location.href =
                            "../index.html";

                        return null;
                    }

                    return res.text();

                }
            )

            .then(
                function (data) {

                    if (!data) {
                        return;
                    }


                    // ========================================
                    // DATABASE ĐÃ CẬP NHẬT
                    // ========================================

                    if (
                        data === "ok" ||
                        data === "Đã cập nhật"
                    ) {

                        select.dataset.status =
                            statusMoi;


                        allOrders.forEach(
                            function (order) {

                                if (
                                    String(
                                        order.order_id
                                    ) ===
                                    String(
                                        order_id
                                    )
                                ) {

                                    order.status =
                                        statusMoi;

                                }

                            }
                        );


                        setStatusColor(
                            select,
                            statusMoi
                        );


                        show(
                            `Đã cập nhật đơn hàng ${order_id} sang trạng thái: ${statusMoi}`
                        );


                        return;
                    }


                    // ========================================
                    // THẤT BẠI
                    // ========================================

                    show(
                        `Cập nhật đơn hàng ${order_id} thất bại!`
                    );


                    select.value =
                        statusCu;


                    select.dataset.status =
                        statusCu;


                    setStatusColor(
                        select,
                        statusCu
                    );

                }
            )

            .catch(
                function () {

                    show(
                        `Không thể cập nhật trạng thái đơn hàng ${order_id}!`
                    );


                    select.value =
                        statusCu;


                    select.dataset.status =
                        statusCu;


                    setStatusColor(
                        select,
                        statusCu
                    );

                }
            );
    }
);

// ===============================
// XEM CHI TIẾT ĐƠN HÀNG
// ===============================

document.addEventListener(
    "click",
    function (e) {

        if (
            !e.target.closest(
                ".see-btn"
            )
        ) {

            return;
        }


        const button =
            e.target.closest(
                ".see-btn"
            );


        const row =
            button.closest(
                "tr"
            );


        if (!row) {

            show(
                `Không tìm thấy thông tin đơn hàng!`
            );

            return;
        }


        const deleteButton =
            row.querySelector(
                ".delete-btn"
            );


        if (!deleteButton) {

            show(
                `Không tìm thấy ID đơn hàng!`
            );

            return;
        }


        const order_id =
            deleteButton.dataset.id;


        // ===============================
        // LẤY THÔNG TIN ĐƠN HÀNG
        // ===============================

        fetch(
            `/orders/${order_id}`
        )

            .then(
                function (res) {

                    if (
                        res.status === 401 ||
                        res.status === 403
                    ) {

                        window.location.href =
                            "../index.html";

                        return null;
                    }


                    return res.json();

                }
            )

            .then(
                function (orderData) {

                    if (!orderData) {
                        return;
                    }


                    const order =
                        orderData[0];


                    if (!order) {

                        show(
                            `Không tìm thấy thông tin đơn hàng ${order_id}!`
                        );

                        return;
                    }


                    const discount =
                        Number(
                            order.discount
                        ) || 0;


                    // ===============================
                    // HIỂN THỊ THÔNG TIN
                    // ===============================

                    document.querySelector(
                        "#detailOrderId"
                    ).textContent =
                        order.order_id;


                    document.querySelector(
                        "#detailName"
                    ).textContent =
                        (order.ho || "") +
                        " " +
                        (order.ten || "");


                    document.querySelector(
                        "#detailEmail"
                    ).textContent =
                        order.email || "";


                    document.querySelector(
                        "#detailPhone"
                    ).textContent =
                        order.phone || "";


                    document.querySelector(
                        "#detailAddress"
                    ).textContent =
                        (order.address || "") +
                        ", " +
                        (order.district || "") +
                        ", " +
                        (order.city || "");


                    document.querySelector(
                        "#detailPayment"
                    ).textContent =
                        order.payment_method || "";


                    document.querySelector(
                        "#detailShippingMethod"
                    ).textContent =
                        order.shipping_method || "";


                    document.querySelector(
                        "#detailNote"
                    ).textContent =
                        order.note ||
                        "Không có";


                    document.querySelector(
                        "#detailDiscount"
                    ).textContent =
                        discount > 0
                            ? discount.toLocaleString(
                                "vi-VN"
                            ) + "đ"
                            : "Không có";


                    document.querySelector(
                        "#detailDate"
                    ).textContent =
                        order.created_at
                            ? String(
                                order.created_at
                            )
                                .replace(
                                    "T",
                                    " "
                                )
                                .slice(
                                    0,
                                    16
                                )
                            : "";


                    document.querySelector(
                        "#detailStatus"
                    ).textContent =
                        order.status || "";


                    document.querySelector(
                        "#detailTotal"
                    ).textContent =
                        Number(
                            order.total || 0
                        ).toLocaleString(
                            "vi-VN"
                        ) + "đ";


                    // ===============================
                    // LẤY SẢN PHẨM
                    // ===============================

                    return fetch(
                        `/order-products/${order_id}`
                    );

                }
            )

            .then(
                function (res) {

                    if (!res) {
                        return null;
                    }


                    if (
                        res.status === 401 ||
                        res.status === 403
                    ) {

                        window.location.href =
                            "../index.html";

                        return null;
                    }


                    return res.json();

                }
            )

            .then(
                function (products) {

                    if (!products) {
                        return;
                    }


                    const productList =
                        document.querySelector(
                            "#detailProducts"
                        );


                    if (!productList) {

                        show(
                            `Không tìm thấy khu vực hiển thị sản phẩm!`
                        );

                        return;
                    }


                    productList.innerHTML =
                        "";


                    if (
                        products.length === 0
                    ) {

                        productList.innerHTML = `

                            <p>
                                Không có sản phẩm trong đơn hàng.
                            </p>

                        `;

                    }


                    products.forEach(
                        function (product) {

                            productList.innerHTML += `

                                <div class="detail-product">

                                    <img
                                        src="../${product.image}"
                                        alt="ảnh"
                                    >

                                    <div class="detail-product-info">

                                        <h4>
                                            ${product.product_name || ""}
                                        </h4>

                                        <p>
                                            Size: ${product.size || ""}
                                        </p>

                                        <p>
                                            Số lượng: ${product.quantity || 0}
                                        </p>

                                        ${
                                            product.price_old
                                                ? `

                                                    <p class="detail-product-old-price">

                                                        <span class="old-price-label">
                                                            Giá cũ:
                                                        </span>

                                                        <span class="old-price-value">

                                                            ${
                                                                Number(
                                                                    product.price_old
                                                                ).toLocaleString(
                                                                    "vi-VN"
                                                                )
                                                            }đ

                                                        </span>

                                                    </p>

                                                `
                                                : ""
                                        }

                                    </div>

                                    <div class="detail-product-price">

                                        ${
                                            Number(
                                                product.price || 0
                                            ).toLocaleString(
                                                "vi-VN"
                                            )
                                        }đ

                                    </div>

                                </div>

                            `;

                        }
                    );


                    // ===============================
                    // HIỆN MODAL
                    // ===============================

                    const modal =
                        document.querySelector(
                            "#orderDetailModal"
                        );


                    if (modal) {

                        modal.style.display =
                            "flex";

                    }

                }
            )

            .catch(
                function () {

                    show(
                        `Không thể tải chi tiết đơn hàng ${order_id}!`
                    );

                }
            );

    }
);


// ===============================
// ĐÓNG MODAL
// ===============================

const closeOrderDetail =
    document.querySelector(
        "#closeOrderDetail"
    );


if (closeOrderDetail) {

    closeOrderDetail.addEventListener(
        "click",
        function () {

            const modal =
                document.querySelector(
                    "#orderDetailModal"
                );


            if (modal) {

                modal.style.display =
                    "none";

            }

        }
    );

}


// ===============================
// BẤM RA NGOÀI MODAL THÌ ĐÓNG
// ===============================

const orderDetailModal =
    document.querySelector(
        "#orderDetailModal"
    );


if (orderDetailModal) {

    orderDetailModal.addEventListener(
        "click",
        function (e) {

            if (
                e.target === this
            ) {

                this.style.display =
                    "none";

            }

        }
    );

}


// ===============================
// NÚT XÓA
// ===============================

document.addEventListener(
    "click",
    function (e) {

        if (
            !e.target.closest(
                ".delete-btn"
            )
        ) {

            return;
        }


        const button =
            e.target.closest(
                ".delete-btn"
            );


        const id =
            button.dataset.id;


        if (!id) {

            show(
                `Không tìm thấy ID đơn hàng!`
            );

            return;
        }


        const xacNhan =
            confirm(
                `Bạn có chắc chắn muốn xóa đơn hàng ${id} không?`
            );


        if (!xacNhan) {
            return;
        }


        fetch(
            `/orders/${id}`,
            {

                method: "DELETE"

            }
        )

            .then(
                function (res) {

                    if (
                        res.status === 401 ||
                        res.status === 403
                    ) {

                        window.location.href =
                            "../index.html";

                        return null;
                    }


                    return res.text();

                }
            )

            .then(
                function (data) {

                    if (!data) {
                        return;
                    }


                    if (
                        data === "ok"
                    ) {

                        // ===============================
                        // XÓA DÒNG TRÊN GIAO DIỆN
                        // ===============================

                        const row =
                            button.closest(
                                "tr"
                            );


                        if (row) {

                            row.remove();

                        }


                        // ===============================
                        // XÓA KHỎI MẢNG
                        // ===============================

                        allOrders =
                            allOrders.filter(
                                function (order) {

                                    return String(
                                        order.order_id
                                    ) !==
                                    String(id);

                                }
                            );


                        show(
                            `Đã xóa đơn hàng ${id} thành công!`
                        );


                        // ===============================
                        // KHÔNG CÒN ĐƠN HÀNG
                        // ===============================

                        if (
                            allOrders.length === 0
                        ) {

                            displayOrders(
                                []
                            );

                        }

                    } else {

                        show(
                            `Xóa đơn hàng ${id} thất bại!`
                        );

                    }

                }
            )

            .catch(
                function () {

                    show(
                        `Không thể xóa đơn hàng ${id}!`
                    );

                }
            );

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


        fetch(
            "timkiemvaloc.html"
        )

            .then(
                function (res) {

                    return res.text();

                }
            )

            .then(
                function (html) {

                    searchFilter.innerHTML =
                        html;


                    document.dispatchEvent(
                        new CustomEvent(
                            "searchFilterLoaded"
                        )
                    );

                }
            )

            .catch(
                function () {

                    show(
                        `Không thể tải form tìm kiếm và lọc!`
                    );

                }
            );

    }
);


// ========================================
// TÌM KIẾM + LỌC ĐƠN HÀNG
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
        // TẠO BỘ LỌC TRẠNG THÁI
        // ========================================

        filterSelect.innerHTML = `

            <option value="">
                -- Lọc trạng thái --
            </option>

            <option value="all">
                Tất cả
            </option>

            <option value="Chờ xử lý">
                Chờ xử lý
            </option>

            <option value="Đang xử lý">
                Đang xử lý
            </option>

            <option value="Đang giao">
                Đang giao
            </option>

            <option value="Hoàn thành">
                Hoàn thành
            </option>

            <option value="Đã hủy">
                Đã hủy
            </option>

        `;


        // ========================================
        // HÀM TÌM KIẾM + LỌC
        // ========================================

        function filterOrders() {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const selectedStatus =
                filterSelect.value;


            // ========================================
            // LỌC ĐƠN HÀNG
            // ========================================

            const result =
                allOrders.filter(
                    function (order) {

                        const orderId =
                            String(
                                order.order_id ?? ""
                            ).toLowerCase();


                        const ho =
                            String(
                                order.ho ?? ""
                            ).toLowerCase();


                        const ten =
                            String(
                                order.ten ?? ""
                            ).toLowerCase();


                        const customerName =
                            `${ho} ${ten}`.toLowerCase();


                        const productName =
                            String(
                                order.product_name ?? ""
                            ).toLowerCase();


                        const total =
                            String(
                                order.total ?? ""
                            ).toLowerCase();


                        const orderDate =
                            String(
                                order.order_date ?? ""
                            ).toLowerCase();


                        const status =
                            String(
                                order.status ?? ""
                            ).toLowerCase();


                        // ========================================
                        // TÌM KIẾM
                        // ========================================

                        const matchSearch =

                            orderId.includes(
                                keyword
                            ) ||

                            customerName.includes(
                                keyword
                            ) ||

                            productName.includes(
                                keyword
                            ) ||

                            total.includes(
                                keyword
                            ) ||

                            orderDate.includes(
                                keyword
                            ) ||

                            status.includes(
                                keyword
                            );


                        // ========================================
                        // LỌC TRẠNG THÁI
                        // ========================================

                        let matchStatus =
                            true;


                        if (
                            selectedStatus !== "" &&
                            selectedStatus !== "all"
                        ) {

                            matchStatus =
                                status ===
                                selectedStatus.toLowerCase();

                        }


                        return (
                            matchSearch &&
                            matchStatus
                        );

                    }
                );


            // ========================================
            // HIỂN THỊ KẾT QUẢ
            // ========================================

            displayOrders(
                result
            );


            // ========================================
            // THÔNG BÁO KẾT QUẢ
            // ========================================

            if (
                result.length === 0
            ) {

                show(
                    `Không tìm thấy đơn hàng phù hợp!`
                );

            } else {

                show(
                    `Tìm thấy ${result.length} đơn hàng phù hợp!`
                );

            }

        }


        // ========================================
        // NÚT TÌM KIẾM
        // ========================================

        searchBtn.addEventListener(
            "click",
            function () {

                filterOrders();

            }
        );


        // ========================================
        // ENTER ĐỂ TÌM KIẾM
        // ========================================

        searchInput.addEventListener(
            "keydown",
            function (e) {

                if (
                    e.key === "Enter"
                ) {

                    filterOrders();

                }

            }
        );


        // ========================================
        // CHỌN TRẠNG THÁI
        // KHÔNG TỰ ĐỘNG LỌC
        // ========================================

        filterSelect.addEventListener(
            "change",
            function () {

                // Chỉ chọn bộ lọc.
                // Muốn lọc phải ấn Tìm kiếm.

            }
        );


        // ========================================
        // RESET
        // ========================================

        resetBtn.addEventListener(
            "click",
            function () {

                searchInput.value =
                    "";

                filterSelect.value =
                    "";


                displayOrders(
                    allOrders
                );


                show(
                    `Đã đặt lại tìm kiếm và bộ lọc!`
                );

            }
        );

    }
);

