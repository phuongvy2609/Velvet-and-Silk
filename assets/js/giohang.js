
// ========================================
// HÀM HIỂN THỊ THÔNG BÁO
// ========================================

function show(message) {

    const notice = document.querySelector(".notice");

    if (!notice) {
        return;
    }

    notice.textContent = message;

    notice.style.display = "block";

    clearTimeout(window.noticeTimer);

    window.noticeTimer = setTimeout(function () {

        notice.style.display = "none";

    }, 2500);

}


// ========================================
// BIẾN GIẢM GIÁ
// ========================================

let discount = 0;


// ========================================
// LẤY GIẢM GIÁ ĐÃ LƯU
// ========================================

const savedDiscount =
    sessionStorage.getItem("discount");

if (savedDiscount) {

    discount =
        Number(savedDiscount);

}


// ========================================
// DANH SÁCH VOUCHER
// ========================================

let vouchers = [];


// ========================================
// LẤY DANH SÁCH VOUCHER
// ========================================

function loadVouchers() {

    const voucherList =
        document.querySelector("#voucherList");

    if (!voucherList) {
        return;
    }

    fetch("/getvouchers")

        .then(function (res) {

            return res.json();

        })

        .then(function (data) {

            vouchers = data;

            voucherList.innerHTML = "";

            const now =
                new Date();


            // ========================================
            // LẤY TỔNG TIỀN GIỎ HÀNG
            // ========================================

            const subtotal =
                getSubtotal();


            // ========================================
            // KIỂM TRA CÓ VOUCHER PHÙ HỢP
            // ========================================

            let hasVoucher = false;


            data.forEach(function (voucher) {

                const startDate =
                    new Date(
                        voucher.start_date
                    );


                const endDate =
                    new Date(
                        voucher.end_date
                    );


                // ========================================
                // KIỂM TRA TRẠNG THÁI
                // ========================================

                if (
                    String(
                        voucher.status
                    ).toLowerCase() !== "active"
                ) {

                    return;

                }


                // ========================================
                // KIỂM TRA SỐ LƯỢNG
                // ========================================

                if (
                    Number(
                        voucher.quantity
                    ) <= 0
                ) {

                    return;

                }


                // ========================================
                // KIỂM TRA NGÀY BẮT ĐẦU
                // ========================================

                if (now < startDate) {

                    return;

                }


                // ========================================
                // KIỂM TRA NGÀY KẾT THÚC
                // ========================================

                if (now > endDate) {

                    return;

                }


                // ========================================
                // KIỂM TRA ĐƠN TỐI THIỂU
                // ========================================

                if (
                    subtotal <
                    Number(
                        voucher.min_order
                    )
                ) {

                    return;

                }


                // ========================================
                // CÓ VOUCHER PHÙ HỢP
                // ========================================

                hasVoucher = true;


                // ========================================
                // HIỂN THỊ VOUCHER
                // ========================================

                voucherList.innerHTML += `

                    <div class="voucher-item">

                        <div>

                            <strong>
                                ${voucher.voucher_code}
                            </strong>

                            <p>
                                ${
                                    voucher.voucher_type === "percent"
                                    ? `Giảm ${voucher.voucher_value}%`
                                    : `Giảm ${
                                        Number(
                                            voucher.voucher_value
                                        ).toLocaleString("vi-VN")
                                    }đ`
                                }
                            </p>

                            <p>
                                Đơn tối thiểu:
                                ${
                                    Number(
                                        voucher.min_order
                                    ).toLocaleString("vi-VN")
                                }đ
                            </p>

                            <p class="date">
                                Ngày bắt đầu:
                                ${
                                    new Date(
                                        voucher.start_date
                                    ).toLocaleDateString("vi-VN")
                                }
                            </p>

                            <p class="date">
                                Ngày hết hạn:
                                ${
                                    new Date(
                                        voucher.end_date
                                    ).toLocaleDateString("vi-VN")
                                }
                            </p>

                        </div>

                        <button
                            type="button"
                            class="select-voucher"
                            data-code="${voucher.voucher_code}"
                        >
                            Chọn
                        </button>

                    </div>

                `;

            });


            // ========================================
            // KHÔNG CÓ VOUCHER PHÙ HỢP
            // ========================================

            if (!hasVoucher) {

                voucherList.innerHTML = `

                    <p class="no-voucher">
                        Đơn hàng của bạn không đủ điều kiện để sử dụng voucher.
                    </p>

                `;

            }

        })

        .catch(function () {

            voucherList.innerHTML =
                `<p>Không thể tải voucher!</p>`;

            show(
                `Không thể tải danh sách voucher!`
            );

        });

}


