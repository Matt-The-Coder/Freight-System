import { Link, useOutletContext } from 'react-router-dom'
import axios from 'axios'
import Breadcrumbs from '@/components/adminDashboard/Breadcrumbs'
import Sidebar from '@/components/adminDashboard/Sidebar'
import { useState, useEffect } from 'react'
const UpcomingTrips = ({ socket }) => {
    const { image, u_role, u_first_name, u_last_name, setIsLoading } = useOutletContext()
    const VITE_UPLOADING_SERVER = import.meta.env.VITE_UPLOADING_SERVER
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const [deliveries, setDeliveries] = useState([])
    const [filterData, setFilterData] = useState('')
    const [deliveriesStorage, setDeliveriesStorage] = useState([])
    const getDeliveries = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/get-pending-trips`)
            const result = data.data
            setDeliveries(result)
            setDeliveriesStorage(result)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
    const filterDeliveries = (e) => {
        if (e == "") {
            setDeliveries(deliveriesStorage)
            setFilterData(e)
        } else {
            setFilterData(e)
            const filteredDeliveries = deliveriesStorage.filter((d) => {
                const formattedDate = formatDateInput(d.t_start_date);
                if (formattedDate == e) {
                    return d;
                }
            })
            setDeliveries(filteredDeliveries)
        }
        console.log(e)
    }

    const formatDateInput = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate());
        return formattedDate.toISOString().split("T")[0];
    };
    const formatDate = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate());
        return formattedDate.toISOString().split("T")[0];
      };
    useEffect(() => {
        getDeliveries()
    }, [])
    return (
        <>
                                <Breadcrumbs title="Tracking" subtitle="Ongoing Trips" />
      <Sidebar/>
      <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="w-auto px-6 py-4 flex gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700 items-center">
                        {/* Input */}
                        <div className="sm:col-span-1">
                            <label htmlFor="hs-as-table-product-review-search" className="sr-only">
                                Search
                            </label>
                            <div className="relative">
                                <form className='p-0' onSubmit={(e) => { searchMaintenance(e) }}>
                                    <input
                                        type="text"
                                        id="hs-as-table-product-review-search"
                                        name="hs-as-table-product-review-search"
                                        className="py-2 px-3 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                        placeholder="Search"
                                        onChange={(e) => { setMaintenanceSearch(e.target.value) }}
                                    />
                                    <button type='submit'></button>
                                </form>

                                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                    <svg
                                        className="flex-shrink-0 size-4 text-gray-400 dark:text-neutral-500"
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
                            </div>
                        </div>

                        <div className="hs-tooltip inline-block [--trigger:hover] h-auto w-auto sm:[--placement:right]">
                            <div className="hs-tooltip-toggle max-w-xs flex items-center gap-x-3 bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700">

                                {/* User Content */}
                                <button

                                    type="button"
                                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                                >
                                    <svg
                                        className="flex-shrink-0 size-3.5"
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
                                        <path d="M3 6h18" />
                                        <path d="M7 12h10" />
                                        <path d="M10 18h4" />
                                    </svg>
                                    Filter
                                    <span className="ps-2 text-xs font-semibold text-blue-600 border-s border-gray-200 dark:border-neutral-700 dark:text-blue-500">
                                        5
                                    </span>
                                </button>
                                {/* End User Content */}

                                {/* Popover Content */}
                                <div className="hs-tooltip-content !w-auto !transform-none relative left-0 hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible hidden opacity-0 transition-opacity invisible z-10 max-w-xs bg-white border border-gray-100 text-start rounded-xl shadow-md after:absolute after:top-0 after:-start-4 after:w-4 after:h-full dark:bg-neutral-800 dark:border-neutral-700">
                                <div
                                        className="transition-[opacity,margin] duration divide-y divide-gray-200 min-w-48 z-10 bg-white shadow-md rounded-lg mt-2 dark:divide-neutral-700 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                
                                    >
                                        <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                                            <label
                                                className="flex py-2.5 px-3 w-full"
                                            >

                                                <input type="date" value={filterData}
                                                    className="w-full py-1 text-gray-800 dark:text-neutral-200 text-sm border-gray-300 rounded-lg focus:ring-blue-500 disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800 "
                                                    onChange={(e) => { filterDeliveries(e.currentTarget.value) }} />
                                                <span className="ms-3 text-xs py-2 px-0 text-gray-800 dark:text-neutral-200 grid place-content-center">
                                                    Start Date
                                                </span>
                                            </label>
                                            <label

                                                className="flex py-2.5 px-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="shrink-0 mt-0.5 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                                    id="hs-as-filters-dropdown-all"
                                                    defaultChecked=""
                                                    onChange={async (el) => {
                                                        if (el.currentTarget.checked) {
                                                            setIsLoading(true)
                                                            setDeliveries(deliveriesStorage)
                                                            setFilter(el.currentTarget.value)
                                                            setIsLoading(false)
                                                        }
                                                    }}
                                                />
                                                <span className="ms-3 text-sm text-gray-800 dark:text-neutral-200">
                                                    All
                                                </span>
                                            </label>
                                            <label
                                                className="flex py-2.5 px-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="shrink-0 mt-0.5 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                                    onChange={async (el) => {
                                                        if (el.currentTarget.checked) {
                                                            setIsLoading(true)
                                                            setFilter(el.currentTarget.value)
                                                            const filterReports = deliveriesStorage.filter((e, i) => {
                                                                return e.t_trip_status == "Completed"
                                                            })
                                                            setDeliveries(filterReports)
            

                                                            setIsLoading(false)
                                                        }
                                                    }}
                                                />
                                                <span className="ms-3 text-sm text-gray-800 dark:text-neutral-200">
                                                    Completed
                                                </span>
                                            </label>
                                            <label
                                                className="flex py-2.5 px-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="shrink-0 mt-0.5 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                                    onChange={async (el) => {
                                                        if (el.currentTarget.checked) {
                                                            setIsLoading(true)
                                                            setFilter(el.currentTarget.value)
                                                            const filterReports = deliveriesStorage.filter((e, i) => {
                                                                return e.t_trip_status == "Cancelled"
                                                            })
                                                            setDeliveries(filterReports)
                                                        

                                                            setIsLoading(false)
                                                        }
                                                    }}
                                                />
                                                <span className="ms-3 text-sm text-gray-800 dark:text-neutral-200">
                                                    Cancelled
                                                </span>
                                            </label>


                                        </div>
                                    </div>
                                </div>
                                {/* End Popover Content */}
                            </div>
                        </div>
                        {/* End User */}


                    </div>
            <div className="trips">
                <div className="trips-list">
                    {deliveries.length == 0 && <center><h1>No Pending Trips at the Moment</h1></center>}
                    {deliveries.map((e, i) => {

                        return (
                            <>
                                                          <div className="trips-container bg-white border-y w-full dark:bg-neutral-800" key={i}>
                                                          <div className="time-container">
                                                              <p  className="text-sm text-gray-600 dark:text-neutral-400">Order Date: {formatDate(e.t_created_date)}</p>
                                                          </div>
                                                          <div className="delivery-info">
                                                              <div className="h3-container bg-light_dark" >
                                                                  <h3 className='text-solid_dark'  >{e.t_trip_status}</h3>
                                                              </div>
                  
                                                          </div>
                                                          <div className="trips-header">
                                                              <div className="header-container border-b-2 py-5">
                                                                  <div className="header1">
                                                                      <div className="row1">
                                                                          <div className="img">
                                                                              <img src={`${VITE_UPLOADING_SERVER}${e.d_picture}`} alt="" />
                                                                          </div>
                                                                          <div className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                                                                              <h2 className=''>{`${e.d_first_name} ${e.d_last_name}`}</h2>
                                                                          </div>
                                                                      </div>
                                                                      <div className="row2">
                                                                          <p className="text-sm text-gray-600 dark:text-neutral-400">Driver</p>
                                                                      </div>
                                                                  </div>
                                                                  <div className="header2">
                                                                      <h2 className='text-xl font-semibold text-gray-800 dark:text-neutral-200'>{e.t_trackingcode}</h2>
                                                                  </div>
                                                              </div>
                                                          </div>
                  
                                                          <>
                                                              {/* Timeline */}
                                                              <div className='py-4'>
                                                                  {/* Heading */}
                                                                  <div className="ps-2 my-2 first:mt-0">
                                                                      <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                                                                      <span className='font-semibold text-xs'>Start Date:</span>      {formatDate(e.t_start_date)}
                                                                      </h3>
                                                                  </div>
                                                                  {/* End Heading */}
                                                                  {/* Item */}
                                                                  <div className="flex gap-x-3">
                                                                      {/* Icon */}
                                                                      <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
                                                                          <div className="relative z-10 size-7 flex justify-center items-center">
                                                                              <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600" />
                                                                          </div>
                                                                      </div>
                                                                      {/* End Icon */}
                                                                      {/* Right Content */}
                                                                      <div className="grow pt-0.5 pb-8">
                                                                          <h3 className="flex gap-x-1.5 text-lg font-semibold text-gray-800 dark:text-white">
                                                                              <svg fill="#1976d2" width="216px" height="216px" viewBox="-1.28 -1.28 34.56 34.56"
                                                                                  className='h-8 w-8'
                                                                                  version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#1976d2" transform="rotate(-45)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>pin</title> <path d="M4 12q0-3.264 1.6-6.016t4.384-4.352 6.016-1.632 6.016 1.632 4.384 4.352 1.6 6.016q0 1.376-0.672 3.2t-1.696 3.68-2.336 3.776-2.56 3.584-2.336 2.944-1.728 2.080l-0.672 0.736q-0.256-0.256-0.672-0.768t-1.696-2.016-2.368-3.008-2.528-3.52-2.368-3.84-1.696-3.616-0.672-3.232zM8 12q0 3.328 2.336 5.664t5.664 2.336 5.664-2.336 2.336-5.664-2.336-5.632-5.664-2.368-5.664 2.368-2.336 5.632z"></path> </g></svg>
                                                                              Origin
                                                                          </h3>
                                                                          <p className="mt-1 text-base text-gray-600 dark:text-neutral-400">
                                                                              {e.t_trip_fromlocation}
                                                                          </p>
                                                                      </div>
                                                                      {/* End Right Content */}
                                                                  </div>
                                                                  {/* End Item */}
                                                                  {/* Heading */}
                                                                  <div className="ps-2 my-2 first:mt-0">
                                                                      <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                                                                      <span className='font-semibold text-xs'>End Date:</span>   {formatDate(e.t_end_date)}
                                                                      </h3>
                                                                  </div>
                                                                  {/* End Heading */}
                                                                  {/* Item */}
                                                                  <div className="flex gap-x-3">
                                                                      {/* Icon */}
                                                                      <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
                                                                          <div className="relative z-10 size-7 flex justify-center items-center">
                                                                              <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600" />
                                                                          </div>
                                                                      </div>
                                                                      {/* End Icon */}
                                                                      {/* Right Content */}
                                                                      <div className="grow pt-0.5 pb-8">
                  
                                                                          <h3 className="flex gap-x-1.5 text-lg font-semibold text-gray-800 dark:text-white">
                                                                              <svg
                                                                                  className='h-8 w-8'
                                                                                  height="200px"
                                                                                  width="200px"
                                                                                  version="1.1"
                                                                                  id="Capa_1"
                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                                  viewBox="0 0 22.723 22.723"
                                                                                  xmlSpace="preserve"
                                                                                  fill="#1976d2"
                                                                              >
                                                                                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                                                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                                                  <g id="SVGRepo_iconCarrier">
                                                                                      {" "}
                                                                                      <g>
                                                                                          {" "}
                                                                                          <path
                                                                                              style={{ fill: "#1976d2" }}
                                                                                              d="M19.735,6.896c0.007,0.245-0.139,0.47-0.366,0.563L9.114,11.655 c-0.071,0.03-0.147,0.044-0.223,0.044c-0.115,0-0.23-0.034-0.329-0.1c-0.163-0.11-0.261-0.293-0.261-0.489V3.433 c0-0.19,0.092-0.369,0.246-0.479C8.702,2.844,8.9,2.814,9.08,2.876l10.255,3.481C19.568,6.435,19.726,6.651,19.735,6.896z M9.991,20.66c0,1.156-1.539,2.063-3.502,2.063c-1.965,0-3.502-0.907-3.502-2.063c0-0.976,1.097-1.77,2.618-1.997V2.738 c0-0.069,0.011-0.137,0.025-0.202c-0.395-0.24-0.662-0.67-0.662-1.167C4.968,0.613,5.582,0,6.337,0h0.539 c0.756,0,1.369,0.613,1.369,1.369c0,0.584-0.367,1.079-0.881,1.275c0.004,0.032,0.01,0.062,0.01,0.094v15.925 C8.894,18.89,9.991,19.684,9.991,20.66z M9.402,20.661c0-0.643-0.869-1.198-2.029-1.394v1.376c0,0.489-0.396,0.885-0.885,0.885 s-0.885-0.396-0.885-0.885v-1.376c-1.16,0.196-2.029,0.751-2.029,1.394c0,0.799,1.335,1.474,2.913,1.474 C8.068,22.134,9.402,21.46,9.402,20.661z"
                                                                                          />{" "}
                                                                                      </g>{" "}
                                                                                  </g>
                                                                              </svg>
                                                                              Destination
                                                                          </h3>
                                                                          <p className="mt-1 text-base text-gray-600 dark:text-neutral-400">
                                                                              {e.t_trip_tolocation}
                                                                          </p>
                                                                      </div>
                                                                      {/* End Right Content */}
                                                                  </div>
                                                                  {/* End Item */}
                                                              </div>
                                                              {/* End Timeline */}
                                                          </>
                  
                  
                                                          {/* <div className="trips-content">
                                                      <div className="main-content">
                                                          <div className="content-design">
                                                              <h1>•</h1>
                                                              <p></p>
                                                              <h1>•</h1>
                                                          </div>
                                                          <div className="content-locations">
                                                              <div className="location-from">
                                                                  <h4>From:</h4>
                                                                  <p>{e.t_trip_fromlocation}</p>
                                                              </div>
                                                              <div className="location-to">
                                                                  <h4>To:</h4>
                                                                  <p>{e.t_trip_tolocation}</p>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div> */}
                  
                                                      </div>
                                                      </>
                        )
                    })}
                </div>
            </div>
            </div>
            </div>
        </>
    )
}

export default UpcomingTrips