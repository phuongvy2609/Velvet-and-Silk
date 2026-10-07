// ========================================
// HIỂN THỊ SAO ĐÁNH GIÁ + SỐ LƯỢNG SẢN PHẨM
// ========================================

function loadProductRatings() {

    const products =
        document.querySelectorAll(".product-item, .product-item2");

    fetch("/getproducts")
        .then(function (res) {
            return res.json();
        })
        .then(function (productData) {

            products.forEach(function (product) {

                const productId =
                    product.dataset.productId;

                const rating =
                    product.querySelector(".rating");

                if (!productId || !rating) {
                    return;
                }

                // ========================================
                // HIỂN THỊ SỐ LƯỢNG TỒN KHO
                // ========================================

                const productInfo =
                    productData.find(function (item) {

                        return String(item.product_id) ===
                            String(productId);

                    });

                if (productInfo) {

                let ratingStock = 
                    product.querySelector(".rating-stock");

                if (!ratingStock) {

                    ratingStock = 
                        document.createElement("div");

                    ratingStock.className = 
                        "rating-stock";

                    rating.parentNode.insertBefore(
                        ratingStock,
                        rating
                    );

                    ratingStock.appendChild(
                        rating
                    );

                }

                let stockElement = 
                    product.querySelector(".stock-quantity");

                if (!stockElement) {

                    stockElement = 
                        document.createElement("div");

                    stockElement.className = 
                        "stock-quantity";

                    ratingStock.appendChild(
                        stockElement
                    );

                }

                if (Number(productInfo.stock_quantity) > 0) {

                    stockElement.textContent =
                        "Còn " +
                        productInfo.stock_quantity +
                        " sản phẩm";

                } else {

                    stockElement.textContent =
                        "";

                }


                // ========================================
                // TAG HẾT HÀNG
                // ========================================

                if (Number(productInfo.stock_quantity) === 0) {

                    let outOfStockTag =
                        product.querySelector(".out-of-stock-tag");

                    if (!outOfStockTag) {

                        outOfStockTag =
                            document.createElement("div");

                        outOfStockTag.className =
                            "out-of-stock-tag";

                        outOfStockTag.textContent =
                            "HẾT HÀNG";

                        const productImage = product.querySelector(".product-image");

                        if (productImage) {
                            productImage.appendChild(outOfStockTag);
                        }

                    }

                }

            }


                // ========================================
                // LẤY ĐÁNH GIÁ
                // ========================================

                fetch(`/reviews/${productId}`)
                    .then(function (res) {
                        return res.json();
                    })
                    .then(function (reviews) {

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

                    })
                    .catch(function () {

                        const stars =
                            rating.querySelectorAll("i");

                        stars.forEach(function (star) {

                            star.className =
                                "fa-regular fa-star";

                        });

                    });

            });

        });

}


// ========================================
// CHẠY KHI MỞ TRANG
// ========================================

loadProductRatings();