// ========================================
// CẬP NHẬT SỐ LƯỢNG
// ========================================

function updateCartQuantity(
    cartId,
    quantity
) {

    return fetch(
        "/update-cart",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                cart_id: cartId,

                quantity: quantity

            })

        }
    )

        .then(function (res) {

            return res.text();

        });

}


// ========================================
// XÓA SẢN PHẨM
// ========================================

function deleteCartItem(cartId) {

    return fetch(
        "/delete-cart",
        {

            method: "DELETE",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                cart_id: cartId

            })

        }
    )

        .then(function (res) {

            return res.text();

        });

}


// ========================================
// LẤY GIỎ HÀNG
// ========================================

function loadCart() {

    const cartItems =
        document.querySelector("#cartItems");


    // ========================================
    // KHÔNG PHẢI TRANG GIỎ HÀNG
    // ========================================

    if (!cartItems) {

        return;

    }


    fetch("/get-user")

        .then(function (res) {

            return res.json();

        })

        .then(function (userData) {


            // ========================================
            // CHƯA ĐĂNG NHẬP
            // ========================================

            if (!userData.user) {

                show(
                    `Vui lòng đăng nhập để xem giỏ hàng!`
                );

                window.location.href =
                    "dangnhap.html";

                return;

            }


            // ========================================
            // LẤY DỮ LIỆU GIỎ HÀNG
            // ========================================

            fetch("/get-cart")

                .then(function (res) {

                    return res.json();

                })

                .then(function (data) {


                    // ========================================
                    // XÓA NỘI DUNG CŨ
                    // ========================================

                    cartItems.innerHTML = "";


                    // ========================================
                    // SỐ LƯỢNG SẢN PHẨM
                    // ========================================

                    const count =
                        document.querySelector(".count");


                    if (count) {

                        count.textContent =
                            ` (${data.length} sản phẩm)`;

                    }


                    // ========================================
                    // GIỎ HÀNG TRỐNG
                    // ========================================

                    if (data.length === 0) {

                        showEmptyCart();

                        return;

                    }


                    // ========================================
                    // HIỂN THỊ SẢN PHẨM
                    // ========================================

                    data.forEach(function (product) {

                        cartItems.innerHTML += `

                            <div
                                class="item-card"
                                data-id="${product.cart_id}"
                                data-name="${product.product_name}"
                                data-size="${product.size}"
                                data-price="${product.price}"
                            >

                                <div class="item-img">

                                    <img
                                        src="${product.image}"
                                        alt=""
                                    >

                                </div>


                                <div class="item-infoo">

                                    <h3>
                                        ${product.product_name}
                                    </h3>


                                    <p>
                                        Size ${product.size}
                                    </p>


                                    <div class="quantity-control">

                                        <button
                                            type="button"
                                            class="add1"
                                            aria-label="Giảm số lượng"
                                        >

                                            <i class="fa-solid fa-minus"></i>

                                        </button>


                                        <span class="quantity">
                                            ${product.quantity}
                                        </span>


                                        <button
                                            type="button"
                                            class="add2"
                                            aria-label="Tăng số lượng"
                                        >

                                            <i class="fa-solid fa-plus"></i>

                                        </button>

                                    </div>

                                </div>


                                <div class="item-price">

                                    <span class="current-price">

                                        ${
                                            (
                                                Number(
                                                    product.price
                                                ) *
                                                Number(
                                                    product.quantity
                                                )
                                            ).toLocaleString(
                                                "vi-VN"
                                            )
                                        }đ

                                    </span>


                                    <span class="unit-price">

                                        ${
                                            Number(
                                                product.price
                                            ).toLocaleString(
                                                "vi-VN"
                                            )
                                        }đ/sản phẩm

                                    </span>


                                    <button
                                        type="button"
                                        class="remove-btn"
                                        data-id="${product.cart_id}"
                                    >

                                        ✕ Xóa

                                    </button>

                                </div>

                            </div>

                        `;

                    });


                    // ========================================
                    // LẤY VOUCHER
                    // ========================================

                    loadVouchers();


                    // ========================================
                    // TÍNH TỔNG TIỀN
                    // ========================================

                    updateTotal();

                });

        });

}


