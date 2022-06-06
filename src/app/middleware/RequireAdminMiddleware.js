

const requireAdmin = (req, res, next) => {
    try {
        if (res.locals.user && res.locals.user.role == 'admin') {
            return  next();
        }
      return res.render('404NotFound');
    } catch (err) {
      throw new Error(err);
    }
  };

module.exports = { requireAdmin };