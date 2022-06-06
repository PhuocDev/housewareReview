// const res = require("express/lib/response");
// const TaiKhoan = require('../models/User');
// const bcrypt = require('bcrypt');
// const { deleteOne, exists } = require("../models/User");

// class LoginController {
//     // [GET] /
//     index(req, res){
//         res.render('login', {layout: 'layout2.hbs'});
//     }
//     login(req, res){
//         let{tenDangNhap, matKhau} = req.body;
//         tenDangNhap.trim();
//         matKhau.trim();

//         if(tenDangNhap == "" || matKhau == "" ){

//             req.session.message = {
//                 type: 'warning-custom',
//                 intro: 'Empty input fields!',
//                 message: 'Please try again!'
//               }
//                res.redirect('login'); 
//         }else{
//             TaiKhoan.findOne({TenDangNhap: tenDangNhap}).then(data => {
//                 if(data){
//                    const hashedPassword = data.MatKhau;
//                    bcrypt.compare(matKhau, hashedPassword).then(result =>{
//                        if(result){
//                         res.redirect('home');
//                        }else{
//                         req.session.message = {
//                             type: 'danger-custom',
//                             intro: 'Incorrect password.',
//                             message: 'Please try again!'
//                           }
//                            res.redirect('login'); 
//                        }
//                    })
                    
//                 }else{

//                     req.session.message = {
//                         type: 'danger-custom',
//                         intro: 'User is not exists.',
//                         message: 'Please try again!'
//                       }
//                        res.redirect('login'); 
                   
//                 }
//             }).catch(err =>{
//                 console.log(err);
//                 req.session.message = {
//                     type: 'danger-custom',
//                     intro: 'An error occcured while checking for existing user!',
//                     message: 'Please try again!'
//                 }
//                    res.redirect('login'); 
//             })
//         }

//     }
// }

// module.exports = new LoginController;