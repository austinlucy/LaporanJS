var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/', function(req, res, next) {
    db.query('SELECT * FROM mahasiswa', function(err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('mahasiswa/index', { mahasiswa: [] }); 
        } else {
            res.render('mahasiswa/index', { mahasiswa: rows });
        }
    });
});


router.get('/tambah', function(req, res) {
    res.render('mahasiswa/tambah');
});

// Proses tambah mahasiswa
router.post('/tambah', function(req, res) {
    var { nama, nrp, tgl_lahir, jenis_kelamin, agama, hoby, alamat, program_studi } = req.body;

    console.log("Data yang diterima:", req.body);


    if (!nama || !nrp || !tgl_lahir || !jenis_kelamin || !alamat || !program_studi) {
        req.flash('error', 'Semua bidang wajib diisi!');
        return res.redirect('/mahasiswa/tambah');
    }

    // Pastikan tabel mahasiswa ada sebelum insert
    db.query('SHOW TABLES LIKE "mahasiswa"', function(err, rows) {
        if (err) {
            console.error("Error saat mengecek tabel mahasiswa:", err);
            req.flash('error', 'Gagal menambahkan mahasiswa: ' + err.message);
            return res.redirect('/mahasiswa/tambah');
        }

        if (rows.length === 0) {
            req.flash('error', 'Tabel mahasiswa tidak ditemukan di database.');
            return res.redirect('/mahasiswa/tambah');
        }

       
        db.query(
            `INSERT INTO mahasiswa (nama, nrp, tgl_lahir, jenis_kelamin, agama, hoby, alamat, program_studi) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nama, nrp, tgl_lahir, jenis_kelamin, agama, hoby, alamat, program_studi],
            function(err, result) {
                if (err) {
                    console.error("Error saat menyimpan ke database:", err);
                    req.flash('error', 'Gagal menambahkan mahasiswa: ' + err.message);
                    return res.redirect('/mahasiswa/tambah');
                } else {
                    req.flash('success', 'Mahasiswa berhasil ditambahkan');
                    return res.redirect('/mahasiswa');
                }
            }
        );
    });
});




router.get('/edit/:id', function(req, res) {
    var id = req.params.id;
    db.query('SELECT * FROM mahasiswa WHERE id_mahasiswa = ?', [id], function(err, rows) {
        if (err || rows.length === 0) {
            req.flash('error', 'Mahasiswa tidak ditemukan');
            res.redirect('/mahasiswa');
        } else {
            res.render('mahasiswa/edit', { mahasiswa: rows[0] });
        }
    });
});

router.post('/edit/:id', function(req, res) {
    var id = req.params.id;
    var { nama, nrp, tgl_lahir, jenis_kelamin, agama, hoby, alamat, program_studi } = req.body;
    db.query('UPDATE mahasiswa SET nama=?, nrp=?, tgl_lahir=?, jenis_kelamin=?, agama=?, hoby=?, alamat=?, program_studi=? WHERE id_mahasiswa=?',
    [nama, nrp, tgl_lahir, jenis_kelamin, agama, hoby, alamat, program_studi, id], function(err) {
        if (err) {
            req.flash('error', err);
            res.redirect('/mahasiswa');
        } else {
            req.flash('success', 'Mahasiswa berhasil diperbarui');
            res.redirect('/mahasiswa');
        }
    });
});

router.post("/hapus/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM mahasiswa WHERE id_mahasiswa = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error saat menghapus data:", err);
            return res.status(500).send("Gagal menghapus data");
        }
        res.redirect("/mahasiswa");
    });
});

router.get('/edit/:id', function(req, res) {
    var id = req.params.id;
    db.query('SELECT * FROM mahasiswa WHERE id_mahasiswa = ?', [id], function(err, rows) {
        if (err || rows.length === 0) {
            req.flash('error', 'Mahasiswa tidak ditemukan');
            res.redirect('/mahasiswa');
        } else {
            res.render('mahasiswa/edit', { mahasiswa: rows[0] });
        }
    });
});


router.post('/edit/:id', function(req, res) {
    var id = req.params.id;
    var { nama, nrp, tgl_lahir, jenis_kelamin, agama, hoby, alamat, program_studi } = req.body;
    
    db.query('UPDATE mahasiswa SET nama=?, nrp=?, tgl_lahir=?, jenis_kelamin=?, agama=?, hoby=?, alamat=?, program_studi=? WHERE id_mahasiswa=?',
    [nama, nrp, tgl_lahir, jenis_kelamin, agama, hoby, alamat, program_studi, id], function(err) {
        if (err) {
            req.flash('error', 'Gagal memperbarui data mahasiswa: ' + err.message);
            res.redirect('/mahasiswa/edit/' + id);
        } else {
            req.flash('success', 'Mahasiswa berhasil diperbarui');
            res.redirect('/mahasiswa');
        }
    });
});

module.exports = router;