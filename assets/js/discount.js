async function loadKhuyenMai() {

    const res = await fetch('/getproducts');
    const products = await res.json();

    const box = document.getElementById('promotionProducts');
    if (!box) return;
    
    box.innerHTML = '';

    products.forEach(product => {

        if (Number(product.discount_percent) > 0) {

            const price = Number(
                String(product.price).replace(/[^\d]/g, '')
            ).toLocaleString('vi-VN') + 'đ';

            const priceOld = product.price_old
                ? Number(
                    String(product.price_old).replace(/[^\d]/g, '')
                ).toLocaleString('vi-VN') + 'đ'
                : '';

            box.innerHTML += `
                <div class="product-item3 has-discount"
                     data-product-id="${product.product_id}">

                    <a href="motasanpham.html?id=${product.product_id}">

                        <div class="product-image">
                            <div class="sale-image">

                                <img 
                                    src="images/${product.image}"
                                    alt="${product.product_name}"
                                >

                                ${
                                    Number(product.stock_quantity) <= 0
                                        ? `<div class="out-of-stock-tag">HẾT HÀNG</div>`
                                        : ''
                                }

                                <span class="sale-tag">
                                    -${product.discount_percent}%
                                </span>

                            </div>
                        </div>

                        <div class="content">

                            <h3>${product.product_name}</h3>

                            <div class="money">

                                <p class="prices">
                                    ${price}
                                </p>

                                <p class="price">
                                    ${priceOld}
                                </p>

                            </div>

                            <div class="rating-stock">

                                <div class="rating">
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                </div>

                                <div class="stock-quantity">
                                    ${
                                        Number(product.stock_quantity) > 0
                                            ? `Còn ${product.stock_quantity} sản phẩm`
                                            : ""
                                    }
                                </div>

                            </div>

                        </div>

                    </a>

                    <div class="size-group">

                        <button class="size-btn">XS</button>
                        <button class="size-btn">S</button>
                        <button class="size-btn">M</button>
                        <button class="size-btn">L</button>

                    </div>

                    <div class="btn-km">
                        <button class="add-to-cart">
                            THÊM VÀO GIỎ
                        </button>

                        <button type="button" class="buy-now">
                            MUA NGAY
                        </button>
                    </div>
                </div>
            `;
        }
    });
}

loadKhuyenMai();



