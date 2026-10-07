
const contactForm = document.querySelector('.contact-form');

const nameInput = document.querySelector('.name');
const emailInput = document.querySelector('.email');


// ========================================
// LẤY TÊN + EMAIL TỪ THÔNG TIN CÁ NHÂN
// ========================================

fetch('/profile')

    .then(res => {

        if (res.status === 401) {

            show(`Vui lòng đăng nhập để liên hệ với shop`);

            window.location.href = '/dangnhap.html';

            return null;
        }

        return res.json();

    })

    .then(data => {

        if (!data) {
            return;
        }


        // TỰ ĐỘNG LẤY TÊN
        if (nameInput) {

            nameInput.value = data.fullname || '';

        }


        // TỰ ĐỘNG LẤY EMAIL
        if (emailInput) {

            emailInput.value = data.email || '';

        }

    })

    .catch(() => {

        show(`Không thể lấy thông tin cá nhân!`);

    });


// ========================================
// GỬI LIÊN HỆ
// ========================================

if (contactForm) {

    contactForm.addEventListener('submit', async (e) => {

        e.preventDefault();


        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const mess =
            document.querySelector('.mess').value.trim();


        // ========================================
        // KIỂM TRA
        // ========================================

        if (name === '' || email === '' || mess === '') {

            show(
                `Không được để trống. Vui lòng nhập đầy đủ thông tin!`
            );

            return;
        }

        // ========================================
        // GỬI LÊN SERVER
        // ========================================

        const res = await fetch('/sendContact', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                name: name,

                email: email,

                mess: mess

            })

        });


        const data = await res.text();


        // ========================================
        // THÀNH CÔNG
        // ========================================

        if (data === 'ok') {

            show(`Đã gửi liên hệ thành công!`);

            // Chỉ xóa lời nhắn
            document.querySelector('.mess').value = '';

        }

        else {

            show(`Gửi liên hệ thất bại!`);

        }

    });

}

