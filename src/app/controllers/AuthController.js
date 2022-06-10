const res = require("express/lib/response");
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { deleteOne, exists } = require("./../models/User");


// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', password: '', confirmPassword: '', fullname: '', mail: '', phone: '' };
    
    // incorrect username
    if (err.message === 'Incorrect username') {
        errors.username = 'Username not registered';
        return errors;
    }
  
    // incorrect password
    if (err.message === 'Incorrect password') {
        errors.password = 'Incorrect password';
        return errors;
    }
  
    // duplicate username error
    if (err.message.includes('expected `username` to be unique')) {
        errors.username = 'Username already registered';
        return errors;
    }

    // password does not match
    if (err.message === "Password does not match") {
        errors.confirmPassword = "Password does not match";
        return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
        console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
        });
    }
  
    return errors;
}
  
// create json web token
const maxAge = 1 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'ChicPet super secret password', {
        expiresIn: maxAge
    });
}



// Login Controller
module.exports.login_get = (req, res) => {
    res.render('login', {layout: 'layout2.hbs'});
}

module.exports.login_post = async (req, res) => {

    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

// Sign up
module.exports.signup_get = (req, res) => {
    res.render('signup', {layout: 'layout2.hbs'});
}

module.exports.signup_post = async (req, res) => {

    const { username, password, fullname, phone, mail } = req.body;

    try {
        const salt = await bcrypt.genSalt();
        encryptedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ role: 'customer', userCode: generateUserCode(), username, password: encryptedPassword, fullname, phone, mail, address: '' });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
        console.log('sign up successful');
    }
    catch(err) {
        console.log('sign up post error');
        console.log(err);
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const generateUserCode = () => {
    var orderCode = Date.now().toString();
    orderCode = orderCode.substring(orderCode.length - 9);
    return orderCode;
}

// Log out
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}
