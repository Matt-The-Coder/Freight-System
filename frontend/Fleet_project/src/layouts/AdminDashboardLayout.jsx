import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react';
import RiseLoader from "react-spinners/RiseLoader";
import '/public/assets/css/adminLayout/adminChat.css'
import axios from 'axios';

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
    const bread = document.querySelector('#breadcrumbs')
    const search = document.querySelector('#hs-as-table-product-review-search')
    if(notif.style.display !== "none"){
      bread.style.zIndex = 0
      if(search){
        search.style.zIndex = 0
      }

      notif.style.display =  "none"

    }else {
      if(search){
        search.style.zIndex = -1
      }

      bread.style.zIndex = -1
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
        <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-0 w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:ps-64 dark:bg-neutral-800 dark:border-neutral-700">
    <nav
      className="flex basis-full items-center w-full mx-auto px-4 sm:px-6"
      aria-label="Global"
    >
      <div className="me-5 lg:me-0 lg:hidden">
        {/* Logo */}
        <Link to="/admin/dashboard" className="logo flex gap-5">
          <img src="/assets/img/kargada-logo.png" alt="Company Logo" className='h-[30px] object-contain'/>
          <div className="logo-name grid place-content-center">
            <span className='text-2xl'>

            <span className='text-primary_blue font-bold'>Kar</span>
            <span className='font-bold text-gray-800 dark:text-neutral-200'>gada</span>
            
            </span>

          </div>
        </Link>
        {/* End Logo */}
      </div>
      <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
        <div className="sm:hidden">
          <button
            type="button"
            className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
          >
            <svg
              className="flex-shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={11} cy={11} r={8} />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>
        <div className="hidden sm:block">
          <label htmlFor="icon" className="sr-only">
            Search
          </label>
          <div className="relative min-w-72 md:min-w-80">
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
              <svg
                className="flex-shrink-0 size-4 text-gray-400 dark:text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx={11} cy={11} r={8} />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              id="icon"
              name="icon"
              className="py-2 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
        <>
        <a href="#" className="notif" onClick={openNotif}>
              <i className='bx bx-bell text-lg dark:text-white'></i>
              {getNotificationNumber()!==0?
                            <span className="count text-md mb-36 dark:text-white">{getNotificationNumber()}</span>:null}

          </a>
                <div className="absolute top-20  notif-container overflow-y-scroll w-80 h-80 py-5 px-8 border bg-white dark:bg-neutral-800 dark:text-white" id='notif-container'>
                  <div className="notif-title border-b-2 mb-4">
                    <h3>Notifications</h3>
                  </div>
                {notifications?.map((e, i)=>{
                  let notf = document.querySelectorAll('.notif-message')
                  const setStyle = () => {
                    if (notf[i]?.id == 0) {
                      notf[i].classList.add('not-read')
                    }
                  }
                  setStyle()
                  return (
                    <a href="/admin/history/list" key={i} >
                      <div className="notif-message " ref={notifMessage} key={i} id={e.n_isRead} 
                    onClick={()=>{setIsRead(e.n_id)}}>
                      <p id='notif-date'>{formatDate(e.n_modified_date)}</p>               
                    <p id='notif-des'> {e.n_description}</p>
                  </div>
                  </a> 
                  )
                })}
                </div>
                
                </>
          <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
            <button
              id="hs-dropdown-with-header"
              type="button"
              className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
            >
              <img
                className="object-cover inline-block size-[38px] rounded-full dark:ring-neutral-800"
                src={`${uploadingServer}/${image}`}
                alt="Image Description"
              />
            </button>
            <div
              className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-900 dark:border dark:border-neutral-700"
              aria-labelledby="hs-dropdown-with-header"
            >
              <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-neutral-800">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Signed in as
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-neutral-300">
                  {user?.u_email}
                </p>
              </div>
              <div className="mt-2 py-2 first:pt-0 last:pb-0">

                <a
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                  href="/account/admin/settings/personal"
                >
<svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-10 w-10"
>
  <rect
    width={512}
    height={512}
    x={0}
    y={0}
    rx={30}
    fill="transparent"
    stroke="transparent"
    strokeWidth={0}
    strokeOpacity="100%"
    paintOrder="stroke"
  />
  <svg
    width="256px"
    height="256px"
    viewBox="0 0 24 24"
    fill="currentColor"
    x={128}
    y={128}
    role="img"
    style={{ display: "inline-block", verticalAlign: "middle" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor">
      <path
        fill="currentColor"
        d="M3 1h12.414L21 6.586V23H3V1Zm2 2v18h14V7.414L14.586 3H5Zm7 6a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3Zm-3.5 1.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0ZM6 19a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1h-2v-1a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1H6v-1Z"
      />
    </g>
  </svg>
</svg>

                  Personal Info
                </a>
                <a
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                  href="/account/admin/settings/security"
                >
<svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-10 w-10"
>
  <rect
    width={512}
    height={512}
    x={0}
    y={0}
    rx={30}
    fill="transparent"
    stroke="transparent"
    strokeWidth={0}
    strokeOpacity="100%"
    paintOrder="stroke"
  />
  <svg
    width="256px"
    height="256px"
    viewBox="0 0 48 48"
    fill="currentColor"
    x={128}
    y={128}
    role="img"
    style={{ display: "inline-block", verticalAlign: "middle" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24 43.5c1.595 0 14.7-12.374 15.094-20.26l-1.419-2.026l1.52-2.026V7.22L26.026 4.5L24 5.21l-2.026-.71L8.805 8.106V19.25l1.52 1.965l-1.418 2.026C9.385 32.54 22.417 43.5 24 43.5Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.974 4.5v8.104l-9.117 6.584H8.805M26.026 4.5v8.104l9.117 6.584h4.052m-.102 4.052l-4.76.06L24 15.44l-10.332 7.8H8.907M24 15.44V43.5"
      />
    </g>
  </svg>
</svg>


                  Security Info
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
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