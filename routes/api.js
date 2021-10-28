module.exports = app => {
    const apiPenduduk = require("../controllers/api_penduduk");
    const helper = require('../helper')
    var router = require("express").Router();
    const AuthApi = require('../controllers/authapi')

    // Route API penduduk
    router.post('/api/login_api', AuthApi.LoginApi)
    router.get('/api/get_all_penduduk', helper.verifyToken, apiPenduduk.getAllPenduduk)
    router.get('/api/get_penduduk/:nik', helper.verifyToken, apiPenduduk.getPendudukByNik)
    router.post('/api/add_penduduk', apiPenduduk.tambahPenduduk)
    router.post('/api/update_penduduk', helper.verifyToken, apiPenduduk.updatePenduduk)
    router.get('/api/delete_penduduk/:id', helper.verifyToken, apiPenduduk.deletePenduduk)
    app.use('/', router);
}