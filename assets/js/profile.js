const nbElement = document.querySelector('.nb');
const bcElement = document.querySelector('.bc');
const kmElement = document.querySelector('.km');

const pdlElement = document.querySelector('.product-list');
const pdl2Element = document.querySelector('.product-list2');
const pdl3Element = document.querySelector('.product-list3');

const titleElement = document.querySelector('.product-hot .title');

const filterProduct = document.querySelector('.filter-product');
const filterBtn = document.querySelector('.filter-btn');
const filterItems = document.querySelectorAll('.filter-menu p');

let currentList = pdlElement;
let minPrice = 0;
let maxPrice = 999999999;


function filterProducts() {
    const products = currentList.querySelectorAll('[data-product-id]');

    products.forEach(product => {
        const priceElement = product.querySelector('.prices');

        if (!priceElement) {
            product.style.display = "";
            return;
        }

        const price = parseInt(
            priceElement.textContent.replace(/[^\d]/g, '')
        );

        if (price >= minPrice && price <= maxPrice) {
            product.style.display = "";
        } else {
            product.style.display = "none";
        }
    });
}


function setActiveTab(activeElement) {
    nbElement.classList.remove("active");
    bcElement.classList.remove("active");
    kmElement.classList.remove("active");

    activeElement.classList.add("active");
}


filterBtn.addEventListener('click', (event) => {
    event.stopPropagation();

    filterProduct.classList.toggle('open');
});


filterItems.forEach(item => {
    item.addEventListener('click', () => {
        minPrice = Number(item.dataset.min);
        maxPrice = Number(item.dataset.max);

        filterProducts();

        filterProduct.classList.remove('open');
    });
});


document.addEventListener('click', (event) => {
    if (!filterProduct.contains(event.target)) {
        filterProduct.classList.remove('open');
    }
});


nbElement.addEventListener('click', () => {
    pdlElement.style.display = "grid";
    pdl2Element.style.display = "none";
    pdl3Element.style.display = "none";

    currentList = pdlElement;

    setActiveTab(nbElement);

    titleElement.textContent = "SẢN PHẨM NỔI BẬT";

    filterProducts();
});


bcElement.addEventListener('click', () => {
    pdlElement.style.display = "none";
    pdl2Element.style.display = "grid";
    pdl3Element.style.display = "none";

    currentList = pdl2Element;

    setActiveTab(bcElement);

    titleElement.textContent = "SẢN PHẨM BÁN CHẠY";

    filterProducts();
});


kmElement.addEventListener('click', () => {
    pdlElement.style.display = "none";
    pdl2Element.style.display = "none";
    pdl3Element.style.display = "grid";

    currentList = pdl3Element;

    setActiveTab(kmElement);

    titleElement.textContent = "SẢN PHẨM KHUYẾN MÃI";

    filterProducts();
});


window.onload = function() {
    let name = localStorage.getItem("username");

    if (name) {
        document.getElementById("username").innerHTML = name;
    }

    filterProducts();
};


async function loadFeaturedProducts() {

    const res = await fetch('/products/random');
    const products = await res.json();

    const box = document.getElementById('featuredProducts');
    if (!box) return;

    box.innerHTML = '';

    products.forEach(product => {

        const price = Number(
            String(product.price).replace(/[^\d]/g, '')
        ).toLocaleString('vi-VN') + 'đ';

        const priceOld = product.price_old
            ? Number(
                String(product.price_old).replace(/[^\d]/g, '')
            ).toLocaleString('vi-VN') + 'đ'
            : '';
        
        const hasDiscount = Number(product.discount_percent) > 0;

        box.innerHTML += `
            <div class="product-item ${hasDiscount ? 'has-discount' : ''}"
                data-product-id="${product.product_id}">

                <a href="motasanpham.html?id=${product.product_id}">

                    <div class="product-image">

                        <img 
                            src="images/${product.image}"
                            alt="${product.product_name}"
                        >

                        ${
                            Number(product.stock_quantity) <= 0
                                ? `<div class="out-of-stock-tag">HẾT HÀNG</div>`
                                : ''
                        }

                        ${
                            hasDiscount
                                ? `
                                    <span class="sale-tag">
                                        -${product.discount_percent}%
                                    </span>
                                `
                                : ''
                        }

                    </div>

                    <div class="content">

                        <h3>${product.product_name}</h3>

                        <div class="money">

                            <p class="prices">
                                ${price}
                            </p>

                            ${
                                priceOld
                                    ? `<p class="price">${priceOld}</p>`
                                    : ''
                            }

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
                                        : ''
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

                <button class="add-to-cart">
                    THÊM VÀO GIỎ
                </button>

                <button type="button" class="buy-now">
                    MUA NGAY
                </button>

            </div>
        `;
    });

    filterProducts();
}

loadFeaturedProducts();


// ========================================
// LẤY SẢN PHẨM BÁN CHẠY
// ========================================

async function loadBestSellingProducts() {

    const res = await fetch('/products/bestselling');
    const products = await res.json();

    const box = document.getElementById('bestSellingProducts');
    if (!box) return;

    box.innerHTML = '';

    products.forEach(product => {

        const price = Number(
            String(product.price).replace(/[^\d]/g, '')
        ).toLocaleString('vi-VN') + 'đ';

        const priceOld = product.price_old
            ? Number(
                String(product.price_old).replace(/[^\d]/g, '')
            ).toLocaleString('vi-VN') + 'đ'
            : '';

        // KIỂM TRA CÓ GIẢM GIÁ KHÔNG
        const hasDiscount = Number(product.discount_percent) > 0;

        box.innerHTML += `
            <div class="product-item ${hasDiscount ? 'has-discount' : ''}"
                 data-product-id="${product.product_id}">

                <a href="motasanpham.html?id=${product.product_id}">

                    <div class="product-image">

                        <img
                            src="images/${product.image}"
                            alt="${product.product_name}"
                        >

                        ${
                            Number(product.stock_quantity) <= 0
                                ? `<div class="out-of-stock-tag">HẾT HÀNG</div>`
                                : ''
                        }

                        ${
                            hasDiscount
                                ? `
                                    <span class="sale-tag">
                                        -${product.discount_percent}%
                                    </span>
                                  `
                                : ''
                        }

                    </div>

                    <div class="content">

                        <h3>${product.product_name}</h3>

                        <div class="money">

                            <p class="prices">
                                ${price}
                            </p>

                            ${
                                priceOld
                                    ? `<p class="price">${priceOld}</p>`
                                    : ''
                            }

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
                                        : ''
                                }

                            </div>

                        </div>

                        <p class="sold-quantity">
                            Đã bán ${product.total_sold} sản phẩm
                        </p>

                    </div>

                </a>

                <div class="size-group">

                    <button class="size-btn">XS</button>
                    <button class="size-btn">S</button>
                    <button class="size-btn">M</button>
                    <button class="size-btn">L</button>

                </div>

                <button class="add-to-cart">
                    THÊM VÀO GIỎ
                </button>

                <button type="button" class="buy-now">
                    MUA NGAY
                </button>

            </div>
        `;
    });

    filterProducts();
}

loadBestSellingProducts();