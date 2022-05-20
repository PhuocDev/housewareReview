const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const BlogSchema = new Schema ({
/*     blogCode: {
        type: String,
        required: true,
        unique: true,
    }, */
    title: {
        type: String,
        required: [true, 'Please enter a title'],
    },
    img: {
        type: String,
        /* data: Buffer,  */
        required: [true, 'Please enter a image source'],
    },
    category: {
        type: String,
        required: [true, 'Please enter a category'],
    },
    description: {
        type: String,
        required: [true, 'Please enter a description'],
    },
    contentCode: {
        type: String,
        required: [true, 'Please enter a content'],
    }
},{ timestamps: true });

const Blog = mongoose.model('blog', BlogSchema);
module.exports = Blog;