import React from 'react'
import {Button} from 'flowbite-react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import {app} from '../firebase'
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../redux/user/userSlice'
import {useNavigate} from 'react-router-dom'

export default function OAuth() {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({prompt: 'select_account'})
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const options = {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    photoURL: resultsFromGoogle.user.photoURL
                })
            }
            const res = await fetch('/api/auth/google', options)
            const data = await res.json()

            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate('/')
            }
            
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Button
            type='button'
            gradientDuoTone='pinkToOrange'
            outline
            onClick={handleGoogleClick}
        >
            <AiFillGoogleCircle className='h-6 w-6 mr-2'/>
            Continue with Google
        </Button>
    )
}
