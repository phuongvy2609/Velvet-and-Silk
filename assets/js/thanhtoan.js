// ========================================
// CÁC ELEMENT TRANG THANH TOÁN
// ========================================

const circle = document.querySelector('.circlee');
const circle1 = document.querySelector('.circle1');
const circle2 = document.querySelector('.circle2');

const maincontent = document.querySelector('.main-content');
const maincontent1 = document.querySelector('.main-content1');
const maincontent3 = document.querySelector('.main-content3');

const btnnext = document.querySelector('.btn-next');
const btnnextt = document.querySelector('.btn-nextt');
const btnback = document.querySelector('.btn-back');
const btnbackkk = document.querySelector('.btn-backkk');

const tabb = document.querySelector('.tabb');
const tab = document.querySelector('.tab');

const pttt = document.querySelector('.pttt');
const ptttcod = document.querySelector('.pttt-cod');

const donebtn = document.querySelector('.done-btn');


// ========================================
// MẶC ĐỊNH THANH TOÁN COD
// ========================================

if (tab) {

    tab.classList.add('active');

}

if (ptttcod) {

    ptttcod.classList.add('active');

}

if (pttt) {

    pttt.classList.remove('active');

}


// ========================================
// BIẾN TIỀN
// ========================================

let subtotal = 0;
let discount = 0;
let shipping_fee = 0;
let total = 0;

let payment_method = "COD - Thanh toán khi nhận hàng";
let shipping_method = "Giao hàng tiêu chuẩn";


// ========================================
// LẤY GIẢM GIÁ
// ========================================

const params = new URLSearchParams(window.location.search);

const discountFromURL = Number(params.get("discount"));

if (!isNaN(discountFromURL) && discountFromURL >= 0) {

    discount = discountFromURL;

}

else {

    const discountFromSession =
        Number(sessionStorage.getItem("discount"));

    if (
        !isNaN(discountFromSession) &&
        discountFromSession >= 0
    ) {

        discount = discountFromSession;

    }

}


// ========================================
// TÍNH TỔNG
// ========================================

function calculateTotal() {

    const totalBeforeShipping =
        subtotal - discount;


    // ========================================
    // ĐƠN TỪ 2 TRIỆU SAU GIẢM
    // → MIỄN PHÍ SHIP
    // ========================================

    if (totalBeforeShipping >= 2000000) {

        shipping_fee = 0;

    }

    else {

        if (shipping_method === "Giao hàng tiêu chuẩn") {

            shipping_fee = 0;

        }

        else if (shipping_method === "Giao hàng nhanh") {

            shipping_fee = 50000;

        }

        else if (shipping_method === "Giao hàng hỏa tốc") {

            shipping_fee = 150000;

        }

    }


    // ========================================
    // TÍNH TOTAL
    // ========================================

    total =
        subtotal -
        discount +
        shipping_fee;


    if (total < 0) {

        total = 0;

    }


    // ========================================
    // HIỂN THỊ TỔNG
    // ========================================

    document
        .querySelectorAll('.gold-text')
        .forEach(element => {

            element.textContent =
                total.toLocaleString("vi-VN") + "đ";

        });


    document
        .querySelectorAll('.cod-total')
        .forEach(element => {

            element.textContent =
                total.toLocaleString("vi-VN") + "đ";

        });


    document
        .querySelectorAll('.bank-total')
        .forEach(element => {

            element.textContent =
                total.toLocaleString("vi-VN") + " ₫";

        });

    // ========================================
    // CẬP NHẬT MÃ QR THANH TOÁN MB BANK
    // ========================================

    const paymentQR = document.getElementById("paymentQR");

    if (paymentQR && total > 0) {
        const amount = Math.round(total);

        const transferContent = "THANHTOAN VELVET SILK";

        paymentQR.src =
            `https://img.vietqr.io/image/MB-0383577505-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent("NGUYEN NGOC PHUONG VY")}`;
    }



    // ========================================
    // HIỂN THỊ GIẢM GIÁ
    // ========================================

    document
        .querySelectorAll('.discount')
        .forEach(element => {

            element.textContent =
                discount.toLocaleString("vi-VN") + "đ";

        });


    // ========================================
    // HIỂN THỊ TẠM TÍNH
    // ========================================

    document
        .querySelectorAll('.bold')
        .forEach(element => {

            element.textContent =
                subtotal.toLocaleString("vi-VN") + "đ";

        });


    // ========================================
    // HIỂN THỊ PHÍ SHIP
    // ========================================

    document
        .querySelectorAll('.shipping-fee')
        .forEach(element => {

            element.textContent =
                shipping_fee.toLocaleString("vi-VN") + "đ";

        });

}


// ========================================
// BƯỚC 1 → BƯỚC 2
// ========================================

if (btnnext) {

    btnnext.addEventListener('click', (e) => {

        e.preventDefault();


        const ho =
            document.querySelector('#ho').value.trim();

        const ten =
            document.querySelector('#ten').value.trim();

        const email =
            document.querySelector('#email').value.trim();

        const phone =
            document.querySelector('#phone').value.trim();

        const address =
            document.querySelector('#address').value.trim();

        const citySelect =
            document.querySelector('#city');

        const districtSelect =
            document.querySelector('#district');


        const city =
            citySelect.value === ""
                ? ""
                : citySelect.options[citySelect.selectedIndex].text;


        const district =
            districtSelect.value === ""
                ? ""
                : districtSelect.options[districtSelect.selectedIndex].text;


        // ========================================
        // KIỂM TRA
        // ========================================

        if (
            ho === "" ||
            ten === "" ||
            email === "" ||
            phone === "" ||
            address === "" ||
            city === "" ||
            district === ""
        ) {

            show(`Vui lòng nhập đầy đủ thông tin!`);

            return;

        }


        if (maincontent) {

            maincontent.style.display = 'none';

        }


        if (maincontent1) {

            maincontent1.style.display = 'block';

        }


        if (circle) {

            circle.classList.add('active');

        }


        if (circle1) {

            circle1.classList.add('active');

        }

    });

}


