const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const VoucherSchema = new Schema({
    voucherId: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    max: {
        type: Number,
    },
    exp: {
        type: Date,
        required: true,
    },
    codeList: [{
        code: {
            type: String,
            required: true,
            unique: true,
        },
        isUsed: {
            type: Boolean,
            required: true,
            default: false,
        },
    }],
    note: {
        type: String,
    },
}, {timestamps: true});
// VoucherSchema.plugin(uniqueValidator);

const Voucher = mongoose.model('voucher', VoucherSchema);
module.exports = Voucher;