import express from 'express';
import listEndpoints from "express-list-endpoints"
import mongoose from 'mongoose'

import blogsRouter from "./services/blogs/index.js"
import { badRequestErrorHandler, catchAllErrorHandler, notFoundErrorHandler } from './errorHandlers.js'

const server = express()

const port = process.env.PORT || 3001
server.use(express.json())
server.use("/blogs", blogsRouter)

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