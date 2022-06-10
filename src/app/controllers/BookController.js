const res = require("express/lib/response");

class BookController {
    // [GET] /home
    index(req, res){
        res.render('book');
    }
}

module.exports = new BookController;