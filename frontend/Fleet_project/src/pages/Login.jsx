import axios from 'axios';
import '../../public/assets/css/login/login.css'
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import RiseLoader from "react-spinners/RiseLoader";
const AdminLogin = () => {
  axios.defaults.withCredentials = true;
  const nav = useNavigate(null)
  const [isLoading, setIsLoading] = useState(false)
  const hostServer = import.meta.env.VITE_SERVER_HOST
  const [userName, setUserName] = useState(null)
  const [password, setPassword] = useState(null)
  const eye = useRef(null)
  const mainContainer = useRef(null)
  const passwordInput = useRef(null)
  const showPassword = () => {
    if (passwordInput.current.type == "password") {
      passwordInput.current.type = "text"
      eye.current.classList = "fa fa-eye"
    }
    else {
      passwordInput.current.type = "password"
      eye.current.classList = "fa fa-eye-slash"
    }
  }
  const isAlreadyAuthenticated = async () => {
    const res = await axios.get(`${hostServer}/alreadyauthenticated`)
    if (res.data.auth) {
      if (res.data.role == "admin") {
        nav("/admin/dashboard")
      } else {
        nav('/driver/dashboard')
      }
      console.log(res.data.role)
    } else {
      console.log(res.data.role)
    }
  }
  const handleSignUp = () => {
    mainContainer.current.classList.add("sign-up-mode")
  }
  const handleSignIn = () => {
    mainContainer.current.classList.remove("sign-up-mode")
  }

  const handleAdminLogin = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true)
      console.log("before")
      const result = await axios.post(`${hostServer}/admin/login`, { userName, password });
      console.log(result)
      if (result.data.success) {
        setIsLoading(false)
          nav('/admin/dashboard')
      }
      else {
        setIsLoading(false)
        alert(result.data.message)
      }

    } catch (error) {
      setIsLoading(false)
      console.error(error)
    }
  };
  const handleDriverLogin = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true)
      const result = await axios.post(`${hostServer}/driver/login`, { userName, password });
      console.log(result)
      if (result.data.success) {
        setIsLoading(false)
          nav('/driver/dashboard')
      }
      else {
        setIsLoading(false)
        alert(result.data.message)
      }

    } catch (error) {
      console.error(error)
    }
  };
  useEffect(() => {
    isAlreadyAuthenticated()
  }, [])

  const override = {
    display: "block",
    margin: "0 auto",
    position: "fixed"
  };

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
      <div className="AdminLogin" ref={mainContainer}>
        <div className="forms-container">
          <div className="signin-signup">
            <form action="#" className="sign-in-form" onSubmit={(e)=>{handleDriverLogin(e)}}>
              <h2 className="title">Driver Login</h2>
              <div className="input-field">
                <i className="fas fa-user" />
                <input type="text" placeholder="Username" required
                  onChange={(e) => { setUserName(e.currentTarget.value) }} />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input type="password" placeholder="Password" ref={passwordInput}
                  onChange={(e) => { setPassword(e.currentTarget.value) }} required />
                {/* <i className="fa fa-eye-slash" id='eyes' aria-hidden="true" 
           style={{position:"relative", left:"23vw", bottom: "4.1vw"}}
            onClick={showPassword} ref={eye}></i> */}
              </div>
              <input type="submit" value="Login" className="btn solid" />
              {/* <p className="social-text">Or Sign in with social platforms</p>
        <div className="social-media">
          <a href="#" className="social-icon">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-twitter" />
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-google" />
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-linkedin-in" />
          </a>
        </div> */}
            </form>
            <form action="#" className="sign-up-form" onSubmit={(e)=>{handleAdminLogin(e)}}> 
              <h2 className="title">Admin Login</h2>
              <div className="input-field">
                <i className="fas fa-user" />
                <input type="text" placeholder="Username"  required
                onChange={(e) => { setUserName(e.currentTarget.value) }} />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input type="password" required placeholder="Password" ref={passwordInput}
                  onChange={(e) => { setPassword(e.currentTarget.value) }} />
              </div>
              <input type="submit" className="btn" value="Login" />
              {/* <p className="social-text">Or Sign up with social platforms</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div> */}
            </form>
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="loginContent">
              <h3>One of administrators ?</h3>
              <p>
              Experience a seamless journey of control, efficiency, and success.
Login now to unlock the power of streamlined freight management.

              </p>
              <button className="btn transparent" id="sign-up-btn" onClick={handleSignUp} >
          Admin Login
        </button>
            </div>
            <img src="/assets/img/log.svg" className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="loginContent">
              <h3>Are you a driver ?</h3>
              <p>
              Welcome to Kargada Freight Services! Join us and enjoy a seamless shipping experience like never before.
              </p>
              <button className="btn transparent" id="sign-in-btn" onClick={handleSignIn}>
                Driver Login
              </button>
            </div>
            <img src="/assets/img/register.svg" className="image" alt="" />
          </div>
        </div>


      </div>
    </>


  )
}

export default AdminLogin;