var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');

router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM kategori ORDER BY id_kategori DESC', function(err, rows) {
        if (err) {
            req.flash('error', err);
            res.redirect('/kategori');
        } else {
            res.render('kategori/index', {
                data: rows
            });
        }
    });
});

router.get('/create', function(req, res, next) {
    res.render('kategori/create');
});

router.post('/store', function(req, res, next) {
    try {
        let { nama_kategori } = req.body;
        let data = { nama_kategori };
        connection.query('INSERT INTO kategori SET ?', data, function(err, result) {
            if (err) {
                req.flash('error', 'Gagal menyimpan data');
            } else {
                req.flash('success', 'Data berhasil disimpan');
            }
            res.redirect('/kategori');
        });
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/kategori');
    }
});

router.get('/edit/:id', function(req, res, next) {
    let id = req.params.id;
    connection.query('SELECT * FROM kategori WHERE id_kategori = ?', [id], function(err, rows) {
        if (err || rows.length === 0) {
            req.flash('error', 'Query gagal atau data tidak ditemukan');
            res.redirect('/kategori');
        } else {
            res.render('kategori/edit', {
                id: rows[0].id_kategori,
                nama: rows[0].nama_kategori
            });
        }
    });
});

router.post('/update/:id', function(req, res, next) {
    try {
        let id = req.params.id;
        let { nama_kategori } = req.body;
        let data = { nama_kategori };
        connection.query('UPDATE kategori SET ? WHERE id_kategori = ?', [data, id], function(err, result) {
            if (err) {
                req.flash('error', 'Gagal mengupdate data');
            } else {
                req.flash('success', 'Data berhasil diupdate');
            }
            res.redirect('/kategori');
        });
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/kategori');
    }
});

router.get('/delete/:id', function (req, res, next) {
    let id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        req.flash('error', 'ID tidak valid');
        return res.redirect('/kategori');
    }

    connection.query('DELETE FROM kategori WHERE id_kategori = ' +id, function (err) {
        if (err) {
            req.flash('error', 'Gagal menghapus data: ');
        } else {
            req.flash('success', 'Data berhasil dihapus');
        }
        res.redirect('/kategori');
    });
});

module.exports = router;