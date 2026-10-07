
let allReviews = [];


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
// LẤY TẤT CẢ ĐÁNH GIÁ
// ========================================

fetch("/getallreview")
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

        const reviewlist =
            document.querySelector(".review-list");

        if (!reviewlist) {
            return;
        }

        allReviews = data;

        displayReviews(allReviews);

    });


// ========================================
// HIỂN THỊ DANH SÁCH ĐÁNH GIÁ
// ========================================

function displayReviews(reviews) {

    const reviewlist =
        document.querySelector(".review-list");

    if (!reviewlist) {
        return;
    }

    reviewlist.innerHTML = "";

    if (reviews.length === 0) {

        reviewlist.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    style="text-align: center;"
                >

                    Không tìm thấy đánh giá và bình luận nào

                </td>

            </tr>

        `;

        return;
    }

    reviews.forEach(function (review) {

        reviewlist.innerHTML += `

            <tr>

                <td>
                    ${review.id}
                </td>

                <td>
                    ${review.customer_name || ""}
                </td>

                <td>
                    ${review.product_name || ""}
                </td>

                <td>
                    ${"⭐".repeat(
                        Number(review.rating) || 0
                    )}
                </td>

                <td>
                    ${review.comment || ""}
                </td>

                <td>
                    ${
                        review.created_at
                            ? review.created_at
                                .replace("T", " ")
                                .slice(0, 16)
                            : ""
                    }
                </td>

                <td>
                    ${review.shop_reply || ""}
                </td>

                <td>

                    <p class="reply-btn ${
                        review.shop_reply
                            ? "replied"
                            : "not-replied"
                    }">

                        ${
                            review.shop_reply
                                ? "Đã phản hồi"
                                : "Chưa phản hồi"
                        }

                    </p>

                </td>

                <td>

                    ${
                        review.reply_at
                            ? review.reply_at
                                .replace("T", " ")
                                .slice(0, 16)
                            : "Chưa phản hồi"
                    }

                </td>

                <td>

                    <div class="dg-bl">

                        <button class="fix-reply">

                            <i class="fa-solid fa-wrench"></i>

                            Sửa

                        </button>

                        <button class="reply">

                            <i class="fa-solid fa-reply"></i>

                            Phản hồi

                        </button>

                        <button
                            class="delete-btn"
                            data-id="${review.id}"
                        >

                            <i class="fa-solid fa-trash"></i>

                            Xóa

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


// ========================================
// NÚT PHẢN HỒI + XÓA
// ========================================

document.addEventListener(
    "click",
    function (e) {

        // ========================================
        // NÚT PHẢN HỒI
        // ========================================

        if (e.target.closest(".reply")) {

            const row =
                e.target.closest("tr");

            const id =
                row.children[0].innerText;

            const comment =
                row.children[4].innerText;

            document.getElementById(
                "customerComment"
            ).innerText = comment;

            document.getElementById(
                "shopReplyInput"
            ).value = "";

            document.getElementById(
                "replyModal"
            ).dataset.reviewId = id;

            document.getElementById(
                "replyModal"
            ).dataset.mode = "reply";

            document.getElementById(
                "replyModalTitle"
            ).innerText =
                "PHẢN HỒI ĐÁNH GIÁ";

            document.getElementById(
                "sendReplyBtn"
            ).innerText =
                "Gửi phản hồi";

            document.getElementById(
                "replyModal"
            ).style.display =
                "block";
        }


        // ========================================
        // NÚT XÓA
        // ========================================

        if (
            e.target.closest(".delete-btn")
        ) {

            const row =
                e.target.closest("tr");

            const id =
                row.children[0].innerText;

            const check =
                confirm(
                    `Bạn có chắc muốn xóa đánh giá "${id}" này không?`
                );

            if (!check) {
                return;
            }

            fetch(
                "/deletereview",
                {

                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        id: id
                    })

                }
            )

                .then(function (res) {

                    if (
                        res.status === 401 ||
                        res.status === 403
                    ) {

                        window.location.href =
                            "../index.html";

                        return null;
                    }

                    return res.text();

                })

                .then(function (data) {

                    if (!data) {
                        return;
                    }

                    if (data === "ok") {

                        show(
                            `Xóa đánh giá "${id}" thành công!`
                        );

                        row.remove();

                        allReviews =
                            allReviews.filter(
                                function (review) {

                                    return String(
                                        review.id
                                    ) !== String(id);

                                }
                            );

                        const reviewlist =
                            document.querySelector(
                                ".review-list"
                            );

                        if (
                            reviewlist &&
                            allReviews.length === 0
                        ) {

                            displayReviews([]);

                        }

                    } else {

                        show(
                            `Xóa đánh giá "${id}" thất bại!`
                        );

                    }

                });

        }

    }
);


