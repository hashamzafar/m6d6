import mongoose from 'mongoose'

const { Schema, model } = mongoose

const CommentSchema = new Schema({
    comment: { type: String, required: true },
    // author: {
    //     name: { type: String, require: true },
    //     avatar: { type: String, require: true }
}, {
    timestamps: true
})

const blogSchema = new Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "User", enum: ["User", "Admin"] },
    readTime: {
        value: {
            type: Number, required: true
        },
        unit: {
            type: String, required: true
        }
    },
    // author: {
    //     name: { type: String, require: true },
    //     avatar: { type: String, require: true }
    // },
    author: { type: Schema.Types.ObjectId, ref: "Author" },
    content: { type: String, require: true },
    comments: [CommentSchema]
    // comments: { type: String, require: true}
}, {
    timestamps: true
})

// export default model("Comments")
// export default model("Blogs", blogSchema, CommentSchema)
export const CommentsModel = model("Comment", CommentSchema)
export const BlogsModel = model("Blog", blogSchema)