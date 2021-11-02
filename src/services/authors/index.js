import express from "express"
import q2m from "query-to-mongo"
import { basicAuthMiddleware } from "../auth/basic.js"
import AuthorModel from "./schema.js"
// import { JWTAuthenticate } from "./tool.js"
const authorsRouter = express.Router()

authorsRouter.get("/", basicAuthMiddleware, async (req, res, next) => {
    try {
        const query = q2m(req.query)

        console.log(query)

        const total = await AuthorModel.countDocuments(query.criteria)
        const authors = await AuthorModel.find(query.criteria, query.options.fields)
            .limit(query.options.limit)
            .skip(query.options.skip)
            .sort(query.options.sort)

        res.send({ links: query.links("/authors", total), total, authors, pageTotal: Math.ceil(total / query.options.limit) })
    } catch (error) {
        next(error)
    }
})

authorsRouter.post("/", async (req, res, next) => {
    try {
        const newAuthor = new AuthorModel(req.body)
        const { _id } = await newAuthor.save()

        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})
authorsRouter.get("/:id", basicAuthMiddleware, async (req, res, next) => {
    try {
        const author = await AuthorModel.findById(req.params.id)
        res.send(author)
    } catch (error) { next(error) }
})
authorsRouter.post("/login", basicAuthMiddleware, async (req, res, next) => {
    try {
        const { email, password } = req.body

        // 1. verify Credentials
        const author = await AuthorModel.checkCredentials(email, password)
        if (author) {
            // 2. if everything is ok we are going to generate an access token
            const accessToken = await JWTAuthenticate(author)
            // 3. send token back as a response
            res.send({ accessToken })
        } else {
            // 4. if credentials are not ok we are sendinh an error (404)
        }

    } catch (error) { next(error) }
})
export default authorsRouter