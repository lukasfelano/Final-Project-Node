const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    name: String, // contoh : 18-Maret-2020 (ambil form date lalu diubah bulan)
    date: Date, // ambil dari form date sama seperti name
    nominal: Number, // contoh : 10000000
    kategori: String // diambil dari value select
});

module.exports = mongoose.model('expense', expenseSchema);