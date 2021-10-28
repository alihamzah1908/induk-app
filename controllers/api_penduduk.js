const mysql = require('mysql');
const config = require('../config/new_db.js');
const pool = mysql.createPool(config);
const jwt = require('jsonwebtoken')

pool.on('error', (err) => {
    console.error(err);
});

exports.getAllPenduduk = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err)
            res.json({
                message: 'Username dan password anda salah!'
            })
        else {
            pool.getConnection(function(err, conn) {
                let sql = 'SELECT * FROM penduduks LIMIT 10';
                let query = conn.query(sql, (err, results) => {
                    var data = {
                        'status': 200,
                        'data': results
                    };
                    res.json(data);
                })
            })
        }
    })
}

exports.getPendudukByNik = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err)
            res.json({
                message: 'Token tidak ditemukan!'
            })
        else {
            pool.getConnection(function(err, conn) {
                if (err) throw err;
                let sql = 'SELECT * FROM penduduks WHERE nik=' + req.params.nik;
                let query = conn.query(sql, (err, results) => {
                    if (results.length > 0) {
                        var data = {
                            'status': 200,
                            'data': results
                        };
                        res.json(data);
                        res.end();
                    } else {
                        var data = {
                            'status': 401,
                            'information': 'Data tidak ditemukan'
                        };
                        res.json(data);
                    }
                })
            })
        }
    })
}

exports.tambahPenduduk = (req, res) => {
    pool.getConnection(function(err, conn) {
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
        let sql = 'SELECT * FROM penduduks WHERE nik=' + req.body.nik + ' OR no_kk=' + req.body.no_kk;
        let query = conn.query(sql, (err, results) => {
            if (results.length > 0) {
                res.json({
                    'status': 401,
                    'information': 'Nik atau nomor Kartu Keluarga sudah tersedia.'
                })
            } else {
                let sql = 'INSERT INTO penduduks SET ?';
                let query = conn.query(sql, data, (err, results) => {
                    if (err) throw err;
                    var data = {
                        'status': 200,
                        'information': 'Data berhasil ditambahkan'
                    };
                    res.json(data)
                })
            }
        })
    })
}


exports.updatePenduduk = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err)
            res.json({
                message: 'Token tidak ditemukan!'
            })
        else {
            pool.getConnection(function(err, conn) {
                let sql1 = 'SELECT * FROM penduduks WHERE id=' + req.body.id;
                let query = conn.query(sql1, (err, data) => {
                    if (err) throw err;
                    if (data.length > 0) {
                        let sql = "UPDATE penduduks SET nik='" + req.body.nik + "', no_kk='" + req.body.no_kk + "', nama_lengkap='" + req.body.nama_lengkap + "', tempat_lahir='" + req.body.tempat_lahir + "', tanggal_lahir='" + req.body.tanggal_lahir + "', jenis_kelamin='" + req.body.jenis_kelamin + "', hubungan_keluarga='" + req.body.hub_keluarga + "', kode_kecamatan='" + req.body.kecamatan + "', kode_desa='" + req.body.desa + "', alamat='" + req.body.alamat + "', no_rt='" + req.body.no_rt + "', no_rw='" + req.body.no_rw + "' WHERE id=" + req.body.id;
                        let query = conn.query(sql, (err, results) => {
                            if (err) throw err;
                            var data = {
                                'status': 200,
                                'information': 'Data berhasil diubah'
                            };
                            res.json(data)
                        })
                    } else {
                        res.json({
                            "status": 401,
                            "information": 'Data tidak ditemukan'
                        })
                    }
                });
            })
        }
    })
}

exports.deletePenduduk = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err)
            res.json({
                message: 'Token tidak ditemukan!'
            })
        else {
            pool.getConnection(function(err, conn) {
                let sql = 'SELECT * FROM penduduks WHERE id=' + req.params.id;
                let query = conn.query(sql, (err, results) => {
                    if (results.length > 0) {
                        let sql = 'DELETE FROM penduduks WHERE id=' + req.params.id;
                        let query = conn.query(sql, (err, results) => {
                            if (err) throw err;
                            var data = {
                                'status': 200,
                                'information': 'Data berhasil dihapus'
                            };
                            res.json(data)
                        })
                    } else {
                        res.json({
                            message: 'Data tidak ditemukan!'
                        })
                    }
                })
            })
        }
    })
}