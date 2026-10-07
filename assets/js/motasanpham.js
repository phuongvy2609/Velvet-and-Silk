
let selectedSize = "";


// =================================
// LẤY ID SẢN PHẨM TỪ URL
// =================================

const url =
    new URLSearchParams(window.location.search);

const id =
    url.get("id");

let product;


// =================================
// LẤY THÔNG TIN SẢN PHẨM
// =================================

fetch(`/products/${id}`)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {

        product = data;

        document.querySelector(".cart-info").dataset.productId =
            product.product_id;

        // Tên sản phẩm
        document.querySelector(".product-name").innerText =
            product.product_name;

        // Giá sản phẩm
        document.getElementById("product-price").innerText =
            Number(
                String(product.price).replace(/[^\d]/g, "")
            ).toLocaleString("vi-VN") + "đ";

        // Giá cũ
        document.getElementById("product-old-price").innerText =
            product.price_old
                ? Number(
                    String(product.price_old).replace(/[^\d]/g, "")
                ).toLocaleString("vi-VN") + "đ"
                : "";

        // Hình ảnh
        document.getElementById("product-image").src =
            "images/" + product.image;

        // Mô tả
        document.getElementById("product-description").innerText =
            product.description;

    })
    .catch(function () {

        show(`Không thể tải thông tin sản phẩm!`);

    });


// =================================
// CHỌN SIZE
// =================================

document.addEventListener(
    "click",
    function (e) {

        if (
            !e.target.classList.contains("size-btn")
        ) {
            return;
        }

        selectedSize =
            e.target.innerText;


        // Bỏ active các size khác

        document.querySelectorAll(".size-btn")
            .forEach(function (btn) {

                btn.classList.remove("active");

            });


        // Active size đang chọn

        e.target.classList.add("active");


        // =================================
        // THÔNG BÁO SIZE ĐÃ CHỌN
        // =================================

        show(
            `Bạn đã chọn Size ${selectedSize}!`
        );

    }
);




// =================================
// HIỂN THỊ SAO ĐÁNH GIÁ SẢN PHẨM
// =================================

function updateProductRating(reviews) {

    const rating =
        document.querySelector("#product-rating");

    if (!rating) {
        return;
    }

    const stars =
        rating.querySelectorAll("i");

    // ================================
    // CHƯA CÓ ĐÁNH GIÁ
    // ================================

    if (!reviews || reviews.length === 0) {

        stars.forEach(function (star) {

            star.className =
                "fa-regular fa-star";

        });

        return;
    }

    // ================================
    // TÍNH ĐIỂM TRUNG BÌNH
    // ================================

    let totalRating = 0;

    reviews.forEach(function (review) {

        totalRating +=
            Number(review.rating) || 0;

    });

    const averageRating =
        totalRating / reviews.length;

    // ================================
    // HIỂN THỊ SAO
    // ================================

    stars.forEach(function (star, index) {

        if (index + 1 <= averageRating) {

            star.className =
                "fa-solid fa-star";

        } else {

            star.className =
                "fa-regular fa-star";

        }

    });
}




// =================================
// LẤY TẤT CẢ ĐÁNH GIÁ
// =================================

