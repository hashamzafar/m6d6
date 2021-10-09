import createHttpError from "http-errors"
import atob from "atob"




export const basicAuthMiddleware = async (req, res, next) => {
    if (!req.header.authorization) {
        next(createHttpError(401, "Please provide credentials in Authorization header!"))
    } else {
        const decodedCredentials = atob(req.header.authorization.split(" ")[1])
        const [email, password] = decodedCredentials.split(":")
        console.log("EMAIL", email)
        console.log("PASSWORD", password)
        const author = await AuthorModel.checkCredentials(email, password)
        if (user) {
            next()
        } else {
            next(createHttpError(401, "Credentials are not valid!"))
        }
    }

    next()
}