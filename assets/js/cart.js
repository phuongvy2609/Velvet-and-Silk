// ========================================
// SỐ LƯỢNG Ở TRANG CHI TIẾT
// ========================================

let soluong = 1;


// ========================================
// HÀM LẤY THÔNG TIN SẢN PHẨM
// ========================================

async function getProductInfo(product) {

    const selectedSize =
        product.querySelector('.size-btn.selected');

    if (!selectedSize) {

        show(`Vui lòng chọn size!`);

        return null;
    }


    const size =
        selectedSize.textContent.trim();


    const nameElement =
        product.querySelector('h3');

    if (!nameElement) {

        show(`Không tìm thấy tên sản phẩm!`);

        return null;
    }


    const product_name =
        nameElement.textContent.trim();


    // ========================================
    // LẤY HÌNH ẢNH
    // ========================================

    let imageElement =
        document.querySelector('#product-image');

    if (!imageElement) {

        imageElement =
            product.querySelector('img');
    }


    const image =
        imageElement
            ? imageElement.getAttribute('src')
            : null;


    // ========================================
    // LẤY GIÁ HIỆN TẠI
    // ========================================

    let priceElement =
        document.querySelector('#product-price');

    if (!priceElement) {

        priceElement =
            product.querySelector('.prices, .prices3');
    }


    if (!priceElement) {

        show(`Không tìm thấy giá sản phẩm!`);

        return null;
    }


    const price =
        Number(
            priceElement.textContent
                .replace(/[^\d]/g, '')
        );


    // ========================================
    // LẤY GIÁ CŨ
    // ========================================

    let priceOldElement =
        document.querySelector('#product-old-price');

    if (!priceOldElement) {

        priceOldElement =
            product.querySelector('.price, .price3');
    }


    let price_old = null;


    if (
        priceOldElement &&
        priceOldElement.textContent.trim() !== ''
    ) {

        price_old =
            Number(
                priceOldElement.textContent
                    .replace(/[^\d]/g, '')
            );
    }

    const productId =
    product.dataset.productId;

        let stock_quantity = 0;

        if (productId) {

            const stockResponse =
                await fetch(`/products/${productId}`);

            const stockData =
                await stockResponse.json();

            stock_quantity =
                Number(stockData.stock_quantity) || 0;

        }

        return {

            size,
            product_name,
            image,
            price,
            price_old,
            stock_quantity

        };

}


// ========================================
// CẬP NHẬT SỐ LƯỢNG TRONG DATABASE
// ========================================

function updateCartQuantity(cartId, quantity) {

    return fetch('/update-cart', {

        method: 'POST',

        headers: {

            'Content-Type':
                'application/json'

        },

        body: JSON.stringify({

            cart_id: cartId,
            quantity: quantity

        })

    })

        .then(function (response) {

            return response.text();

        });

}


// ========================================
// XÓA SẢN PHẨM KHỎI GIỎ
// ========================================

function deleteCartItem(cartId) {

    return fetch('/delete-cart', {

        method: 'DELETE',

        headers: {

            'Content-Type':
                'application/json'

        },

        body: JSON.stringify({

            cart_id: cartId

        })

    })

        .then(function (response) {

            return response.text();

        });

}


// ========================================
// CHỌN SIZE
// ========================================

document.addEventListener(
    'click',
    function (e) {

        const sizeButton =
            e.target.closest('.size-btn');


        if (!sizeButton) {

            return;
        }


        const product =
            sizeButton.closest(
                '.product-item, .product-item2, .product-item3, .cart-info'
            );


        if (!product) {

            return;
        }


        const sizeButtons =
            product.querySelectorAll(
                '.size-btn'
            );


        sizeButtons.forEach(
            function (button) {

                button.classList.remove(
                    'selected'
                );

            }
        );


        sizeButton.classList.add(
            'selected'
        );
    }
);


// ========================================
// THÊM VÀO GIỎ
// ========================================

document.addEventListener(
    'click',
    async function (e) {

        const addButton =
            e.target.closest('.add-to-cart');


        if (!addButton) {

            return;
        }


        let product =
            addButton.closest(
                '.product-item, .product-item2, .product-item3'
            );


        if (!product) {

            product =
                document.querySelector(
                    '.cart-info'
                );

        }


        if (!product) {

            show(
                `Không tìm thấy sản phẩm!`
            );

            return;
        }


        // ========================================
        // LẤY THÔNG TIN SẢN PHẨM
        // ========================================

        const productInfo =
            await getProductInfo(product);


        if (!productInfo) {

            return;
        }


        if (productInfo.stock_quantity <= 0) {

            show(`Sản phẩm đã hết hàng!`);

            return;
        }

        // ========================================
        // KIỂM TRA ĐĂNG NHẬP
        // ========================================

        const resUser =
            await fetch('/get-user');


        const userData =
            await resUser.json();


        if (!userData.user) {

            show(
                `Vui lòng đăng nhập!`
            );

            window.location.href =
                "dangnhap.html";

            return;
        }


        // ========================================
        // THÊM SẢN PHẨM VÀO GIỎ
        // ========================================

        const res =
            await fetch('/add-to-cart', {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json'

                },

                body: JSON.stringify({

                    product_name:
                        productInfo.product_name,

                    quantity:
                        soluong,

                    image:
                        productInfo.image,

                    price:
                        productInfo.price,

                    price_old:
                        productInfo.price_old,

                    size:
                        productInfo.size

                })

            });


        const data =
            await res.text();


        // ========================================
        // KIỂM TRA KẾT QUẢ
        // ========================================

        if (data === "ok") {

            // Xóa trạng thái MUA NGAY cũ
            sessionStorage.removeItem("buyNow");


            // ========================================
            // THÔNG BÁO THÊM GIỎ HÀNG
            // ========================================

            show(
                `Đã thêm ` +
                productInfo.product_name +
                ` - size ` +
                productInfo.size +
                ` vào giỏ hàng!`
            );


            // ========================================
            // BỎ TRẠNG THÁI CHỌN SIZE
            // ========================================

            const selectedSize =
                product.querySelector(
                    '.size-btn.selected'
                );


            if (selectedSize) {

                selectedSize.classList.remove(
                    'selected'
                );

            }


            // ========================================
            // CẬP NHẬT ICON GIỎ HÀNG
            // ========================================

            if (
                typeof loadCartCount ===
                'function'
            ) {

                await loadCartCount();

            }

        } else {

            show(
                `Lỗi thêm sản phẩm: ` +
                data
            );

        }

    }
);


