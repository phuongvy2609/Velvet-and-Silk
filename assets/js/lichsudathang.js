
// ========================================
// LẤY CÁC NÚT
// ========================================

const btn1 = document.querySelector(".btn1");
const btn2 = document.querySelector(".btn2");
const btn3 = document.querySelector(".btn3");
const btn4 = document.querySelector(".btn4");
const btn5 = document.querySelector(".btn5");
const btn6 = document.querySelector(".btn6");

const orderList = document.querySelector("#orderList");

let orders = [];


// ========================================
// LẤY USER
// ========================================

fetch("/get-user")
    .then(res => res.json())
    .then(data => {

        const user = data.user;

        if (!user) {

            orderList.innerHTML = `
                <p class="no-order">
                    Bạn chưa đăng nhập. Vui lòng đăng nhập để xem lịch sử đơn hàng!
                </p>
            `;

            show(`Vui lòng đăng nhập để xem lịch sử đơn hàng!`);

            return;
        }


        // ========================================
        // LẤY LỊCH SỬ ĐƠN HÀNG
        // ========================================

        fetch(`/order-history/${user.id}`)
            .then(res => res.json())
            .then(data => {

                orders = data;

                hienThiDonHang(orders);

            })
            .catch(() => {

                show(`Không thể tải lịch sử đơn hàng!`);

            });

    })
    .catch(() => {

        show(`Không thể kiểm tra thông tin đăng nhập!`);

    });


// ========================================
// HIỂN THỊ ĐƠN HÀNG
// ========================================

function hienThiDonHang(data) {

    orderList.innerHTML = "";

    if (data.length === 0) {

        orderList.innerHTML = `
            <p class="no-order">
                Hiện tại bạn không có đơn hàng nào.
            </p>
        `;

        return;
    }


    data.forEach(order => {

        // ========================================
        // LẤY SẢN PHẨM TRONG ĐƠN
        // ========================================

        fetch(`/order-products/${order.order_id}`)
            .then(res => res.json())
            .then(products => {

                let sanPham = "";


                // ========================================
                // HIỂN THỊ SẢN PHẨM
                // ========================================

                products.forEach(product => {

                    sanPham += `
                        <div class="sp">

                            <div class="products">

                                <img
                                    src="${product.image}"
                                    alt="${product.product_name}">

                            </div>


                            <div class="order-info">

                                <span class="order-name">
                                    ${product.product_name}
                                </span>

                                <div>
                                    Size: ${product.size || ""}
                                </div>

                                <div class="quantity">
                                    Số lượng: ${product.quantity}
                                </div>

                            </div>

                        </div>
                    `;

                });


                // ========================================
                // CLASS CARD + STATUS
                // ========================================

                let cardClass = "order-card";
                let statusClass = "status";

                if (order.status === "Chờ xử lý") {

                    cardClass = "order-card1";
                    statusClass = "status1";

                }

                else if (order.status === "Đang xử lý") {

                    cardClass = "order-card2";
                    statusClass = "status2";

                }

                else if (order.status === "Đang giao") {

                    cardClass = "order-card3";
                    statusClass = "status3";

                }

                else if (order.status === "Hoàn thành") {

                    cardClass = "order-card4";
                    statusClass = "status4";

                }

                else if (order.status === "Đã hủy") {

                    cardClass = "order-card5";
                    statusClass = "status5";

                }


                // ========================================
                // NÚT
                // ========================================

                let nut = "";


                // ========================================
                // CHỜ XỬ LÝ
                // ========================================

                if (order.status === "Chờ xử lý") {

                    nut = `
                        <button
                            class="btn btn-detail"
                            onclick="huyDon(${order.order_id})">
                            Hủy đơn hàng
                        </button>

                        <button
                            class="btn btn-reorder"
                            onclick="xemChiTiet(${order.order_id})">
                            Xem chi tiết
                        </button>
                    `;

                }


                // ========================================
                // ĐANG XỬ LÝ
                // ========================================

                else if (order.status === "Đang xử lý") {

                    nut = `
                        <button
                            class="btn btn-detail"
                            onclick="huyDon(${order.order_id})">
                            Hủy đơn hàng
                        </button>

                        <button
                            class="btn btn-reorder"
                            onclick="xemChiTiet(${order.order_id})">
                            Xem chi tiết
                        </button>
                    `;

                }


                // ========================================
                // ĐANG GIAO
                // ========================================

                else if (order.status === "Đang giao") {

                    nut = `
                        <button
                            class="btn btn-detail"
                            onclick="xemChiTiet(${order.order_id})">
                            Xem chi tiết
                        </button>
                    `;

                }


                // ========================================
                // HOÀN THÀNH / ĐÃ HỦY
                // ========================================

                else {

                    nut = `
                        <button
                            class="btn btn-detail"
                            onclick="xemChiTiet(${order.order_id})">
                            Xem chi tiết
                        </button>

                        <button
                            class="btn btn-reorder"
                            onclick="muaLai(${order.order_id})">
                            Mua lại
                        </button>
                    `;

                }


                // ========================================
                // HIỂN THỊ CARD
                // ========================================

                orderList.innerHTML += `

                    <div class="${cardClass}">

                        <div class="order-header">

                            <div class="order-id">
                                Mã đơn: ${order.order_id}
                            </div>

                            <div class="${statusClass}">
                                ${order.status}
                            </div>

                        </div>


                        <div class="order-content">

                            <div class="product-list">
                                ${sanPham}
                            </div>


                            <div class="order-total">

                                <span class="total-label">
                                    Tổng tiền
                                </span>

                                <span class="price">
                                    ${Number(order.total).toLocaleString("vi-VN")}đ
                                </span>

                            </div>

                        </div>


                        <div class="order-actions">

                            ${nut}

                        </div>

                    </div>

                `;

            })
            .catch(() => {

                show(
                    `Không thể tải sản phẩm của đơn hàng ${order.order_id}!`
                );

            });

    });

}


