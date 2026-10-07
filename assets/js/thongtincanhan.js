// ========================================
// CHUYỂN TAB
// ========================================

const tabbtnn = document.querySelector('#tabProfile');
const tabbtn = document.querySelector('#tabPassword');
const tabAddress = document.querySelector('#tabAddress');
const tabOverview = document.querySelector('#tabOverview');

const profile = document.querySelector('.profile');
const change = document.querySelector('.change');
const address = document.querySelector('.address');
const overview = document.querySelector('.overview');


// ========================================
// TAB THÔNG TIN CÁ NHÂN
// ========================================

if (tabbtnn) {

    tabbtnn.addEventListener('click', () => {

        profile.style.display = 'block';
        change.style.display = 'none';
        address.style.display = 'none';
        overview.style.display = 'none';

        tabbtnn.classList.add('active');
        tabbtn.classList.remove('active');
        tabAddress.classList.remove('active');
        tabOverview.classList.remove('active');

        show(`Đã chuyển sang Thông tin cá nhân`);

    });

}


// ========================================
// TAB ĐỔI MẬT KHẨU
// ========================================

if (tabbtn) {

    tabbtn.addEventListener('click', () => {

        profile.style.display = 'none';
        change.style.display = 'block';
        address.style.display = 'none';
        overview.style.display = 'none';

        tabbtnn.classList.remove('active');
        tabbtn.classList.add('active');
        tabAddress.classList.remove('active');
        tabOverview.classList.remove('active');

        show(`Đã chuyển sang Đổi mật khẩu`);

    });

}


// ========================================
// TAB ĐỊA CHỈ
// ========================================

if (tabAddress) {

    tabAddress.addEventListener('click', () => {

        profile.style.display = 'none';
        change.style.display = 'none';
        address.style.display = 'block';
        overview.style.display = 'none';

        tabbtnn.classList.remove('active');
        tabbtn.classList.remove('active');
        tabAddress.classList.add('active');
        tabOverview.classList.remove('active');

        loadAddresses();

        show(`Đã chuyển sang Địa chỉ cá nhân`);

    });

}


// ========================================
// TAB TỔNG QUAN MUA HÀNG
// ========================================

if (tabOverview) {

    tabOverview.addEventListener('click', () => {

        profile.style.display = 'none';
        change.style.display = 'none';
        address.style.display = 'none';
        overview.style.display = 'block';

        tabbtnn.classList.remove('active');
        tabbtn.classList.remove('active');
        tabAddress.classList.remove('active');
        tabOverview.classList.add('active');

        loadOrderOverview();

        show(`Đã chuyển sang Tổng quan mua hàng`);

    });

}


// ========================================
// LẤY THÔNG TIN CÁ NHÂN
// ========================================

fetch('/profile')

    .then(res => {

        if (res.status === 401) {

            show(`Vui lòng đăng nhập`);

            window.location.href = '/dangnhap.html';

            return null;
        }

        return res.json();

    })

    .then(data => {

        if (!data) {
            return;
        }

        const fullnameInput = document.querySelector('#fullname');
        const phoneInput = document.querySelector('#phone');
        const emailInput = document.querySelector('#email');
        const avatarElement = document.querySelector('#avatar');
        const membershipRank =
            document.querySelector('#membershipRank');

        if (fullnameInput) {
            fullnameInput.value = data.fullname || '';
        }

        if (phoneInput) {
            phoneInput.value = data.phone || '';
        }

        if (emailInput) {
            emailInput.value = data.email || '';
        }

        
        // ========================================
        // HIỂN THỊ AVATAR
        // ========================================

        const fullname = data.fullname || '';

        const words = fullname.trim().split(/\s+/);

        let avatar = '';

        if (words.length >= 2) {

            avatar =
                words[0][0] +
                words[words.length - 1][0];

        }

        else if (words.length === 1 && words[0]) {

            avatar = words[0][0];

        }

        if (avatarElement) {

            avatarElement.textContent =
                avatar.toUpperCase();

        }

    });


// ========================================
// LƯU THÔNG TIN CÁ NHÂN
// ========================================

const btnSaveProfile =
    document.querySelector('#btnSaveProfile');

if (btnSaveProfile) {

    btnSaveProfile.addEventListener('click', () => {

        const fullname =
            document.querySelector('#fullname')
                .value
                .trim();

        const phone =
            document.querySelector('#phone')
                .value
                .trim();

        const email =
            document.querySelector('#email')
                .value
                .trim();


        if (!fullname || !phone || !email) {

            show(`Vui lòng nhập đầy đủ thông tin`);

            return;
        }

        fetch('/profile', {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                fullname: fullname,
                phone: phone,
                email: email

            })

        })

            .then(res => res.json())

            .then(data => {

                if (!data) {

                    show(`Cập nhật thông tin thất bại`);

                    return;
                }

                show(`Cập nhật thông tin thành công!`);

                window.location.reload();

            });

    });

}