// ========================================
// MUA NGAY
// ========================================

document.addEventListener(
    'click',
    async function (e) {

        const buyNowButton =
            e.target.closest('.buy-now');


        if (!buyNowButton) {

            return;
        }


        // ========================================
        // TÌM SẢN PHẨM
        // ========================================

        const product =
            buyNowButton.closest(
                '.product-item, .product-item2, .product-item3, .cart-info'
            );


        if (!product) {

            show(
                `Không tìm thấy sản phẩm!`
            );

            return;
        }
        


        // ========================================
        // LẤY ID SẢN PHẨM
        // ========================================

        const product_id =
            product.dataset.productId;


        if (!product_id) {

            show(
                `Không tìm thấy mã sản phẩm!`
            );

            return;
        }


        // ========================================
        // LẤY THÔNG TIN SẢN PHẨM
        // ========================================

        const productInfo =
            await getProductInfo(product);


        if (!productInfo) {

            return;
        }

        if (productInfo.stock_quantity <= 0) {

            show(`Sản phẩm đã hết hàng!`);

            return;
        }


        // ========================================
        // LẤY SỐ LƯỢNG
        // ========================================

        let quantity = 1;


        const quantityElement =
            product.querySelector(
                '.quantity'
            );


        if (quantityElement) {

            quantity =
                Number(
                    quantityElement.textContent
                ) || 1;

        }


        // ========================================
        // KIỂM TRA ĐĂNG NHẬP
        // ========================================

        const resUser =
            await fetch('/get-user');


        const userData =
            await resUser.json();


        if (!userData.user) {

            show(
                `Vui lòng đăng nhập!`
            );

            window.location.href =
                'dangnhap.html';

            return;
        }


        // ========================================
        // GỬI SẢN PHẨM MUA NGAY
        // ========================================

        const res =
            await fetch('/buy-now', {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json'

                },

                body: JSON.stringify({

                    product_id:
                        Number(product_id),

                    product_name:
                        productInfo.product_name,

                    image:
                        productInfo.image,

                    price:
                        productInfo.price,

                    price_old:
                        productInfo.price_old,

                    quantity:
                        quantity,

                    size:
                        productInfo.size

                })

            });


        const data =
            await res.text();


        // ========================================
        // MUA NGAY THÀNH CÔNG
        // ========================================

        if (data === 'ok') {

            // ========================================
            // THÔNG BÁO MUA NGAY
            // ========================================

            show(
                `Đã chọn mua ngay ` +
                productInfo.product_name
            );


            // Đánh dấu đây là thanh toán mua ngay
            sessionStorage.setItem(
                "buyNow",
                "true"
            );


            // Xóa trạng thái voucher cũ nếu có
            sessionStorage.removeItem(
                "discount"
            );

            sessionStorage.removeItem(
                "voucherCode"
            );


            // Đi thẳng đến thanh toán
            window.location.href =
                'thanhtoan.html';

        } else {

            show(
                `Mua ngay thất bại: ` +
                data
            );

        }

    }
);


// ========================================
// TĂNG GIẢM SỐ LƯỢNG Ở TRANG MÔ TẢ SẢN PHẨM
// ========================================

document.addEventListener(
    "click",
    function (e) {

        // ========================================
        // NÚT GIẢM
        // ========================================

        const minusButton =
            e.target.closest(".add1");


        // ========================================
        // NÚT TĂNG
        // ========================================

        const plusButton =
            e.target.closest(".add2");


        // ========================================
        // KHÔNG PHẢI NÚT TĂNG / GIẢM
        // ========================================

        if (!minusButton && !plusButton) {

            return;
        }


        // ========================================
        // TÌM KHU VỰC SẢN PHẨM
        // ========================================

        const product =
            e.target.closest(
                ".product-item, .product-item2, .product-item3, .cart-info"
            );


        if (!product) {

            return;
        }


        // ========================================
        // LẤY Ô SỐ LƯỢNG
        // ========================================

        const quantityElement =
            product.querySelector(
                ".quantity"
            );


        if (!quantityElement) {

            return;
        }


        // ========================================
        // LẤY SỐ LƯỢNG HIỆN TẠI
        // ========================================

        let quantity =
            Number(
                quantityElement.textContent
            ) || 1;


        // ========================================
        // GIẢM SỐ LƯỢNG
        // ========================================

        if (minusButton) {

            if (quantity > 1) {

                quantity--;

            }

        }


        // ========================================
        // TĂNG SỐ LƯỢNG
        // ========================================

        if (plusButton) {

            quantity++;

        }


        // ========================================
        // HIỂN THỊ SỐ LƯỢNG
        // ========================================

        quantityElement.textContent =
            quantity;


        // ========================================
        // CẬP NHẬT BIẾN SỐ LƯỢNG
        // ========================================

        soluong = quantity;

    }
);