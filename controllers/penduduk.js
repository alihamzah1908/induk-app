// import mysql from 'mysql';
const url = require('url')
const mysql = require('mysql');
const excel = require('exceljs');
const config = require('../config/new_db.js');
const pool = mysql.createPool(config);

// import url from 'url';

pool.on('error', (err) => {
    console.error(err);
});

exports.Penduduk = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.session.loggedin) {
            try {
                let sql = 'SELECT a.*, b.nama_kelurahan, c.kecamatan FROM penduduks as a left join desa_master as b on a.kode_desa=b.code_kelurahan left join kecamatan as c on a.kode_kecamatan=c.code_kecamatan';
                let query = conn.query(sql, (err, results) => {
                    if (err) throw err;
                    res.render('penduduk', {
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
            res.redirect('/')
        }
    })
}

exports.getPenduduk = (req, res) => {
    pool.getConnection(function(err, conn) {
        var q = url.parse(req.url, true).query;
        let sql = 'SELECT a.*, b.nama_kelurahan, c.kecamatan FROM penduduks as a left join desa_master as b on a.kode_desa=b.code_kelurahan left join kecamatan as c on a.kode_kecamatan=c.code_kecamatan WHERE a.id=' + q.id;
        let query = conn.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results)
        })
    })
}

exports.insertPenduduk = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.body.id) {
            let sql = "UPDATE penduduks SET nik='" + req.body.nik + "', no_kk='" + req.body.no_kk + "', nama_lengkap='" + req.body.nama_lengkap + "' WHERE id=" + req.body.id;
            let query = conn.query(sql, (err, results) => {
                if (err) throw err;
                res.redirect('/penduduk')
            })
        } else {
            let data = {
                nik: req.body.nik,
                no_kk: req.body.no_kk,
                nama_lengkap: req.body.nama_lengkap,
                tempat_lahir: req.body.tempat_lahir,
                tanggal_lahir: req.body.tanggal_lahir,
                jenis_kelamin: req.body.jenis_kelamin,
                hubungan_keluarga: req.body.hub_keluarga,
                kode_kecamatan: req.body.kecamatan,
                kode_desa: req.body.desa,
                alamat: req.body.alamat,
                no_rt: req.body.no_rt,
                no_rw: req.body.no_rw
            };
            let sql = 'INSERT INTO penduduks SET ?';
            let query = conn.query(sql, data, (err, results) => {
                if (err) throw err;
                res.redirect('/penduduk')
            })
        }
    })
}

exports.deletePenduduk = (req, res) => {
    pool.getConnection(function(err, conn) {
        let sql = 'DELETE FROM penduduks WHERE id=' + req.body.id + '';
        let query = conn.query(sql, (err, results) => {
            if (err) throw err;
            res.redirect('/penduduk');
        })
    })
}

exports.download_file = (req, res) => {
    pool.getConnection(function(err, conn) {
        conn.query("SELECT * FROM penduduks", function(err, penduduks, fields) {
            const jsonPenduduk = JSON.parse(JSON.stringify(penduduks))
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet('Data Penduduk');

            worksheet.columns = [
                { header: 'NIK' },
                { header: 'NO_KK' },
                { header: 'NAMA_LENGKAP' },
                { header: 'TEMPAT_LAHIR' },
                { header: 'TANGGAL_LAHIR' },
                { header: 'JENIS_KELAMIN' },
                { header: 'HUBUNGAN_KELUARGA' },
                { header: 'ALAMAT' },
                { header: 'NO_RT' },
                { header: 'NO_RW' },
                { header: 'KODE_DESA' },
                { header: 'KELURAHAN' },
                { header: 'KODE_KECAMATAN' },
                { header: 'KECAMATAN' },
            ]
            worksheet.addRows(jsonPenduduk);
            var fileName = 'FORMAT-ISIAN-PENDUDUK.xlsx';
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
            workbook.xlsx.write(res).then(function() {
                res.end();
            });
        })
    })
}

exports.getKoordinat = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (err) throw err;
        let sql = 'SELECT * FROM kecamatan';
        let query = conn.query(sql, (err, results) => {
            if (err) throw err;
            const type = 'Feature';
            const arr = [];
            for (const val of results) {
                conn.query("SELECT * FROM peta_koordinat WHERE code_kecamatan=" + val.code_kecamatan + "", function(err, coord, fields) {
                    const array = [];
                    for (const key of coord) {
                        array.push(key.koordinat.split(', '))
                    }
                })
                const arrx = {
                    type: type,
                    id: val.id,
                    properties: {
                        name: val.kecamatan,
                        density: 10
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [

                        ]
                    }
                }
                arr.push(arrx)
            }
            res.json({
                type: 'FeatureCollection',
                features: arr
            })
        })
    })
}