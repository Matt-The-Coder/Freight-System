import {Link} from 'react-router-dom'
import { useEffect, useRef } from 'react';
const Sidebar = ({access, handleLogout}) => {
  var x = document.getElementsByTagName("body")[0];
  const backLight = document.getElementsByClassName('transition duration fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 hs-overlay-backdrop');
  const side = useRef(null)
  useEffect(() => {
    const backLightArray = [...backLight];
    if (side.current?.className !== "hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-[260px] fixed inset-y-0 start-0 z-[100] md:z-0 bg-white border-e border-gray-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 dark:bg-neutral-800 dark:border-neutral-700 open opened") {
      if(backLightArray){
        backLightArray?.forEach((e, i)=>{
          e.remove()
        })
        x.style.overflow = "auto" 
      }
    }
  }, [side.current]);



    return(
        <>
          {/* Sidebar */}
  <div
    id="application-sidebar"
    className="hs-overlay [--auto-close:lg]
  hs-overlay-open:translate-x-0
  -translate-x-full transition-all duration-300 transform
  w-[260px]
  hidden
  fixed inset-y-0 start-0 z-[100] md:z-0
  bg-white border-e border-gray-200
  lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
  dark:bg-neutral-800 dark:border-neutral-700
 "
  >
    <div className="px-8 pt-4">
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
    <nav
      className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
      data-hs-accordion-always-open=""
    >
      <ul className="space-y-1.5">
        <li>
          <a
            className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white"
            href="/admin/dashboard"
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
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
          </a>
        </li>

        <li className="hs-accordion" id="account-accordion">
          <button
            type="button"
            className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hs-accordion-active:text-white"
          >
            <svg
              className="flex-shrink-0 mt-0.5 size-4"
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
              <circle cx={18} cy={15} r={3} />
              <circle cx={9} cy={7} r={4} />
              <path d="M10 15H6a4 4 0 0 0-4 4v2" />
              <path d="m21.7 16.4-.9-.3" />
              <path d="m15.2 13.9-.9-.3" />
              <path d="m16.6 18.7.3-.9" />
              <path d="m19.1 12.2.3-.9" />
              <path d="m19.6 18.7-.4-1" />
              <path d="m16.8 12.3-.4-1" />
              <path d="m14.3 16.6 1-.4" />
              <path d="m20.7 13.8 1-.4" />
            </svg>
            Maintenance
            <svg
              className="hs-accordion-active:block ms-auto hidden size-4"
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
              <path d="m18 15-6-6-6 6" />
            </svg>
            <svg
              className="hs-accordion-active:hidden ms-auto block size-4"
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div
            id="account-accordion-child"
            className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
          >
            <ul className="pt-2 ps-2">
              <li>
                <Link
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                  to="/admin/maintenance/list"
                >
                  Maintenance List
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                  to="/admin/maintenance/add"
                >
                  Add Maintenance
                </Link>
              </li>

            </ul>
          </div>
        </li>
        <li className="hs-accordion" id="projects-accordion">
          <button
            type="button"
            className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hs-accordion-active:text-white"
          >
  <i className='bx bx-gas-pump text-lg'></i>
            Fuel
            <svg
              className="hs-accordion-active:block ms-auto hidden size-4"
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
              <path d="m18 15-6-6-6 6" />
            </svg>
            <svg
              className="hs-accordion-active:hidden ms-auto block size-4"
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div
            id="projects-accordion-child"
            className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
          >
            <ul className="pt-2 ps-2">
              <li>
                <Link
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                  to="/admin/fuel/manage"
                >
                  Fuel Management
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                  to="/admin/fuel/add"
                >
                  Add Fuel
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li className="hs-accordion" id="projects-accordion">
          <button
            type="button"
            className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hs-accordion-active:text-white"
          >
<i className='bx bx-navigation text-lg'></i>
            Tracking
            <svg
              className="hs-accordion-active:block ms-auto hidden size-4"
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
              <path d="m18 15-6-6-6 6" />
            </svg>
            <svg
              className="hs-accordion-active:hidden ms-auto block size-4"
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div
            id="projects-accordion-child"
            className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
          >
            <ul className="pt-2 ps-2">
              <li>
                <a
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                  href="/admin/tracking/trips/ongoing"
                >
                  Ongoing Trips
                </a>
              </li>
              <li>
                <a
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                  href="/admin/tracking/trips/upcoming"
                >
                  Upcoming Trips
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li className="hs-accordion" id="projects-accordion">
          <button
            type="button"
            className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hs-accordion-active:text-white"
          >
      <i className='bx bx-history text-lg' ></i>
            History
            <svg
              className="hs-accordion-active:block ms-auto hidden size-4"
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
              <path d="m18 15-6-6-6 6" />
            </svg>
            <svg
              className="hs-accordion-active:hidden ms-auto block size-4"
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div
            id="projects-accordion-child"
            className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
          >
            <ul className="pt-2 ps-2">
              <li>
                <a
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                  href="/admin/history/list"
                >
                Deliveries
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li className="hs-accordion" id="projects-accordion">
          <button
            type="button"
            className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hs-accordion-active:text-white"
          >
<i className='bx bx-file text-lg'></i>
            Reports
            <svg
              className="hs-accordion-active:block ms-auto hidden size-4"
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
              <path d="m18 15-6-6-6 6" />
            </svg>
            <svg
              className="hs-accordion-active:hidden ms-auto block size-4"
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div
            id="projects-accordion-child"
            className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
          >
            <ul className="pt-2 ps-2">
              <li>
                <Link
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                  to="/admin/reports/sustainability"
                >
                  Environmental
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                  to="/admin/reports/trips"
                >
                  Deliveries
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <a
            className="w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
            href="/admin/chat"
          >
  <i className='bx bx-chat text-lg'></i>
            Chat
          </a>
        </li>
        <li className="hs-accordion" id="projects-accordion">
          <button
            type="button"
            className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hs-accordion-active:text-white"
          >
<i className="bx bx-cog text-lg" />
            Settings
            <svg
              className="hs-accordion-active:block ms-auto hidden size-4"
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
              <path d="m18 15-6-6-6 6" />
            </svg>
            <svg
              className="hs-accordion-active:hidden ms-auto block size-4"
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div
            id="projects-accordion-child"
            className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
          >
            <ul className="pt-2 ps-2">
              <li>
                <Link
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                  to="/account/admin/settings/personal"
                >
                  Personal Info
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                  to="/account/admin/settings/security"
                >
                  Security Info
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li onClick={()=>{handleLogout()}}>
          <a
            className="text-solid_red w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
            href="#"
          >
    <i className="bx bx-log-out-circle text-lg text-solid_red" />
            Logout
          </a>
        </li>
      </ul>
    </nav>
  </div>
  {/* End Sidebar */}
        </>
    )
}

export default Sidebar