// ========================================
// BƯỚC 2 → BƯỚC 1
// ========================================

if (btnback) {

    btnback.addEventListener('click', () => {

        if (maincontent1) {

            maincontent1.style.display = 'none';

        }


        if (maincontent) {

            maincontent.style.display = 'block';

        }


        if (circle1) {

            circle1.classList.remove('active');

        }


        if (circle2) {

            circle2.classList.remove('active');

        }


        if (circle) {

            circle.classList.add('active');

        }


        show(`Đã quay lại bước thông tin giao hàng!`);

    });

}


// ========================================
// BƯỚC 2 → BƯỚC 3
// ========================================

if (btnnextt) {

    btnnextt.addEventListener('click', () => {

        if (maincontent1) {

            maincontent1.style.display = 'none';

        }


        if (maincontent3) {

            maincontent3.style.display = 'block';

        }


        if (circle) {

            circle.classList.add('active');

        }


        if (circle1) {

            circle1.classList.add('active');

        }


        if (circle2) {

            circle2.classList.add('active');

        }


        // ========================================
        // MẶC ĐỊNH HIỆN COD KHI VÀO BƯỚC 3
        // ========================================

        if (tab) {

            tab.classList.add('active');

        }

        if (tabb) {

            tabb.classList.remove('active');

        }

        if (ptttcod) {

            ptttcod.classList.add('active');

        }

        if (pttt) {

            pttt.classList.remove('active');

        }

        payment_method =
            "COD - Thanh toán khi nhận hàng";

    });

}


// ========================================
// BƯỚC 3 → BƯỚC 2
// ========================================

if (btnbackkk) {

    btnbackkk.addEventListener('click', () => {

        if (maincontent3) {

            maincontent3.style.display = 'none';

        }


        if (maincontent1) {

            maincontent1.style.display = 'block';

        }


        if (circle) {

            circle.classList.add('active');

        }


        if (circle1) {

            circle1.classList.add('active');

        }


        if (circle2) {

            circle2.classList.remove('active');

        }


        show(`Đã quay lại bước vận chuyển!`);

    });

}


// ========================================
// THANH TOÁN COD
// ========================================

if (tab) {

    tab.addEventListener('click', () => {

        if (tabb) {

            tabb.classList.remove('active');

        }


        tab.classList.add('active');


        if (ptttcod) {

            ptttcod.classList.add('active');

        }


        if (pttt) {

            pttt.classList.remove('active');

        }


        payment_method =
            "COD - Thanh toán khi nhận hàng";


        show(`Đã chọn Thanh toán khi nhận hàng!`);

    });

}


// ========================================
// THANH TOÁN CHUYỂN KHOẢN
// ========================================

if (tabb) {

    tabb.addEventListener('click', () => {

        if (tab) {

            tab.classList.remove('active');

        }


        tabb.classList.add('active');


        if (ptttcod) {

            ptttcod.classList.remove('active');

        }


        if (pttt) {

            pttt.classList.add('active');

        }


        payment_method =
            "Chuyển khoản - Thanh toán trước khi nhận hàng";


        show(`Đã chọn Thanh toán chuyển khoản!`);

    });

}


// ========================================
// PHƯƠNG THỨC VẬN CHUYỂN
// ========================================

const shippingOptions =
    document.querySelectorAll('input[name="ship"]');


shippingOptions.forEach((radio, index) => {

    radio.addEventListener('change', () => {

        if (index === 0) {

            shipping_method =
                "Giao hàng tiêu chuẩn";

            shipping_fee = 0;

        }

        else if (index === 1) {

            shipping_method =
                "Giao hàng nhanh";

            shipping_fee = 50000;

        }

        else if (index === 2) {

            shipping_method =
                "Giao hàng hỏa tốc";

            shipping_fee = 150000;

        }


        // ========================================
        // MIỄN PHÍ SHIP
        // ========================================

        if (subtotal - discount >= 2000000) {

            shipping_fee = 0;

            show(`Đơn hàng đủ 2 triệu sau giảm giá - Được miễn phí vận chuyển!`);

        }

        else {

            show(`Đã chọn ${shipping_method}!`);

        }


        calculateTotal();

    });

});


// ========================================
// HIỂN THỊ SẢN PHẨM
// ========================================

function renderProduct(product) {

    const price =
        Number(product.price) || 0;


    const quantity =
        Number(product.quantity) || 1;


    const itemTotal =
        price * quantity;


    document
        .querySelectorAll('.product-list')
        .forEach(list => {

            list.innerHTML = `

                <div class="product-item">

                    <div class="img-box">

                        <img
                            src="${product.image}"
                            alt="${product.product_name}"
                        >

                        <span class="qty">
                            ${quantity}
                        </span>

                    </div>


                    <div class="info">

                        <h4>
                            ${product.product_name}
                        </h4>


                        <p>
                            Size: ${product.size || ""}
                        </p>


                        <p>
                            Số lượng: ${quantity}
                        </p>

                    </div>


                    <div class="price">

                        ${itemTotal.toLocaleString("vi-VN")}đ

                    </div>

                </div>

            `;

        });

}


// ========================================
// LẤY GIỎ HÀNG
// ========================================