// ========================================
// LỌC ĐƠN HÀNG
// ========================================

btn1.addEventListener("click", function () {

    hienThiDonHang(orders);

    doiNut(btn1);

});


btn2.addEventListener("click", function () {

    hienThiDonHang(
        orders.filter(order =>
            order.status === "Chờ xử lý"
        )
    );

    doiNut(btn2);

});


btn3.addEventListener("click", function () {

    hienThiDonHang(
        orders.filter(order =>
            order.status === "Đang xử lý"
        )
    );

    doiNut(btn3);

});


btn4.addEventListener("click", function () {

    hienThiDonHang(
        orders.filter(order =>
            order.status === "Đang giao"
        )
    );

    doiNut(btn4);

});


btn5.addEventListener("click", function () {

    hienThiDonHang(
        orders.filter(order =>
            order.status === "Hoàn thành"
        )
    );

    doiNut(btn5);

});


btn6.addEventListener("click", function () {

    hienThiDonHang(
        orders.filter(order =>
            order.status === "Đã hủy"
        )
    );

    doiNut(btn6);

});


// ========================================
// ĐỔI ACTIVE
// ========================================

function doiNut(button) {

    btn1.classList.remove("active");
    btn2.classList.remove("active");
    btn3.classList.remove("active");
    btn4.classList.remove("active");
    btn5.classList.remove("active");
    btn6.classList.remove("active");

    button.classList.add("active");

}


// ========================================
// XEM CHI TIẾT ĐƠN HÀNG
// ========================================

