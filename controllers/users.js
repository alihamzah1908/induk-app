const mysql = require('mysql');
const config = require('../config/new_db');
const pool = mysql.createPool(config);
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
// import url from 'url';

pool.on('error', (err) => {
    console.error(err);
});

exports.getUser = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.session.loggedin) {
            try {
                let sql = 'select * from users WHERE role != "super admin"';
                let query = conn.query(sql, (err, results) => {
                    if (err) throw err;
                    let sql2 = 'select * FROM users WHERE username="' + req.session.username + '"';
                    let query = conn.query(sql2, (err, value) => {
                        if (err) throw err;
                        res.render('users/index', {
                            results: results,
                            url: req.url,
                            loggedin: value[0].role
                        })
                    })
                })
            } catch {
                res.status(401).json({
                    error: new Error('Invalid request')
                })
            }
        }
    })
}

exports.postUser = (req, res) => {
    pool.getConnection(function(err, conn) {
        let data = {
            name: req.body.nama_lengkap,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, salt),
            email: req.body.email,
            role: req.body.role,
        };
        let sql = 'INSERT INTO users SET ?';
        let query = conn.query(sql, data, (err, results) => {
            if (err) throw err;
            res.redirect('/users')
        })
    })
}

exports.deleteUser = (req, res) => {
    pool.getConnection(function(err, conn) {
        let sql = 'DELETE FROM users WHERE id=' + req.body.id + '';
        let query = conn.query(sql, (err, results) => {
            if (err) throw err;
            res.redirect('/users');
        })
    })
}

exports.getSession = (req, res) => {
    pool.getConnection(function(err, conn) {
        let sql2 = 'select * FROM users WHERE username="' + req.session.username + '"';
        let query = conn.query(sql2, (err, value) => {
            if (err) throw err;
            res.json({
                data: value
            })
        })
    })
}