// ========================================
// HIỂN THỊ GIỎ HÀNG TRỐNG
// ========================================

function showEmptyCart() {

    const cartItems =
        document.querySelector("#cartItems");


    if (!cartItems) {

        return;

    }


    cartItems.innerHTML = `

        <p>
            Giỏ hàng của bạn đang trống!
        </p>

    `;


    const bold =
        document.querySelector(".bold");


    const discountElement =
        document.querySelector(".discount");


    const totalPrice =
        document.querySelector(".total-price");


    if (bold) {

        bold.textContent =
            `0đ`;

    }


    if (discountElement) {

        discountElement.textContent =
            `0đ`;

    }


    if (totalPrice) {

        totalPrice.textContent =
            `0đ`;

    }


    // ========================================
    // XÓA GIẢM GIÁ
    // ========================================

    discount = 0;


    sessionStorage.setItem(
        "discount",
        0
    );


    sessionStorage.removeItem(
        "voucherCode"
    );


    // ========================================
    // XÓA DANH SÁCH VOUCHER
    // ========================================

    const voucherList =
        document.querySelector("#voucherList");


    if (voucherList) {

        voucherList.innerHTML = "";

    }

}


// ========================================
// LẤY TỔNG TIỀN SẢN PHẨM
// ========================================

function getSubtotal() {

    let total = 0;


    document
        .querySelectorAll(".item-card")
        .forEach(function (item) {

            const price =
                Number(
                    item.dataset.price
                );


            const quantityElement =
                item.querySelector(
                    ".quantity"
                );


            if (!quantityElement) {

                return;

            }


            const quantity =
                Number(
                    quantityElement.textContent
                );


            total +=
                price * quantity;

        });


    return total;

}


// ========================================
// TÍNH TỔNG TIỀN
// ========================================

function updateTotal() {

    const total =
        getSubtotal();


    // ========================================
    // KIỂM TRA VOUCHER ĐÃ CHỌN
    // ========================================

    const voucherCode =
        sessionStorage.getItem(
            "voucherCode"
        );


    if (voucherCode) {

        const voucher =
            vouchers.find(function (item) {

                return item.voucher_code ===
                    voucherCode;

            });


        // ========================================
        // NẾU VOUCHER TỒN TẠI
        // ========================================

        if (voucher) {


            // ========================================
            // KIỂM TRA TRẠNG THÁI
            // ========================================

            const voucherStatus =
                String(
                    voucher.status
                ).toLowerCase();


            // ========================================
            // KIỂM TRA SỐ LƯỢNG
            // ========================================

            const voucherQuantity =
                Number(
                    voucher.quantity
                );


            // ========================================
            // KIỂM TRA THỜI GIAN
            // ========================================

            const now =
                new Date();


            const startDate =
                new Date(
                    voucher.start_date
                );


            const endDate =
                new Date(
                    voucher.end_date
                );


            // ========================================
            // KIỂM TRA VOUCHER CÒN HỢP LỆ
            // ========================================

            if (
                voucherStatus !== "active" ||
                voucherQuantity <= 0 ||
                now < startDate ||
                now > endDate
            ) {

                discount = 0;


                sessionStorage.setItem(
                    "discount",
                    0
                );


                sessionStorage.removeItem(
                    "voucherCode"
                );


                show(
                    `Voucher không còn hợp lệ!`
                );

            }


            // ========================================
            // KIỂM TRA ĐƠN TỐI THIỂU
            // ========================================

            else if (
                total <
                Number(
                    voucher.min_order
                )
            ) {

                discount = 0;


                sessionStorage.setItem(
                    "discount",
                    0
                );


                sessionStorage.removeItem(
                    "voucherCode"
                );


                show(
                    `Đơn hàng không còn đủ điều kiện sử dụng voucher!`
                );

            }


            // ========================================
            // VOUCHER HỢP LỆ
            // ========================================

            else {


                // ========================================
                // TÍNH LẠI GIẢM GIÁ
                // ========================================

                if (
                    voucher.voucher_type ===
                    "percent"
                ) {

                    discount =
                        total *
                        Number(
                            voucher.voucher_value
                        ) /
                        100;

                } else {

                    discount =
                        Number(
                            voucher.voucher_value
                        );

                }


                // ========================================
                // KHÔNG GIẢM QUÁ TIỀN HÀNG
                // ========================================

                if (discount > total) {

                    discount =
                        total;

                }


                sessionStorage.setItem(
                    "discount",
                    discount
                );

            }

        }

    } else {


        // ========================================
        // KHÔNG CÓ VOUCHER
        // ========================================

        if (discount > total) {

            discount =
                total;

        }

    }


    // ========================================
    // TẠM TÍNH
    // ========================================

    const bold =
        document.querySelector(".bold");


    if (bold) {

        bold.textContent =
            total.toLocaleString(
                "vi-VN"
            ) +
            `đ`;

    }


    // ========================================
    // GIẢM GIÁ
    // ========================================

    const discountElement =
        document.querySelector(".discount");


    if (discountElement) {

        discountElement.textContent =
            discount.toLocaleString(
                "vi-VN"
            ) +
            `đ`;

    }


    // ========================================
    // TỔNG CỘNG
    // ========================================

    let finalTotal =
        total -
        discount;


    if (finalTotal < 0) {

        finalTotal = 0;

    }


    const totalPrice =
        document.querySelector(
            ".total-price"
        );


    if (totalPrice) {

        totalPrice.textContent =
            finalTotal.toLocaleString(
                "vi-VN"
            ) +
            `đ`;

    }

}


