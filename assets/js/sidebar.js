function loadSidebar() {

    const sidebar = document.getElementById("sidebar");

    fetch("/admin/sidebar.html")

        .then(function (res) {

            return res.text();

        })

        .then(function (data) {

            if (!sidebar) {

                return;

            }

            sidebar.innerHTML = data;

            const menu =
                sidebar.querySelectorAll(
                    ".sidebar ul li a"
                );

            menu.forEach(function (link) {

                if (
                    link.pathname ===
                    window.location.pathname
                ) {

                    link.classList.add("active");

                }

            });

            sidebar.style.visibility = "visible";

            const sidebarElement =
                sidebar.querySelector(".sidebar");

            const sidebarToggle =
                sidebar.querySelector("#sidebarToggle");

            if (!sidebarElement || !sidebarToggle) {

                return;

            }

            const sidebarState =
                localStorage.getItem("sidebarState");

            if (sidebarState === "collapsed") {

                sidebarElement.classList.add("collapsed");

                document.body.classList.add(
                    "sidebar-collapsed"
                );

                sidebarToggle.innerHTML =
                    '<i class="fa-solid fa-chevron-right"></i>';

            } else {

                sidebarElement.classList.remove("collapsed");

                document.body.classList.remove(
                    "sidebar-collapsed"
                );

                sidebarToggle.innerHTML =
                    '<i class="fa-solid fa-bars"></i>';

            }

            sidebarToggle.addEventListener(
                "click",
                function () {

                    sidebarElement.classList.toggle(
                        "collapsed"
                    );

                    document.body.classList.toggle(
                        "sidebar-collapsed"
                    );

                    if (
                        sidebarElement.classList.contains(
                            "collapsed"
                        )
                    ) {

                        localStorage.setItem(
                            "sidebarState",
                            "collapsed"
                        );

                        sidebarToggle.innerHTML =
                            '<i class="fa-solid fa-chevron-right"></i>';

                    } else {

                        localStorage.setItem(
                            "sidebarState",
                            "expanded"
                        );

                        sidebarToggle.innerHTML =
                            '<i class="fa-solid fa-bars"></i>';

                    }

                }
            );

            loadChatBadge();

        });

}


function loadChatBadge() {

    fetch("/chat/admin/unread-count")

        .then(function (res) {

            if (!res.ok) {

                return null;

            }

            return res.json();

        })

        .then(function (data) {

            if (!data) {

                return;

            }

            const badge =
                document.getElementById("chatBadge");

            if (!badge) {

                return;

            }

            const total =
                Number(data.total) || 0;

            if (total > 0) {

                badge.textContent =
                    total > 99
                        ? "99+"
                        : total;

                badge.style.display = "flex";

            } else {

                badge.textContent = "";

                badge.style.display = "none";

            }

        })

        .catch(function () {

            return;

        });

}


loadSidebar();