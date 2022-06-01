const res = require("express/lib/response");
const Order = require('../models/Order');
const mongoose = require('mongoose');
const Service = require('../models/Service');
const User = require('../models/User');
const { serviceListcache } = require("../middleware/ServicesCacheMiddleware");
const { render } = require("express/lib/response");


const handleErrors = (err) => {
    let errors = { title: '', img: '', category: '', description: '', prices: '', contentCode: '' };

    if (err.message === 'Title is required') {
        errors.title = '*Title is required';
        return errors;
    }

    if (err.message === 'Image is required') {
        errors.img = '*Image is required';
        return errors;
    }

    if (err.message === "Category is required") {
        errors.category = "*Category is required";
        return errors;
    }
    if (err.message === "Description is required") {
        errors.description = "*Description is required";
        return errors;
    }
    if (err.message === "Content is required") {
        errors.contentCode = "*Content is required";
        return errors;
    }
    return errors;
}
module.exports.service_get = async(req, res) => {
    try {
        const serviceList = await Service.find({}).sort({ createdAt: -1 }).lean();
        if (serviceList) {
            //console.log(serviceList);
            res.render('service', { services: serviceList });
        } else {
            console.log('serviceList Null');
        }
    } catch (err) {
        console.log('get service error');
        console.log(err);
    }
}
module.exports.postService_get = (req, res) => {
    res.render('postService');
}

//---------------------------------------------------------------------------

module.exports.postService_post = async(req, res) => {
    console.log('req.body: ' + req.body);

    const { name, img, category, description, prices, contentCode } = req.body;

    try {
        const newService = new Service({
            name: name,
            img: img,
            category: category,
            description: description,
            prices: prices,
            contentCode: contentCode
        });
        newService.save().then(result => {
            console.log('posting successful');
            console.log(newService);
            res.status(200).json({ service: newService });
        });
    } catch (err) {
        console.log('book_post error');
        console.log(err);
        var error = JSON.stringify({ error: err });
        res.status(400).json({ error });
    }
};


module.exports.detailService_get = async(req, res) => {
    console.log('service code: ', req.params.code);
    var objectId = mongoose.Types.ObjectId(req.params.code);
    console.log('objectID: ', objectId);
    try {
        const service = await Service.findOne({ _id: objectId }).lean();
        if (service) {
            console.log(service);
            res.render('detailService', { service: service });
        } else {
            console.log('service null');
        }
    } catch (err) {
        console.log('service detail error');
        console.log(err);
    }
}

//----------------------------------edit---------------------------------------//
module.exports.editService_get = async(req, res) => {
    try {
        const serviceList = await Service.find({}).sort({ createdAt: -1 }).lean();
        if (serviceList) {
            res.render('editService', { services: serviceList });
        } else {
            console.log('serviceList Null');
        }
    } catch (err) {
        console.log('get service error');
        console.log(err);
    }
}

module.exports.editService_post = async(req, res) => {

    const { id, status } = req.body;
    var objectId = mongoose.Types.ObjectId(id);
    try {
        if (status == "delete") {
            const query = { _id: objectId };
            const result = await Service.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
                serviceListcache.del("serviceList"); //remove cache
                res.status(200).json({ status: "deleted" });
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }
        }

    } catch (err) {
        console.log('delete service error');
        console.log(err);
    }
}

//--------------------------------------------render update service------------------------------//
module.exports.updateService_get = async(req, res) => {
    console.log('service code: ', req.params.code);
    var objectId = mongoose.Types.ObjectId(req.params.code);
    console.log('objectID: ', objectId);
    try {
        const service = await Service.findOne({ _id: objectId }).lean();
        if (service) {
            //console.log(service);
            res.render('updateService', { service: service });
        } else {
            console.log('service null');
        }
    } catch (err) {
        console.log('service detail error');
        console.log(err);
    }
}

