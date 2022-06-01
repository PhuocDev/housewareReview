// const res = require("express/lib/response");
// const TaiKhoan = require('../models/User');
// const bcrypt = require('bcrypt');

// class SignupController {
//     // [GET] /

//     signup_get(req, res){
//         res.render('signup', {layout: 'layout2.hbs'});
//     }

//     signup_post(req,res){
//         let {tenDangNhap, matKhau,xacNhanMatKhau, hoTen, soDienThoai, mail } = req.body;
//         tenDangNhap = tenDangNhap.trim();
//         matKhau = matKhau.trim();
//         hoTen = hoTen.trim();
//         soDienThoai = soDienThoai.trim();
//         mail = mail.trim();

//         if(tenDangNhap == "" || mail == "" || matKhau == "" || hoTen == "" || soDienThoai == ""){

//             req.session.message = {
//                 type: 'warning-custom',
//                 intro: 'Empty input fields!',
//                 message: 'Please try again!'
//               }
//                res.redirect('signup'); 
//         }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail)){
           
//             req.session.message = {
//                 type: 'danger-custom',
//                 intro: 'Invalid email entered!',
//                 message: 'Please try again!'
//               }
//                res.redirect('signup'); 
//         }else if(matKhau.lenght < 8){
//             req.session.message = {
//                 type: 'warning-custom',
//                 intro: 'Password is too short!',
//                 message: 'Please try again!'
//               }
//                res.redirect('signup'); 
//         }else if(matKhau != xacNhanMatKhau){
            
//             req.session.message = {
//                 type: 'danger-custom',
//                 intro: 'Password is different with repeat password!',
//                 message: 'Please try again!'
//               }
//                res.redirect('signup'); 
//         }else if(!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(soDienThoai)){

//             req.session.message = {
//                 type: 'danger-custom',
//                 intro: 'Invalid phone entered.',
//                 message: 'Please try again!'
//               }
//                res.redirect('signup'); 
//         }else{
//             TaiKhoan.findOne({TenDangNhap: tenDangNhap}).then(result => {
//                 if(result){

//                     req.session.message = {
//                         type: 'warning-custom',
//                         intro: 'User already exists.',
//                         message: 'Please try again!'
//                       }
//                        res.redirect('signup'); 
//                 }else{
//                     //create new user
//                     const saltRound = 10;
//                     bcrypt.hash(matKhau, saltRound).then(hashedPassword =>{
//                         const newUser = new TaiKhoan({
//                             TenDangNhap: tenDangNhap,
//                             MatKhau: hashedPassword,
//                             HoTen: hoTen,
//                             SoDienThoai: soDienThoai,
//                             Mail: mail
//                         });
//                         newUser.save().then(result => {

//                             req.session.message = {
//                                 type: 'success-custom',
//                                 intro: '',
//                                 message: 'Signup successful!'
//                             }
//                             res.redirect('signup'); 
//                         })
//                         .catch(err => {

//                             req.session.message = {
//                                 type: 'danger-custom',
//                                 intro: 'An error occured while saving taiKhoan!',
//                                 message: 'Please try again!'
//                               }
//                                res.redirect('signup'); 
//                         })
//                     })
//                     .catch(err => {

//                         req.session.message = {
//                             type: 'danger-custom',
//                             intro: 'An error occured while hashing password!',
//                             message: 'Please try again!'
//                           }
//                            res.redirect('signup'); 
//                     })
//                 }
//             }).catch(err =>{
//                 console.log(err);
//                 req.session.message = {
//                     type: 'danger-custom',
//                     intro: 'An error occcured while checking for existing user!',
//                     message: 'Please try again!'
//                   }
//                    res.redirect('signup'); 
//             })
//         }
//     }
    
// }

// module.exports = new SignupController;