const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'ChicPet super secret password', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'ChicPet super secret password', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        console.log('checkUser user = null');
        next();
      } else {
        let user = await User.findById(decodedToken.id).lean();
        req.session.user = user;
        res.locals.user = user;
        // console.log('checkUser user not null');
        // console.log(user);
        // console.log('req.session.user');
        // console.log(req.session.user);
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };