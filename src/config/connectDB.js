const mongoose = require('mongoose');

const USER_NAME = "TanThanh0805";
const PASSWORD = "999999";
const URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.kys2a.mongodb.net/CHICPET?retryWrites=true&w=majority`;

module.exports = connectDB = async() => {
    try {
        await mongoose.connect(URI);
        console.log("Connecting to DB successfully!");
    }
    catch(error) {
        console.error(error);
    }   
};