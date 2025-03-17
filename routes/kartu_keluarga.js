var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');

router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM kartu_keluarga ORDER BY no_kk DESC', function(err, rows) {
        if (err) {
            req.flash('error', err);
            res.redirect('/kartu_keluarga');
        } else {
            res.render('kartu_keluarga/index', {
                data: rows
            });
        }
    });
});

router.get('/create', function(req, res, next) {
    res.render('kartu_keluarga/create');
});

router.post('/store', function(req, res, next) {
    try {
        let { no_kk, alamat, rt, rw, kode_pos, desa_kelurahan, kecamatan, kabupaten_kota, provinsi } = req.body;
        let data = { no_kk, alamat, rt, rw, kode_pos, desa_kelurahan, kecamatan, kabupaten_kota, provinsi };
        
        connection.query('INSERT INTO kartu_keluarga SET ?', data, function(err, result) {
            if (err) {
                req.flash('error', 'Gagal menyimpan data');
            } else {
                req.flash('success', 'Data berhasil disimpan');
            }
            res.redirect('/kartu_keluarga');
        });
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/kartu_keluarga');
    }
});

router.get('/edit/:no_kk', function(req, res, next) {
    let no_kk = req.params.no_kk;

    connection.query('SELECT * FROM kartu_keluarga WHERE no_kk = ?', [no_kk], function(err, rows) {
        if (err) {
            req.flash('error', 'Terjadi kesalahan saat mengambil data');
            res.redirect('/kartu_keluarga');
        } else if (rows.length === 0) {
            req.flash('error', 'Data tidak ditemukan');
            res.redirect('/kartu_keluarga');
        } else {
            res.render('kartu_keluarga/edit', { data: rows[0] }); // Kirim data ke EJS
        }
    });
});


router.post('/update/:no_kk', function(req, res, next) {
    try {
        let no_kk = req.params.no_kk;
        let { alamat, rt, rw, kode_pos, desa_kelurahan, kecamatan, kabupaten_kota, provinsi } = req.body;
        let data = { alamat, rt, rw, kode_pos, desa_kelurahan, kecamatan, kabupaten_kota, provinsi };
        
        connection.query('UPDATE kartu_keluarga SET ? WHERE no_kk = ?', [data, no_kk], function(err, result) {
            if (err) {
                req.flash('error', 'Gagal mengupdate data');
            } else {
                req.flash('success', 'Data berhasil diupdate');
            }
            res.redirect('/kartu_keluarga');
        });
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/kartu_keluarga');
    }
});

router.get('/delete/:no_kk', function (req, res, next) {
    let no_kk = req.params.no_kk;

    connection.query('DELETE FROM kartu_keluarga WHERE no_kk = ?', [no_kk], function (err) {
        if (err) {
            req.flash('error', 'Gagal menghapus data');
        } else {
            req.flash('success', 'Data berhasil dihapus');
        }
        res.redirect('/kartu_keluarga');
    });
});

module.exports = router;