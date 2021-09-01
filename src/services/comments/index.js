// import express from 'express'
// import createError from 'http-errors'

// import BlogsModel from "../blogs/schema"

// const commentsRouter = express.Router()

// commentsRouter
//     .route('/')
//     .post(async (req, res, next) => {
//         try {

//             const newComment = new BlogsModel(req.body)
//             const { _id } = await newComment.save()

//             res.status(201).send({ _id })

//         } catch (error) {
//             next(error)
//         }
//     })

//     .get(async (req, res, next) => {
//         try {

//             const comments = await CommentsModel.find({})

//             res.send(comments)

//         } catch (error) {
//             next(error)
//         }
//     })
// commentsRouter
//     .route("/:_id")
//     .get(async (req, res, next) => {
//         try {

//             const commentId = req.params._id

//             const comment = await CommentsModel.findById(commentId)

//             if (comment) {
//                 res.send(comment)
//             } else {
//                 next(createError(404, `User with id ${commentId} not found!`))
//             }

//         } catch (error) {
//             next(error)
//         }
//     })


//     .put(async (req, res, next) => {
//         try {
//             const commentId = req.params._id

//             const modifiedComment = await CommentsModel.findByIdAndUpdate(commentId, req.body, {
//                 new: true
//             })

//             if (modifiedBlog) {
//                 res.send(modifiedComment)
//             } else {
//                 next(createError(404, `User with id ${commentId} not found!`))
//             }
//         } catch (error) {
//             next(error)
//         }
//     })
//     .delete(async (req, res, next) => {
//         try {
//             const commentId = req.params._id

//             const deletedComment = await CommentsModel.findByIdAndDelete(commentId)

//             if (deletedComment) {
//                 res.status(204).send('deleted')
//             } else {
//                 next(createError(404, `User with id ${commentId} not found!`))
//             }
//         } catch (error) {
//             next(error)
//         }
//     })


// export default commentsRouter