function loadReviews() {

    fetch(`/reviews/${id}`)
        .then(function (res) {

            return res.json();

        })
        .then(function (reviews) {

            const reviewList =
                document.querySelector("#review-list");

            updateProductRating(reviews);

            // Xóa danh sách cũ

            reviewList.innerHTML = "";


            // Nếu chưa có đánh giá

            if (reviews.length === 0) {

                reviewList.innerHTML =
                    "<p>Chưa có đánh giá nào cho sản phẩm này.</p>";

                return;

            }


            // Hiển thị từng đánh giá

            reviews.forEach(function (review) {

                // ==================================
                // TẠO SAO
                // ==================================

                let stars = "";

                for (
                    let i = 1;
                    i <= 5;
                    i++
                ) {

                    if (i <= review.rating) {

                        stars += "⭐";

                    }

                }


                // ==================================
                // AVATAR USER
                // ==================================

                const nameParts =
                    review.customer_name
                        .trim()
                        .split(/\s+/);


                let avatarLetter = "?";


                if (nameParts.length >= 2) {

                    const firstLetter =
                        nameParts[0]
                            .charAt(0)
                            .toUpperCase();


                    const lastLetter =
                        nameParts[nameParts.length - 1]
                            .charAt(0)
                            .toUpperCase();


                    avatarLetter =
                        firstLetter +
                        lastLetter;

                } else if (
                    nameParts.length === 1
                ) {

                    avatarLetter =
                        nameParts[0]
                            .charAt(0)
                            .toUpperCase();

                }


                // ==================================
                // NGÀY ĐÁNH GIÁ
                // ==================================

                let reviewDate = "";

                if (review.created_at) {

                    reviewDate =
                        review.created_at
                            .replace("T", " ")
                            .slice(0, 16);

                }


                // ==================================
                // PHẢN HỒI CỦA SHOP
                // ==================================

                let shopReplyHTML = "";


                if (
                    review.shop_reply &&
                    review.shop_reply.trim() !== ""
                ) {

                    let replyDate = "";


                    if (review.reply_at) {

                        replyDate =
                            review.reply_at
                                .replace("T", " ")
                                .slice(0, 16);

                    }


                    shopReplyHTML = `
                        <div class="shop-reply">

                            <div class="shop-reply-header">

                                <div class="shop-reply-user">

                                    <div class="shop-avatar">
                                        VS
                                    </div>

                                    <div class="shop-reply-info">

                                        <div class="shop-reply-name">
                                            Velvet & Silk
                                        </div>

                                        <div class="shop-label">
                                            Phản hồi từ cửa hàng
                                        </div>

                                    </div>

                                </div>

                                <div class="shop-reply-date">
                                    ${replyDate}
                                </div>

                            </div>

                            <div class="shop-reply-content">
                                ${review.shop_reply}
                            </div>

                        </div>
                    `;

                }


                // ==================================
                // HIỂN THỊ REVIEW
                // ==================================

                reviewList.innerHTML += `
                    <div class="review-item">

                        <div class="review-header">

                            <div class="review-user">

                                <div class="avatar">
                                    ${avatarLetter}
                                </div>

                                <div class="user-info">

                                    <h3>
                                        ${review.customer_name}
                                    </h3>

                                    <div class="review-stars">
                                        ${stars}
                                    </div>

                                </div>

                            </div>

                            <div class="review-date">
                                ${reviewDate}
                            </div>

                        </div>

                        <div class="review-content">
                            ${review.comment}
                        </div>

                        ${shopReplyHTML}

                    </div>
                `;

            });

        })
        .catch(function () {

            show(`Không thể tải đánh giá của sản phẩm!`);

        });

}


// =================================
// KIỂM TRA ĐÃ MUA SẢN PHẨM
// =================================

function checkPurchasedProduct() {

    fetch(`/check-purchased/${id}`)
        .then(function (res) {

            return res.json();

        })
        .then(function (data) {

            const feedback =
                document.querySelector(".feedback");

            if (!feedback) {
                return;
            }

            if (data.purchased) {

                feedback.style.display = "block";

            } else {

                feedback.style.display = "none";

            }

        })
        .catch(function () {

            const feedback =
                document.querySelector(".feedback");

            if (!feedback) {
                return;
            }

            feedback.style.display = "none";

        });

}



// =================================
// THÊM ĐÁNH GIÁ
// =================================

const btn =
    document.querySelector(".btn-submit");