// ========================================
// ĐỔI MẬT KHẨU
// ========================================

const btnChangePassword =
    document.querySelector('#btnChangePassword');

if (btnChangePassword) {

    btnChangePassword.addEventListener('click', () => {

        const oldPassword =
            document.querySelector('#oldPassword')
                .value
                .trim();

        const newPassword =
            document.querySelector('#newPassword')
                .value
                .trim();


        if (!oldPassword || !newPassword) {

            show(`Vui lòng nhập đầy đủ mật khẩu`);

            return;
        }

        fetch('/change-password', {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                oldPassword: oldPassword,
                newPassword: newPassword

            })

        })

            .then(res => res.text())

            .then(text => {

                let data = null;

                if (text) {
                    data = JSON.parse(text);
                }


                if (!data || !data.success) {

                    show(
                        data && data.message
                            ? data.message
                            : `Đổi mật khẩu thất bại`
                    );

                    return;
                }


                show(`Đổi mật khẩu thành công!`);

                window.location.reload();

            });

    });

}


// ========================================
// HIỆN / ẨN MẬT KHẨU
// ========================================

document
    .querySelectorAll('.toggle-password')
    .forEach(icon => {

        icon.addEventListener('click', () => {

            const input =
                document.getElementById(
                    icon.dataset.target
                );

            if (!input) {
                return;
            }


            if (input.type === 'password') {

                input.type = 'text';

                icon.classList.remove('fa-eye');

                icon.classList.add('fa-eye-slash');

            }

            else {

                input.type = 'password';

                icon.classList.remove('fa-eye-slash');

                icon.classList.add('fa-eye');

            }

        });

    });


// ========================================
// CÁC ELEMENT ĐỊA CHỈ
// ========================================

const btnAddAddress =
    document.querySelector('#btnAddAddress');

const btnCancelAddress =
    document.querySelector('#btnCancelAddress');

const btnSaveAddress =
    document.querySelector('#btnSaveAddress');

const addressForm =
    document.querySelector('#addressForm');

const city =
    document.querySelector('#city');

const ward =
    document.querySelector('#ward');


// ========================================
// HIỆN FORM THÊM ĐỊA CHỈ
// ========================================

if (btnAddAddress) {

    btnAddAddress.addEventListener('click', () => {

        // Xóa trạng thái sửa
        delete addressForm.dataset.editId;


        // Đổi tên nút
        btnSaveAddress.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Lưu địa chỉ
        `;


        // Xóa dữ liệu cũ
        document.querySelector('#addressFullname').value = '';

        document.querySelector('#addressPhone').value = '';

        document.querySelector('#addressDetail').value = '';

        document.querySelector('#isDefault').checked = false;


        // Reset tỉnh
        city.value = '';


        // Reset phường
        ward.innerHTML = `
            <option value="">
                -- Chọn Phường / Xã --
            </option>
        `;


        // Hiện form
        addressForm.style.display = 'block';

    });

}


// ========================================
// HỦY FORM
// ========================================

if (btnCancelAddress) {

    btnCancelAddress.addEventListener('click', () => {

        addressForm.style.display = 'none';

        delete addressForm.dataset.editId;


        btnSaveAddress.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Lưu địa chỉ
        `;

    });

}


// ========================================
// LẤY TỈNH / THÀNH PHỐ
// ========================================

if (city) {

    fetch('https://34tinhthanh.com/api/provinces')

        .then(res => {

            if (!res.ok) {

                return null;

            }

            return res.json();

        })

        .then(data => {

            if (!data) {
                return;
            }

            if (!Array.isArray(data)) {
                return;
            }


            data.forEach(item => {

                const option =
                    document.createElement('option');

                option.value =
                    item.province_code;

                option.textContent =
                    item.name;

                city.appendChild(option);

            });

        });

}


// ========================================
// LẤY PHƯỜNG / XÃ
// ========================================

