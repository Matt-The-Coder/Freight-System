import { useOutletContext, useNavigate, Form } from 'react-router-dom'
import '/public/assets/css/adminLayout/settings.css'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import Breadcrumbs from '@/components/adminDashboard/Breadcrumbs'
import Sidebar from '@/components/adminDashboard/Sidebar'
import { useEffect, useRef, useState } from 'react'
const Settings = () => {
    const hostServer = import.meta.env.VITE_SERVER_HOST
    const uploadingServer = import.meta.env.VITE_UPLOADING_SERVER
    const { u_id, setIsLoading,image, setImage } = useOutletContext()
    const [fName, setFName] = useState("")
    const [lName, setLName] = useState("")
    const [uName, setUName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState('')
    const [uPassword, setUPassword] = useState("")
    const [cP, setCP] = useState("")
    const [nP, setNP] = useState('')
    const [cNP, setCNP] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [oldPasswordError, setOldPasswordError] = useState(false)
    const [mismatchedPassword, setMismatchedPassword] = useState(false)
    const [usernameError, setUsernameError] = useState(false)
    const [success, setSuccess] = useState(false)
    const profilePic = useRef(null)
    const nav = useNavigate()

 
    const getInfo = async () => {
        try {
            setIsLoading(true)
            const result = await axios.get(`${hostServer}/getaccountbyid/${u_id}`)
            if (result.data.message) {
                // nav("/login")
            } else {
                const userData = result.data
                setFName(userData[0].u_first_name)
                setLName(userData[0].u_last_name)
                setEmail(userData[0].u_email)
                setUName(userData[0].u_username)
                setUPassword(userData[0].u_password)
                setRole("Admin")
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
        useEffect(()=>{

            getInfo()
        }, [u_id])
    

    const updateInformation = async (e) => {

        try {

          e.preventDefault()
            const result = await axios.post(`${hostServer}/updatePersonalInfo`, {
                fName, lName, uName, email, u_id
            })
            const data = result.data
            if(data.errorMessage){
                setUsernameError(true)
                setTimeout(()=>{setUsernameError(false)}, 2000)
            }else{
                setRefresh(!refresh)
                setSuccess(true)
                setTimeout(()=>{setSuccess(false)}, 2000)
            }

        } catch (error) {
            console.log(error)
        }


    }

    const changePicture = () => 
    {
        const pic = profilePic.current
        const img = document.getElementById("prof-pic")
        pic.click()
        pic.addEventListener("change", async (e) => 
        {
            const result = e.target.files[0]
            const formData = new FormData()
            formData.append('my_file', result)
            try {
                setIsLoading(true)
                const upload = await axios.post(`${hostServer}/upload/${u_id}`, formData)
                // img.src = URL.createObjectURL(result)
                if(upload.data){
                   const uploadedImage = await axios.get(`${hostServer}/getProfilePicture/${u_id}`)
                   const fileImage = uploadedImage.data.image[0].u_profile_picture
                   setImage(fileImage)
                } else {
                    console.log("Uploading failed.")
                }
                setIsLoading(false)
            } catch (error) {
                console.log(error)
            }

        })
    }
    return (
        <>
            <Breadcrumbs title="Settings" subtitle="Personal Info"/>
      <Sidebar/>
      <div className="w-full lg:ps-64">
    <div className="sm:space-y-6">
        <>
  {/* Card Section */}
  <div className="max-w-4xl mx-auto">
    {/* Card */}
    <div className="bg-white rounded-xl p-4 sm:p-7 dark:bg-neutral-800">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
          Profile
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Manage your name, email and account settings.
        </p>
      </div>
      <form onSubmit={(e) => { updateInformation(e) }}>
        {/* Grid */}
        <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
          <div className="sm:col-span-3">
            <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
              Profile photo
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
            <div className="flex items-center gap-5">
              <img
                className="inline-block size-16 rounded-full ring-2 ring-white dark:ring-neutral-900 object-cover"
                src={`${uploadingServer}/${image}`}
                alt="Image Description"
              />
              <div className="flex gap-x-2">
                <div>
                <input type="file" name="prof-pic"  ref={profilePic} hidden/>
                  <button
                  onClick={changePicture} 
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1={12} x2={12} y1={3} y2={15} />
                    </svg>
                    Upload photo
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End Col */}
          <div className="sm:col-span-3">
            <label
              htmlFor="af-account-full-name"
              className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
            >
              Full name
            </label>
            <div className="hs-tooltip inline-block">
              <button type="button" className="hs-tooltip-toggle ms-1">
                <svg
                  className="inline-block size-3 text-gray-400 dark:text-neutral-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </button>
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible w-40 text-center z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700"
                role="tooltip"
              >
                Public Display Name
              </span>
            </div>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
            <div className="sm:flex">
              <input
                id="af-account-full-name"
                type="text"
                value={fName} onChange={(e) => { setFName(e.target.value) }} required
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              />
              <input
              value={lName} onChange={(e) => { setLName(e.target.value) }} required
                type="text"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              />
            </div>
          </div>
                    {/* End Col */}
                    <div className="sm:col-span-3">
            <label
              htmlFor="af-account-email"
              className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
            >
              Username
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
            <input
             value={uName} onChange={(e) => { setUName(e.target.value) }}
              id="af-account-email"
              type="text"
              className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              placeholder="maria@site.com"
            />
          </div>
          {/* End Col */}
          {/* End Col */}
          <div className="sm:col-span-3">
            <label
              htmlFor="af-account-email"
              className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
            >
              Email
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
            <input
             value={email} onChange={(e) => { setEmail(e.target.value) }}
              id="af-account-email"
              type="email"
              className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              placeholder="maria@site.com"
            />
          </div>
          {/* End Col */}
         

          {/* End Col */}
        </div>
        {/* End Grid */}
        <div className="mt-5 flex justify-end gap-x-2">
          <button
            type='submit'
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
</>
</div>
</div>
{success &&
(<>
  <div
  className="bg-teal-50 w-[100%] lg:w-[30%] h-auto border-t-2 border-primary_blue rounded-lg p-4 dark:bg-teal-800/30 fixed bottom-0 right-0"
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
        You have successfully updated your profile.
      </p>
    </div>
  </div>
</div>
</>)

}



{usernameError &&
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
      Username already exists!
      </p>
    </div>
  </div>
</div>
}

        </>
    )
}

export default Settings;