// ========================================
// CẬP NHẬT SỐ SẢN PHẨM
// ========================================

function updateCartItemCount() {

    const items =
        document.querySelectorAll(
            ".item-card"
        );


    const countElement =
        document.querySelector(
            ".count"
        );


    if (countElement) {

        countElement.textContent =
            ` (${items.length} sản phẩm)`;

    }

}


// ========================================
// KIỂM TRA GIỎ HÀNG TRỐNG
// ========================================

function checkEmptyCart() {

    const cartItems =
        document.querySelector(
            "#cartItems"
        );


    if (!cartItems) {

        return;

    }


    const items =
        document.querySelectorAll(
            ".item-card"
        );


    if (items.length === 0) {

        showEmptyCart();

    }

}


// ========================================
// ĐI ĐẾN TRANG THANH TOÁN
// ========================================

const checkoutBtn =
    document.querySelector(
        ".checkout-btn"
    );


if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function () {


            const items =
                document.querySelectorAll(
                    ".item-card"
                );


            // ========================================
            // GIỎ HÀNG TRỐNG
            // ========================================

            if (items.length === 0) {

                show(
                    `Giỏ hàng của bạn đang trống!`
                );

                return;

            }


            // ========================================
            // LẤY GIẢM GIÁ HIỆN TẠI
            // ========================================

            const currentDiscount =
                Number(
                    sessionStorage.getItem(
                        "discount"
                    )
                ) || 0;


            // ========================================
            // ĐI THANH TOÁN
            // ========================================

            window.location.href =
                "thanhtoan.html?discount=" +
                currentDiscount;

        }
    );

}


// ========================================
// XỬ LÝ NÚT TRONG GIỎ HÀNG
// ========================================

const cartItems =
    document.querySelector(
        "#cartItems"
    );


