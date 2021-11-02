import createHttpError from "http-error"
import { verifyJWT } from "./tool.js"
import AuthorModel from "./schema.js"

export const JWTAuthMiddleware = (req, res, next) => {
    // .1 check if Authorization is recieved, if it is not --> trigger an error (401)
    if (!req.headers.Authorization) {
        next(createHttpError(401, " please provide credentials in Authorization header!"))
    } else {
        try {
            // 2. Extract the token  from the Authorization header ( authorization : Bearer jalhdiusguhkjdskjv..sadihiulghriuaghhagf.adfihliureaghafjil.joijoi)
            const token = req.headers.Authorization.replace("barer", " ")
            // 3. verify token, if it goes fine we'll get back the payload ({id:"897y87agjabd"}), otherwise is being thrown by the jwt library 
            const decordedToken = await verifyJWT(token)
            console.log(decordedToken)
            next()
            // 4. find the user in db by id and attach him to req.user  
            const author = await AuthorModel.findById(decordedToken.id)
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