import mongoose from 'mongoose'

const { Schema, model } = mongoose

const blogSchema = new Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
        value: {
            type: Number, required: true
        },
        unit: {
            type: String, required: true
        }
    },
    author: {
        name: { type: String, require: true },
        avatar: { type: String, require: true }
    },
    content: { type: String, require: true }

}, {
    timestamps: true
})


export default model("Blogs", blogSchema)