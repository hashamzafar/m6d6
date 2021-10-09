import mongoose from "mongoose"
import bcrypt from "bcrypt"
const { Schema, model } = mongoose

const AuthorSchema = new Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
    },
    { timestamps: true }
)
AuthorSchema.pre("save", async function (next) {
    const newAuthor = this
    const plainPw = newAuthor.password
    if (newAuthor.isModified("password")) {
        newAuthor.password = await bcrypt.hash(plainPw, 10)
    }
    next()
})

AuthorSchema.methods.toJson = function () {
    const authorDocument = this
    const authorObject = authorDocument.toObject()

    delete authorObject.password

    return authorObject

}

AuthorSchema.statics.checkCredentials = async function (email, plainPw) {
    const author = this.findOne({ email })

    if (author) {
        const isMatch = await bcrypt.compare(plainPw, author.password)
        if (isMatch) return author
        else return null
    } else {
        return null
    }

}



export default model("Author", AuthorSchema)