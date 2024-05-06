
import { useEffect, useRef, useState } from 'react';
import {Link} from 'react-router-dom'
const Header = ({image}) => {

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
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
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
                  james@site.com
                </p>
              </div>
              <div className="mt-2 py-2 first:pt-0 last:pb-0">
                <a
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                  href="#"
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
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  Newsletter
                </a>
                <a
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                  href="#"
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
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Purchases
                </a>
                <a
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                  href="#"
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
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m8 17 4 4 4-4" />
                  </svg>
                  Downloads
                </a>
                <a
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                  href="#"
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx={9} cy={7} r={4} />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Team Account
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