// ========================================
// ĐÓNG MODAL
// ========================================

document.querySelector(
    ".close-modal"
).addEventListener(
    "click",
    function () {

        document.getElementById(
            "replyModal"
        ).style.display =
            "none";

    }
);


// ========================================
// NÚT PHẢN HỒI / LƯU THAY ĐỔI
// ========================================

document.getElementById(
    "sendReplyBtn"
).addEventListener(
    "click",
    function () {

        const modal =
            document.getElementById(
                "replyModal"
            );

        const id =
            modal.dataset.reviewId;

        const mode =
            modal.dataset.mode || "reply";

        const shop_reply =
            document.getElementById(
                "shopReplyInput"
            ).value.trim();


        // ========================================
        // KIỂM TRA NỘI DUNG
        // ========================================

        if (!shop_reply) {

            show(
                `Vui lòng nhập nội dung phản hồi!`
            );

            return;
        }


        // ========================================
        // GỬI PHẢN HỒI
        // ========================================

        fetch(
            "/fixReplyReview",
            {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    id: id,

                    shop_reply: shop_reply

                })

            }
        )

            .then(function (res) {

                if (
                    res.status === 401 ||
                    res.status === 403
                ) {

                    window.location.href =
                        "../index.html";

                    return null;
                }

                return res.text();

            })

            .then(function (data) {

                if (!data) {
                    return;
                }


                // ========================================
                // PHẢN HỒI / SỬA THÀNH CÔNG
                // ========================================

                if (data === "ok") {

                    if (mode === "edit") {

                        show(
                            `Đã sửa phản hồi "${id}" thành công!`
                        );

                    } else {

                        show(
                            `Phản hồi "${id}" thành công!`
                        );

                    }


                    // ĐÓNG MODAL

                    modal.style.display =
                        "none";


                    // ========================================
                    // CẬP NHẬT DỮ LIỆU
                    // KHÔNG RELOAD TRANG
                    // ========================================

                    allReviews =
                        allReviews.map(
                            function (review) {

                                if (
                                    String(review.id) ===
                                    String(id)
                                ) {

                                    review.shop_reply =
                                        shop_reply;

                                    review.reply_at =
                                        new Date()
                                            .toISOString();

                                }

                                return review;

                            }
                        );


                    // ========================================
                    // HIỂN THỊ LẠI BẢNG
                    // ========================================

                    displayReviews(
                        allReviews
                    );

                }


                // ========================================
                // PHẢN HỒI / SỬA THẤT BẠI
                // ========================================

                else {

                    if (mode === "edit") {

                        show(
                            `Cập nhật phản hồi "${id}" thất bại!`
                        );

                    } else {

                        show(
                            `Phản hồi "${id}" thất bại!`
                        );

                    }

                }

            });

    }
);


// ========================================
// SỬA PHẢN HỒI ADMIN
// ========================================

document.addEventListener(
    "click",
    function (e) {

        if (
            e.target.closest(".fix-reply")
        ) {

            const row =
                e.target.closest("tr");

            const id =
                row.children[0].innerText;

            const shopReply =
                row.children[6].innerText;

            const comment =
                row.children[4].innerText;


            document.getElementById(
                "customerComment"
            ).innerText =
                comment;


            document.getElementById(
                "shopReplyInput"
            ).value =
                shopReply;


            document.getElementById(
                "replyModal"
            ).dataset.reviewId =
                id;


            document.getElementById(
                "replyModal"
            ).dataset.mode =
                "edit";


            document.getElementById(
                "replyModalTitle"
            ).innerText =
                "SỬA PHẢN HỒI";


            document.getElementById(
                "sendReplyBtn"
            ).innerText =
                "Lưu thay đổi";


            document.getElementById(
                "replyModal"
            ).style.display =
                "block";

        }

    }
);


