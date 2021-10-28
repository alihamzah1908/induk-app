module.exports = app => {
    // const express = require('express')
    const penduduk = require("../controllers/penduduk.js");
    const desa = require("../controllers/desa.js");
    const kecamatan = require("../controllers/kecamatan.js");
    const excel = require('../controllers/excel.controller.js')
    const Auth = require('../controllers/auth.js')
    const getKoordinat = require("../controllers/penduduk");
    const apiDashboard = require("../controllers/api_dashboard");
    const apiPenduduk = require("../controllers/api_penduduk");
    // const authApi = require('../controllers/auth_api')
    const upload = require('../middleware/upload.js')
    const user = require('../controllers/users')
    const helper = require('../helper')

    var router = require("express").Router();
    // Routes Administrator
    router.get('/', (req, res) => { res.sendFile(__basedir + '/views/login.html') });
    router.get('/home', (req, res) => {
        if (req.session.loggedin) {
            res.render('Home')
        } else {
            res.redirect('/')
        }
    });
    router.get('/contact', (req, res) => {
        if (req.session.loggedin) {
            res.render('Contact')
        } else {
            res.redirect('/')
        }
    });
    router.get('/profile', (req, res) => {
        if (req.session.loggedin) {
            res.render('Profile')
        } else {
            res.redirect('/')
        }
    });
    router.get('/dokumentasi/api', (req, res) => {
        if (req.session.loggedin) {
            res.render('dokumentasi/api')
        } else {
            res.redirect('/')
        }
    })
    router.get('/profil_kecamatan', kecamatan.listKecamatan);
    router.get('/getProfileKecamatan', kecamatan.profilKecamatan);
    router.get('/logout', Auth.Logout);
    router.post('/login', Auth.Login);

    // Controller Penduduk
    router.post('/upload_file', upload.single("file"), excel.upload);
    router.post('/insert_penduduk', penduduk.insertPenduduk);
    router.post('/delete', penduduk.deletePenduduk);
    // router.get('/penduduk', penduduk.Penduduk);
    router.get('/penduduk', penduduk.Penduduk);
    router.get('/get_penduduk_row', penduduk.getPenduduk);
    router.get('/get_koordinat', penduduk.getKoordinat);
    router.get('/get_total_penduduk', async function(req, res, next) {
        try {
            res.json(await apiDashboard.getTotalPenduduk(req.query.page));
        } catch (err) {
            console.error(`Error while getting programming languages `, err.message);
            next(err);
        }
    })
    router.get('/get_jenis_kelamin', async function(req, res, next) {
        try {
            res.json(await apiDashboard.getJumlahPenduduk(req.query.page));
        } catch (err) {
            console.error(`Error while getting programming languages `, err.message);
            next(err);
        }
    })
    router.get('/download_penduduk', penduduk.download_file);

    // Controller Desa
    // router.get('/datatable_desa', desa.datatableDesa);
    router.get('/desa', desa.Desa);
    router.get('/get_desa', desa.getDesa);

    // Controller Kecamatan
    router.get('/kecamatan', kecamatan.Kecamatan);
    router.get('/get_kecamatan', kecamatan.getKecamatan);

    router.get('/users', user.getUser)
    router.get('/session', user.getSession)
    router.post('/insert_users', user.postUser)
    router.post('/delete_users', user.deleteUser)
    app.use('/', router);
}