function loadWards(provinceCode, selectedWardName = '') {

    if (!ward) {
        return;
    }


    ward.innerHTML = `
        <option value="">
            -- Chọn Phường / Xã --
        </option>
    `;


    if (!provinceCode) {
        return;
    }


    ward.innerHTML = `
        <option value="">
            Đang tải Phường / Xã...
        </option>
    `;


    fetch(
        `https://34tinhthanh.com/api/wards?province_code=${provinceCode}`
    )

        .then(res => {

            if (!res.ok) {

                return null;

            }

            return res.json();

        })

        .then(data => {

            if (!data) {
                return;
            }


            let wardData = [];


            if (Array.isArray(data)) {

                wardData = data;

            }

            else if (
                data &&
                Array.isArray(data.data)
            ) {

                wardData = data.data;

            }


            ward.innerHTML = `
                <option value="">
                    -- Chọn Phường / Xã --
                </option>
            `;


            wardData.forEach(item => {

                const option =
                    document.createElement('option');


                option.value =
                    item.ward_code ||
                    item.code ||
                    item.id ||
                    '';


                option.textContent =
                    item.name ||
                    item.ward_name ||
                    '';


                // Tự chọn phường cũ khi sửa
                if (
                    selectedWardName &&
                    option.textContent.trim() ===
                    selectedWardName.trim()
                ) {

                    option.selected = true;

                }


                ward.appendChild(option);

            });

        });

}


// ========================================
// CHỌN TỈNH / THÀNH PHỐ
// ========================================

if (city) {

    city.addEventListener('change', () => {

        loadWards(city.value, '');

    });

}


// ========================================
// LƯU / SỬA ĐỊA CHỈ
// ========================================

if (btnSaveAddress) {

    btnSaveAddress.addEventListener('click', () => {

        const fullname =
            document
                .querySelector('#addressFullname')
                .value
                .trim();


        const phone =
            document
                .querySelector('#addressPhone')
                .value
                .trim();


        const addressDetail =
            document
                .querySelector('#addressDetail')
                .value
                .trim();


        const isDefault =
            document
                .querySelector('#isDefault')
                .checked;


        // ========================================
        // LẤY TÊN TỈNH
        // ========================================

        let cityName = '';


        if (
            city &&
            city.selectedIndex >= 0
        ) {

            cityName =
                city.options[city.selectedIndex].text.trim();

        }


        // ========================================
        // LẤY TÊN PHƯỜNG
        // ========================================

        let wardName = '';


        if (
            ward &&
            ward.selectedIndex >= 0
        ) {

            wardName =
                ward.options[ward.selectedIndex].text.trim();

        }


        // ========================================
        // KIỂM TRA DỮ LIỆU
        // ========================================

        if (
            !fullname ||
            !phone ||
            !city ||
            !city.value ||
            !ward ||
            !ward.value ||
            !addressDetail
        ) {

            show(
                `Vui lòng nhập đầy đủ thông tin địa chỉ`
            );

            return;
        }


        // ========================================
        // KIỂM TRA ĐANG SỬA
        // ========================================

        const editId =
            addressForm.dataset.editId;


        // ========================================
        // TRƯỜNG HỢP SỬA
        // ========================================

        if (editId) {

            fetch(`/addresses/${editId}`, {

                method: 'PUT',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({

                    fullname: fullname,

                    phone: phone,

                    province_name: cityName,

                    ward_name: wardName,

                    address: addressDetail,

                    is_default: isDefault

                })

            })

                .then(res => res.text())

                .then(text => {

                    if (text !== 'ok') {

                        show(
                            `Cập nhật địa chỉ thất bại: ${text}`
                        );

                        return;
                    }


                    show(
                        `Cập nhật địa chỉ thành công`
                    );


                    resetAddressForm();

                    loadAddresses();

                });

            return;
        }


        // ========================================
        // TRƯỜNG HỢP THÊM MỚI
        // ========================================

        fetch('/addresses', {

            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify({

                fullname: fullname,

                phone: phone,

                province_name: cityName,

                ward_name: wardName,

                address: addressDetail,

                is_default: isDefault

            })

        })

            .then(res => res.text())

            .then(text => {

                if (text !== 'ok') {

                    show(
                        `Thêm địa chỉ thất bại: ${text}`
                    );

                    return;
                }


                show(`Thêm địa chỉ mới thành công`);


                resetAddressForm();

                loadAddresses();

            });

    });

}


// ========================================
// RESET FORM ĐỊA CHỈ
// ========================================