async function loadCart() {

    const response =
        await fetch("/get-cart");


    if (!response.ok) {

        show(`Không lấy được giỏ hàng!`);

        return;

    }


    const products =
        await response.json();


    if (!products || products.length === 0) {

        show(`Giỏ hàng đang trống!`);

        return;

    }


    subtotal = 0;


    document
        .querySelectorAll(".product-list")
        .forEach(list => {

            list.innerHTML = "";

        });


    products.forEach(product => {

        const price =
            Number(product.price) || 0;


        const quantity =
            Number(product.quantity) || 0;


        const itemTotal =
            price * quantity;


        subtotal += itemTotal;


        document
            .querySelectorAll(".product-list")
            .forEach(list => {

                list.innerHTML += `

                    <div class="product-item">

                        <div class="img-box">

                            <img
                                src="${product.image}"
                                alt="${product.product_name}"
                            >

                            <span class="qty">
                                ${quantity}
                            </span>

                        </div>


                        <div class="info">

                            <h4>
                                ${product.product_name}
                            </h4>


                            <p>
                                Size: ${product.size || ""}
                            </p>


                            <p>
                                Số lượng: ${quantity}
                            </p>

                        </div>


                        <div class="price">

                            ${itemTotal.toLocaleString("vi-VN")}đ

                        </div>

                    </div>

                `;

            });

    });


    shipping_fee = 0;


    calculateTotal();


    show(`Đã tải giỏ hàng thành công!`);

}


// ========================================
// THANH TOÁN MUA NGAY
// ========================================

async function loadBuyNow() {

    try {

        const response =
            await fetch('/get-buy-now');


        // ========================================
        // CHƯA ĐĂNG NHẬP
        // ========================================

        if (response.status === 401) {

            show(`Vui lòng đăng nhập!`);

            window.location.href =
                "dangnhap.html";

            return false;

        }


        // ========================================
        // LỖI LẤY SẢN PHẨM
        // ========================================

        if (!response.ok) {

            show(`Không lấy được sản phẩm mua ngay!`);

            return false;

        }


        const product =
            await response.json();


        // ========================================
        // KHÔNG CÓ SẢN PHẨM
        // ========================================

        if (
            !product ||
            !product.product_name
        ) {

            show(`Không có sản phẩm mua ngay!`);

            return false;

        }


        const price =
            Number(product.price) || 0;


        const quantity =
            Number(product.quantity) || 1;


        subtotal =
            price * quantity;


        shipping_fee = 0;


        renderProduct(product);


        calculateTotal();


        show(`Đã tải sản phẩm mua ngay!`);


        return true;

    }

    catch (error) {

        show(
            `Có lỗi khi lấy sản phẩm mua ngay!`
        );

        return false;

    }

}


// ========================================
// TỰ ĐỘNG LẤY EMAIL THÔNG TIN CÁ NHÂN
// ========================================

async function loadProfileCheckout() {

    try {

        const res =
            await fetch('/profile');


        if (!res.ok) {

            return;

        }


        const data =
            await res.json();


        const emailInput =
            document.querySelector('#email');


        if (emailInput) {

            emailInput.value =
                data.email || "";

        }

    }

    catch (error) {

        console.log(
            "Không lấy được email cá nhân!"
        );

    }

}


// ========================================
// XÁC ĐỊNH MUA NGAY HAY GIỎ HÀNG
// ========================================

async function loadCheckout() {

    const isBuyNow =
        sessionStorage.getItem("buyNow") === "true";


    if (isBuyNow) {

        await loadBuyNow();

        return;

    }


    await loadCart();

}


loadProfileCheckout();


async function startCheckout() {

    const isBuyNow =
        sessionStorage.getItem("buyNow") === "true";


    await loadCheckout();


    // ========================================
    // CHỈ HIỆN VOUCHER KHI MUA NGAY
    // ========================================

    const voucherCheckout =
        document.getElementById("voucherCheckout");


    if (voucherCheckout) {

        if (isBuyNow) {

            voucherCheckout.style.display = "block";

            loadCheckoutVouchers();

        }

        else {

            voucherCheckout.style.display = "none";

        }

    }

}


startCheckout();


// ========================================
// NÚT ĐẶT HÀNG
// ========================================

