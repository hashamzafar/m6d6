import createHttpError from "http-errors"
import AuthorModel from "../authors/schema.js"
import atob from "atob"


export const basicAuthMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) {
        next(createHttpError(404, "please porvide credential in Authorization header"))

    } else {
        const decodedCredentials = atob(req.headers.authorization.split(" ")[1])
        console.log(decodedCredentials)

        const [email, password] = decodedCredentials.split(":")

        console.log("EMAIL ", email)

        console.log("PASSWORD ", password)
        const author = await AuthorModel.checkCredentials(email, password)

        if (author) {
            req.author = author

            next()
        } else {
            next(createHttpError(401, "Credentials are not correct!"))
        }
    }
}