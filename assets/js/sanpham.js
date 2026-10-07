
// ========================================
// HÀM HIỂN THỊ THÔNG BÁO
// ========================================

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

        }, 2500);
}


// ========================================
// LẤY CATEGORY VÀ SEARCH TỪ URL
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const category =
    params.get("category");

const search =
    params.get("search");

const categoryTitle =
    document.getElementById(
        "categoryTitle"
    );

const productList =
    document.getElementById(
        "productList"
    );


// ========================================
// ĐỊNH DẠNG GIÁ
// ========================================

function formatPrice(price) {

    if (!price) {
        return "";
    }

    return Number(
        String(price).replace(
            /[^\d]/g,
            ""
        )
    ).toLocaleString("vi-VN") + "đ";
}


// ========================================
// HIỂN THỊ SAO
// ========================================

function renderRating(reviews) {

    let html = "";

    if (
        !reviews ||
        reviews.length === 0
    ) {

        for (
            let i = 1;
            i <= 5;
            i++
        ) {

            html += `
                <i class="fa-regular fa-star"></i>
            `;

        }

        return html;
    }


    let totalRating = 0;

    reviews.forEach(function (review) {

        totalRating +=
            Number(review.rating) || 0;

    });


    const averageRating =
        totalRating / reviews.length;


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (
            i <= averageRating
        ) {

            html += `
                <i class="fa-solid fa-star"></i>
            `;

        } else {

            html += `
                <i class="fa-regular fa-star"></i>
            `;

        }

    }

    return html;
}


// ========================================
// LẤY ĐÁNH GIÁ CỦA SẢN PHẨM
// ========================================

function getProductRating(
    productId,
    ratingElement
) {

    fetch(
        `/reviews/${productId}`
    )

        .then(function (res) {

            return res.json();

        })

        .then(function (reviews) {

            ratingElement.innerHTML =
                renderRating(reviews);

        });

}


// ========================================
// TẠO HTML SẢN PHẨM
// ========================================

function renderProduct(product) {

    const productHTML = `

      

            <div
                class="product-item ${Number(product.discount_percent) > 0 ? "has-discount" : ""}"
                data-product-id="${product.product_id}"
            >

                <a
                    href="motasanpham.html?id=${product.product_id}"
                >

                    <div class="product-image">

                        <img 
                            src="images/${product.image}" 
                            alt="ảnh"
                        >

                        ${
                            Number(product.discount_percent) > 0
                                ? `
                                    <span class="sale-tag">
                                        -${product.discount_percent}%
                                    </span>
                                `
                                : ""
                        }

                        ${
                            Number(product.stock_quantity) <= 0
                                ? `
                                    <div class="out-of-stock-tag">
                                        HẾT HÀNG
                                    </div>
                                `
                                : ""
                        }

                        </div>

                    <div class="content3">

                        <h3>
                            ${product.product_name}
                        </h3>

                        <div class="money3">

                            <p class="prices3">
                                ${formatPrice(
                                    product.price
                                )}
                            </p>

                            ${
                                product.price_old
                                    ? `
                                        <p class="price3">
                                            ${formatPrice(
                                                product.price_old
                                            )}
                                        </p>
                                    `
                                    : ""
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
                                        : ""
                                }
                            </div>

                        </div>

                    </div>

                </a>


                <div class="size-group">

                    <button class="size-btn">
                        XS
                    </button>

                    <button class="size-btn">
                        S
                    </button>

                    <button class="size-btn">
                        M
                    </button>

                    <button class="size-btn">
                        L
                    </button>

                </div>


                <button class="add-to-cart">
                    THÊM VÀO GIỎ
                </button>


                <button
                    type="button"
                    class="buy-now"
                >
                    MUA NGAY
                </button>

            </div>

 

    `;


    productList.insertAdjacentHTML(
        "beforeend",
        productHTML
    );

    

    const productItem =
        productList.querySelector(
            `.product-item[data-product-id="${product.product_id}"]`
        );


    if (!productItem) {
        return;
    }


    const ratingElement =
        productItem.querySelector(
            ".rating"
        );


    if (!ratingElement) {
        return;
    }


    getProductRating(
        product.product_id,
        ratingElement
    );
}


// ========================================
// TÌM KIẾM SẢN PHẨM
// ========================================

if (search) {

    categoryTitle.textContent =
        `TÌM KIẾM: ${search}`;

    fetch(
        `/products/search/${encodeURIComponent(search)}`
    )

        .then(function (res) {

            return res.json();

        })

        .then(function (data) {

            productList.innerHTML =
                "";


            if (
                data.length === 0
            ) {

                productList.innerHTML = `
                    <p>
                        Không tìm thấy sản phẩm phù hợp.
                    </p>
                `;


                show(
                    `Không tìm thấy sản phẩm phù hợp với "${search}"!`
                );

                return;
            }


            data.forEach(
                function (product) {

                    renderProduct(product);

                }
            );


            show(
                `Đã tìm thấy ${data.length} sản phẩm với từ khóa "${search}"!`
            );

        });

}


// ========================================
// LỌC THEO DANH MỤC
// ========================================

else if (category) {

    categoryTitle.textContent =
        category;


    fetch(
        `/products/category/${encodeURIComponent(category)}`
    )

        .then(function (res) {

            return res.json();

        })

        .then(function (data) {

            productList.innerHTML =
                "";


            if (
                data.length === 0
            ) {

                productList.innerHTML = `
                    <p>
                        Không tìm thấy sản phẩm phù hợp.
                    </p>
                `;

                return;
            }


            data.forEach(
                function (product) {

                    renderProduct(product);

                }
            );

        });

}