if (donebtn) {

    donebtn.addEventListener('click', async (e) => {

        e.preventDefault();


        // ========================================
        // LẤY USER
        // ========================================

        const resUser =
            await fetch('/get-user');


        if (!resUser.ok) {

            show(`Không kiểm tra được tài khoản!`);

            return;

        }


        const userData =
            await resUser.json();


        if (!userData.user) {

            show(`Vui lòng đăng nhập!`);

            window.location.href =
                "dangnhap.html";

            return;

        }


        const user_id =
            userData.user.id;


        // ========================================
        // LẤY THÔNG TIN GIAO HÀNG
        // ========================================

        const ho =
            document
                .querySelector('#ho')
                .value
                .trim();


        const ten =
            document
                .querySelector('#ten')
                .value
                .trim();


        const email =
            document
                .querySelector('#email')
                .value
                .trim();


        const phone =
            document
                .querySelector('#phone')
                .value
                .trim();


        const address =
            document
                .querySelector('#address')
                .value
                .trim();


        const citySelect =
            document.querySelector('#city');


        const districtSelect =
            document.querySelector('#district');


        const city =
            citySelect.value === ""
                ? ""
                : citySelect.options[citySelect.selectedIndex].text;


        const district =
            districtSelect.value === ""
                ? ""
                : districtSelect.options[districtSelect.selectedIndex].text;


        const noteElement =
            document.querySelector('#note');


        const note =
            noteElement
                ? noteElement.value.trim()
                : "";


        // ========================================
        // KIỂM TRA THÔNG TIN
        // ========================================

        if (
            ho === "" ||
            ten === "" ||
            email === "" ||
            phone === "" ||
            address === "" ||
            city === "" ||
            district === ""
        ) {

            show(
                `Vui lòng nhập đầy đủ thông tin giao hàng!`
            );

            return;

        }


        // ========================================
        // KIỂM TRA THANH TOÁN
        // ========================================

        if (!payment_method) {

            show(
                `Vui lòng chọn phương thức thanh toán!`
            );

            return;

        }


        // ========================================
        // TÍNH LẠI TỔNG
        // ========================================

        calculateTotal();


        const voucherCode =
            sessionStorage.getItem("voucherCode");


        // ========================================
        // THÔNG BÁO ĐANG ĐẶT HÀNG
        // ========================================

        show(`Đang tiến hành đặt hàng...`);


        // ========================================
        // TẠO ĐƠN HÀNG
        // ========================================

        const res =
            await fetch(
                '/createOrder',
                {

                    method: 'POST',

                    headers: {

                        'Content-Type':
                            'application/json'

                    },

                    body: JSON.stringify({

                        user_id:
                            user_id,

                        ho:
                            ho,

                        ten:
                            ten,

                        email:
                            email,

                        phone:
                            phone,

                        address:
                            address,

                        city:
                            city,

                        district:
                            district,

                        note:
                            note,

                        payment_method:
                            payment_method,

                        shipping_method:
                            shipping_method,

                        shipping_fee:
                            shipping_fee,

                        subtotal:
                            subtotal,

                        discount:
                            discount,

                        voucher_code:
                            voucherCode,

                        total:
                            total

                    })

                }

            );


        // ========================================
        // ĐẶT HÀNG THẤT BẠI
        // ========================================

        if (!res.ok) {

            show(`Đặt hàng thất bại!`);

            return;

        }


        const data =
            await res.json();


        // ========================================
        // ĐẶT HÀNG THÀNH CÔNG
        // ========================================

        if (data.order_id) {

            // ========================================
            // NẾU CÓ VOUCHER → TRỪ 1
            // ========================================

            if (voucherCode) {

                await fetch("/decrease-voucher", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        voucher_code:
                            voucherCode

                    })

                });

            }


            // ========================================
            // XÓA GIẢM GIÁ
            // ========================================

            sessionStorage.removeItem("discount");


            // ========================================
            // XÓA VOUCHER
            // ========================================

            sessionStorage.removeItem("voucherCode");


            // ========================================
            // XÓA TRẠNG THÁI MUA NGAY
            // ========================================

            sessionStorage.removeItem("buyNow");


            // ========================================
            // THÔNG BÁO
            // ========================================

            show(
                `Đặt hàng thành công!`
            );


            // ========================================
            // ĐI ĐẾN CHI TIẾT ĐƠN HÀNG
            // ========================================

            window.location.href =
                `xemchitiet.html?order_id=${data.order_id}`;

        }

        else {

            show(
                `Đặt hàng thất bại!`
            );

        }

    });

}


// ========================================
// LẤY TỈNH / THÀNH PHỐ
// ========================================

const city =
    document.getElementById("city");


const district =
    document.getElementById("district");


// ========================================
// BIẾN LƯU DỮ LIỆU TỈNH
// ========================================

let provinces = [];


// ========================================
// CHUẨN HÓA TÊN
// ========================================

