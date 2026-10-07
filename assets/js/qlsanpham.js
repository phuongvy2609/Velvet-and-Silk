let allProducts = [];


// ========================================
// HIỂN THỊ THÔNG BÁO
// ========================================

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


// ========================================
// ĐỊNH DẠNG GIÁ
// ========================================

function formatPrice(price) {

    if (price === null || price === undefined || price === "") {
        return "";
    }

    let value = String(price);

    value = value.replace(/[^\d]/g, "");

    if (value === "") {
        return "";
    }

    return Number(value).toLocaleString("vi-VN") + "đ";
}



function calculateDiscount(price, priceOld) {

    if (!price || !priceOld) {
        return "";
    }

    const currentPrice = Number(
        String(price).replace(/[^\d]/g, "")
    );

    const oldPrice = Number(
        String(priceOld).replace(/[^\d]/g, "")
    );

    if (
        !currentPrice ||
        !oldPrice ||
        oldPrice <= currentPrice
    ) {
        return "";
    }

    const discount = Math.round(
        ((oldPrice - currentPrice) / oldPrice) * 100
    );

    return `-${discount}%`;
}



function updateProductDiscount() {

    const priceInput =
        document.getElementById("productPrice");

    const priceOldInput =
        document.getElementById("productPriceOld");

    const discountInput =
        document.getElementById("productDiscount");

    if (
        !priceInput ||
        !priceOldInput ||
        !discountInput
    ) {
        return;
    }

    const price =
        Number(
            priceInput.value.replace(/[^\d]/g, "")
        );

    const priceOld =
        Number(
            priceOldInput.value.replace(/[^\d]/g, "")
        );

    if (
        !price ||
        !priceOld ||
        priceOld <= price
    ) {
        discountInput.value = "";
        return;
    }

    const discount =
        Math.round(
            ((priceOld - price) / priceOld) * 100
        );

    discountInput.value = `${discount}%`;
}




// ========================================
// HIỂN THỊ DANH SÁCH SẢN PHẨM
// ========================================

