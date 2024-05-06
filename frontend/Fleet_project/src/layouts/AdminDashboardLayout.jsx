import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react';
import RiseLoader from "react-spinners/RiseLoader";
import axios from 'axios';
import Header from '@/components/adminDashboard/Header';
import Breadcrumbs from '@/components/adminDashboard/Breadcrumbs';
import Sidebar from '@/components/adminDashboard/Sidebar';

const AdminDashboardLayout = ({ socket }) => {

    axios.defaults.withCredentials = true;
    const hostServer = import.meta.env.VITE_SERVER_HOST
    const uploadingServer = import.meta.env.VITE_UPLOADING_SERVER
    const nav = useNavigate(null)
    const [trackingDropdown, setTrackingDropdown] = useState(false)
    const [reportDropdown, setReportDropdown] = useState(false)
    const [maintenanceDropdown, setMaintenanceDropdown] = useState(false)
    const [deliveriesDropdown, setDeliveriesDropdown] = useState(false)
    const [chatsDropdown, setChatsDropdown] = useState(false)
    const [adminHistory, setAdminHistory] = useState(false)
    const [fuel, setFuel] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState(null)
    const [authError, setAuthError] = useState(null)
    const [mapStyle, setMapStyle] = useState('light-v11')
    const [theme, setTheme] = useState("light")
    const [refresh, setRefresh] = useState(false)
    const [access, setAccess] = useState("")
    const [image, setImage] = useState('')
    const [hasImage, setHasImage] = useState(false)
    const [driverHistory, setDriverHistory] = useState(false)
    const [notifications, setNotifications] = useState([])
    const notifMessage = useRef()

  const toggleDropdown = (e) => {
    switch (e.id) {
      case 'tracking': setTrackingDropdown(!trackingDropdown)
        break;
      case 'maintenance': setMaintenanceDropdown(!maintenanceDropdown)
        break;
      case "fuel": setFuel(!fuel)
        break;
      case "chats": setChatsDropdown(!chatsDropdown)
        break;
      case "adminHistory": setAdminHistory(!adminHistory)
        break;
      case "report": setReportDropdown(!reportDropdown)
        break;
      case "deliveries": setDeliveriesDropdown(!deliveriesDropdown)
        break;
        case "history": setDriverHistory(!driverHistory)
        break;
      default: null;
    }


  }

  const override = {
    display: "block",
    margin: "0 auto",
    position: "fixed"
  };
  // Send users to the server
  useEffect(() => {
    if(user?.u_username !== undefined){
      socket.emit('active', { username: user?.u_username })
    }
    return () => socket.off('active')
  }, [user, socket])

  const closeSidebar = () => {
    const adminSidebar = document.querySelector('.adminSidebar');
    adminSidebar.classList.add('close')
    adminSidebar.style.display = 'none'
    const notification = document.querySelector('.notif-container')
    if(notification?.style.display == "block"){
      notification.style.display = "none"
    }
  }
  const checkAuthentication = async () => {

    try {
      const result = await axios.get(`${hostServer}/homeAuthentication`)
      if (result.data.message) {
        setAuthError(result.data.message)
        nav("/login")
      } else {
        const userData = result.data
        setIsAuth(true);
        setUser(userData.authData.user[0])
        setRefresh(!refresh)
      }
    } catch (error) {
      console.log("Cannot fetch, server is down!")
      setAuthError("Cannot fetch, Internal server is down!")
    }


  }
  const getProfilePicture = async () => {
    if(user){
      const result = await axios.get(`${hostServer}/getProfilePicture/${user?.u_id}`)
      setImage(result.data.image[0].u_profile_picture)
      setHasImage(true)
    }
    return

  }
  const getAccess = async () => {
    if(user){
      const result = await axios.get(`${hostServer}/getAccess/${user?.u_id}`)
      const fetchedData = result.data.data[0]
      setAccess(fetchedData)
    }
    return

  }
  const handleLogout = async () => {
    try {
      setIsLoading(true)
      socket.emit('logout', { username: user.u_username })
      await axios.delete(`${hostServer}/logout`);
      setIsLoading(false)
      nav("/login")
    } catch (error) {
      console.log(error)
    }

  }
  const getNotifications = async () =>{
    try {
      setIsLoading(true)
      const notif = await axios.get(`${hostServer}/getNotifications`);
      const result = notif.data.reverse();
      setNotifications(result)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    checkAuthentication()

  }, [])
  useEffect(() => {
    getAccess()
    getProfilePicture()
    getNotifications()
  }, [refresh])

  useEffect(() => {
    socket.on('deliveryUpdate', (data) => {
      getNotifications()
      setRefresh(!refresh)
    });
    return () => socket.off('deliveryUpdate');

  }, [socket]);


  useEffect(() => {
  
    // Function to handle theme toggle
    const handleThemeToggle = () => {
      const toggler = document.getElementById('theme-toggle');
      if (toggler.checked) {
        document.body.classList.add('dark');
        setTheme("dark")
      } else {
        document.body.classList.remove('dark');
        setTheme("light")
      }
    };


  }, []); // Empty dependency array ensures this code runs only once, like componentDidMount

  const setMapTheme = () => {

    setTimeout(() => {
      if (mapStyle == 'light-v11') {
        setMapStyle('navigation-night-v1')
      } else {
        setMapStyle('light-v11')
      }
    }, 100)

  }
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    formattedDate.setDate(formattedDate.getDate());
    return formattedDate.toISOString().split("T")[0];
  };
  const openNotif = () => {
    const notif = document.querySelector('.notif-container')
    const notifbyid = document.querySelector('#notif-container')
    if(notif.style.display !== "none"){
      notif.style.display =  "none"
    }else {
      notif.style.display = "block"
      notifbyid.style.display = "block"
    }
  }
  
  const getNotificationNumber = () => {
    const notif = notifications.filter((e, i)=>{
      return e.n_isRead == 0
    })
    return notif.length
  }
  const setIsRead = async (id) =>{
    try {
      const res = await axios.put(`${hostServer}/updateNotifications/${id}`)
    } catch (error) {
      console.log(error)
    }
  }
    
  return (

<>
{isLoading && (
        <>
          <div className="loadingScreen"></div>
          <div className="loadingHandler">
            <RiseLoader
              id='loader'
              color="#1976D2"
              cssOverride={override}
              speedMultiplier={0.8}
            />
          </div>


        </>)}
<Header image={image}/>
{/* <Breadcrumbs/>
<Sidebar/> */}
  {/* Content */}
  <>
    <Outlet context={{ isLoading, setIsLoading, ...user, mapStyle, setMapStyle, theme, setImage, image, handleLogout}} />
  </>
  {/* End Content */}
</>

  )
}

export default AdminDashboardLayout;