const shipping = document.getElementById("shipping");
const support = document.getElementById("support");
const warranty = document.getElementById("warranty");
const saving = document.getElementById("saving");

function hienThi() {

    // Ẩn tất cả
    shipping.classList.remove("active");
    support.classList.remove("active");
    warranty.classList.remove("active");
    saving.classList.remove("active");

    // Lấy phần hash
    let hash = window.location.hash;

    if (hash === "#shipping") {
        shipping.classList.add("active");
    }

    if (hash === "#support") {
        support.classList.add("active");
    }

    if (hash === "#warranty") {
        warranty.classList.add("active");
    }

    if (hash === "#saving") {
        saving.classList.add("active");
    }

    // Nếu không có hash thì hiện vận chuyển
    if (hash === "") {
        shipping.classList.add("active");
    }
}

// Chạy khi mở trang
hienThi();

// Chạy khi bấm chuyển sang hash khác
window.addEventListener("hashchange", hienThi);