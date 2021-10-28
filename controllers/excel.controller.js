const db = require("../models");
const Penduduk = db.penduduk;

const readXlsxFile = require("read-excel-file/node");

const upload = async(req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload an excel file!");
        }
        let path =
            __basedir + "/public/uploads/" + req.file.filename;
        readXlsxFile(path).then((rows) => {
            rows.shift();

            let penduduks = [];
            rows.forEach((row) => {
                let penduduk = {
                    nik: row[0],
                    no_kk: row[1],
                    nama_lengkap: row[2],
                    tempat_lahir: row[3],
                    tanggal_lahir: row[4],
                    jenis_kelamin: row[5],
                    hubungan_keluarga: row[6],
                    alamat: row[7],
                    no_rt: row[8],
                    no_rw: row[9],
                    kode_desa: row[10],
                    kelurahan: row[11],
                    kode_kecamatan: row[12],
                    kecamatan: row[13],
                };
                penduduks.push(penduduk)
            });

            Penduduk.bulkCreate(penduduks)
                .then(() => {
                    res.redirect('/penduduk');
                })
                .catch((error) => {
                    res.status(500).send({
                        message: "Fail to import data into database!",
                        error: error.message,
                    });
                });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};

module.exports = { upload };