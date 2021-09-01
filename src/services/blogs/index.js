import express from 'express'
import createError from 'http-errors'
import { BlogsModel, CommentsModel } from "./schema.js"
// import BlogsModel from './schema.js'

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

blogsRouter
    .route('/:_id/comments')

    .post(async (req, res, next) => {
        try {

            const newComment = new CommentsModel(req.body)
            const savedComment = await newComment.save()
            const updatedBlog = await BlogsModel.findByIdAndUpdate(
                req.params.id,
                { $push: { comments: savedComment } },
                { new: true }
            )
            if (updatedBlog) {
                res.send(updatedBlog)
            } else {

                next(createError(404, `Blog Post with id ${req.params.id} not found`))
            }
        } catch (error) {
            next(error)
        }
    })
    //         res.status(201).send({ _id })

    //     } catch (error) {
    //         next(error)
    //     }
    // })
    .get(async (req, res, next) => {
        try {

            const comments = await CommentsModel.find({})

            res.send(comments)

        } catch (error) {
            next(error)
        }
    })
blogsRouter
    .route("/:_id/comments/:_id")
    .get(async (req, res, next) => {
        try {

            const commentId = req.params._id

            const comment = await CommentsModel.findById(commentId)

            if (comment) {
                res.send(comment)
            } else {
                next(createError(404, `User with id ${commentId} not found!`))
            }

        } catch (error) {
            next(error)
        }
    })


    .put(async (req, res, next) => {
        try {
            const commentId = req.params._id

            const modifiedComment = await CommentsModel.findByIdAndUpdate(commentId, req.body, {
                new: true
            })

            if (modifiedBlog) {
                res.send(modifiedComment)
            } else {
                next(createError(404, `User with id ${commentId} not found!`))
            }
        } catch (error) {
            next(error)
        }
    })
    .delete(async (req, res, next) => {
        try {
            const commentId = req.params._id

            const deletedComment = await CommentsModel.findByIdAndDelete(commentId)

            if (deletedComment) {
                res.status(204).send('deleted')
            } else {
                next(createError(404, `User with id ${commentId} not found!`))
            }
        } catch (error) {
            next(error)
        }
    })


export default blogsRouter