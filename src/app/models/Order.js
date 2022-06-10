const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema ({
    orderCode: {
        type: String,
        required: true,
        unique: true,
    },
    customerId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userCode: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
    },
    meetingTime: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
    },
    serviceList: [{
        service: {
            type: Schema.Types.Map,
        },
        type: {
            type: String,
        },
        price: {
            type: Number,
        },
        quantity: {
            type: Number,
        },
        total: {
            type: Number,
        },
    }],
    sum: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    voucher: {
        type: String,
    },
    total: {
        type: Number,
    },
    note: {
        type: String,
    },
    payment: {
        type: String,
    },
},{ timestamps: true });

const Order = mongoose.model('order', OrderSchema);
module.exports = Order;