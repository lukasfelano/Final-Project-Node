const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    name: String,
    date: Date,
    nominal: Number,
    kategori: String
});

module.exports = mongoose.model('expense', expenseSchema);