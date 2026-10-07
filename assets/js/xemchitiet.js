const params = new URLSearchParams(window.location.search);
const order_id = params.get("order_id");


// ========================================
// HÀM HIỂN THỊ THÔNG BÁO
// ========================================

function show(message) {

    const notice = document.querySelector(".notice");

    if (!notice) {
        return;
    }

    notice.textContent = `${message}`;

    notice.style.display = "block";

    clearTimeout(window.noticeTimer);

    window.noticeTimer = setTimeout(function () {

        notice.style.display = "none";

    }, 3000);
}


// ========================================
// KIỂM TRA MÃ ĐƠN HÀNG
// ========================================

if (!order_id) {

    show(`Không tìm thấy mã đơn hàng.`);

}


// ========================================
// LẤY THÔNG TIN ĐƠN HÀNG
// ========================================

if (order_id) {

    fetch(`/orders/${order_id}`)
        .then(res => res.json())
        .then(data => {

            if (!data || data.length === 0) {

                show(`Không tìm thấy đơn hàng.`);

                return;
            }

            const order = data[0];


            // ========================================
            // MÃ ĐƠN
            // ========================================

            document.querySelector(".order-id").textContent =
                `Mã Đơn: ${order.order_id}`;


            // ========================================
            // NGƯỜI NHẬN
            // ========================================

            document.querySelector(".receiver").textContent =
                `${order.ho} ${order.ten}`;


            // ========================================
            // EMAIL
            // ========================================

            document.querySelector(".email").textContent =
                `${order.email}`;


            // ========================================
            // SỐ ĐIỆN THOẠI
            // ========================================

            document.querySelector(".phone").textContent =
                `${order.phone}`;


            // ========================================
            // ĐỊA CHỈ
            // ========================================

            document.querySelector(".address").textContent =
                `${order.address}, ${order.district}, ${order.city}`;


            // ========================================
            // PHƯƠNG THỨC THANH TOÁN
            // ========================================

            document.querySelector(".payment-method").textContent =
                `${order.payment_method}`;

            document.querySelector(".shipping-method-info").textContent =
                `${order.shipping_method}`;
            // ========================================
            // THỜI GIAN
            // ========================================

            document.querySelector(".order-time").textContent =
                `${order.created_at.replace("T", " ").slice(0, 16)}`;


            // ========================================
            // PHƯƠNG THỨC GIAO HÀNG
            // ========================================

            // const shippingRow =
            //     document.querySelector(".shipping-row");

            // const shippingMethod =
            //     document.querySelector(".shipping-method");

            // if (
            //     order.shipping_method &&
            //     order.shipping_method.trim() !== ""
            // ) {

            //     shippingMethod.textContent =
            //         `${order.shipping_method}`;

            // } else {

            //     shippingRow.style.display = "none";
            // }


            // ========================================
            // VOUCHER
            // ========================================

            const voucherRow =
                document.querySelector(".voucher-row");

            const voucherCode =
                document.querySelector(".voucher-code");

            if (
                order.voucher_code &&
                order.voucher_code.trim() !== ""
            ) {

                voucherCode.textContent =
                    `${order.voucher_code}`;

            } else {

                voucherRow.style.display = "none";
            }


            // ========================================
            // GIẢM GIÁ
            // ========================================

            const discountRow =
                document.querySelector(".discount-row");

            const voucherDiscount =
                document.querySelector(".voucher-discount");

            const discount =
                Number(order.discount) || 0;

            if (discount > 0) {

                voucherDiscount.textContent =
                    `-${discount.toLocaleString("vi-VN")}đ`;

            } else {

                discountRow.style.display = "none";
            }


            // ========================================
            // TỔNG TIỀN
            // ========================================

            document.querySelector(".total-money").textContent =
                `${Number(order.total).toLocaleString("vi-VN")}đ`;

        })
        .catch(error => {

            show(`Không thể tải thông tin đơn hàng.`);

        });

}


// ========================================
// LẤY SẢN PHẨM TRONG ĐƠN HÀNG
// ========================================

if (order_id) {

    fetch(`/order-products/${order_id}`)
        .then(res => res.json())
        .then(products => {

            const productItem =
                document.querySelector(".product-item");

            if (!productItem) {
                return;
            }

            productItem.innerHTML = "";


            // ========================================
            // KIỂM TRA SẢN PHẨM
            // ========================================

            if (!products || products.length === 0) {

                productItem.innerHTML = `
                    <p>Không có sản phẩm trong đơn hàng.</p>
                `;

                show(`Không có sản phẩm trong đơn hàng.`);

                return;
            }


            // ========================================
            // HIỂN THỊ SẢN PHẨM
            // ========================================

            products.forEach(product => {

                const price =
                    Number(product.price) || 0;

                const quantity =
                    Number(product.quantity) || 0;

                const productTotal =
                    price * quantity;


                // ========================================
                // GIÁ CŨ
                // ========================================

                let priceOld = "";

                if (
                    product.price_old &&
                    Number(product.price_old) > 0
                ) {

                    priceOld = `
                        <div class="product-old-price">

                            <span class="gia-cu-label">
                                Giá cũ:
                            </span>

                            <span class="gia-cu-number">
                                ${Number(product.price_old)
                                    .toLocaleString("vi-VN")}đ
                            </span>

                        </div>
                    `;
                }


                // ========================================
                // THÊM SẢN PHẨM
                // ========================================

                productItem.innerHTML += `
                    <div class="product-row">

                        <div class="product-info">

                            <img
                                src="${product.image}"
                                alt="${product.product_name}"
                            >

                            <div class="product-detail">

                                <div class="product-name">
                                    ${product.product_name}
                                </div>

                                <div class="product-qty">
                                    Size: ${product.size}
                                </div>

                                <div class="product-qty">
                                    Số lượng: ${quantity}
                                </div>

                                ${priceOld}

                            </div>

                        </div>

                        <div class="product-price">
                            ${productTotal
                                .toLocaleString("vi-VN")}đ
                        </div>

                    </div>
                `;
            });

        })
        .catch(error => {

            show(`Không thể tải sản phẩm trong đơn hàng.`);

        });

}