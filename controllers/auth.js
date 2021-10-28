// const { response } = require('express');
const mysql = require('mysql');
const config = require('../config/new_db');
const pool = mysql.createPool(config);
const bcrypt = require('bcrypt')

exports.Login = (req, res) => {
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
                        req.session.loggedin = true;
                        req.session.username = username;
                        req.session.role = value[0].role;
                        res.redirect('/home')
                    } else {
                        res.send('Incorrect Username and/or Password!');
                    }
                    res.end();
                }
            })
        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
    })
}

exports.Logout = (req, res) => {
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