import express from 'express'
import createError from 'http-errors'

import BlogsModel from './schema.js'

const blogsRouter = express.Router()

blogsRouter
    .route('/')
    .post(async (req, res, next) => {
        try {

            const newblog = new BlogsModel(req.body)
            const { _id } = await newblog.save()

            res.status(201).send({ _id })

        } catch (error) {
            next(error)
        }
    })

    .get(async (req, res, next) => {
        try {

            const blogs = await BlogsModel.find({})

            res.send(blogs)

        } catch (error) {
            next(error)
        }
    })
blogsRouter
    .route("/:_id")
    .get(async (req, res, next) => {
        try {

            const blogId = req.params._id

            const blog = await BlogsModel.findById(blogId)

            if (blog) {
                res.send(blog)
            } else {
                next(createError(404, `User with id ${blogId} not found!`))
            }

        } catch (error) {
            next(error)
        }
    })


    .put(async (req, res, next) => {
        try {
            const blogId = req.params._id

            const modifiedBlog = await BlogsModel.findByIdAndUpdate(blogId, req.body, {
                new: true
            })

            if (modifiedBlog) {
                res.send(modifiedBlog)
            } else {
                next(createError(404, `User with id ${blogId} not found!`))
            }
        } catch (error) {
            next(error)
        }
    })
    .delete(async (req, res, next) => {
        try {
            const blogId = req.params._id

            const deletedBlog = await BlogsModel.findByIdAndDelete(blogId)

            if (deletedBlog) {
                res.status(204).send('deleted')
            } else {
                next(createError(404, `User with id ${blogId} not found!`))
            }
        } catch (error) {
            next(error)
        }
    })


export default blogsRouter