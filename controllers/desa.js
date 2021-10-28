// import mysql from 'mysql';
const mysql = require('mysql');
const url = require('url')
const config = require('../config/new_db.js');
const pool = mysql.createPool(config);

exports.Desa = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.session.loggedin) {
            try {
                let sql = 'SELECT * FROM desa_master as a left join kecamatan as b on a.code_kecamatan=b.code_kecamatan';
                let query = conn.query(sql, (err, results) => {
                    if (err) throw err;
                    res.render('desa/index', {
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

exports.datatableDesa = (req, res) => {
    pool.getConnection(function(err, conn) {
        let sql = 'SELECT * FROM desa_master as a left join kecamatan as b on a.code_kecamatan=b.code_kecamatan';
        let query = conn.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results);
        })
    })
}

exports.getDesa = (req, res) => {
    pool.getConnection(function(err, conn) {
        var q = url.parse(req.url, true).query;
        let sql = 'SELECT * from desa_master where code_kecamatan=' + q.kode_kecamatan;
        let query = conn.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results)
        })
    })
}