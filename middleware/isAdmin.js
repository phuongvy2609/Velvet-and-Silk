const isAdmin = (req, res, next) => {

    // Chưa đăng nhập
    if (!req.session.user) { //Không có người đăng nhập
        return res.status(401).send("Chưa đăng nhập");
    }

    // Không phải admin
    if (req.session.user.role !== "admin") {  //Có đăng nhập nhưng không phải admin.
        return res.status(403).send("Không có quyền admin");
    }

    // Là admin cho đi tiếp
    next();
};

module.exports = isAdmin;