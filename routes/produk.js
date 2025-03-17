var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');

router.get('/create', function (req, res, next) {
    connection.query('SELECT * FROM kategori ORDER BY id_kategori DESC', function(err, rows) {
        if (err) {
            req.flash('error', err);
            return res.send('Terjadi error: ' + err.message);
        } else {
            res.render('produk/create', { data: rows });
        }
    });
});

router.get('/', function(req, res, next) {
    connection.query(`SELECT produk.id_produk, produk.nama_produk, produk.harga_produk, kategori.nama_kategori 
                      FROM produk 
                      JOIN kategori ON produk.id_kategori = kategori.id_kategori 
                      ORDER BY produk.id_produk DESC`, function(err, rows) {
        if (err) {
            req.flash('error', err);
            res.redirect('/');
        } else {
            res.render('produk/index', { data: rows });
        }
    });
});

router.post('/store', function(req, res, next) {
    let { nama_produk, harga_produk, id_kategori } = req.body;
    let data = { nama_produk, harga_produk, id_kategori };

    connection.query('INSERT INTO produk SET ?', data, function(err, result){
        if (err) {
            req.flash('error', 'Gagal menyimpan data');
        } else {
            req.flash('success', 'Data berhasil disimpan');
        }
        res.redirect('/produk');
    });
});

router.get('/edit/:id', function(req, res, next) {
    let id_produk = req.params.id;

    connection.query('SELECT * FROM produk WHERE id_produk = ?', [id_produk], function(err, produk) {
        if (err || produk.length === 0) {
            req.flash('error', 'Produk tidak ditemukan');
            res.redirect('/produk');
        } else {
            connection.query('SELECT * FROM kategori ORDER BY id_kategori DESC', function(err, kategori) {
                if (err) {
                    req.flash('error', 'Gagal mengambil data kategori');
                    res.redirect('/produk');
                } else {
                    res.render('produk/edit', { produk: produk[0], kategori });
                }
            });
        }
    });
});

router.post('/update/:id', function(req, res, next) {
    let id_produk = req.params.id;
    let { nama_produk, harga_produk, id_kategori } = req.body;
    let data = { nama_produk, harga_produk, id_kategori };

    connection.query('UPDATE produk SET ? WHERE id_produk = ?', [data, id_produk], function(err, result) {
        if (err) {
            req.flash('error', 'Gagal mengupdate data');
        } else {
            req.flash('success', 'Data berhasil diperbarui');
        }
        res.redirect('/produk');
    });
});


router.get('/delete/:id', function(req, res, next) {
    let id_produk = req.params.id;

    connection.query('DELETE FROM produk WHERE id_produk = ?', [id_produk], function(err, result) {
        if (err) {
            req.flash('error', 'Gagal menghapus produk');
        } else {
            req.flash('success', 'Produk berhasil dihapus');
        }
        res.redirect('/produk');
    });
});

module.exports = router;
