// ========================================
// HIỂN THỊ THÔNG BÁO
// ========================================

function show(message) {

    const notice =
        document.querySelector(".notice");

    if (!notice) {
        return;
    }

    notice.textContent =
        `${message}`;

    notice.style.display =
        "block";

    clearTimeout(
        window.noticeTimer
    );

    window.noticeTimer =
        setTimeout(function () {

            notice.style.display =
                "none";

        }, 3000);
}


// ========================================
// ĐĂNG XUẤT ADMIN
// ========================================

document.addEventListener("click", function(e) {

    const logoutBtn =
        e.target.closest("#adminLogoutBtn");

    if (!logoutBtn) {
        return;
    }

    e.preventDefault();

    const check =
        confirm("Bạn có chắc muốn đăng xuất không?");

    if (!check) {
        return;
    }

    fetch("/logout-admin", {
        method: "POST"
    })

    .then(function(res) {
        return res.text();
    })

    .then(function(data) {

        if (data === "ok") {

            show(
                "Đăng xuất Admin thành công!"
            );

            setTimeout(function() {

                window.location.href =
                    "../dangnhap.html";

            }, 1000);
        }
    });
});