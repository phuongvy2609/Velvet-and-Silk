const form = document.querySelector("form");

form.addEventListener("submit", function(e) {

    e.preventDefault();


    const email =
        document.querySelector("#email").value;


    const password =
        document.querySelector("#password").value;


    fetch("/dangnhap", {

        method: "POST",

        headers: {
            "Content-Type":
                "application/json"
        },

        body: JSON.stringify({

            email: email,

            password: password

        })

    })


    .then(function(res) {

        return res.text();

    })


    .then(function(data) {


        // ========================================
        // ĐĂNG NHẬP ADMIN
        // ========================================

        if (data === "admin") {

            show(
                `Đăng nhập Admin thành công!`
            );


            setTimeout(function() {

                window.location.href =
                    "../admin/dashboard.html";

            }, 1500);


        }


        // ========================================
        // ĐĂNG NHẬP USER
        // ========================================

        else if (data === "user") {

            show(
                `Đăng nhập User thành công!`
            );


            setTimeout(function() {

                window.location.href =
                    "../index.html";

            }, 1500);


        }


        // ========================================
        // ĐĂNG NHẬP THẤT BẠI
        // ========================================

        else {

            alert(data);

        }

    });

});

const togglePassword = document.querySelector(".togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function() {

    if (password.type === "password") {

        password.type = "text";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    } else {

        password.type = "password";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});