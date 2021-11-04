import express from 'express';
import listEndpoints from "express-list-endpoints"
import mongoose from 'mongoose'
import cors from "cors"
// import commentsRouter from "./services/comments/index.js"
import blogsRouter from "./services/blogs/index.js"
import { badRequestErrorHandler, catchAllErrorHandler, notFoundErrorHandler, unathorizedHandler, forbiddenHandler } from './errorHandlers.js'
import authorsRouter from "./services/authors/index.js"
import passport from "passport"
import GoogleStrategy from "./services/authors/oauth.js"
const server = express()

const port = process.env.PORT || 3001

passport.use("google", GoogleStrategy)

server.use(cors())
server.use(express.json())

server.use(passport.initialize())



server.use("/blogs", blogsRouter)
server.use("/authors", authorsRouter)
// server.use('/', commentsRouter)
server.use(unathorizedHandler)
server.use(forbiddenHandler)
server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION)
mongoose.connection.on("connected", () => {
    console.log('Successfully connected to mongo!')
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log("Server is running on port ", port)
    })
})

mongoose.connection.on("error", err => {
    console.log("MONGO ERROR: ", err)
})