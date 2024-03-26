import {Alert, Button, FileInput, Select, TextInput} from 'flowbite-react'
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {useNavigate} from 'react-router-dom'

export default function CreatePost() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [publishError, setPublishError] = useState(null)
  const [formData, setFormData] = useState({})

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image')
        return
      }
      setImageUploadError(null)
      const storage = getStorage(app)
      const fileName = new Date().getTime() + '-' + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageUploadProgress(progress.toFixed(0))
        },
        error => {
          setImageUploadError('Image upload failed')
          setImageUploadProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            setImageUploadProgress(null)
            setImageUploadError(null)
            setFormData({...formData, image: downloadURL})
          })
        }
      )
    } catch (error) {
      setImageUploadProgress(null)
      setImageUploadError('Image upload failed')
      console.log(error)
    }
  }

  const handleChange = (event) => {
    const {id, value} = event.target
    setFormData({...formData, [id]: value})
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const res = await fetch('/api/post/create', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setPublishError(null)
        navigate(`/post/${data.slug}`)
      } else {
        setPublishError(data.message)
        return
      }

    } catch (error) {
      setPublishError('Something went wrong!')
    }
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-3 mb-16">
        <h3 className="text-3xl font-semibold text-center my-7">Create a post</h3>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput type='text' placeholder='Title' id='title'
              className='flex-1' required onChange={handleChange}/>
            <Select id='category' onChange={handleChange}>
              <option value="uncategorized">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <div className='flex gap-4 items-center justify-between p-3 border-4 border-teal-500 border-dotted'>
            <FileInput type='file' accept='image/*' onChange={(e) => {setFile(e.target.files[0])}}/>
            <Button type='button' gradientDuoTone='purpleToBlue' size='sm'
              outline onClick={handleUploadImage} disabled={imageUploadProgress}>
              {imageUploadProgress ? (
                <div className='h-16 w-16'>
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>
                </div>
              ): 'Upload image'}
            </Button>
          </div>
          {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
          {formData.image && (
            <img src={formData.image} alt="upload" className='w-full h-72 object-cover'/>
          )}
          <ReactQuill theme='snow' placeholder='Write about your post...' id='content'
          className='h-72 mb-12' required onChange={value => {setFormData({...formData, content: value})}}/>
          <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
          {publishError && <Alert color='failure'>{publishError}</Alert>}
        </form>
    </div>
  )
}

// 6:30:53