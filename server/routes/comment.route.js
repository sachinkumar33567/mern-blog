import express from 'express'
import {varifyToken} from '../utils/varifyUser.js'
import {
    createComment,
    deleteComment,
    editComment,
    getComment,
    getComments,
    likeComment
} from '../controllers/comment.controller.js'

const router = express.Router()

router.post('/create',varifyToken, createComment)
router.get('/get/:postId', getComment)
router.put('/likeComment/:commentId', varifyToken, likeComment)
router.put('/editComment/:commentId', varifyToken, editComment)
router.delete('/deleteComment/:commentId', varifyToken, deleteComment)
router.get('/getcomments', varifyToken, getComments)

export default router