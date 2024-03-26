import React, { useEffect, useState } from 'react'
import {Avatar, Button, Dropdown, Navbar, TextInput} from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon, FaSun} from 'react-icons/fa'
import {useDispatch, useSelector} from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { signoutSuccess } from '../redux/user/userSlice'

export default function Header() {
  const path = useLocation().pathname
  const dispatch = useDispatch()
  const {currentUser} = useSelector(state => state.user)
  const {theme} = useSelector(state => state.theme)
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromURL = urlParams.get('searchTerm')
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL)
    }

  }, [location.search])

  const handleSubmit = async (event) => {
    event.preventDefault()
    // const urlParams = new URLSearchParams(location.search)
    // urlParams.set('searchTerm', searchTerm)
    const searchQuery = `searchTerm=${searchTerm}` // urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  const handleSignout = async () => {
    try {
        const res = await fetch('/api/user/signout', {
            method: 'post'
        })

        const data = await res.json()
        if (res.ok) {
            dispatch(signoutSuccess(data))
        } else {
            console.log(data.message)
        }
    } catch (error) {
        console.log(error.message)
    }
  }

  return (
    <Navbar className="border-b-2">
      <Link to='/' className='text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r
        from-indigo-500 via-purple-500 to-pink-500
        rounded-md text-white'
        >
          Vikings
        </span>
        Blog
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          value={searchTerm}
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          onChange={event => setSearchTerm(event.target.value)}
        />
      </form>

      <Button
        className='bg-white h-10 w-12 lg:hidden'
        color='gray'
      >
        <AiOutlineSearch/>
      </Button>

      <div className='flex gap-4 items-center md:order-2'>
        <Button
          className='bg-white h-10 w-12 hidden sm:inline'
          color='gray'
          onClick={() => {dispatch(toggleTheme())}}
        >
          {theme === 'dark'? <FaSun/>: <FaMoon/>}
        </Button>
        {currentUser? (
        <Dropdown
          arrowIcon={false}
          inline
          label = {
            <Avatar
              alt='user'
              img={currentUser.profilePicture}
              rounded
            />
          }
        >
          <Dropdown.Header>
            <p>{currentUser.username}</p>
            <p className='truncate'>{currentUser.email}</p>
          </Dropdown.Header>
          <Link to='/dashboard?tab=profile'>
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Dropdown.Divider/>
          <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
        </Dropdown>
        ): (
          <Link to='/signin'>
            <Button outline gradientDuoTone='purpleToBlue'>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle/>
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
        <Link to='/about'>
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={'div'}>
        <Link to='/projects'>
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}