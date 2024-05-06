
import { useEffect, useRef, useState } from 'react';
import {Link, useOutletContext} from 'react-router-dom'
const Header = ({image, d_email}) => {
  const [notifications, setNotifications] = useState([])
  const hostServer = import.meta.env.VITE_SERVER_HOST
  const uploadingServer = import.meta.env.VITE_UPLOADING_SERVER

  const closeSidebar = () => {
    const adminSidebar = document.querySelector('.adminSidebar');
    adminSidebar.classList.add('close')
    adminSidebar.style.display = 'none'
    const notification = document.querySelector('.notif-container')
    if(notification?.style.display == "block"){
      notification.style.display = "none"
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
    return(
        <>
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
                  {d_email}
                </p>
              </div>
              <div className="mt-2 py-2 first:pt-0 last:pb-0">

<a
  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
  href="/account/driver/settings/personal"
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
  href="/account/driver/settings/security"
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

        </>
    )
}

export default Header