function normalizeName(name) {

    return (name || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/^tinh\s+/g, "")
        .replace(/^thanh pho\s+/g, "")
        .replace(/^tp\s+/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();

}


// ========================================
// TÌM TÊN GẦN ĐÚNG
// ========================================

function findByName(list, savedName) {

    const name =
        normalizeName(savedName);


    if (!name) {

        return null;

    }


    // ========================================
    // TÌM CHÍNH XÁC
    // ========================================

    let result =
        list.find(item => {

            return normalizeName(item.name) === name;

        });


    if (result) {

        return result;

    }


    // ========================================
    // TÌM CHỨA NHAU
    // ========================================

    result =
        list.find(item => {

            const itemName =
                normalizeName(item.name);


            return (
                itemName.includes(name) ||
                name.includes(itemName)
            );

        });


    return result || null;

}


// ========================================
// LOAD TỈNH / THÀNH PHỐ
// API V2
// ========================================

async function getCity() {

    if (!city) {

        return;

    }


    const res =
        await fetch(
            "https://provinces.open-api.vn/api/v2/"
        );


    if (!res.ok) {

        show(`Không thể tải danh sách tỉnh/thành phố!`);

        return;

    }


    provinces =
        await res.json();


    city.innerHTML = `
        <option value="" disabled selected hidden>
            -- Chọn Tỉnh/ Thành phố --
        </option>
    `;


    provinces.forEach(item => {

        const option =
            document.createElement("option");


        option.value =
            item.code;


        option.textContent =
            item.name;


        city.appendChild(option);

    });

}


// ========================================
// TỰ ĐỘNG ĐIỀN ĐỊA CHỈ MẶC ĐỊNH
// ========================================

async function loadDefaultAddressCheckout() {

    const res =
        await fetch("/getaddresses");


    if (!res.ok) {

        return;

    }


    const addresses =
        await res.json();


    // ========================================
    // KIỂM TRA DỮ LIỆU
    // ========================================

    if (!Array.isArray(addresses)) {

        return;

    }


    if (addresses.length === 0) {

        return;

    }


    // ========================================
    // TÌM ĐỊA CHỈ MẶC ĐỊNH
    // ========================================

    const defaultAddress =
        addresses.find(address => {

            const value =
                String(address.is_default)
                    .toLowerCase()
                    .trim();


            return (
                value === "1" ||
                value === "true"
            );

        });


    if (!defaultAddress) {

        return;

    }


    // ========================================
    // LẤY INPUT
    // ========================================

    const hoInput =
        document.getElementById("ho");


    const tenInput =
        document.getElementById("ten");


    const phoneInput =
        document.getElementById("phone");


    const addressInput =
        document.getElementById("address");


    // ========================================
    // TÁCH HỌ VÀ TÊN
    // ========================================

    const fullname =
        (defaultAddress.fullname || "").trim();


    const nameParts =
        fullname.split(/\s+/);


    const ten =
        nameParts.pop() || "";


    const ho =
        nameParts.join(" ");


    // ========================================
    // ĐIỀN HỌ
    // ========================================

    if (hoInput) {

        hoInput.value =
            ho;

    }


    // ========================================
    // ĐIỀN TÊN
    // ========================================

    if (tenInput) {

        tenInput.value =
            ten;

    }


    // ========================================
    // ĐIỀN PHONE
    // ========================================

    if (phoneInput) {

        phoneInput.value =
            defaultAddress.phone || "";

    }


    // ========================================
    // ĐIỀN ĐỊA CHỈ
    // ========================================

    if (addressInput) {

        addressInput.value =
            defaultAddress.address || "";

    }


    // ========================================
    // KIỂM TRA SELECT
    // ========================================

    if (!city || !district) {

        return;

    }


    // ========================================
    // ĐỢI TỈNH LOAD XONG
    // ========================================

    if (provinces.length === 0) {

        await getCity();

    }


    // ========================================
    // TÌM TỈNH
    // ========================================

    let selectedProvince =
        findByName(
            provinces,
            defaultAddress.province_name
        );


    // ========================================
    // NẾU CÓ province_code
    // THỬ TÌM BẰNG CODE
    // ========================================

    if (
        !selectedProvince &&
        defaultAddress.province_code
    ) {

        selectedProvince =
            provinces.find(item => {

                return String(item.code) ===
                    String(defaultAddress.province_code);

            });

    }


    // ========================================
    // KHÔNG TÌM THẤY TỈNH
    // ========================================

    if (!selectedProvince) {

        show(`Không tìm thấy tỉnh/thành phố của địa chỉ mặc định!`);

        return;

    }


    // ========================================
    // CHỌN TỈNH
    // ========================================

    city.value =
        selectedProvince.code;


    // ========================================
    // TẢI PHƯỜNG / XÃ
    // ========================================

    district.innerHTML = `
        <option value="" disabled selected>
            Đang tải Phường / Xã...
        </option>
    `;


    district.disabled = true;


    const resProvince =
        await fetch(
            "https://provinces.open-api.vn/api/v2/p/"
            + selectedProvince.code
            + "?depth=2"
        );


    if (!resProvince.ok) {

        district.innerHTML = `
            <option value="" disabled selected>
                -- Chọn Phường / Xã --
            </option>
        `;


        district.disabled = false;


        show(`Không thể tải Phường / Xã!`);

        return;

    }


    const provinceData =
        await resProvince.json();


    // ========================================
    // HIỂN THỊ PHƯỜNG / XÃ
    // ========================================

    district.innerHTML = `
        <option value="" disabled selected>
            -- Chọn Phường / Xã --
        </option>
    `;


    const wards =
        Array.isArray(provinceData.wards)
            ? provinceData.wards
            : [];


    wards.forEach(ward => {

        const option =
            document.createElement("option");


        option.value =
            ward.code;


        option.textContent =
            ward.name;


        district.appendChild(option);

    });


    district.disabled = false;


    // ========================================
    // TÌM PHƯỜNG / XÃ
    // ========================================

    let selectedWard =
        findByName(
            wards,
            defaultAddress.ward_name
        );


    // ========================================
    // NẾU CÓ ward_code
    // THỬ TÌM BẰNG CODE
    // ========================================

    if (
        !selectedWard &&
        defaultAddress.ward_code
    ) {

        selectedWard =
            wards.find(ward => {

                return String(ward.code) ===
                    String(defaultAddress.ward_code);

            });

    }


    // ========================================
    // CHỌN PHƯỜNG / XÃ
    // ========================================

    if (selectedWard) {

        district.value =
            selectedWard.code;

    }


    show(`Đã tự động điền địa chỉ mặc định!`);

}


// ========================================
// CHẠY LOAD TỈNH
// ========================================

getCity().then(() => {

    loadDefaultAddressCheckout();

});


// ========================================
// CHỌN TỈNH → LẤY PHƯỜNG / XÃ
// ========================================

if (city) {

    city.addEventListener(
        "change",
        async function () {

            const cityCode =
                this.value;


            if (!cityCode) {

                return;

            }


            if (!district) {

                return;

            }


            district.innerHTML = `
                <option value="" disabled selected>
                    Đang tải Phường / Xã...
                </option>
            `;


            district.disabled = true;


            const res =
                await fetch(
                    "https://provinces.open-api.vn/api/v2/p/"
                    + cityCode
                    + "?depth=2"
                );


            if (!res.ok) {

                district.innerHTML = `
                    <option value="">
                        Không thể tải Phường / Xã
                    </option>
                `;


                district.disabled = false;


                show(`Không thể tải Phường / Xã!`);

                return;

            }


            const data =
                await res.json();


            district.innerHTML = `
                <option value="" disabled selected>
                    -- Chọn Phường / Xã --
                </option>
            `;


            // ========================================
            // API V2 TRẢ PHƯỜNG/XÃ
            // ========================================

            if (
                data.wards &&
                Array.isArray(data.wards)
            ) {

                data.wards.forEach(ward => {

                    const option =
                        document.createElement("option");


                    option.value =
                        ward.code;


                    option.textContent =
                        ward.name;


                    district.appendChild(option);

                });

            }


            district.disabled = false;


            show(`Đã tải danh sách Phường / Xã!`);

        }
    );

}


// ========================================
// ĐỔI ĐỊA CHỈ THANH TOÁN
// ========================================

const changeAddressBtn =
    document.getElementById("changeAddressBtn");


const savedAddressesCheckout =
    document.getElementById(
        "savedAddressesCheckout"
    );


document.addEventListener("click", function (event) {

    if (
        savedAddressesCheckout &&
        savedAddressesCheckout.style.display === "block" &&
        !savedAddressesCheckout.contains(event.target) &&
        event.target !== changeAddressBtn
    ) {

        savedAddressesCheckout.style.display =
            "none";

    }

});


// ========================================
// LẤY ĐỊA CHỈ ĐÃ LƯU
// ========================================

async function loadSavedAddressesCheckout() {

    const res =
        await fetch("/getaddresses");


    if (!res.ok) {

        show(`Không lấy được địa chỉ!`);

        return;

    }


    const addresses =
        await res.json();


    // ========================================
    // KIỂM TRA
    // ========================================

    if (!Array.isArray(addresses)) {

        show(`Dữ liệu địa chỉ không hợp lệ!`);

        return;

    }


    // ========================================
    // SẮP XẾP ĐỊA CHỈ MẶC ĐỊNH LÊN ĐẦU
    // ========================================

    addresses.sort((a, b) => {

        const defaultA =
            String(a.is_default)
                .toLowerCase()
                .trim();


        const defaultB =
            String(b.is_default)
                .toLowerCase()
                .trim();


        const isDefaultA =
            defaultA === "1" ||
            defaultA === "true";


        const isDefaultB =
            defaultB === "1" ||
            defaultB === "true";


        return Number(isDefaultB) -
            Number(isDefaultA);

    });


    // ========================================
    // KHÔNG CÓ ĐỊA CHỈ
    // ========================================

    if (addresses.length === 0) {

        savedAddressesCheckout.innerHTML = "";

        savedAddressesCheckout.style.display =
            "none";

        show(`Bạn chưa có địa chỉ đã lưu!`);

        return;

    }


    // ========================================
    // XÓA DANH SÁCH CŨ
    // ========================================

    savedAddressesCheckout.innerHTML = "";


    // ========================================
    // HIỂN THỊ ĐỊA CHỈ
    // ========================================

    addresses.forEach(address => {

        const div =
            document.createElement("div");


        div.className =
            "checkout-address-item";


        const defaultValue =
            String(address.is_default)
                .toLowerCase()
                .trim();


        const isDefault =
            defaultValue === "1" ||
            defaultValue === "true";


        div.innerHTML = `

            <div class="checkout-address-top">

                <p class="checkout-address-name">
                    ${address.fullname || ""}
                </p>

                ${isDefault
                ? `
                    <span class="default-address">
                        <i class="fa-solid fa-check"></i>
                        Mặc định
                    </span>
                `
                : ""
            }

            </div>


            <p>
                <i class="fa-solid fa-phone"></i>
                ${address.phone || ""}
            </p>


            <p>
                <i class="fa-solid fa-location-dot"></i>
                ${address.address || ""}
            </p>


            <p>
                <i class="fa-solid fa-map"></i>
                ${address.ward_name || ""}
                ${address.province_name
                ? ", " + address.province_name
                : ""
            }
            </p>

        `;


        // ========================================
        // CLICK CHỌN ĐỊA CHỈ
        // ========================================

        div.addEventListener(
            "click",
            async () => {

                // ========================================
                // INPUT
                // ========================================

                const hoInput =
                    document.getElementById("ho");


                const tenInput =
                    document.getElementById("ten");


                const phoneInput =
                    document.getElementById("phone");


                const addressInput =
                    document.getElementById("address");


                // ========================================
                // TÁCH HỌ TÊN
                // ========================================

                const fullname =
                    (address.fullname || "").trim();


                const nameParts =
                    fullname.split(/\s+/);


                const ten =
                    nameParts.pop() || "";


                const ho =
                    nameParts.join(" ");


                // ========================================
                // ĐIỀN HỌ
                // ========================================

                if (hoInput) {

                    hoInput.value =
                        ho;

                }


                // ========================================
                // ĐIỀN TÊN
                // ========================================

                if (tenInput) {

                    tenInput.value =
                        ten;

                }


                // ========================================
                // ĐIỀN PHONE
                // ========================================

                if (phoneInput) {

                    phoneInput.value =
                        address.phone || "";

                }


                // ========================================
                // ĐIỀN ĐỊA CHỈ
                // ========================================

                if (addressInput) {

                    addressInput.value =
                        address.address || "";

                }


                // ========================================
                // KIỂM TRA SELECT
                // ========================================

                if (!city || !district) {

                    show(
                        `Không tìm thấy ô tỉnh/thành phố!`
                    );

                    return;

                }


                // ========================================
                // ĐỢI TỈNH LOAD
                // ========================================

                if (provinces.length === 0) {

                    await getCity();

                }


                // ========================================
                // TÌM TỈNH
                // ========================================

                let selectedProvince =
                    findByName(
                        provinces,
                        address.province_name
                    );


                // ========================================
                // THỬ CODE NẾU CÓ
                // ========================================

                if (
                    !selectedProvince &&
                    address.province_code
                ) {

                    selectedProvince =
                        provinces.find(
                            item =>
                                String(item.code) ===
                                String(
                                    address.province_code
                                )
                        );

                }


                // ========================================
                // CHỌN TỈNH
                // ========================================

                if (selectedProvince) {

                    city.value =
                        selectedProvince.code;

                }


                // ========================================
                // NẾU KHÔNG TÌM THẤY
                // ========================================

                if (!city.value) {

                    district.innerHTML = `
                        <option value="" disabled selected>
                            -- Chọn Phường / Xã --
                        </option>
                    `;


                    district.disabled = false;


                    savedAddressesCheckout.style.display =
                        "none";


                    show(
                        `Đã điền thông tin địa chỉ, vui lòng chọn Tỉnh/Thành phố!`
                    );

                    return;

                }


                // ========================================
                // TẢI PHƯỜNG / XÃ
                // ========================================

                district.innerHTML = `
                    <option value="" disabled selected>
                        Đang tải Phường / Xã...
                    </option>
                `;


                district.disabled = true;


                const resProvince =
                    await fetch(
                        "https://provinces.open-api.vn/api/v2/p/"
                        + city.value
                        + "?depth=2"
                    );


                if (!resProvince.ok) {

                    district.innerHTML = `
                        <option value="" disabled selected>
                            -- Chọn Phường / Xã --
                        </option>
                    `;


                    district.disabled = false;


                    savedAddressesCheckout.style.display =
                        "none";


                    show(`Không thể tải Phường / Xã!`);

                    return;

                }


                const provinceData =
                    await resProvince.json();


                // ========================================
                // HIỂN THỊ PHƯỜNG / XÃ
                // ========================================

                district.innerHTML = `
                    <option value="" disabled selected>
                        -- Chọn Phường / Xã --
                    </option>
                `;


                const wards =
                    Array.isArray(provinceData.wards)
                        ? provinceData.wards
                        : [];


                wards.forEach(ward => {

                    const option =
                        document.createElement("option");


                    option.value =
                        ward.code;


                    option.textContent =
                        ward.name;


                    district.appendChild(option);

                });


                district.disabled = false;


                // ========================================
                // TÌM PHƯỜNG / XÃ
                // ========================================

                let selectedWard =
                    findByName(
                        wards,
                        address.ward_name
                    );


                // ========================================
                // THỬ CODE NẾU CÓ
                // ========================================

                if (
                    !selectedWard &&
                    address.ward_code
                ) {

                    selectedWard =
                        wards.find(
                            ward =>
                                String(ward.code) ===
                                String(
                                    address.ward_code
                                )
                        );

                }


                // ========================================
                // CHỌN PHƯỜNG / XÃ
                // ========================================

                if (selectedWard) {

                    district.value =
                        selectedWard.code;

                }

                else {

                    district.value = "";

                }


                // ========================================
                // ẨN DANH SÁCH
                // ========================================

                savedAddressesCheckout.style.display =
                    "none";


                show(`Đã chọn địa chỉ giao hàng khác!`);

            }
        );


        savedAddressesCheckout.appendChild(div);

    });


    // ========================================
    // HIỆN DANH SÁCH
    // ========================================

    savedAddressesCheckout.style.display =
        "block";

}


// ========================================
// NÚT ĐỔI ĐỊA CHỈ
// ========================================

if (changeAddressBtn) {

    changeAddressBtn.addEventListener(
        "click",
        () => {

            loadSavedAddressesCheckout();

        }
    );

}


// ========================================
// LOAD VOUCHER
// ========================================

function loadCheckoutVouchers() {

    const voucherList =
        document.getElementById("voucherListCheckout");


    if (!voucherList) {

        return;

    }


    fetch("/getvouchers")

        .then(response =>
            response.json()
        )

        .then(vouchers => {

            voucherList.innerHTML = "";


            if (!vouchers || vouchers.length === 0) {

                voucherList.innerHTML = `
                    <p>Hiện tại chưa có voucher giảm giá.</p>
                `;

                return;

            }


            const now =
                new Date();


            const activeVouchers =
                vouchers.filter(voucher => {

                    const status =
                        (voucher.status || "")
                            .trim()
                            .toLowerCase();


                    const isStatusActive =
                        status === "đang hoạt động" ||
                        status === "active";


                    const isQuantityLeft =
                        Number(voucher.quantity) > 0;


                    const startDate =
                        new Date(voucher.start_date);


                    const endDate =
                        new Date(voucher.end_date);


                    const isDateValid =
                        !isNaN(startDate) &&
                        !isNaN(endDate);


                    const isInDateRange =
                        isDateValid &&
                        now >= startDate &&
                        now <= endDate;


                    const isMinOrderMet =
                        Number(subtotal) >=
                        Number(voucher.min_order || 0);


                    return (
                        isStatusActive &&
                        isQuantityLeft &&
                        isInDateRange &&
                        isMinOrderMet
                    );

                });


            if (activeVouchers.length === 0) {

                voucherList.innerHTML = `
                    <p>Hiện tại chưa có voucher giảm giá.</p>
                `;

                return;

            }


            activeVouchers.forEach(voucher => {

                let discountText = "";


                const code =
                    String(voucher.voucher_code || "")
                        .trim()
                        .toUpperCase();


                if (code === "GIAM10") {

                    discountText =
                        "Giảm 10%";

                }

                else if (code === "GIAM25") {

                    discountText =
                        "Giảm 25%";

                }

                else if (code === "GIAM50K") {

                    discountText =
                        "Giảm 50.000đ";

                }

                else if (code === "GIAM25K") {

                    discountText =
                        "Giảm 25.000đ";

                }

                else {

                    discountText =
                        `Giảm ${Number(
                            voucher.voucher_value || 0
                        ).toLocaleString("vi-VN")}đ`;

                }


                const item =
                    document.createElement("div");


                item.className =
                    "voucher-item-checkout";


                item.innerHTML = `

                    <div>

                        <strong>
                            ${voucher.voucher_code}
                        </strong>

                        <p>
                            ${discountText}
                        </p>

                        <p>
                            Đơn tối thiểu:
                            ${Number(
                    voucher.min_order
                ).toLocaleString("vi-VN")}đ
                        </p>

                        <p class="date">
                            HSD:
                            ${formatVoucherDate(
                    voucher.end_date
                )}
                        </p>

                    </div>


                    <button
                        type="button"
                        class="select-voucher-checkout"
                        data-code="${voucher.voucher_code}"
                    >
                        Chọn
                    </button>

                `;


                voucherList.appendChild(item);

            });


            document
                .querySelectorAll(
                    ".select-voucher-checkout"
                )
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        function () {

                            const voucherCode =
                                this.dataset.code;


                            selectCheckoutVoucher(
                                voucherCode,
                                activeVouchers
                            );

                        }
                    );

                });


            restoreCheckoutVoucher();

        });

}


