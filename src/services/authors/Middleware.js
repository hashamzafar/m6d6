import createHttpError from "http-errors"
import atob from "atob"
import AuthorModel from "./schema.js"



export const basicAuthMiddleware = async (req, res, next) => {
    console.log(req.headers.authorization)
    if (!req.headers.authorization) {
        next(createHttpError(401, "Please provide credentials in Authorization header!"))
    } else {
        const decodedCredentials = atob(req.headers.authorization.split(" ")[1])
        const [email, password] = decodedCredentials.split(":")
        console.log("EMAIL", email)
        console.log("PASSWORD", password)
        const author = await AuthorModel.checkCredentials(email, password)
        if (author) {
            res.author = author
            next()
        } else {
            next(createError(401, "Credentials are not valid!"))
        }
    }


}