if (cartItems) {

    cartItems.addEventListener(
        "click",
        async function (e) {


            // ========================================
            // NÚT XÓA
            // ========================================

            const removeButton =
                e.target.closest(
                    ".remove-btn"
                );


            if (removeButton) {

                const cartId =
                    removeButton.dataset.id;


                const item =
                    removeButton.closest(
                        ".item-card"
                    );


                // ========================================
                // LẤY TÊN SẢN PHẨM
                // ========================================

                const productName =
                    item
                        ? item.dataset.name
                        : `sản phẩm`;


                // ========================================
                // LẤY SIZE
                // ========================================

                const productSize =
                    item
                        ? item.dataset.size
                        : ``;


                const confirmDelete =
                    confirm(
                        `Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?`
                    );


                if (!confirmDelete) {

                    return;

                }


                const data =
                    await deleteCartItem(
                        cartId
                    );


                if (data === "ok") {


                    // ========================================
                    // XÓA TRÊN GIAO DIỆN
                    // ========================================

                    if (item) {

                        item.remove();

                    }


                    // ========================================
                    // CẬP NHẬT ICON GIỎ HÀNG
                    // ========================================

                    if (
                        typeof loadCartCount ===
                        "function"
                    ) {

                        await loadCartCount();

                    }


                    // ========================================
                    // CẬP NHẬT SỐ SẢN PHẨM
                    // ========================================

                    updateCartItemCount();


                    // ========================================
                    // CẬP NHẬT TỔNG TIỀN
                    // ========================================

                    updateTotal();


                    // ========================================
                    // CẬP NHẬT DANH SÁCH VOUCHER
                    // ========================================

                    loadVouchers();


                    // ========================================
                    // KIỂM TRA GIỎ HÀNG TRỐNG
                    // ========================================

                    checkEmptyCart();


                    // ========================================
                    // THÔNG BÁO XÓA
                    // ========================================

                    show(
                        `Đã xóa ${productName} - Size ${productSize} khỏi giỏ hàng!`
                    );

                } else {

                    show(
                        `Xóa sản phẩm thất bại!`
                    );

                }


                return;

            }


            // ========================================
            // NÚT GIẢM
            // ========================================

            const minusButton =
                e.target.closest(
                    ".add1"
                );


            // ========================================
            // NÚT TĂNG
            // ========================================

            const plusButton =
                e.target.closest(
                    ".add2"
                );


            // ========================================
            // KHÔNG PHẢI NÚT TĂNG / GIẢM
            // ========================================

            if (
                !minusButton &&
                !plusButton
            ) {

                return;

            }


            // ========================================
            // LẤY SẢN PHẨM
            // ========================================

            const item =
                e.target.closest(
                    ".item-card"
                );


            if (!item) {

                return;

            }


            const cartId =
                item.dataset.id;


            const quantityElement =
                item.querySelector(
                    ".quantity"
                );


            if (!quantityElement) {

                return;

            }


            let quantity =
                Number(
                    quantityElement.textContent
                );


            // ========================================
            // NÚT GIẢM
            // ========================================

            if (minusButton) {


                // ========================================
                // NẾU ĐANG LÀ 1
                // ========================================

                if (quantity === 1) {

                    const confirmDelete =
                        confirm(
                            `Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?`
                        );


                    if (!confirmDelete) {

                        return;

                    }


                    // ========================================
                    // LẤY TÊN SẢN PHẨM
                    // ========================================

                    const productName =
                        item.dataset.name ||
                        `sản phẩm`;


                    // ========================================
                    // LẤY SIZE
                    // ========================================

                    const productSize =
                        item.dataset.size ||
                        ``;


                    // ========================================
                    // XÓA SẢN PHẨM
                    // ========================================

                    const data =
                        await deleteCartItem(
                            cartId
                        );


                    if (data === "ok") {

                        item.remove();


                        // ========================================
                        // CẬP NHẬT ICON GIỎ HÀNG
                        // ========================================

                        if (
                            typeof loadCartCount ===
                            "function"
                        ) {

                            await loadCartCount();

                        }


                        // ========================================
                        // CẬP NHẬT SỐ SẢN PHẨM
                        // ========================================

                        updateCartItemCount();


                        // ========================================
                        // CẬP NHẬT TỔNG TIỀN
                        // ========================================

                        updateTotal();


                        // ========================================
                        // CẬP NHẬT VOUCHER
                        // ========================================

                        loadVouchers();


                        // ========================================
                        // KIỂM TRA GIỎ HÀNG
                        // ========================================

                        checkEmptyCart();


                        // ========================================
                        // THÔNG BÁO XÓA
                        // ========================================

                        show(
                            `Đã xóa sản phẩm ${productName} - Size ${productSize} khỏi giỏ hàng!`
                        );

                    } else {

                        show(
                            `Xóa sản phẩm thất bại!`
                        );

                    }


                    return;

                }


                // ========================================
                // GIẢM 1
                // ========================================

                quantity =
                    quantity - 1;

            }


            // ========================================
            // NÚT TĂNG
            // ========================================

            if (plusButton) {

                quantity =
                    quantity + 1;

            }


            // ========================================
            // CẬP NHẬT SỐ LƯỢNG GIAO DIỆN
            // ========================================

            quantityElement.textContent =
                quantity;


            // ========================================
            // CẬP NHẬT GIÁ
            // ========================================

            const price =
                Number(
                    item.dataset.price
                );


            const currentPrice =
                item.querySelector(
                    ".current-price"
                );


            if (currentPrice) {

                currentPrice.textContent =
                    (
                        price *
                        quantity
                    ).toLocaleString(
                        "vi-VN"
                    ) +
                    `đ`;

            }


            // ========================================
            // CẬP NHẬT DATABASE
            // ========================================

            const data =
                await updateCartQuantity(
                    cartId,
                    quantity
                );


            if (data !== "ok") {

                show(
                    `Lỗi cập nhật số lượng!`
                );

                return;

            }


            // ========================================
            // CẬP NHẬT TỔNG TIỀN
            // ========================================

            updateTotal();


            // ========================================
            // CẬP NHẬT VOUCHER
            // ========================================

            loadVouchers();


            // ========================================
            // KHÔNG THÔNG BÁO TĂNG / GIẢM SỐ LƯỢNG
            // ========================================

        }
    );

}


