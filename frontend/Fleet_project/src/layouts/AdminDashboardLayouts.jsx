import { Outlet, Link, useNavigate } from 'react-router-dom'
import '../../public/assets/css/adminLayout/dashboard.css'
import { useEffect, useRef, useState } from 'react';
import RiseLoader from "react-spinners/RiseLoader";
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
    // Function to handle side menu item clicks
    const handleSideMenuItemClick = (e) => {
      const sideLinks = document.querySelectorAll('.adminSidebar .side-menu  li a:not(.logout)');
      sideLinks.forEach((item) => item.parentElement.classList.remove('active'));
      e.target.parentElement.classList.add('active');
    };



    // Function to handle menu bar click
    const handleMenuBarClick = () => {
      const adminSidebar = document.querySelector('.adminSidebar');
      const sideMenu = document.querySelectorAll('#subMenu');
      const notif = document.querySelector('.notif-container');
      // Toggle the 'close' class on the adminSidebar
      adminSidebar.classList.toggle('close');

      // Check if the adminSidebar is closed
      if (adminSidebar.classList.contains('close')) {
        sideMenu.forEach((menu) => {
          // Apply styles for smooth hiding
          menu.style.opacity = '0.5';
        });
        adminSidebar.style.display = "none"
        notif.style.display = "none"
      } else {
        sideMenu.forEach((menu) => {
          // Apply styles for smooth showing
          menu.style.opacity = '1';
        });
        adminSidebar.style.display = "block"
        notif.style.display = "none"
      }
    };


    // // Function to handle search button click
    // const handleSearchBtnClick = (e) => {
    //   if (window.innerWidth < 576) {
    //     e.preventDefault(); // Fixed a missing function call 'preventDefault'
    //     const searchForm = document.querySelector('.content nav form');
    //     searchForm.classList.toggle('show');
    //     const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
    //     if (searchForm.classList.contains('show')) {
    //       searchBtnIcon.classList.replace('bx-search', 'bx-x');
    //     } else {
    //       searchBtnIcon.classList.replace('bx-x', 'bx-search');
    //     }
    //   }
    // };

    // // Function to handle window resize
    // const handleWindowResize = () => {
    //   const adminSidebar = document.querySelector('.adminSidebar');
    //   if (window.innerWidth < 768) {
    //     adminSidebar.classList.add('close');
    //   } else {
    //     adminSidebar.classList.remove('close');
    //   }

    //   const searchForm = document.querySelector('.content nav form');
    //   const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
    //   if (window.innerWidth > 576) {
    //     searchBtnIcon.classList.replace('bx-x', 'bx-search');
    //     searchForm.classList.remove('show');
    //   }
    // };

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

    // Attach event listeners
    const sideLinks = document.querySelectorAll('.adminSidebar .side-menu li a:not(.logout)');
    sideLinks.forEach((item) => {
      item.addEventListener('click', handleSideMenuItemClick);
    });

    const menuBar = document.querySelector('.content nav .bx.bx-menu');
    menuBar.addEventListener('click', handleMenuBarClick);

    // const searchBtn = document.querySelector('.content nav form .form-input button');
    // searchBtn.addEventListener('click', handleSearchBtnClick);

    // window.addEventListener('resize', handleWindowResize);

    const toggler = document.getElementById('theme-toggle');
    toggler.addEventListener('change', handleThemeToggle);

    // Clean up event listeners when the component unmounts
    return () => {
      sideLinks.forEach((item) => {
        item.removeEventListener('click', handleSideMenuItemClick);
      });
      menuBar.removeEventListener('click', handleMenuBarClick);
      // searchBtn.removeEventListener('click', handleSearchBtnClick);
      // window.removeEventListener('resize', handleWindowResize);
      toggler.removeEventListener('change', handleThemeToggle);
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


    <div className='DashboardLayout'>

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
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div className="adminSidebar close">
        <Link to="/admin/dashboard" className="logo">
          <img src="/assets/img/kargada-logo.png" alt="Company Logo" className='h-[100px]'/>
          <div className="logo-name">
            <span>Kar</span>gada
          </div>
        </Link>
        <ul className="side-menu">
          {access.a_admin_board == 1 &&
            <li onClick={closeSidebar}>
              <Link to="/admin/dashboard">
                <i className="bx bxs-dashboard" />
                Dashboard
              </Link>
            </li>}
          {access.a_driver_board == 1 &&
            <li onClick={closeSidebar}>
              <Link to="/driver/dashboard">
                <i className="bx bxs-dashboard" />
                Dashboard
              </Link>
            </li>}
          {access.a_deliveries == 1 && (<>
            <li id='deliveries' onClick={(e) => { toggleDropdown(e.currentTarget) }} >
              <Link to="#">
                <i className='bx bx-package' ></i>
                Deliveries
              </Link>
            </li>
            {deliveriesDropdown && (
              <>
                <li onClick={closeSidebar}>
                  <Link to="/driver/deliveries/ongoing" id='subMenu'>
                    In Progress
                  </Link>
                </li >
                <li onClick={closeSidebar}>
                  <Link to="/driver/deliveries/pending" id='subMenu'>
                    Pending
                  </Link>
                </li>
              </>
            )
            } </>)
          }
          {access.a_history == 1 && (<>

            <li id='history' onClick={(e) => { toggleDropdown(e.currentTarget) }}>
              <Link to="#">
                <i className='bx bx-history' ></i>
                History
              </Link>
            </li>
            {driverHistory && (
              <>
                <li onClick={closeSidebar}>
                  <Link to="/driver/history/deliveries" id='subMenu'>
                    Deliveries
                  </Link>
                </li >
              </>
            )
            }</>)
          }
          {access.a_driver_chat == 1 &&
            (<>
              <li id='chats'>
                <a href="/driver/chats">
                  <i className='bx bx-chat'></i>
                  Chats
                </a>
              </li>
            </>)}
          {access.a_maintenance == 1 && (<>
            <li id='maintenance' onClick={(e) => { toggleDropdown(e.currentTarget) }}>
              <Link to="#" >
                <i className='bx bx-wrench'></i>
                Maintenance
              </Link>
            </li>
            {maintenanceDropdown && (
              <>
                <li onClick={closeSidebar}>
                  <Link to="/admin/maintenance/list" id='subMenu'>
                    Maintenance List
                  </Link>
                </li >
                <li onClick={closeSidebar}>
                  <Link to="/admin/maintenance/add" id='subMenu'>
                    Add Maintenance
                  </Link>
                </li>
              </>
            )
            } </>)

          }

          {access.a_fuel == 1 && (
            <>
              <li id='fuel' onClick={(e) => { toggleDropdown(e.currentTarget) }}>
                <Link to="#">
                  <i className='bx bx-gas-pump'></i>
                  Fuel
                </Link>
              </li>
              {
                fuel && (
                  <>
                    <li onClick={closeSidebar}>
                      <Link to="/admin/fuel/manage" id='subMenu'>
                        Fuel Management
                      </Link>
                    </li >
                    <li onClick={closeSidebar}>
                      <Link to="/admin/fuel/add" id='subMenu'>
                        Add Fuel
                      </Link>
                    </li>
                  </>
                )
              }

            </>)}
          {access.a_tracking == 1 && (
            <>
              <li id='tracking' onClick={(e) => { toggleDropdown(e.currentTarget) }}>
                <Link to="#">
                  <i className='bx bx-navigation'></i>
                  Tracking
                </Link>
              </li>
              {trackingDropdown && (
                <>
                  <li onClick={closeSidebar}>
                    <Link to="/admin/tracking/trips/upcoming" id='subMenu'>
                      Upcoming Trips
                    </Link>
                  </li>
                  <li onClick={closeSidebar}>
                    <Link to="/admin/tracking/trips/ongoing" id='subMenu'>
                      OnGoing Trips
                    </Link>
                  </li>
                </>
              )
              }
            </>)}
            {access.a_maintenance == 1 && (<>
            <li id='adminHistory' onClick={(e) => { toggleDropdown(e.currentTarget) }}>
              <Link to="#">
                <i className='bx bx-history' ></i>
                History
              </Link>
            </li>
            {adminHistory && (
              <>
                <li onClick={closeSidebar}>
                  <Link to="/admin/history/list" id='subMenu'>
                    Deliveries
                  </Link>
                </li >
              </>
            )
            } </>)

          }
          {access.a_tracking == 1 && (
            <>
              <li id='report' onClick={(e) => { toggleDropdown(e.currentTarget) }}>
                <Link to="#">
                  <i className='bx bx-file'></i>
                  Reports
                </Link>
              </li>
              {reportDropdown && (
                <>
                  <li onClick={closeSidebar}>
                    <Link to="/admin/reports/sustainability" id='subMenu'>
                      Environmental
                    </Link>
                  </li>
                  <li onClick={closeSidebar}>
                    <Link to="/admin/reports/trips" id='subMenu'>
                      Deliveries
                    </Link>
                  </li>

                </>
              )
              }
            </>)}
          {access.a_admin_chat == 1 &&
            (<>
              <li id='chats' onClick={(e) => { toggleDropdown(e.currentTarget) }}>
                <a href="/admin/chat">
                  <i className='bx bx-chat'></i>
                  Chats
                </a>
              </li>
              {/* {chatsDropdown && (
                  <>
                <li>
                  <Link to="/admin/chats/list"  id='subMenu'>
                  chats List
                  </Link> 
                </li >
                <li >
                <Link to="/admin/chats/add" id='subMenu'>
                Add chats
                </Link> 
              </li>
              </>
              )
                } */}
            </>)}

          <li id='settings' onClick={(e) => { toggleDropdown(e.currentTarget) }}>
            <Link to="/account/admin/settings" onClick={closeSidebar}>
              <i className="bx bx-cog" />
              Settings
            </Link>
          </li>

        </ul>
        <ul className="side-menu">
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>
            <a className="logout">
              <i className="bx bx-log-out-circle" />
              Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Navbar */}
        <nav >
          <i className="bx bx-menu" />
          <form action="#" id='search-btn'>
            <div className="form-input">
              <input type="search" placeholder="Search..." />
              <button className="search-btn" type="submit">
                <i className="bx bx-search" />
              </button>
            </div>
          </form>
          <input type="checkbox" id="theme-toggle" hidden onClick={setMapTheme} />
          <label htmlFor="theme-toggle" className="theme-toggle" onClick={setMapTheme} />
          { access.a_admin_chat == 1
            && (

              <a href="#" className="notif" onClick={openNotif}>
              <i className='bx bx-bell'></i>
              {getNotificationNumber()!==0?
                            <span className="count">{getNotificationNumber()}</span>:null}

          </a>

            )
              
        
            }

            { access.a_admin_chat == 1
            && (
                <>
                <div className="notif-container" id='notif-container'>
                  <div className="notif-title">
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
                    <a href="/admin/history/list" key={i}>
                      <div className="notif-message" ref={notifMessage} key={i} id={e.n_isRead} 
                    onClick={()=>{setIsRead(e.n_id)}}>
                      <p id='notif-date'>{formatDate(e.n_modified_date)}</p>               
                    <p id='notif-des'> {e.n_description}</p>
                  </div>
                  </a> 
                  )
                })}
                </div>
                
                </>
            )
              
        
            }


          <Link to="/account/admin/settings" className="profile">
            <img src={hasImage? `${uploadingServer}${image}`:''} alt='Profile' />
          </Link>
        </nav>
        {/* End of Navbar */}
        <main onClick={closeSidebar}>
          <Outlet context={{ isLoading, setIsLoading, ...user, mapStyle, setMapStyle, theme, setImage, image }} />

        </main>
      </div>


    </div>
  )
}

export default AdminDashboardLayout;