// ========================================
// TÌM KIẾM + LỌC ĐÁNH GIÁ
// CHỈ TÌM KHI ẤN NÚT TÌM KIẾM
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
        // OPTION LỌC SỐ SAO
        // ========================================

        filterSelect.innerHTML = `

            <option value="">
                -- Lọc theo số sao --
            </option>

            <option value="all">
                Tất cả
            </option>

            <option value="5">
                ⭐⭐⭐⭐⭐ 5 sao
            </option>

            <option value="4">
                ⭐⭐⭐⭐ 4 sao
            </option>

            <option value="3">
                ⭐⭐⭐ 3 sao
            </option>

            <option value="2">
                ⭐⭐ 2 sao
            </option>

            <option value="1">
                ⭐ 1 sao
            </option>

        `;


        // ========================================
        // HÀM TÌM KIẾM + LỌC
        // ========================================

        function filterReviews() {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const selectedRating =
                filterSelect.value;


            const result =
                allReviews.filter(
                    function (review) {

                        const id =
                            String(
                                review.id ?? ""
                            ).toLowerCase();

                        const customerName =
                            String(
                                review.customer_name ?? ""
                            ).toLowerCase();

                        const productName =
                            String(
                                review.product_name ?? ""
                            ).toLowerCase();

                        const rating =
                            String(
                                review.rating ?? ""
                            ).toLowerCase();

                        const comment =
                            String(
                                review.comment ?? ""
                            ).toLowerCase();

                        const createdAt =
                            String(
                                review.created_at ?? ""
                            ).toLowerCase();

                        const shopReply =
                            String(
                                review.shop_reply ?? ""
                            ).toLowerCase();

                        const replyAt =
                            String(
                                review.reply_at ?? ""
                            ).toLowerCase();


                        const matchSearch =

                            id.includes(keyword) ||

                            customerName.includes(keyword) ||

                            productName.includes(keyword) ||

                            rating.includes(keyword) ||

                            comment.includes(keyword) ||

                            createdAt.includes(keyword) ||

                            shopReply.includes(keyword) ||

                            replyAt.includes(keyword);


                        let matchRating = true;


                        if (
                            selectedRating !== "" &&
                            selectedRating !== "all"
                        ) {

                            matchRating =
                                String(
                                    review.rating
                                ) === selectedRating;

                        }


                        return (
                            matchSearch &&
                            matchRating
                        );

                    }
                );


            displayReviews(result);


            // ========================================
            // THÔNG BÁO KẾT QUẢ
            // CHỈ HIỆN KHI ĐÃ ẤN TÌM KIẾM
            // ========================================

            if (result.length === 0) {

                show(
                    `Không tìm thấy đánh giá phù hợp!`
                );

            } else {

                show(
                    `Tìm thấy ${result.length} đánh giá phù hợp!`
                );

            }

        }


        // ========================================
        // NÚT TÌM KIẾM
        // ========================================

        searchBtn.addEventListener(
            "click",
            function () {

                filterReviews();

            }
        );


        // ========================================
        // ENTER ĐỂ TÌM KIẾM
        // ========================================

        searchInput.addEventListener(
            "keydown",
            function (e) {

                if (e.key === "Enter") {

                    filterReviews();

                }

            }
        );


        // ========================================
        // CHỌN SỐ SAO
        // KHÔNG TỰ ĐỘNG TÌM
        // ========================================

        filterSelect.addEventListener(
            "change",
            function () {

                // Chỉ chọn bộ lọc.
                // Muốn lọc phải ấn Tìm kiếm.

            }
        );


        // ========================================
        // RESET
        // ========================================

        resetBtn.addEventListener(
            "click",
            function () {

                searchInput.value = "";

                filterSelect.value = "";

                displayReviews(
                    allReviews
                );

                show(
                    `Đã đặt lại tìm kiếm và bộ lọc!`
                );

            }
        );

    }
);

