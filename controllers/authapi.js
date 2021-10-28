const mysql = require('mysql');
const jwt = require('jsonwebtoken')
const config = require('../config/new_db');
const pool = mysql.createPool(config);
const bcrypt = require('bcrypt')

exports.LoginApi = (req, res) => {
    pool.getConnection(function(err, conn) {
        var username = req.body.username;
        var password = req.body.password;
        if (username && password) {
            let sql2 = 'select * FROM users WHERE username="' + req.body.username + '"';
            let query = conn.query(sql2, (err, value) => {
                if (err) throw err;
                if (value.length > 0) {
                    const check = bcrypt.compareSync(password, value[0].password)
                    if (check == true) {
                        jwt.sign({ value }, 'secretkey', (err, token) => {
                            res.json({
                                'Authorization': 'Bearer ' + token,
                                'Username': value[0].username,
                                'Email': value[0].email,
                                'Role name': value[0].role,
                                'id': value[0].id,
                            })
                        })
                    } else {
                        res.json({
                            status: 401,
                            message: 'Username atau password anda salah !'
                        })
                    }
                }
            })
        } else {
            res.send('Mohon masukan username dan password anda!');
            res.end();
        }
    })
}

exports.LogoutApi = (req, res) => {
    pool.getConnection(function(err, conn) {
        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    })
}