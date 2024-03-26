import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)

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
    const {username, email, password} = formData
    if (!username || !email || !password) {
      setErrorMessage('Please fill out all fields.')
    }
    const options = {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    }
    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch('/api/auth/signup', options)
      const data = await res.json()
      setLoading(false)
      if (data.success === false) {
        return setErrorMessage(data.message)
      }
      if (res.ok) {
        navigate('/signin')
      }
    } catch (err) {
      setErrorMessage(err.message)
      setLoading(false)
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
            This is Vikings Blog website you can signup with your email and password or with Google.
          </p>
        </div>
        <div className='flex-1'>
          <form action="" className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username'/>
              <TextInput
                type='text'
                placeholder='Username'
                name='username'
                onChange={handleChange}
              />
            </div>
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
                placeholder='Password'
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
                'Sign Up'
              )}
            </Button>
            <OAuth/>
          </form>
          <div className='flex gap-2 mt-5 text-sm'>
            <span>Have an account?</span>
            <Link to='/signin' className='text-blue-500'>
              Sign In
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