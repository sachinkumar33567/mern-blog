import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body
    if (!username || !email || !password) {
        next(errorHandler(400, 'All fields are required!!'))
    }
    
    if (password.length < 6) {
        return next(errorHandler(400, 'Password must be of 6 characters'))
    }

    if (username.length < 7 || username.length > 20) {
        return next(errorHandler(400, 'Username must be in between 7 and 20 characters'))
    }
    if (username.includes(' ')) {
        return next(errorHandler(400, "Username can't contain spaces"))
    }

    if (!username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(400, 'Username can contains only letters and numbers'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = User({
        username: username.toLowerCase() + Math.random().toString(9).slice(-3),
        email,
        password: hashedPassword
    })

    try {
        await newUser.save()
        res.json('Signup successful.')
    } catch (err) {
        next(err)
    }
}


export const signin = async (req, res, next) => {
    const {email, password} = req.body
    
    if (!email || !password) {
        next(errorHandler(400, 'All fields are required!!'))
    }
    try {
        const validUser = await User.findOne({email})
        if (!validUser) {
            return next(errorHandler(404, 'User not found!!'))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password!!'))
        }

        const token = jwt.sign({id: validUser._id, isAdmin: validUser.isAdmin}, process.env.secretKey)
        const {password: pass, ...rest} = validUser._doc
        res.status(200).cookie('access_token', token, {httpOnly:true}).json(rest)
    } catch (err) {
        next(err)
    }
}


export const google = async (req, res, next) => {
    const {email, name, photoURL} = req.body

    try {
        const user = await User.findOne({email})
        
        if (user) {
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.secretKey)
            const {password, ...rest} = user._doc
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)

        } else {
            const generatedPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-3),
                email,
                password: hashedPassword,
                profilePicture: photoURL
            })
            
            await newUser.save()
            const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.secretKey)
            const {password, ...rest} = newUser._doc
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
        }
    } catch (err) {
        
    }
}