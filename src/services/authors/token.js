import createHttpError from "http-error"
import { verifyJWT } from "./tool.js"
import AuthorModel from "./schema.js"

export const JWTAuthMiddleware = async (req, res, next) => {

    if (!req.headers.Authorization) {
        next(createHttpError(401, " please provide credentials in Authorization header!"))
    } else {
        try {

            const token = req.headers.Authorization.replace("barer", " ")

            const decordedToken = await verifyJWT(token)
            console.log(decordedToken)
            next()

            const author = await AuthorModel.findById(decordedToken._id)
            if (author) {
                req.author = author
                next()
            } else {
                next(createHttpError(404, "author not found"))
            }
        } catch (error) {
            console.log(error)
            next(createHttpError(401, "token not valid"))
        }
    }







}