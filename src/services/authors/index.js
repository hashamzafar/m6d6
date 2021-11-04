import express from "express"
import q2m from "query-to-mongo"
import { basicAuthMiddleware } from "../auth/basic.js"
import AuthorModel from "./schema.js"
import { JWTAuthMiddleware } from "./token.js"
import passport from "passport"
import { JWTAuthenticate, verifyRefreshAndGenerateTokens } from "./tool.js"
import { adminOnlyMiddleware } from "../auth/admin.js"
const authorsRouter = express.Router()


authorsRouter.post("/register", async (req, res, next) => {
    try {
        const newAuthor = new AuthorModel(req.body)
        const { _id } = await newAuthor.save()
        res.send({ _id })
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const authors = await AuthorModel.find()
        res.send(authors)
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
        console.log(req.user)
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})

authorsRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
        req.author.name = "John"
        await req.author.save()

        res.send()
    } catch (error) {
        next(error)
    }
})

authorsRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
        await req.author.deleteOne()

        res.send()
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] })) // This endpoint receives Google login requests from our FE and redirects them to Google

authorsRouter.get("/googleRedirect", passport.authenticate("google"), async (req, res, next) => {
    try {
        console.log(req.author) // we are going to receive the tokens here thanks to the passportNext function and the serializeUser function
        res.redirect(`http://localhost:3000?accessToken=${req.author.tokens.accessToken}&refreshToken=${req.author.tokens.refreshToken}`)
    } catch (error) {
        next(error)
    }
}) // This endpoint receives the response from Google

authorsRouter.get("/:id", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
    try {
        const authors = await AuthorModel.findById(req.params._id)
        res.send(authors)
    } catch (error) {
        next(error)
    }
})

authorsRouter.post("/login", async (req, res, next) => {
    try {
        // 1. Get email and password from req.body
        const { email, password } = req.body

        // 2. Verify credentials
        const author = await AuthorModel.checkCredentials(email, password)

        if (author) {
            // 3. If credentials are ok we are going to generate access token and refresh token
            const { accessToken, refreshToken } = await JWTAuthenticate(author)

            // 4. Send token back as a response
            res.send({ accessToken, refreshToken })
        } else {
            next(createHttpError(401, "Credentials are not ok!"))
        }
    } catch (error) {
        next(error)
    }
})

authorsRouter.post("/refreshToken", async (req, res, next) => {
    try {
        const { currentRefreshToken } = req.body

        // 1. Check the validity of currentRefreshToken (check if it is not expired, check the integrity, check if currentRefreshToken is in db)

        // 2. If everything is fine --> generate a new pair of tokens (accessToken and refreshToken)
        const { accessToken, refreshToken } = await verifyRefreshAndGenerateTokens(currentRefreshToken)

        // 3. Send tokens back as a response
        res.send({ accessToken, refreshToken })
    } catch (error) {
        next(error)
    }
})

authorsRouter.post("/logout", JWTAuthMiddleware, async (req, res, next) => {
    try {
        req.author.refreshToken = null
        await req.author.save()
        res.send()
    } catch (error) {
        next(error)
    }
})


// authorsRouter.get("/", basicAuthMiddleware, async (req, res, next) => {
//     try {
//         const query = q2m(req.query)

//         console.log(query)

//         const total = await AuthorModel.countDocuments(query.criteria)
//         const authors = await AuthorModel.find(query.criteria, query.options.fields)
//             .limit(query.options.limit)
//             .skip(query.options.skip)
//             .sort(query.options.sort)

//         res.send({ links: query.links("/authors", total), total, authors, pageTotal: Math.ceil(total / query.options.limit) })
//     } catch (error) {
//         next(error)
//     }
// })

// authorsRouter.post("/", async (req, res, next) => {
//     try {
//         const newAuthor = new AuthorModel(req.body)
//         const { _id } = await newAuthor.save()

//         res.status(201).send({ _id })
//     } catch (error) {
//         next(error)
//     }
// })
// authorsRouter.get("/:id", basicAuthMiddleware, async (req, res, next) => {
//     try {
//         const author = await AuthorModel.findById(req.params.id)
//         res.send(author)
//     } catch (error) { next(error) }
// })
// authorsRouter.post("/login", basicAuthMiddleware, async (req, res, next) => {
//     try {
//         const { email, password } = req.body


//         const author = await AuthorModel.checkCredentials(email, password)
//         if (author) {


//             const accessToken = await JWTAuthenticate(author)

//             res.send({ accessToken })
//         } else {
//             next.send(createHttpError(401, "Credential are not authorized"))

//         }

//     } catch (error) {
//         next(error)
//     }
// })
export default authorsRouter