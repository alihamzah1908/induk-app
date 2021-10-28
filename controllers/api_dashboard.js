const db = require('../services/db')
const helper = require('../helper')
const config = require('../config/config')

async function getTotalPenduduk(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT * FROM kecamatan`, [offset, config.listPerPage]
    );
    const arr = [];
    const type = 'Feature';
    for (const val of rows) {
        const coor = await db.query(
            `SELECT koordinat FROM peta_koordinat WHERE code_kecamatan=` + val.code_kecamatan + ``
        );
        const penduduk = await db.query(
            `SELECT * FROM penduduks WHERE kode_kecamatan=` + val.code_kecamatan + ``
        );
        const arry = [];
        for (const arrcoor of coor) {
            arry.push(arrcoor.koordinat.split(', '))
        }
        const arrx = {
            type: type,
            id: val.id,
            properties: {
                name: val.kecamatan,
                density: penduduk.length
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    arry
                ]
            }
        }
        arr.push(arrx)
    }
    const features = arr;
    const meta = { page };

    return {
        type: 'FeatureCollection',
        features
    }
}

async function getJumlahPenduduk(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const penduduk = await db.query(
        `SELECT * FROM penduduks`, [offset, config.listPerPage]
    );
    const perempuan = await db.query(
        `SELECT * FROM penduduks WHERE jenis_kelamin='perempuan'`, [offset, config.listPerPage]
    );
    const lakilaki = await db.query(
        `SELECT * FROM penduduks WHERE jenis_kelamin='laki-laki'`, [offset, config.listPerPage]
    );
    return {
        total_penduduk: penduduk.length,
        total_perempuan: perempuan.length,
        total_laki_laki: lakilaki.length
    }
}

module.exports = {
    getTotalPenduduk,
    getJumlahPenduduk
}