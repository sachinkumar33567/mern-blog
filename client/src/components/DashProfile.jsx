import { Alert, Button, Modal, TextInput} from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { updateStart, updateSuccess, updateFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess } from '../redux/user/userSlice'
import {HiOutlineExclamationCircle} from 'react-icons/hi'

export default function DashProfile() {
    const {currentUser, error, loading} = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileURL, setImageFileURL] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({})
    const filePickerRef = useRef()
    const dispatch = useDispatch()

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileURL(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])

    const uploadImage = async () => {
        setImageFileUploading(true)
        setImageFileUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageFileUploadProgress(progress.toFixed(0))
            },
            (error) => {
                setImageFileUploadError("Couldn't upload image (file must be less than 5MB)")
                setImageFileUploadProgress(null)
                setImageFile(null)
                setImageFileURL(null)
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileURL(downloadURL)
                    setFormData({...formData, profilePicture: downloadURL})
                    setImageFileUploading(false)
                })
            }
        )
    }

    const handleChange = (event) => {
        const {id, value} = event.target
        setFormData({...formData, [id]: value})
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault()
        setUpdateUserError(null)
        setUpdateUserSuccess(null)

        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload')
            return
        }
        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made')
            return
        }

        try {
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (res.ok) {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess('Profile updated successfully')
            } else {
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message)
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'delete'
            })
            const data = await res.json()
            if (res.ok) {
                dispatch(deleteUserSuccess(data))
            } else {
                dispatch(deleteUserFailure(data.message))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
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
        <div className='max-w-lg w-full p-3 mx-auto mb-16'>
            <h1 className='my-7 font-semibold text-3xl text-center'>Profile</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <input type="file" eccept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
                <div className='relative h-32 w-32 shadow-md overflow-hidden rounded-full self-center cursor-pointer'
                    onClick={() => {
                        filePickerRef.current.click()
                    }}
                >
                    {imageFileUploadProgress && (
                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                },
                                pathColor: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                                textColor: '#f88',
                                trailColor: '#d6d6d6',
                                backgroundColor: '#3e98c7',
                            }}
                        />
                    )}
                    <img src={imageFileURL || currentUser.profilePicture} alt="user"
                        className={`
                            rounded-full w-full h-full object-cover border-8 border-[lightgray]
                            ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-100'}
                        `}
                    />
                </div>
                {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
                <TextInput
                    type='text'
                    id='username'
                    placeholder='Username'
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput
                    type='email'
                    id='email'
                    placeholder='name@company.in'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput
                    type='password'
                    id='password'
                    placeholder='Password'
                    onChange={handleChange}
                />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline
                    disabled={loading || imageFileUploading}
                >
                    {loading? 'Loading...': 'Update'}
                </Button>
                {currentUser.isAdmin && (
                    <Link to='/createpost'>
                        <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
                            Create a post
                        </Button>
                    </Link>
                )}
            </form>
            <div className='flex justify-between mt-4 text-red-500'>
                <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
                <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            )}
            {error && (
                <Alert color='failure' className='mt-5'>
                    {error}
                </Alert>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <Modal.Header/>
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14
                        text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                        <h3 className='text-lg text-gray-500 dark:text-gray-400 mb-5'>
                            Are you sure you want to delete your Account?
                        </h3>
                        <div className='flex justify-between'>
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
