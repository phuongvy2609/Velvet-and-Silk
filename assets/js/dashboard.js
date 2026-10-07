// =========================
// LẤY DỮ LIỆU DASHBOARD
// =========================

fetch('/dashboard')
    .then(res => res.json())
    .then(data => {

        // =========================
        // 1. THỐNG KÊ SỐ LƯỢNG
        // =========================

        document.getElementById('totalProducts').textContent = Number(data.products).toLocaleString('vi-VN');

        document.getElementById('totalOrders').textContent = Number(data.orders).toLocaleString('vi-VN');

        document.getElementById('totalReviews').textContent = Number(data.reviews).toLocaleString('vi-VN');

        document.getElementById('totalContacts').textContent = Number(data.contacts).toLocaleString('vi-VN');


        // =========================
        // 2. BIỂU ĐỒ DOANH THU
        // =========================

        const months = [
            'Tháng 1',
            'Tháng 2',
            'Tháng 3',
            'Tháng 4',
            'Tháng 5',
            'Tháng 6',
            'Tháng 7',
            'Tháng 8',
            'Tháng 9',
            'Tháng 10',
            'Tháng 11',
            'Tháng 12'
        ];


        // Mặc định doanh thu 12 tháng = 0

        const revenueData = new Array(12).fill(0);


        // Đưa dữ liệu SQL vào đúng tháng

        data.revenue.forEach(item => {
            const monthIndex = Number(item.month) - 1;
            revenueData[monthIndex] = Number(item.revenue);

        });


        // =========================
        // VẼ BIỂU ĐỒ CỘT
        // =========================

        const revenueCanvas = document.getElementById('revenueChart');

        new Chart(revenueCanvas, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [

                    {
                        label: 'Doanh thu',
                        backgroundColor: "#d399ee",
                        data: revenueData
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return Number(value).toLocaleString('vi-VN') + 'đ';
                            }

                        }

                    }

                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return Number(context.raw).toLocaleString('vi-VN') + 'đ';
                            }
                        }
                    }
                }
            }
        });


        // =========================
        // 3. BIỂU ĐỒ TRÒN
        // =========================

        const statusNames = [
            'Chờ xử lý',
            'Đang xử lý',
            'Đang giao',
            'Hoàn thành',
            'Đã hủy'
        ];


        const statusData = new Array(5).fill(0);

        data.orderStatus.forEach(item => {

            const index = statusNames.indexOf(item.status);
            if (index !== -1) {
                statusData[index] = Number(item.total);
            }
        });


        // =========================
        // VẼ BIỂU ĐỒ TRÒN
        // =========================

        const orderCanvas = document.getElementById('orderChart');

        new Chart(orderCanvas, {
            type: 'pie',
            data: {
                labels: statusNames,
                datasets: [

                    {
                        data: statusData
                    }
                ]
            },

            options: {

                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });


        // =========================
        // 4. SẢN PHẨM BÁN CHẠY
        // =========================

        const productList =
            document.getElementById('topProductList');

        productList.innerHTML = '';


        data.topProducts.forEach((product, index) => {

            productList.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>
                         <img
                            src="/${product.image}"
                            alt="ảnh"
                        >
                    </td>

                    <td>
                        ${product.product_name}
                    </td>

                    <td>
                        ${Number(product.sold).toLocaleString('vi-VN')}
                    </td>

                    <td>
                        ${Number(product.revenue).toLocaleString('vi-VN')}đ
                    </td>

                </tr>

            `;

        });

    });