module.exports = (sequelize, Sequelize) => {
    const Penduduk = sequelize.define("penduduk", {
        nik: {
            type: Sequelize.STRING
        },
        no_kk: {
            type: Sequelize.STRING
        },
        nama_lengkap: {
            type: Sequelize.STRING
        },
        tempat_lahir: {
            type: Sequelize.STRING
        },
        tanggal_lahir: {
            type: Sequelize.STRING
        },
        jenis_kelamin: {
            type: Sequelize.STRING
        },
        hubungan_keluarga: {
            type: Sequelize.STRING
        },
        alamat: {
            type: Sequelize.TEXT
        },
        no_rt: {
            type: Sequelize.STRING
        },
        no_rw: {
            type: Sequelize.STRING
        },
        kode_desa: {
            type: Sequelize.STRING
        },
        kelurahan: {
            type: Sequelize.STRING
        },
        kode_kecamatan: {
            type: Sequelize.BOOLEAN
        },
        kecamatan: {
            type: Sequelize.BOOLEAN
        }
    });
    return Penduduk;
};