function xemChiTiet(order_id) {

    const order = orders.find(
        item => item.order_id == order_id
    );

    if (!order) {

        show(`Không tìm thấy đơn hàng nào!`);

        return;
    }


    // ========================================
    // HIỂN THỊ THÔNG TIN
    // ========================================

    document.getElementById("detailOrderId").textContent =
        order.order_id;

    document.getElementById("detailStatus").textContent =
        order.status;

    document.getElementById("detailReceiver").textContent =
        order.ho + " " + order.ten;

    document.getElementById("detailEmail").textContent =
        order.email;

    document.getElementById("detailPhone").textContent =
        order.phone;

    document.getElementById("detailAddress").textContent =
        order.address;

    document.getElementById("detailPayment").textContent =
        order.payment_method;

    document.getElementById("detailShipping").textContent =
        order.shipping_method || "Không có";

    document.getElementById("detailTime").textContent =
        order.created_at.replace("T", " ").slice(0, 16);

    document.getElementById("detailDiscountCode").textContent =
        order.discount && Number(order.discount) > 0
            ? Number(order.discount).toLocaleString("vi-VN") + "đ"
            : "Không có";

    document.getElementById("detailNote").textContent =
        order.note || "Không có";


    // ========================================
    // LẤY SẢN PHẨM
    // ========================================

    fetch(`/order-products/${order_id}`)
        .then(res => res.json())
        .then(products => {

            const productList =
                document.getElementById("detailProductList");

            productList.innerHTML = "";


            // ========================================
            // KIỂM TRA SẢN PHẨM
            // ========================================

            if (!products || products.length === 0) {

                productList.innerHTML = `
                    <p>
                        Không có sản phẩm trong đơn hàng.
                    </p>
                `;

                show(
                    `Đơn hàng ${order_id} không có sản phẩm!`
                );

                return;
            }


            // ========================================
            // HIỂN THỊ TỪNG SẢN PHẨM
            // ========================================

            products.forEach(product => {

                let giaCu = "";

                if (
                    product.price_old != null &&
                    Number(product.price_old) > 0
                ) {

                    giaCu = `
                        <p class="gia-cu">

                            <span class="gia-cu-label">
                                Giá cũ:
                            </span>

                            <span class="gia-cu-number">
                                ${Number(product.price_old).toLocaleString("vi-VN")}đ
                            </span>

                        </p>
                    `;

                }


                productList.innerHTML += `

                    <div class="detail-product">

                        <img
                            src="${product.image}"
                            alt="ảnh"
                        >


                        <div>

                            <h4>
                                ${product.product_name}
                            </h4>

                            <p>
                                Size: ${product.size}
                            </p>

                            <p>
                                Số lượng: ${product.quantity}
                            </p>

                            <p>
                                Giá:
                                ${Number(product.price).toLocaleString("vi-VN")}đ
                            </p>

                            ${giaCu}

                        </div>

                    </div>

                `;

            });


            // ========================================
            // TỔNG TIỀN + MÃ GIẢM GIÁ
            // ========================================

            let maVoucher =
                order.voucher_code || "Không có";

            let tienGiam =
                Number(order.discount || 0);

            let tamTinh =
                Number(order.subtotal || 0);

            let tongTien =
                Number(order.total || 0);


            productList.innerHTML += `

                <div class="detail-total-box">

                    <div class="detail-total-row">

                        <span>
                            Tạm tính:
                        </span>

                        <strong>
                            ${tamTinh.toLocaleString("vi-VN")}đ
                        </strong>

                    </div>


                    <div class="detail-total-row">

                        <span>
                            Mã giảm giá:
                        </span>

                        <strong class="detail-voucher">
                            ${maVoucher}
                        </strong>

                    </div>


                    <div class="detail-total-row">

                        <span>
                            Giảm giá:
                        </span>

                        <strong class="detail-discount">
                            -${tienGiam.toLocaleString("vi-VN")}đ
                        </strong>

                    </div>


                    <div class="detail-total">

                        <span>
                            Tổng tiền của đơn hàng:
                        </span>

                        <strong>
                            ${tongTien.toLocaleString("vi-VN")}đ
                        </strong>

                    </div>

                </div>

            `;


            // ========================================
            // HIỆN FORM
            // ========================================

            document
                .getElementById("orderDetailModal")
                .classList.add("show");


            // ========================================
            // THÔNG BÁO
            // ========================================

            show(
                `Đã mở chi tiết đơn hàng ${order_id}!`
            );

        })
        .catch(() => {

            show(
                `Không thể tải chi tiết đơn hàng ${order_id}!`
            );

        });

}


