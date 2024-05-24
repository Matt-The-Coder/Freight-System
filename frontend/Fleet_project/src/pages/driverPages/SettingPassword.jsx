import { useOutletContext, useNavigate, Form } from 'react-router-dom'
import '/public/assets/css/adminLayout/settings.css'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import Breadcrumbs from '@/components/driverDashboard/Breadcrumbs'
import Sidebar from '@/components/driverDashboard/Sidebar'
import { useEffect, useRef, useState } from 'react'
const SettingPassword = () => {
    const hostServer = import.meta.env.VITE_SERVER_HOST
    const { d_id, setIsLoading,image, setImage, handleLogout } = useOutletContext()
    const [isDisabled, setIsDisabled] = useState(true)
    const [uPassword, setUPassword] = useState("")
    const [cP, setCP] = useState("")
    const [nP, setNP] = useState('')
    const [cNP, setCNP] = useState('')
    const [oldPasswordError, setOldPasswordError] = useState(false)
    const [mismatchedPassword, setMismatchedPassword] = useState(false)
    const [success, setSuccess] = useState(false)
    const nav = useNavigate()

 
    const getInfo = async () => {
        try {
            setIsLoading(true)
            const result = await axios.get(`${hostServer}/getdriveraccountbyid/${d_id}`)
            if (result.data.message) {
                // nav("/login")
            } else {
                const userData = result.data
                setUPassword(userData[0].d_password)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
        useEffect(()=>{

            getInfo()
        }, [d_id])
    
    const updateSecurity = async (e) => {
        e.preventDefault()
        try {
            const isMatched = await bcrypt.compare(cP, uPassword)
            if(isMatched)
            {
                console.log(isMatched)
                if(nP == cNP){

            const result = await axios.post(`${hostServer}/updateDriverSecurityInfo`,
            {
                nP, d_id
            })
            const data = result.data
            setSuccess(true)
            setTimeout(()=>{setSuccess(false)}, 2000)
            console.log("ok")
                }else
                {
                    setMismatchedPassword(true)
                    setTimeout(()=>{setMismatchedPassword(false)}, 2000)
                    console.log("new password does not match")
                }
            }
            else 
            {
                setOldPasswordError(true)
                setTimeout(()=>{setOldPasswordError(false)}, 2000)
                console.log("Old password is wrong")
            }
        } catch (error) {
            console.log(error)
        }
        
    }
    return(
        <>
            <Breadcrumbs title="Settings" subtitle="Security Info" />
      <Sidebar handleLogout={handleLogout}/>
      <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

                <>
  {/* Card Section */}
  <div className="max-w-4xl mt-0 mx-auto">
    {/* Card */}
    <div className="bg-white rounded-xl  dark:bg-neutral-800">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
        Security Information
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Manage your passwords.
        </p>
      </div>
      <form onSubmit={(e)=>{updateSecurity(e)}}>
        {/* Grid */}
        <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">

          {/* End Col */}

          {/* End Col */}

          {/* End Col */}
          <div className="sm:col-span-3">
            <label
              htmlFor="af-account-password"
              className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
            >
              Password
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
            <div className="space-y-2">
              <input
                id="af-account-password"
                type="text"
                onChange={(e) => { 
                  setIsDisabled(false)
                  setCP(e.target.value) }}  required
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Enter Current Password"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="af-account-password"
              className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
            >
             New Password
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
            <div className="space-y-2">
              <input
                id="af-account-password"
                type="text"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Enter New Password"
                onChange={(e) => { 
                  setIsDisabled(false)
                  setNP(e.target.value) }} pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}' title='Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"' required
              />
              <input
                type="text"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Re-Enter New Password"
                onChange={(e) => {
                  setIsDisabled(false)
                  setCNP(e.target.value) }} pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}' title='Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"' required
              />
            </div>
          </div>
        </div>
        {/* End Grid */}
        <div className="mt-5 flex justify-end gap-x-2">
          <a href="/driver/dashboard">
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          </a>
          <button
          disabled={isDisabled}
            type="submit"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
    {/* End Card */}
  </div>
  {/* End Card Section */}
  {success &&
  <div
  className="bg-teal-50 w-[100%] lg:w-[30%] hide h-auto border-t-2 border-primary_blue rounded-lg p-4 dark:bg-teal-800/30 fixed bottom-0 right-0"
  role="alert"
>
  <div className="flex">
    <div className="flex-shrink-0">
      {/* Icon */}
      <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-light_blue text-primary_blue dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
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
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
      {/* End Icon */}
    </div>
    <div className="ms-3">
      <h3 className="text-gray-800 font-semibold dark:text-white">
        Successfully updated.
      </h3>
      <p className="text-sm text-gray-700 dark:text-neutral-400">
        You have successfully updated your security information.
      </p>
    </div>
  </div>
</div>
}



{mismatchedPassword &&
  <div
  className="bg-red-50 w-[100%] lg:w-[30%] h-auto border-s-4 border-red-500 p-4 dark:bg-red-800/30 fixed right-0 bottom-0"
  role="alert"
>
  <div className="flex">
    <div className="flex-shrink-0">
      {/* Icon */}
      <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
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
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </span>
      {/* End Icon */}
    </div>
    <div className="ms-3">
      <h3 className="text-gray-800 font-semibold dark:text-white">Error!</h3>
      <p className="text-sm text-gray-700 dark:text-neutral-400">
      Please make sure your passwords match.
      </p>
    </div>
  </div>
</div>
}

{oldPasswordError && 
  <div
  className="bg-red-50 w-[100%] lg:w-[30%] h-auto border-s-4 border-red-500 animate-pulse p-4 dark:bg-red-800/30 fixed bottom-0 right-0"
  role="alert"
>
  <div className="flex">
    <div className="flex-shrink-0">
      {/* Icon */}
      <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
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
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </span>
      {/* End Icon */}
    </div>
    <div className="ms-3">
      <h3 className="text-gray-800 font-semibold dark:text-white">Error!</h3>
      <p className="text-sm text-gray-700 dark:text-neutral-400">
        Your Old Password is Wrong.
      </p>
    </div>
  </div>
</div>}

</>
</div>
</div>
        </>
    )
}

export default SettingPassword