module.exports.updateService_post = async(req, res) => {

    const { id, name, img, category, description, prices, contentCode } = req.body;
    var objectId = mongoose.Types.ObjectId(id);
    const newService = new Service({
        name: name,
        img: img,
        category: category,
        description: description,
        prices: prices,
        contentCode: contentCode
    });
    try {
        const result = await Service.updateOne({ _id: objectId }, {
            name: name,
            img: img,
            category: category,
            description: description,
            prices: prices,
            contentCode: contentCode
        });
        if (result.modifiedCount === 1) {
            console.log("Successfully deleted one document.");
            res.status(200).json({ service: newService });

        } else {
            console.log("No documents matched the query. uploaded 0 documents.");
        }

    } catch (err) {
        console.log('update service error');
        console.log(err);
    }
}


//----------------------------------------------
module.exports.book_get = (req, res) => {
    res.render('book');
}

module.exports.book_post = async(req, res) => {
    const { name, phone, mail, appointment, services, note, total } = req.body;

    try {
        if (req.session.user) {
            console.log('service controller req.session.user');
            console.log(req.session.user);
        } else console.log('service controller req.session.user NULL');
        var newOrder = new Order({
            orderCode: generateOrderCode(),
            customerId: req.session.user._id,
            userCode: req.session.user.userCode,
            fullname: name,
            phone: phone,
            mail: mail,
            meetingTime: appointment,
            status: 'Chờ xác nhận',
            serviceList: services,
            sum: total,
            discount: 0,
            voucher: '',
            total: total,
            note: note,
            payment: 'Tiền mặt',
        });
        newOrder.save().then(result => {
            console.log('make order successful');
            console.log(result);
            res.status(200).json({ order: newOrder });
        });
    } catch (err) {
        console.log('book_post error');
        console.log(err);
        var error = JSON.stringify({ error: err });
        res.status(400).json({ error });
    }
}

module.exports.adminBook_post = async(req, res) => {
    const { userCode, name, phone, email, appointment, services, note, total } = req.body;

    try {
        if (req.session.user) {
            console.log('service controller req.session.user');
            console.log(req.session.user);
        } else console.log('service controller req.session.user NULL');

        const userInfo = await User.findOne({ userCode: userCode });
        if (userInfo) {
            console.log('userInfo');
            console.log(userInfo);
            var newOrder = new Order({
                orderCode: generateOrderCode(),
                customerId: userInfo._id,
                userCode: userCode,
                fullname: name,
                phone: phone,
                mail: email,
                meetingTime: appointment,
                status: 'Chờ xác nhận',
                serviceList: services,
                sum: total,
                discount: 0,
                voucher: '',
                total: total,
                note: note,
                payment: 'Tiền mặt',
            });
            newOrder.save().then(result => {
                console.log('make order successful');
                console.log(result);
                res.status(200).json({ order: newOrder });
            });
        }
        else {
            console.log('user code not found');
            res.status(400).json({ error: 'user code not found' });
        }

        
    } catch (err) {
        console.log('book_post error');
        console.log(err);
        var error = JSON.stringify({ error: err });
        res.status(400).json({ error });
    }
}

const generateOrderCode = () => {
    var orderCode = Date.now().toString();
    orderCode = orderCode.substring(orderCode.length - 9);
    return orderCode;
}

module.exports.customerListService_post = async (req, res) => {
    if (res.locals.user) {
        try {
            const serviceListFind = await Service.find({});
            if (serviceListFind) {
                var serviceListToSend = [];
                for (i = 0; i < serviceListFind.length; i++) {
                    var service = {
                        name: serviceListFind[i].name,
                        img: serviceListFind[i].img,
                        category: serviceListFind[i].category,
                        prices: serviceListFind[i].prices,
                    };
                    serviceListToSend.push(service);
                }
                res.status(200).json({ serviceList: serviceListToSend });
            }
            else {
                console.log('service list return null');
                res.status(400).json({ error: 'service list null' });
            }
        }
        catch(err) {
            console.log('customer service list get error');
            console.log(err);
            res.status(400).json({ error: err });
        }
        
    }
    else {
        console.log('user not log in');
        res.status(400).json({ error: 'user not log in' });
    }
}