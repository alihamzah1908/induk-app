function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage]
}

function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}


function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1]
        req.token = bearerToken;
        next();
    } else {
        res.json({
            "message": 'Belum memiliki autentikasi.'
        })
    }
}
module.exports = {
    getOffset,
    emptyOrRows,
    verifyToken
}