// ========================================
// CHẠY KHI MỞ TRANG
// ========================================

loadCart();

loadVouchers();


// ========================================
// CHỌN VOUCHER
// ========================================

const voucherList =
    document.querySelector(
        "#voucherList"
    );


if (voucherList) {

    voucherList.addEventListener(
        "click",
        function (e) {


            const button =
                e.target.closest(
                    ".select-voucher"
                );


            if (!button) {

                return;

            }


            const voucherCode =
                button.dataset.code;


            // ========================================
            // LẤY TỔNG TIỀN
            // ========================================

            const subtotal =
                getSubtotal();


            // ========================================
            // TÌM VOUCHER
            // ========================================

            const voucher =
                vouchers.find(
                    function (item) {

                        return item.voucher_code ===
                            voucherCode;

                    }
                );


            // ========================================
            // VOUCHER KHÔNG TỒN TẠI
            // ========================================

            if (!voucher) {

                show(
                    `Voucher không tồn tại!`
                );

                return;

            }


            // ========================================
            // KIỂM TRA TRẠNG THÁI
            // ========================================

            if (
                String(
                    voucher.status
                ).toLowerCase() !==
                "active"
            ) {

                show(
                    `Voucher hiện không hoạt động!`
                );

                return;

            }


            // ========================================
            // KIỂM TRA SỐ LƯỢNG
            // ========================================

            if (
                Number(
                    voucher.quantity
                ) <= 0
            ) {

                show(
                    `Voucher đã hết số lượng!`
                );

                return;

            }


            // ========================================
            // KIỂM TRA NGÀY
            // ========================================

            const now =
                new Date();


            const startDate =
                new Date(
                    voucher.start_date
                );


            const endDate =
                new Date(
                    voucher.end_date
                );


            if (now < startDate) {

                show(
                    `Voucher chưa bắt đầu sử dụng!`
                );

                return;

            }


            if (now > endDate) {

                show(
                    `Voucher đã hết hạn!`
                );

                return;

            }


            // ========================================
            // KIỂM TRA ĐƠN TỐI THIỂU
            // ========================================

            if (
                subtotal <
                Number(
                    voucher.min_order
                )
            ) {

                show(
                    `Đơn hàng của bạn không đủ điều kiện để sử dụng voucher.`
                );

                return;

            }


            // ========================================
            // TÍNH GIẢM GIÁ
            // ========================================

            if (
                voucher.voucher_type ===
                "percent"
            ) {

                discount =
                    subtotal *
                    Number(
                        voucher.voucher_value
                    ) /
                    100;

            } else {

                discount =
                    Number(
                        voucher.voucher_value
                    );

            }


            // ========================================
            // KHÔNG GIẢM QUÁ TIỀN HÀNG
            // ========================================

            if (discount > subtotal) {

                discount =
                    subtotal;

            }


            // ========================================
            // LƯU VOUCHER
            // ========================================

            sessionStorage.setItem(
                "voucherCode",
                voucherCode
            );


            // ========================================
            // LƯU GIẢM GIÁ
            // ========================================

            sessionStorage.setItem(
                "discount",
                discount
            );


            // ========================================
            // CẬP NHẬT TỔNG TIỀN
            // ========================================

            updateTotal();


            // ========================================
            // THÔNG BÁO
            // ========================================

            show(
                `Đã chọn voucher ${voucherCode}`
            );

        }
    );

}
