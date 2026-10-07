// ========================================
// HIỆN / ẨN MẬT KHẨU
// ========================================

document
    .querySelectorAll('.togglePassword')
    .forEach(function (eye) {

        eye.onclick = function () {

            const password =
                eye.previousElementSibling;


            if (password.type === "password") {

                password.type = "text";

                eye.classList.replace(
                    "fa-eye",
                    "fa-eye-slash"
                );

            } else {

                password.type = "password";

                eye.classList.replace(
                    "fa-eye-slash",
                    "fa-eye"
                );

            }

        };

    });


// ========================================
// FORM ĐĂNG KÝ
// ========================================

const form =
    document.querySelector(".form");


form.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();


        const fullname =
            document.querySelector(
                '[name="fullname"]'
            ).value;


        const phone =
            document.querySelector(
                '[name="phone"]'
            ).value;


        const email =
            document.querySelector(
                '[name="email"]'
            ).value;


        const password =
            document.querySelector(
                '[name="password"]'
            ).value;


        // ========================================
        // GỬI DỮ LIỆU ĐĂNG KÝ
        // ========================================

        fetch(
            "/dangky",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    fullname: fullname,

                    phone: phone,

                    email: email,

                    password: password

                })

            }
        )


            // ========================================
            // NHẬN KẾT QUẢ
            // ========================================

            .then(function (res) {

                return res.text();

            })


            .then(function (data) {

                // ========================================
                // ĐĂNG KÝ THÀNH CÔNG
                // ========================================

                if (data === "ok") {

                    show(
                        `Đăng ký thành công!`
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "../dangnhap.html";

                        },
                        1500
                    );


                } else {

                    // ========================================
                    // ĐĂNG KÝ THẤT BẠI
                    // ========================================

                    alert(data);

                }

            });

    }
);