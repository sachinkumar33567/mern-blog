import { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashPosts from '../components/DashPosts'
import DashUsers from '../components/DashUsers'
import DashComments from '../components/DashComments'
import DashboardComp from '../components/DashboardComp'

export default function Dashboard() {
  const location = useLocation()
  const [tab, setTab] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromURL = urlParams.get('tab')
    if (tabFromURL) {
      setTab(tabFromURL)
    }
  }, [location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* Sidebar */}
      <div className='md:w-56'>
        <DashSidebar/>
      </div>

      {/* Profile */}
      {tab === 'profile' && <DashProfile/>}

      {/* Posts */}
      {tab === 'posts' && <DashPosts/>}

      {/* Users */}
      {tab === 'users' && <DashUsers/>}

      {/* Comments */}
      {tab === 'comments' && <DashComments/>}

      {/* Dashboard Component */}
      {tab === 'dash' && <DashboardComp/>}
    </div>
  )
}