function displayProducts(products) {

    const productList =
        document.querySelector(".product-list");

    if (!productList) {
        return;
    }

    productList.innerHTML = "";


    // ========================================
    // KHÔNG CÓ KẾT QUẢ
    // ========================================

    if (products.length === 0) {

        productList.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    style="text-align: center;"
                >
                    Không tìm thấy sản phẩm nào
                </td>
            </tr>
        `;

        return;
    }


    // ========================================
    // HIỂN THỊ SẢN PHẨM
    // ========================================

    products.forEach(function (product) {

        productList.innerHTML += `

            <tr>

                <td>
                    ${product.product_id}
                </td>

                <td>
                    <img
                        src="../images/${product.image}"
                        alt="Ảnh"
                    >
                </td>

                <td>
                    ${product.product_name || ""}
                </td>

                <td>
                    ${formatPrice(product.price)}
                </td>

                <td>
                    ${formatPrice(product.price_old)}
                </td>

                <td>
                    ${calculateDiscount(product.price, product.price_old)}
                </td>

                <td>
                    ${product.stock_quantity || 0}
                </td>

                <td>
                    ${product.description || ""}
                </td>

                <td>
                    <button
                        type="button"
                        class="edit-btn"
                        data-id="${product.product_id}"
                    >
                        <i class="fa-solid fa-wrench"></i>
                        Sửa
                    </button>
                </td>

                <td>
                    <button
                        type="button"
                        class="delete-btn"
                        data-id="${product.product_id}"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Xóa
                    </button>
                </td>

            </tr>

        `;

    });

}


// ========================================
// LẤY TẤT CẢ SẢN PHẨM
// ========================================

fetch('/getproducts')

    .then(function (res) {

        if (
            res.status === 401 ||
            res.status === 403
        ) {

            window.location.href =
                "../index.html";

            return null;
        }

        return res.json();

    })

    .then(function (data) {

        if (!data) {
            return;
        }

        // Lưu toàn bộ sản phẩm
        allProducts = data;

        // Hiển thị toàn bộ sản phẩm khi vừa mở trang
        displayProducts(allProducts);
    });


// ========================================
// XÓA SẢN PHẨM
// ========================================

document.addEventListener(
    "click",
    function (e) {

        const deleteBtn =
            e.target.closest(".delete-btn");

        if (!deleteBtn) {
            return;
        }

        const product_id =
            deleteBtn.dataset.id;

        const confirmDelete =
            confirm(
                "Bạn có chắc muốn xóa sản phẩm không?"
            );

        if (!confirmDelete) {

            return;
        }


        fetch(
            "/deleteproduct",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    id: product_id
                })
            }
        )

            .then(function (res) {
                return res.text();
            })

            .then(function (result) {

                if (result === "ok") {

                    show(
                        `Xóa sản phẩm ${product_id} thành công!`
                    );

                    setTimeout(function () {

                        location.reload();

                    }, 1000);

                } else {

                    show(
                        `Xóa sản phẩm ${product_id} thất bại!`
                    );

                }

            });

    }
);


// ========================================
// SỬA SẢN PHẨM
// ========================================

document.addEventListener(
    "click",
    function (e) {

        const editBtn =
            e.target.closest(".edit-btn");

        if (!editBtn) {
            return;
        }

        const id =
            editBtn.dataset.id;


        fetch(`/products/${id}`)

            .then(function (res) {
                return res.json();
            })

            .then(function (product) {

                const addProductOverlay =
                    document.getElementById(
                        "addProductOverlay"
                    );

                const addProductForm =
                    document.getElementById(
                        "addProductForm"
                    );


                // Hiển thị form
                addProductOverlay.style.display =
                    "flex";

                addProductForm.style.display =
                    "block";


                // Đổi tiêu đề
                document.getElementById(
                    "formTitle"
                ).textContent =
                    "SỬA SẢN PHẨM";


                // Điền dữ liệu
                document.getElementById(
                    "editProductId"
                ).value =
                    product.product_id;

                document.getElementById(
                    "productName"
                ).value =
                    product.product_name;

                document.getElementById(
                    "productPrice"
                ).value =
                    product.price;

                document.getElementById(
                    "productPriceOld"
                ).value =
                    product.price_old || "";

                document.getElementById(
                    "productDiscount"
                ).value = "";

                updateProductDiscount();

                document.getElementById(
                    "productStock"
                ).value = 
                    product.stock_quantity || 0;

                document.getElementById(
                    "productDescription"
                ).value =
                    product.description;

                document.getElementById(
                    "productCategory"
                ).value =
                    product.category || "";


                // Hiển thị ảnh cũ
                const imagePreview =
                    document.getElementById(
                        "imagePreview"
                    );

                imagePreview.src =
                    `../images/${product.image}`;

                imagePreview.style.display =
                    "block";

            });

    }
);


// ========================================
// THÊM SẢN PHẨM
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const addProductBtn =
            document.getElementById(
                "addProductBtn"
            );

        const addProductForm =
            document.getElementById(
                "addProductForm"
            );

        const cancelProductBtn =
            document.getElementById(
                "cancelProductBtn"
            );

        const saveProductBtn =
            document.getElementById(
                "saveProductBtn"
            );

        const productImage =
            document.getElementById(
                "productImage"
            );

        const productPrice =
            document.getElementById(
                "productPrice"
            );

        const productPriceOld =
            document.getElementById(
                "productPriceOld"
            );

        const productDiscount =
            document.getElementById(
                "productDiscount"
            );

        const imagePreview =
            document.getElementById(
                "imagePreview"
            );

        const formTitle =
            document.getElementById(
                "formTitle"
            );

        const editProductId =
            document.getElementById(
                "editProductId"
            );

        const addProductOverlay =
            document.getElementById(
                "addProductOverlay"
            );


        // Ban đầu ẩn form
        addProductForm.style.display =
            "none";


        // ========================================
        // NÚT THÊM SẢN PHẨM
        // ========================================

        addProductBtn.addEventListener(
            "click",
            function () {

                formTitle.textContent =
                    "THÊM SẢN PHẨM";

                editProductId.value = "";

                document.getElementById(
                    "productName"
                ).value = "";

                document.getElementById(
                    "productPrice"
                ).value = "";

                document.getElementById(
                    "productPriceOld"
                ).value = "";

                document.getElementById(
                    "productDiscount"
                ).value = "";

                document.getElementById(
                    "productStock"
                ).value = "";

                document.getElementById(
                    "productDescription"
                ).value = "";

                document.getElementById(
                    "productCategory"
                ).value = "";

                productImage.value = "";

                imagePreview.src = "";

                imagePreview.style.display =
                    "none";


                // Hiện form
                addProductOverlay.style.display =
                    "flex";

                addProductForm.style.display =
                    "block";

            }
        );


        // ========================================
        // NÚT HỦY
        // ========================================

        cancelProductBtn.addEventListener(
            "click",
            function () {

                addProductOverlay.style.display =
                    "none";

                addProductForm.style.display =
                    "none";


                show(
                    `Đã hủy thao tác!`
                );

            }
        );


        // ========================================
        // CHỌN HÌNH ẢNH
        // ========================================

        productImage.addEventListener(
            "change",
            function () {

                const file =
                    this.files[0];

                if (file) {

                    imagePreview.src =
                        URL.createObjectURL(file);

                    imagePreview.style.display =
                        "block";


                    show(
                        `Đã chọn hình ảnh ${file.name}!`
                    );

                } else {

                    imagePreview.src = "";

                    imagePreview.style.display =
                        "none";

                }

            }
        );

        productPrice.addEventListener(
            "input",
            function () {
                updateProductDiscount();
            }
        );

        productPriceOld.addEventListener(
            "input",
            function () {
                updateProductDiscount();
            }
        );

        // ========================================
        // NÚT LƯU
        // ========================================

        saveProductBtn.addEventListener(
            "click",
            function () {

                const product_name =
                    document.getElementById(
                        "productName"
                    ).value.trim();

                const price =
                    document.getElementById(
                        "productPrice"
                    ).value.trim();

                const price_old =
                    document.getElementById(
                        "productPriceOld"
                    ).value.trim();

                const discount =
                    document.getElementById(
                        "productDiscount"
                    ).value.trim();

                const stock_quantity =
                    document.getElementById(
                        "productStock"
                    ).value;
                    
                const imageFile =
                    productImage.files[0];

                const description =
                    document.getElementById(
                        "productDescription"
                    ).value.trim();

                const category =
                    document.getElementById(
                        "productCategory"
                    ).value;

                const id =
                    editProductId.value;


                // ========================================
                // KIỂM TRA DỮ LIỆU
                // ========================================

                if (
                    !product_name ||
                    !price ||
                    !description ||
                    !category
                ) {

                    show(
                        `Vui lòng nhập đầy đủ thông tin!`
                    );

                    return;
                }


                // ========================================
                // TẠO FORMDATA
                // ========================================

                const formData =
                    new FormData();

                formData.append(
                    "product_name",
                    product_name
                );

                formData.append(
                    "price",
                    price
                );

                formData.append(
                    "price_old",
                    price_old
                );

                formData.append(
                    "discount",
                    discount
                );
                
                formData.append(
                    "stock_quantity",
                    stock_quantity
                )

                formData.append(
                    "description",
                    description
                );

                formData.append(
                    "category",
                    category
                );


                // Có ảnh mới
                if (imageFile) {

                    formData.append(
                        "image",
                        imageFile
                    );

                }


                // ========================================
                // XÁC ĐỊNH THÊM HAY SỬA
                // ========================================

                let url;


                if (id) {

                    // Sửa
                    url =
                        `/updateproduct/${id}`;

                } else {

                    // Thêm
                    if (!imageFile) {

                        show(
                            `Vui lòng chọn hình ảnh!`
                        );

                        return;
                    }

                    url =
                        "/addproduct";

                }


                // ========================================
                // GỬI DỮ LIỆU
                // ========================================
                fetch(
                    url,
                    {
                        method: "POST",
                        body: formData
                    }
                )

                    .then(function (res) {
                        return res.text();
                    })

                    .then(function (result) {

                        if (result === "ok") {

                            if (id) {

                                show(
                                    `Sửa sản phẩm ${id} thành công!`
                                );

                            } else {

                                show(
                                    `Thêm sản phẩm "${product_name}" thành công!`
                                );

                            }

                            setTimeout(function () {

                                location.reload();

                            }, 1000);

                        } else {

                            show(
                                `Thao tác thất bại: ${result}`
                            );

                        }

                    });

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

        fetch("timkiemvaloc.html")

            .then(function (res) {
                return res.text();
            })

            .then(function (html) {

                searchFilter.innerHTML =
                    html;

                document.dispatchEvent(
                    new CustomEvent(
                        "searchFilterLoaded"
                    )
                );

            });

    }
);


// ========================================
// TÌM KIẾM + LỌC SẢN PHẨM
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
        // TẠO BỘ LỌC GIÁ
        // ========================================

        filterSelect.innerHTML = `
            <option value="">
            -- Lọc trạng thái--
            </option>

            <option value="">
                Tất cả
            </option>

            <option value="0-100000">
                Dưới 100.000đ
            </option>

            <option value="100000-300000">
                100.000đ - 300.000đ
            </option>

            <option value="300000-500000">
                300.000đ - 500.000đ
            </option>

            <option value="500000-1000000">
                500.000đ - 1.000.000đ
            </option>

            <option value="1000000-max">
                Trên 1.000.000đ
            </option>

        `;


        // ========================================
        // HÀM TÌM KIẾM + LỌC
        // ========================================

        function filterProducts() {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const filterValue =
                filterSelect.value;


            // ========================================
            // LỌC TỪ DANH SÁCH GỐC
            // ========================================

            const result =
                allProducts.filter(
                    function (product) {

                        // ========================================
                        // TÌM KIẾM TẤT CẢ THÔNG TIN
                        // ========================================

                        const allInfo =
                            Object.values(product)
                                .map(function (value) {

                                    return String(
                                        value || ""
                                    );

                                })
                                .join(" ")
                                .toLowerCase();


                        const matchSearch =
                            allInfo.includes(
                                keyword
                            );


                        // ========================================
                        // LẤY GIÁ
                        // ========================================

                        let price =
                            String(
                                product.price || ""
                            );

                        price =
                            price.replace(
                                /[^\d]/g,
                                ""
                            );

                        price =
                            Number(price) || 0;


                        // ========================================
                        // LỌC GIÁ
                        // ========================================

                        let matchPrice = true;


                        if (
                            filterValue === ""
                        ) {

                            matchPrice = true;

                        }

                        else if (
                            filterValue ===
                            "0-100000"
                        ) {

                            matchPrice =
                                price < 100000;

                        }

                        else if (
                            filterValue ===
                            "100000-300000"
                        ) {

                            matchPrice =
                                price >= 100000 &&
                                price < 300000;

                        }

                        else if (
                            filterValue ===
                            "300000-500000"
                        ) {

                            matchPrice =
                                price >= 300000 &&
                                price < 500000;

                        }

                        else if (
                            filterValue ===
                            "500000-1000000"
                        ) {

                            matchPrice =
                                price >= 500000 &&
                                price <= 1000000;

                        }

                        else if (
                            filterValue ===
                            "1000000-max"
                        ) {

                            matchPrice =
                                price > 1000000;

                        }


                        // ========================================
                        // PHẢI ĐÚNG CẢ 2
                        // ========================================

                        return (
                            matchSearch &&
                            matchPrice
                        );

                    }
                );


            // ========================================
            // HIỂN THỊ KẾT QUẢ
            // ========================================

            displayProducts(result);


            // ========================================
            // THÔNG BÁO KẾT QUẢ
            // ========================================

            if (result.length === 0) {

                show(
                    `Không tìm thấy sản phẩm phù hợp!`
                );

            } else {

                show(
                    `Tìm thấy ${result.length} sản phẩm!`
                );

            }

        }


        // ========================================
        // NÚT TÌM KIẾM
        // CHỈ BẤM NÚT MỚI HIỂN THỊ KẾT QUẢ
        // ========================================

        searchBtn.addEventListener(
            "click",
            function () {

                filterProducts();

            }
        );


        // ========================================
        // NHẤN ENTER
        // ========================================

        searchInput.addEventListener(
            "keydown",
            function (e) {

                if (e.key === "Enter") {

                    filterProducts();

                }

            }
        );


        // ========================================
        // CHỌN BỘ LỌC
        // KHÔNG TỰ TÌM KIẾM
        // ========================================

        filterSelect.addEventListener(
            "change",
            function () {

                // Không làm gì ở đây
                // Muốn lọc phải bấm Tìm kiếm

            }
        );


        // ========================================
        // NÚT ĐẶT LẠI
        // ========================================

        resetBtn.addEventListener(
            "click",
            function () {

                searchInput.value = "";

                filterSelect.value = "";


                // Hiển thị lại toàn bộ sản phẩm
                displayProducts(
                    allProducts
                );


                show(
                    `Đã đặt lại tìm kiếm và bộ lọc!`
                );

            }
        );

    }
);