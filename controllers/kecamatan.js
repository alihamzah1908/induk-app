// import mysql from 'mysql';
const mysql = require('mysql');
const config = require('../config/new_db.js');
const pool = mysql.createPool(config);
const url = require('url')

pool.on('error', (err) => {
    console.error(err);
});

exports.Kecamatan = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.session.loggedin) {
            try {
                let sql = 'SELECT * FROM kecamatan';
                let query = conn.query(sql, (err, results) => {
                    if (err) throw err;
                    res.render('kecamatan', {
                        results: results,
                        url: req.url
                    })
                })
            } catch {
                res.status(401).json({
                    error: new Error('Invalid request')
                })
            }
        } else {
            res.redirect('/');
        }
    })
}

exports.listKecamatan = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.session.loggedin) {
            try {
                let sql = 'SELECT * FROM kecamatan ORDER BY kecamatan ASC';
                let query = conn.query(sql, (err, results) => {
                    if (err) throw err;
                    res.render('kecamatan/profile_kecamatan', {
                        results: results,
                        url: req.url
                    })
                })
            } catch {
                res.status(401).json({
                    error: new Error('Invalid request')
                })
            }
        } else {
            res.redirect('/');
        }
    })
}

exports.getKecamatan = (req, res) => {
    pool.getConnection(function(err, conn) {
        let sql = 'SELECT * from kecamatan';
        let query = conn.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results)
        })
    })
}

exports.profilKecamatan = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (err) throw err;
        var q = url.parse(req.url, true).query;
        let sql = 'SELECT * FROM kecamatan WHERE code_kecamatan=' + q.code;
        let query = conn.query(sql, (err, results) => {
            if (err) throw err;
            let sql2 = 'SELECT COUNT(*) as total_penduduk FROM penduduks WHERE kode_kecamatan=' + q.code;
            let query = conn.query(sql2, (err, hasil_total) => {
                if (err) throw err;
                let sql3 = 'SELECT COUNT(*) as total_perempuan FROM penduduks WHERE kode_kecamatan=' + q.code + ' AND jenis_kelamin="perempuan"';
                let query = conn.query(sql3, (err, hasil_perempuan) => {
                    if (err) throw err;
                    let sql4 = 'SELECT COUNT(*) as total_laki_laki FROM penduduks WHERE kode_kecamatan=' + q.code + ' AND jenis_kelamin="laki-laki"';
                    let query = conn.query(sql4, (err, hasil_laki_laki) => {
                        res.json({
                            data: results,
                            total_penduduk: hasil_total,
                            total_perempuan: hasil_perempuan,
                            total_laki_laki: hasil_laki_laki
                        })
                    })
                })
            })
        })
    })
}