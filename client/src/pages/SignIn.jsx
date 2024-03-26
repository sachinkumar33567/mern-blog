import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { signInFailure, signInSuccess, signinStart } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const {loading, error: errorMessage} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = event => {
    const {name, value} = event.target
    setFormData({
      ...formData,
      [name]: value.trim() 
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const {email, password} = formData
    if (!email || !password) {
      return dispatch(signInFailure('Please fill out all fields!!'))
    }
    const options = {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    }
    try {
      dispatch(signinStart())
      const res = await fetch('/api/auth/signin', options)
      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFailure(data.message))
      }
      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (err) {
      dispatch(signInFailure(err.message))
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex gap-5 max-w-3xl mx-auto flex-col sm:flex-row md:items-center'>
        <div className='flex-1'>
          <Link to='/' className='text-4xl font-bold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r
            from-indigo-500 via-purple-500 to-pink-500
            rounded-md text-white'
            >
              Vikings
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5 '>
            This is Vikings Blog website you can signin  with your email and password or with Google.
          </p>
        </div>
        <div className='flex-1'>
          <form action="" className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email'/>
              <TextInput
                type='email'
                placeholder='name@company.in'
                name='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password'/>
              <TextInput
                type='password'
                placeholder='**************'
                name='password'
                onChange={handleChange}
              />
            </div>
            <Button
              type='submit'
              gradientDuoTone='purpleToPink'
              disabled={loading}
            >
              {loading? (
                <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>Loading...</span>
                </>
              ): (
                'Sign In'
              )}
            </Button>
            <OAuth/>
          </form>
          <div className='flex gap-2 mt-5 text-sm'>
            <span>Don't have an account?</span>
            <Link to='/signup' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}