// ========================================
// FORMAT NGÀY VOUCHER
// ========================================

function formatVoucherDate(date) {

    if (!date) {

        return "";

    }


    const d =
        new Date(date);


    const day =
        String(d.getDate())
            .padStart(2, "0");


    const month =
        String(d.getMonth() + 1)
            .padStart(2, "0");


    const year =
        d.getFullYear();


    return `${day}/${month}/${year}`;

}


// ========================================
// CHỌN VOUCHER
// ========================================

function selectCheckoutVoucher(
    voucherCode,
    vouchers
) {

    const voucher =
        vouchers.find(
            item =>
                item.voucher_code === voucherCode
        );


    if (!voucher) {

        return;

    }


    // ========================================
    // LẤY SUBTOTAL
    // ========================================

    const currentSubtotal =
        Number(subtotal) || 0;


    // ========================================
    // KIỂM TRA ĐƠN TỐI THIỂU
    // ========================================

    const minOrder =
        Number(voucher.min_order) || 0;


    if (currentSubtotal < minOrder) {

        show(
            `Đơn hàng phải từ ${minOrder.toLocaleString("vi-VN")}đ để sử dụng voucher này`
        );

        return;

    }


    // ========================================
    // LẤY MÃ VOUCHER
    // ========================================

    const code =
        String(voucher.voucher_code || "")
            .trim()
            .toUpperCase();


    // ========================================
    // LẤY GIÁ TRỊ VOUCHER
    // ========================================

    const voucherValue =
        Number(voucher.voucher_value) || 0;


    // ========================================
    // TÍNH GIẢM GIÁ
    // ========================================

    let voucherDiscount = 0;


    const voucherType =
        String(voucher.voucher_type || "")
            .trim()
            .toUpperCase();


    // ========================================
    // GIẢM THEO PHẦN TRĂM
    // ========================================

    if (
        voucherType === "PERCENT" ||
        voucherType === "PHANTRAM"
    ) {

        voucherDiscount =
            currentSubtotal *
            voucherValue /
            100;

    }


    // ========================================
    // GIẢM TIỀN CỐ ĐỊNH
    // ========================================

    else if (
        voucherType === "FIXED" ||
        voucherType === "TIENCODINH"
    ) {

        voucherDiscount =
            voucherValue;

    }


    // ========================================
    // VOUCHER KHÔNG HỢP LỆ
    // ========================================

    else {

        show(`Loại voucher không hợp lệ!`);

        return;

    }


    // ========================================
    // KHÔNG CHO GIẢM QUÁ SUBTOTAL
    // ========================================

    if (voucherDiscount > currentSubtotal) {

        voucherDiscount =
            currentSubtotal;

    }


    // ========================================
    // LÀM TRÒN
    // ========================================

    voucherDiscount =
        Math.round(voucherDiscount);


    // ========================================
    // GÁN GIẢM GIÁ
    // ========================================

    discount =
        voucherDiscount;


    // ========================================
    // LƯU VOUCHER
    // ========================================

    sessionStorage.setItem(
        "voucherCode",
        code
    );


    sessionStorage.setItem(
        "discount",
        discount
    );


    // ========================================
    // TÍNH LẠI TOTAL
    // ========================================

    calculateTotal();


    // ========================================
    // ĐỔI TRẠNG THÁI NÚT
    // ========================================

    document
        .querySelectorAll(
            ".select-voucher-checkout"
        )
        .forEach(button => {

            button.classList.remove("selected");

            button.textContent = "Chọn";

        });


    const selectedButton =
        document.querySelector(
            `.select-voucher-checkout[data-code="${voucherCode}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add("selected");

        selectedButton.textContent =
            "Đã chọn";

    }


    // ========================================
    // THÔNG BÁO
    // ========================================

    show(
        `Đã áp dụng voucher ${code}! Giảm ${discount.toLocaleString("vi-VN")}đ`
    );

}


// ========================================
// CẬP NHẬT GIẢM GIÁ
// ========================================

function updateCheckoutDiscount(discount) {

    const discountElements =
        document.querySelectorAll(".discount");


    discountElements.forEach(element => {

        element.textContent =
            `${discount.toLocaleString("vi-VN")}đ`;

    });


    sessionStorage.setItem(
        "discount",
        discount
    );

}


// ========================================
// CẬP NHẬT TOTAL
// ========================================

function updateCheckoutTotal(total) {

    const totalElements =
        document.querySelectorAll(".gold-text");


    totalElements.forEach(element => {

        element.textContent =
            `${Math.round(total).toLocaleString("vi-VN")}đ`;

    });


    const codTotal =
        document.querySelector(".cod-total");


    if (codTotal) {

        codTotal.textContent =
            `${Math.round(total).toLocaleString("vi-VN")}đ`;

    }


    const bankTotal =
        document.querySelector(".bank-total");


    if (bankTotal) {

        bankTotal.textContent =
            `${Math.round(total).toLocaleString("vi-VN")}₫`;

    }

}


// ========================================
// KHÔI PHỤC VOUCHER
// ========================================

function restoreCheckoutVoucher() {

    const voucherCode =
        sessionStorage.getItem("voucherCode");


    const savedDiscount =
        Number(
            sessionStorage.getItem("discount")
        ) || 0;


    if (!voucherCode) {

        return;

    }


    // ========================================
    // KHÔI PHỤC GIẢM GIÁ
    // ========================================

    discount =
        savedDiscount;


    // ========================================
    // TÍNH LẠI TOTAL
    // ========================================

    calculateTotal();


    // ========================================
    // KHÔI PHỤC NÚT ĐÃ CHỌN
    // ========================================

    document
        .querySelectorAll(
            ".select-voucher-checkout"
        )
        .forEach(button => {

            button.classList.remove("selected");

            button.textContent = "Chọn";

        });


    const button =
        document.querySelector(
            `.select-voucher-checkout[data-code="${voucherCode}"]`
        );


    if (button) {

        button.classList.add("selected");

        button.textContent =
            "Đã chọn";

    }

}