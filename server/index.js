import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js'
import path from 'path'

dotenv.config() 

const __dirname = path.resolve()
const app = express()
const port = 3000.

app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.mongo)
.then(res => {
    console.log('Database is connected.')
}).catch(err => {
    console.log('Error while connecting mongoDB!!')
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)

app.use(express.static(path.join(__dirname, '/client/dist')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error!!'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})




app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})

// Live on https://mern-blog-r03l.onrender.com