btn.addEventListener(
    "click",
    function () {

        // Lấy thông tin người dùng

        fetch("/get-user")

            .then(function (res) {

                return res.json();

            })

            .then(function (user) {

                // Kiểm tra đăng nhập

                if (!user.user) {

                    show(
                        `Bạn vui lòng đăng nhập để đánh giá sản phẩm!`
                    );

                    return;

                }


                // Lấy thông tin đánh giá

                const customer_name =
                    user.user.fullname;

                const product_id =
                    id;

                const product_name =
                    document.querySelector(
                        ".product-name"
                    ).innerText;

                const comment =
                    document.querySelector(
                        ".review-input"
                    ).value;

                const rating =
                    document.querySelector(
                        "#star-rating"
                    ).value;


                // Kiểm tra nhập đầy đủ

                if (
                    comment.trim() === "" ||
                    rating === "0"
                ) {

                    show(
                        `Vui lòng nhập đầy đủ thông tin đánh giá!`
                    );

                    return;

                }


                // =================================
                // THÔNG BÁO ĐANG GỬI
                // =================================

                show(
                    `Đang gửi đánh giá ${product_name}...`
                );


                // Gửi đánh giá

                fetch(
                    "/addreview",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            customer_name:
                                customer_name,

                            product_id:
                                product_id,

                            product_name:
                                product_name,

                            comment:
                                comment,

                            rating:
                                rating

                        })

                    }
                )

                    .then(function (res) {

                        return res.text();

                    })

                    .then(function (data) {

                        if (data === "ok") {

                            show(
                                `Cảm ơn bạn đã đánh giá ${product_name}!`
                            );


                            // Xóa nội dung bình luận

                            document.querySelector(
                                ".review-input"
                            ).value = "";


                            // Đặt lại số sao

                            document.querySelector(
                                "#star-rating"
                            ).value = "5";


                            // Hiển thị lại đánh giá

                            loadReviews();

                        } else {

                            show(
                                `Đã xảy ra lỗi, vui lòng thử lại sau!`
                            );

                        }

                    })

                    .catch(function () {

                        show(
                            `Không thể gửi đánh giá ${product_name}!`
                        );

                    });

            })

            .catch(function () {

                show(
                    `Không thể kiểm tra trạng thái đăng nhập!`
                );

            });

    }
);


function loadSuggestedProducts() {

    fetch("/products/random")
        .then(function (res) {

            if (!res.ok) {
                return res.text().then(function (data) {
                    return Promise.reject(data);
                });
            }

            return res.json();

        })
        .then(function (products) {

            const list =
                document.querySelector("#suggestedList");

            if (!list) {
                return;
            }

            list.innerHTML = "";

            products
                .filter(function (item) {

                    return item.product_id != id;

                })
                .slice(0, 6)
                .forEach(function (item) {

                    const price =
                        Number(
                            String(item.price)
                                .replace(/[^\d]/g, "")
                        ).toLocaleString("vi-VN") + "đ";


                    let oldPrice = "";

                    if (item.price_old) {

                        oldPrice =
                            Number(
                                String(item.price_old)
                                    .replace(/[^\d]/g, "")
                            ).toLocaleString("vi-VN") + "đ";

                    }


                    let discount = "";

                    if (
                        item.discount_percent &&
                        item.discount_percent > 0
                    ) {

                        discount = `
                            <span class="discount">
                                -${item.discount_percent}%
                            </span>
                        `;

                    }


                    list.innerHTML += `

                        <div class="product-item3 ${
                            item.discount_percent > 0 ? "has-discount" : ""
                        }"
                        data-product-id="${item.product_id}">

                            <a href="motasanpham.html?id=${item.product_id}">

                                <div class="product-image">

                                    <div class="sale-image">

                                        <img 
                                            src="images/${item.image}"
                                            alt="${item.product_name}"
                                        >

                                        ${
                                            item.discount_percent > 0
                                                ? `
                                                    <span class="sale-tag">
                                                        -${item.discount_percent}%
                                                    </span>
                                                `
                                                : ""
                                        }

                                    </div>

                                </div>

                                <div class="content">

                                    <h3>${item.product_name}</h3>

                                    <div class="money">

                                        <p class="prices">
                                            ${price}
                                        </p>

                                        ${
                                            Number(item.price_old) > Number(item.price)
                                                ? `
                                                    <p class="price">
                                                        ${oldPrice}
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
                                                Number(item.stock_quantity) > 0
                                                    ? `Còn ${item.stock_quantity} sản phẩm`
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

                            <button 
                                type="button"
                                class="add-to-cart">

                                THÊM VÀO GIỎ

                            </button>

                            <button 
                                type="button"
                                class="buy-now">

                                MUA NGAY

                            </button>

                        </div>

                    `;

                });

        });
}


// =================================
// HIỂN THỊ ĐÁNH GIÁ KHI MỞ TRANG
// =================================

loadReviews();
checkPurchasedProduct();
loadSuggestedProducts();