function resetAddressForm() {

    if (!addressForm) {
        return;
    }


    addressForm.style.display = 'none';

    delete addressForm.dataset.editId;


    if (btnSaveAddress) {

        btnSaveAddress.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Lưu địa chỉ
        `;

    }


    const fullnameInput =
        document.querySelector('#addressFullname');


    const phoneInput =
        document.querySelector('#addressPhone');


    const detailInput =
        document.querySelector('#addressDetail');


    const defaultInput =
        document.querySelector('#isDefault');


    if (fullnameInput) {
        fullnameInput.value = '';
    }


    if (phoneInput) {
        phoneInput.value = '';
    }


    if (detailInput) {
        detailInput.value = '';
    }


    if (defaultInput) {
        defaultInput.checked = false;
    }


    if (city) {
        city.value = '';
    }


    if (ward) {

        ward.innerHTML = `
            <option value="">
                -- Chọn Phường / Xã --
            </option>
        `;

    }

}


// ========================================
// HIỂN THỊ DANH SÁCH ĐỊA CHỈ
// ========================================

function loadAddresses() {

    fetch('/getaddresses')

        .then(res => {

            if (res.status === 401) {

                show(`Vui lòng đăng nhập`);

                window.location.href =
                    '/dangnhap.html';

                return null;
            }


            if (!res.ok) {

                show(`Không thể tải danh sách địa chỉ`);

                return null;

            }


            return res.json();

        })

        .then(data => {

            if (!data) {
                return;
            }


            const addressList =
                document.querySelector(
                    '#addressList'
                );


            if (!addressList) {
                return;
            }


            addressList.innerHTML = '';


            // ========================================
            // KHÔNG CÓ ĐỊA CHỈ
            // ========================================

            if (
                !Array.isArray(data) ||
                data.length === 0
            ) {

                addressList.innerHTML = `
                    <p class="no-address">
                        Bạn chưa có địa chỉ nào.
                    </p>
                `;

                show(`Bạn chưa có địa chỉ nào`);

                return;
            }


            // ========================================
            // HIỂN THỊ ĐỊA CHỈ
            // ========================================

            data.forEach(item => {

                const addressItem =
                    document.createElement('div');


                addressItem.className =
                    'address-item';


                addressItem.innerHTML = `

                    <div class="address-content">

                        <div class="address-name">
                            <i class="fa-regular fa-address-card"></i>
                            ${item.fullname || ''}
                        </div>

                        <div class="address-phone">
                            <i class="fa-solid fa-phone"></i>
                            ${item.phone || ''}
                        </div>

                        <div class="address-detail">
                            <i class="fa-solid fa-location-dot"></i>
                            ${item.address || ''}
                        </div>

                        <div class="address-location">
                            <i class="fa-solid fa-map-location-dot"></i>
                            ${item.ward_name || ''},
                            ${item.province_name || ''}
                        </div>

                        ${
                            Number(item.is_default) === 1
                            ? `
                                <span class="address-default-label">
                                    <i class="fa-solid fa-house-circle-check"></i>
                                    Mặc định
                                </span>
                            `
                            : ''
                        }

                    </div>


                    <div class="address-actions">

                        <button
                            type="button"
                            class="btn-edit-address"
                            data-id="${item.address_id}"
                        >

                            <i class="fa-solid fa-pen"></i>

                            Sửa

                        </button>


                        <button
                            type="button"
                            class="btn-delete-address"
                            onclick="deleteAddress(${item.address_id})"
                        >

                            <i class="fa-solid fa-trash"></i>

                            Xóa

                        </button>

                    </div>

                `;


                addressList.appendChild(
                    addressItem
                );

            });

        });

}


// ========================================
// NÚT SỬA ĐỊA CHỈ
// ========================================

document.addEventListener('click', event => {

    const btn =
        event.target.closest(
            '.btn-edit-address'
        );


    if (!btn) {
        return;
    }


    const addressId =
        btn.dataset.id;

    fetch('/getaddresses')

        .then(res => {

            if (res.status === 401) {

                show(`Vui lòng đăng nhập`);

                window.location.href =
                    '/dangnhap.html';

                return null;
            }

            return res.json();

        })

        .then(data => {

            if (!data) {
                return;
            }


            const selectedAddress =
                data.find(item =>
                    String(item.address_id) ===
                    String(addressId)
                );


            if (!selectedAddress) {

                show(
                    `Không tìm thấy địa chỉ này`
                );

                return;
            }


            // ========================================
            // ĐIỀN THÔNG TIN CŨ
            // ========================================

            document
                .querySelector('#addressFullname')
                .value =
                selectedAddress.fullname || '';


            document
                .querySelector('#addressPhone')
                .value =
                selectedAddress.phone || '';


            document
                .querySelector('#addressDetail')
                .value =
                selectedAddress.address || '';


            document
                .querySelector('#isDefault')
                .checked =
                Number(
                    selectedAddress.is_default
                ) === 1;


            // ========================================
            // CHỌN TỈNH CŨ
            // ========================================

            let provinceOption = null;


            if (city) {

                for (
                    let i = 0;
                    i < city.options.length;
                    i++
                ) {

                    if (
                        city.options[i].text.trim() ===
                        String(
                            selectedAddress.province_name
                        ).trim()
                    ) {

                        provinceOption =
                            city.options[i];

                        break;
                    }

                }

            }


            if (provinceOption) {

                city.value =
                    provinceOption.value;


                // ========================================
                // LOAD PHƯỜNG CŨ
                // ========================================

                loadWards(
                    city.value,
                    selectedAddress.ward_name
                );

            }


            // ========================================
            // LƯU ID ĐANG SỬA
            // ========================================

            addressForm.dataset.editId =
                selectedAddress.address_id;


            // ========================================
            // ĐỔI TÊN NÚT
            // ========================================

            btnSaveAddress.innerHTML = `
                <i class="fa-solid fa-pen"></i>
                Cập nhật địa chỉ
            `;


            // ========================================
            // HIỆN FORM
            // ========================================

            addressForm.style.display =
                'block';

        });

});


// ========================================
// XÓA ĐỊA CHỈ
// ========================================

function deleteAddress(addressId) {

    const confirmDelete =
        confirm(
            'Bạn có chắc chắn muốn xóa địa chỉ này không?'
        );


    if (!confirmDelete) {

        return;
    }

    fetch(`/addresses/${addressId}`, {

        method: 'DELETE'

    })

        .then(res => res.text())

        .then(text => {

            if (text !== 'ok') {

                show(
                    `Xóa địa chỉ thất bại: ${text}`
                );

                return;
            }


            show(`Xóa địa chỉ thành công`);


            loadAddresses();

        });

}


// ========================================
// TẢI DANH SÁCH ĐỊA CHỈ BAN ĐẦU
// ========================================

loadAddresses();



// ========================================
// TỔNG QUAN MUA HÀNG
// ========================================

// ========================================
// TỔNG QUAN MUA HÀNG
// ========================================

function loadOrderOverview() {

    fetch('/order-overview')

        .then(res => {

            if (!res.ok) {

                show(
                    `Không thể tải tổng quan mua hàng`
                );

                return null;
            }

            return res.json();

        })

        .then(data => {

            if (!data) {
                return;
            }


            const totalProducts =
                document.querySelector(
                    '#totalProducts'
                );


            const totalOrders =
                document.querySelector(
                    '#totalOrders'
                );


            const totalMoney =
                document.querySelector(
                    '#totalMoney'
                );


            const completedOrders =
                document.querySelector(
                    '#completedOrders'
                );


            const membershipRank =
                document.querySelector(
                    '#membershipRank'
                );


            if (totalProducts) {

                totalProducts.textContent =
                    data.totalProducts || 0;

            }


            if (totalOrders) {

                totalOrders.textContent =
                    data.totalOrders || 0;

            }


            if (totalMoney) {

                totalMoney.textContent =
                    Number(
                        data.totalMoney || 0
                    ).toLocaleString('vi-VN') + 'đ';

            }


            if (completedOrders) {

                completedOrders.textContent =
                    data.completedOrders || 0;

            }

            updateMembershipRank(
                data.completedOrders,
                data.membershipRank,
                data.role
            );

        });

}



// ========================================
// CẬP NHẬT HẠNG THÀNH VIÊN
// ========================================

function updateMembershipRank(completedOrders, membershipRank, role) {
    const rankElement = document.querySelector('#membershipRank');
    if (!rankElement) return;

    if (String(role || '').toLowerCase() === 'admin') {
        rankElement.textContent = 'Không có';

        rankElement.classList.remove(
            'rank-dong',
            'rank-bac',
            'rank-vang',
            'rank-kim-cuong'
        );

        rankElement.classList.add('chua-co');
        return;
    }

    const completed = Number(completedOrders || 0);

    let rank = 'Hạng Đồng';
    let rankClass = 'rank-dong';

    if (completed >= 20) {
        rank = 'Hạng Kim Cương';
        rankClass = 'rank-kim-cuong';
    } else if (completed >= 15) {
        rank = 'Hạng Vàng';
        rankClass = 'rank-vang';
    } else if (completed >= 10) {
        rank = 'Hạng Bạc';
        rankClass = 'rank-bac';
    }

    rankElement.textContent = rank;

    rankElement.classList.remove(
        'rank-dong',
        'rank-bac',
        'rank-vang',
        'rank-kim-cuong',
        'chua-co'
    );

    rankElement.classList.add(rankClass);
}

loadOrderOverview();