// ========================================
// ĐÓNG FORM
// ========================================

function dongChiTiet() {

    document
        .getElementById("orderDetailModal")
        .classList.remove("show");

}


// ========================================
// HỦY ĐƠN HÀNG
// ========================================

function huyDon(order_id) {

    const xacNhan =
        confirm(`Bạn có chắc muốn hủy đơn hàng này không?`);

    if (!xacNhan) {

        show(
            `Bạn đã hủy thao tác hủy đơn hàng ${order_id}!`
        );

        return;
    }


    // ========================================
    // HỦY ĐƠN
    // ========================================

    fetch(`/cancel-order/${order_id}`, {

        method: "PUT"

    })

        .then(res => res.text())

        .then(data => {

            if (data === "ok") {

                show(
                    `Hủy đơn hàng ${order_id} thành công!`
                );


                // ========================================
                // TÌM ĐƠN HÀNG
                // ========================================

                const order = orders.find(
                    item => item.order_id === order_id
                );


                // ========================================
                // ĐỔI TRẠNG THÁI
                // ========================================

                if (order) {

                    order.status = "Đã hủy";

                }


                // ========================================
                // HIỂN THỊ LẠI
                // ========================================

                hienThiDonHang(orders);

            }

            else {

                show(
                    `Hủy đơn hàng ${order_id} thất bại!`
                );

            }

        })

        .catch(() => {

            show(
                `Không thể hủy đơn hàng ${order_id}!`
            );

        });

}


// ========================================
// MUA LẠI ĐƠN HÀNG
// ========================================

function muaLai(order_id) {

    // ========================================
    // KIỂM TRA ĐƠN HÀNG
    // ========================================

    const order = orders.find(
        item => item.order_id == order_id
    );

    if (!order) {

        show(
            `Không tìm thấy đơn hàng ${order_id}!`
        );

        return;
    }


    // ========================================
    // LẤY SẢN PHẨM CỦA ĐƠN CŨ
    // ========================================

    fetch(`/order-products/${order_id}`)
        .then(res => {

            if (!res.ok) {

                show(
                    `Không thể lấy sản phẩm của đơn hàng ${order_id}!`
                );

                return null;
            }

            return res.json();

        })

        .then(products => {

            if (!products) {

                return;
            }


            // ========================================
            // KIỂM TRA SẢN PHẨM
            // ========================================

            if (!products || products.length === 0) {

                show(
                    `Đơn hàng ${order_id} không có sản phẩm để mua lại!`
                );

                return;
            }


            // ========================================
            // THÊM TỪNG SẢN PHẨM VÀO GIỎ
            // ========================================

            const themSanPham = products.map(product => {

                return fetch("/add-to-cart", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        product_name: product.product_name,

                        quantity: product.quantity,

                        image: product.image,

                        price: product.price,

                        price_old: product.price_old,

                        size: product.size

                    })

                });

            });


            // ========================================
            // CHỜ THÊM TẤT CẢ SẢN PHẨM
            // ========================================

            return Promise.all(themSanPham);

        })

        .then(results => {

            if (!results) {

                return;
            }


            // ========================================
            // KIỂM TRA KẾT QUẢ
            // ========================================

            const themThanhCong =
                results.every(res => res.ok);


            if (!themThanhCong) {

                show(
                    `Không thể thêm sản phẩm của đơn hàng ${order_id} vào giỏ hàng!`
                );

                return;
            }


            // ========================================
            // THÔNG BÁO THÀNH CÔNG
            // ========================================

            show(
                `Đã mua lại sản phẩm của đơn hàng ${order_id} vào giỏ hàng!`
            );


            // ========================================
            // CHUYỂN SANG TRANG GIỎ HÀNG
            // ========================================

            setTimeout(function () {

                window.location.href = "giohang.html";

            }, 1000);

        })

        .catch(() => {

            show(
                `Không thể thêm sản phẩm của đơn hàng ${order_id} vào giỏ hàng!`
            );

        });

}

