function show (text) {
    const notice = document.querySelector('.notice');

    notice.innerText = text;
    notice.style.display = "block";

    setTimeout(() => {
        notice.style.display = "none";
    }, 2800);
}

