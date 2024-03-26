import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://th.bing.com/th/id/OIP.E5CccGy8eGWPmcQ_UH8TewHaEH?w=900&h=500&rs=1&pid=ImgDetMain'
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    slug: {
        type: String,
        unique: true,
        required: true
    }
}, {timestamps: true})


const Post = mongoose.model('Post', postSchema)

export default Post