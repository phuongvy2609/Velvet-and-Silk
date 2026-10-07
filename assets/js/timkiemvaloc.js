// ========================================
// LOAD FORM TÌM KIẾM + LỌC
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const searchFilter = document.getElementById("searchFilter");

    if (!searchFilter) {
        return;
    }

    fetch("timkiemvaloc.html")
        .then(res => res.text())
        .then(html => {

            searchFilter.innerHTML = html;

            // Báo cho phần tìm kiếm + lọc
            // biết form đã được load
            document.dispatchEvent(
                new CustomEvent("searchFilterLoaded")
            );

        });

});