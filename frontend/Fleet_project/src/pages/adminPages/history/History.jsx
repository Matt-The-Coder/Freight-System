import { Link, useOutletContext } from 'react-router-dom'
import '/public/assets/css/adminLayout/trackingTrips.css'
import axios from 'axios'
import Breadcrumbs from '@/components/adminDashboard/Breadcrumbs'
import Sidebar from '@/components/adminDashboard/Sidebar'
import { useState, useEffect } from 'react'



const AdminHistory = ({ socket }) => {
    const { image, u_role, u_first_name, u_last_name, setIsLoading, handleLogout } = useOutletContext()
    const VITE_UPLOADING_SERVER = import.meta.env.VITE_UPLOADING_SERVER
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const [deliveriesStorage, setDeliveriesStorage] = useState([])
    const [deliveries, setDeliveries] = useState([])
    const [filter, setFilter] = useState('all')
    const [filterData, setFilterData] = useState('')
    useEffect(() => {
        socket.on('deliveryUpdate', (data) => {
            alert("Delivery Status Updated")
            location.reload()
        });
        return () => socket.off('deliveryUpdate');

    }, [socket]);
    const getDeliveries = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/get-trips-admin`)
            const result = data.data
            console.log(result)
            setDeliveries(result)
            setDeliveriesStorage(result)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const openModal = (e) => {
        const num = e
        const modalInfo = document.querySelector("#modal" + e)
        const modalbg = document.querySelector("#modalbg" + e)
        const modalb = document.querySelector("#modalb" + e)
        const deliveriesContainer = document.querySelectorAll('.harang')
        deliveriesContainer.forEach((e, i)=>{
          e.style.zIndex = -1
        })
        modalInfo.style.display = "block"
        modalb.style.display = 'block'
        modalbg.style.display = 'block'
    }
    const closeModal = (e) => {
        const modalInfo = document.querySelector("#modal" + e)
        const deliveriesContainer = document.querySelectorAll('.harang')
        const modalbg = document.querySelector("#modalbg" + e)
        const modalb = document.querySelector("#modalb" + e)
        deliveriesContainer.forEach((e, i)=>{
          e.style.zIndex = 99
        })
        modalInfo.style.display = "none"
        modalb.style.display = 'none'
        modalbg.style.display = 'none'

    }



    const openPictureModal = (e) => {
        const dialog = document.querySelector(`#dialog${e}`)
        dialog.showModal()


    }
    const closePictureModal = (e) => {
        const dialog = document.querySelector(`#dialog${e}`)
        dialog.close()

    }
    const filterDeliveries = (e) => {
        if (e == "") {
            setDeliveries(deliveriesStorage)
            setFilterData(e)
        } else {
            setFilterData(e)
            const filteredDeliveries = deliveriesStorage.filter((d, i) => {
                const formattedDate = formatDate(d.t_created_date);
                if (formattedDate == e) {
                    return d

                }

            })
            setDeliveries(filteredDeliveries)
        }

    }
    useEffect(() => {
        getDeliveries()
    }, [])
    const formatDate = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate());
        return formattedDate.toISOString().split("T")[0];
    };
    return (
        <>
            <Breadcrumbs title="History" subtitle="Deliveries" isModal={true} />
            <Sidebar isModal={true} handleLogout={handleLogout}/>
            <div className="w-full lg:ps-64">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 lg-[600px] bg-white dark:bg-neutral-800">
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
                                </button>
                                {/* End User Content */}

                                {/* Popover Content */}
                                <div className="hs-tooltip-content !w-auto !transform-none relative left-0 hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible hidden opacity-0 transition-opacity invisible z-10 max-w-xs bg-white border border-gray-100 text-start rounded-xl shadow-md after:absolute after:top-0 after:-start-4 after:w-4 after:h-full dark:bg-neutral-800 dark:border-neutral-700 tool-content">
                                <div
                                        className="transition-[opacity,margin] duration divide-y divide-gray-200 min-w-48 z-10 bg-white shadow-md rounded-lg mt-2 dark:divide-neutral-700 dark:bg-neutral-800 dark:border dark:border-neutral-700 tool-content"
                                
                                    >
                                        <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                                            <label
                                                className="flex py-2.5 px-3 w-full"
                                            >

                                                <input type="date" value={filterData}
                                                    className="w-full py-1 text-gray-800 dark:text-neutral-200 text-sm border-gray-300 rounded-lg focus:ring-blue-500 disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800 "
                                                    onChange={(e) => { filterDeliveries(e.currentTarget.value) }} />
                                                <span className="ms-3 text-xs py-2 px-0 text-gray-800 dark:text-neutral-200 grid place-content-center">
                                                    Order Date
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
                    <div className="trips !mt-0 ">
                        <div className="trips-list">
                            {deliveries.length == 0 && <center>
                              <h1 className='dark:text-white text-neutral-900'>No Trips Found</h1></center>}
                            {deliveries.reverse().map((e, i) => {
                                let statusColor = '';
                                let fontColor = ''
                                if (e.t_trip_status == 'Completed') {
                                    statusColor = "#ccfbf1";
                                    fontColor = '#115e59'
                                } else if (e.t_trip_status == 'In Progress') {
                                    statusColor = '#fef9c3';
                                    fontColor = '#854d0e'
                                } else if (e.t_trip_status == 'Cancelled') {
                                    statusColor = '#fee2e2';
                                    fontColor = '#991b1b'
                                }
                                return (
                                    <div className="trips-container bg-white border-y w-full dark:bg-neutral-800" key={i}>
                                        <div className="time-container">
                                            <p  className="text-sm text-gray-600 dark:text-neutral-400">Order Date: {formatDate(e.t_created_date)}</p>
                                        </div>
                                        <div className="delivery-info">
                                            <div className="h3-container" style={{ backgroundColor: statusColor }}>
                                                <h3 style={{ color: fontColor }} >{e.t_trip_status}</h3>
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
                                                       <span className='font-semibold text-xs'>Start Date:</span>  {formatDate(e.t_start_date)}
                                                    </h3>
                                                </div>
                                                {/* End Heading */}
                                                {/* Item */}
                                                <div className="flex gap-x-3">
                                                    {/* Icon */}
                                                    <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
                                                        <div className="relative z-10 size-7 flex justify-center items-center harang">
                                                            <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600" />
                                                        </div>
                                                    </div>
                                                    {/* End Icon */}
                                                    {/* Right Content */}
                                                    <div className="grow pt-0.5 pb-8">
                                                        <h3 className="flex gap-x-1.5 text-lg font-semibold text-gray-800 dark:text-white">
                                                            <svg fill="#1976d2" width="216px" height="216px" viewBox="-1.28 -1.28 34.56 34.56"
                                                                className='h-8 w-8 harang'
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
                                                      <span className='font-semibold text-xs '>End Date:</span>  {formatDate(e.t_end_date)}
                                                    </h3>
                                                </div>
                                                {/* End Heading */}
                                                {/* Item */}
                                                <div className="flex gap-x-3">
                                                    {/* Icon */}
                                                    <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
                                                        <div className="relative z-10 size-7 flex justify-center items-center harang">
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
                                        <div className="more-info">
                                            <button onClick={() => { openModal(i) }} className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">More Info</button>
                                            <div className="more-info-modal" id={`modal${i}`}>
                                    <div className="more-info-background bg-gray-800 opacity-30" id={`modalbg${i}`}></div>
                                    <div
                                    id={`modalb${i}`}
    className="hs-overlay  size-full fixed top-0 start-0 z-[100] overflow-x-hidden overflow-y-auto pointer-events-none"
  >
    <div className="mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 ease-out transition-all sm:max-w-4xl sm:w-full m-3 h-[calc(100%-3.5rem)] sm:mx-auto">
      <div className="max-h-full overflow-hidden flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-neutral-700/70">
        <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-800">
          <h3 className="font-bold text-gray-800 dark:text-neutral-200">
            History Information
          </h3>
          <button
          onClick={() => { closeModal(i) }}
            type="button"
            className="flex z- justify-center items-center bg-[#2e2b2b] size-7 text-sm font-semibold rounded-lg border border-transparent hover:bg-[#4e4c4c] text-white dark:text-white dark:border-transparent dark:hover:bg-neutral-700"
          >
            <span className="sr-only"  >Close</span>
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
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          <div className="sm:divide-y divide-gray-200 dark:divide-neutral-700">
            <div className="py-3 sm:py-6">
              <h4 className="mb-2 text-sm text-left font-semibold uppercase text-gray-600 dark:text-neutral-400">
                Delivery Details
              </h4>
              {/* Grid */}
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {/* Card */}
                <a
                  className="bg-white p-4 transition duration-300 rounded-lg hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  href="#"
                >
                  <div className="flex justify-center items-center">
                    <div className="mt-1.5 flex justify-center flex-shrink-0 rounded-s-xl dark:text-white dark:text-white">
                    <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-[55px] w-[55px] "
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
    viewBox="0 0 36 36"
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
        d="M32 13.22V30H4V8h3V6H3.75A1.78 1.78 0 0 0 2 7.81v22.38A1.78 1.78 0 0 0 3.75 32h28.5A1.78 1.78 0 0 0 34 30.19V12.34a7.45 7.45 0 0 1-2 .88Z"
        className="clr-i-outline--badged clr-i-outline-path-1--badged"
      />
      <path
        fill="currentColor"
        d="M8 14h2v2H8z"
        className="clr-i-outline--badged clr-i-outline-path-2--badged"
      />
      <path
        fill="currentColor"
        d="M14 14h2v2h-2z"
        className="clr-i-outline--badged clr-i-outline-path-3--badged"
      />
      <path
        fill="currentColor"
        d="M20 14h2v2h-2z"
        className="clr-i-outline--badged clr-i-outline-path-4--badged"
      />
      <path
        fill="currentColor"
        d="M26 14h2v2h-2z"
        className="clr-i-outline--badged clr-i-outline-path-5--badged"
      />
      <path
        fill="currentColor"
        d="M8 19h2v2H8z"
        className="clr-i-outline--badged clr-i-outline-path-6--badged"
      />
      <path
        fill="currentColor"
        d="M14 19h2v2h-2z"
        className="clr-i-outline--badged clr-i-outline-path-7--badged"
      />
      <path
        fill="currentColor"
        d="M20 19h2v2h-2z"
        className="clr-i-outline--badged clr-i-outline-path-8--badged"
      />
      <path
        fill="currentColor"
        d="M26 19h2v2h-2z"
        className="clr-i-outline--badged clr-i-outline-path-9--badged"
      />
      <path
        fill="currentColor"
        d="M8 24h2v2H8z"
        className="clr-i-outline--badged clr-i-outline-path-10--badged"
      />
      <path
        fill="currentColor"
        d="M14 24h2v2h-2z"
        className="clr-i-outline--badged clr-i-outline-path-11--badged"
      />
      <path
        fill="currentColor"
        d="M20 24h2v2h-2z"
        className="clr-i-outline--badged clr-i-outline-path-12--badged"
      />
      <path
        fill="currentColor"
        d="M26 24h2v2h-2z"
        className="clr-i-outline--badged clr-i-outline-path-13--badged"
      />
      <path
        fill="currentColor"
        d="M10 10a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1Z"
        className="clr-i-outline--badged clr-i-outline-path-14--badged"
      />
      <path
        fill="currentColor"
        d="M22.5 6H13v2h9.78a7.49 7.49 0 0 1-.28-2Z"
        className="clr-i-outline--badged clr-i-outline-path-15--badged"
      />
      <circle
        cx={30}
        cy={6}
        r={5}
        fill="currentColor"
        className="clr-i-outline--badged clr-i-outline-path-16--badged clr-i-badge"
      />
      <path fill="none" d="M0 0h36v36H0z" />
    </g>
  </svg>
</svg>


                    </div>
                    <div className="grow ms-6">
                      <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                        Start Date
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-500">
                      {formatDate(e.t_start_date)}
                      </p>
                    </div>
                  </div>
                </a>
                {/* End Card */}
                {/* Card */}
                <a
                  className="bg-white p-4 transition duration-300 rounded-lg hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  href="#"
                >
                  <div className="flex justify-center items-center">
                    <div className="mt-1.5 flex justify-center flex-shrink-0 rounded-s-xl dark:text-white">
                    <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="w-[55px] h-[55px]"
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
    viewBox="0 0 2048 2048"
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
        d="M1792 993q60 41 107 93t81 114t50 131t18 141q0 119-45 224t-124 183t-183 123t-224 46q-91 0-176-27t-156-78t-126-122t-85-157H128V128h256V0h128v128h896V0h128v128h256v865zM256 256v256h1408V256h-128v128h-128V256H512v128H384V256H256zm643 1280q-3-31-3-64q0-86 24-167t73-153h-97v-128h128v86q41-51 91-90t108-67t121-42t128-15q100 0 192 33V640H256v896h643zm573 384q93 0 174-35t142-96t96-142t36-175q0-93-35-174t-96-142t-142-96t-175-36q-93 0-174 35t-142 96t-96 142t-36 175q0 93 35 174t96 142t142 96t175 36zm64-512h192v128h-320v-384h128v256zM384 1024h128v128H384v-128zm256 0h128v128H640v-128zm0-256h128v128H640V768zm-256 512h128v128H384v-128zm256 0h128v128H640v-128zm384-384H896V768h128v128zm256 0h-128V768h128v128zm256 0h-128V768h128v128z"
      />
    </g>
  </svg>
</svg>

                    </div>
                    <div className="grow ms-6">
                      <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                        End Date
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-500">
                      {formatDate(e.t_end_date)}
                      </p>
                    </div>
                  </div>
                </a>
                {/* End Card */}

                {/* Card */}
                <a
                  className="bg-white p-4 transition duration-300 rounded-lg hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  href="#"
                >
                  <div className="flex justify-center items-center">
                    <div className="mt-1.5 flex justify-center flex-shrink-0 rounded-s-xl dark:text-white">
                    <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-[55px] w-[55px]"
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
    viewBox="0 0 512 512"
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
        d="M92.6 21c-32 0-64.04 24-64.04 72L92.6 221l64-128c0-48-32-72-64-72zm282.3 39c-6.9.29-13.6 1.6-19.2 2.8l3.8 17.6c5.6-1.25 11.4-2.04 16.3-2.4zM92.6 61c17.7 0 32 14.33 32 32c0 17.7-14.3 32-32 32c-17.67 0-32-14.3-32-32c0-17.67 14.33-32 32-32zm302.2.2l-3 17.7c4.9 1.03 9.8 2.32 14.1 4.9l8.7-15.8c-6.1-3.25-12.9-6.17-19.8-6.8zm-57.5 6.7c-6.1 2.38-12.2 4.51-17.4 6.6L327 91c5.5-2.34 11.3-4.38 16.2-6.1zM431 81.3L417.3 93c3.6 4.12 6.4 9.2 8.6 13.3l16.1-8.1c-3.4-6.55-6.4-11.51-11-16.9zm-127.8.9c-6.1 3.11-11.1 5.88-16.5 8.6l8.8 15.8c5.2-3 10.9-5.9 15.5-8.2zm-32.3 17.9c-5.3 3.1-10.5 6.2-15.6 9.6l9.8 15c4.9-3.2 10-6.2 15-9.2zM448.2 118c-5.9 1-11.9 1.7-17.8 2.4c.4 5 .1 10.4-.9 14.6l17.5 4.1c1-7.2 1.9-14.6 1.2-21.1zm-208.1 1.7c-5 3.4-9.9 6.9-14.9 10.3l10.4 14.7c4.8-3.5 9.7-6.8 14.6-10.2zm-29.6 21.1c-5 3.6-10.2 7.6-14.5 10.9l10.9 14.3c5.5-4 9.3-7 14.3-10.7zm213 8c-3 4.6-6.5 9.2-10 12.7l13.1 12.5c4.3-5.1 8.9-10.3 12.1-15.5zm-241.8 14.1c-4.9 3.8-9.8 7.7-14.1 11.3l11.4 13.9c4.7-3.9 9.5-7.9 13.9-11.1zM401.1 173c-4.6 3.7-9.4 7.3-13.8 10.3l10.3 14.8c5.3-3.6 10.5-7.5 15-11.1zm-247.4 12.9c-4.7 3.8-9.2 7.8-13.8 11.7l11.7 13.7c4.5-3.9 9-7.8 13.6-11.6zm218.9 7c-5.1 3-10.4 6.1-15.2 8.7l8.6 15.9c5.4-3.3 11.5-6.2 16-9.2zm-246.4 16.6c-4.5 4-8.9 8-13.4 12.1l12.1 13.4c4.4-4 8.9-8 13.3-12zm215.5.4c-5.3 2.6-10.6 5.3-15.9 7.9l7.7 16.2c6.2-3 10.8-5.5 16.4-8.1zm-32 15.4c-5.5 2.5-10.8 4.9-16.4 7.2l7.3 16.5c5.5-2.4 11-4.9 16.5-7.4zM99.6 234c-5.1 4.5-8.65 8-13.3 12.5l12.7 13c4.7-4.5 8.5-8.4 12.9-12.2zm177.3 5.8c-5.5 2.3-11 4.7-16.5 7l7 16.7c5.6-2.3 11.1-4.7 16.6-7.1zm-33.1 14c-5.5 2.4-11 4.8-16.6 7l7 16.7c5.5-2.3 11.1-4.7 16.6-7zm184.8 7.2c-32 0-64 24-64 72l64 128l64-128c0-48-32-72-64-72zm-218 6.8c-5.7 2.6-11.7 5-16.6 7.1l7.1 16.6c5.9-2.5 11.5-4.9 16.5-7.1zM177.4 282c-5.4 2.5-11.7 5.3-16.5 7.5l7.4 16.4c5.9-2.6 11.1-5.2 16.3-7.4zm-33 15c-5.6 2.7-11.4 5.5-16.4 8l8.1 16.1c5.4-2.8 11-5.4 15.9-7.8zm284.2 4c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32zm-316.8 12.3c-5.3 2.9-10.6 5.9-16 9l9 15.6c5.1-3 10.3-5.8 15.5-8.6zM80.1 332c-5.61 3.2-11.03 7.5-15.7 10.6L75.3 357c4.97-3.6 10.32-7.3 14.6-9.9zm-29.9 22.6c-4.8 4.4-9.53 9.5-13.2 13.8l13.7 11.7c3.85-4.7 7.2-8.2 11.7-12.2zm217.8 1.3l1.6 17.9c5.2-.9 10.4-.3 15.6.5l3.1-17.7c-6.6-1-13.6-1.7-20.3-.7zm-37.2 10l6.8 16.7c5.2-2.3 10.6-4.1 16.1-5.8c-1.9-5.7-3.3-11.5-4.8-17.3c-6.3 1.8-12.6 4.2-18.1 6.4zm77.5-.9l-10.2 14.8c4.2 3.1 8.3 6.4 11.6 10.5l13.6-11.8c-5.1-5.2-9-10.1-15-13.5zm-94.5 9c-5.5 2.8-10.8 6-16.1 9.1l9.1 15.5c5.2-2.8 10.3-6.1 15.4-8.8zM26.01 385c-3.02 6.5-5.47 13.5-6.61 19.7l17.7 3.1c1.08-5.7 2.63-9.8 4.9-14.7c-5.49-2.4-10.73-5.3-15.99-8.1zm156.09 7.8c-5.1 3.3-10.1 6.6-15.1 10l10 15c5-3.3 9.9-6.7 14.9-10zm152.7 1.2l-15.1 9.8c3.2 4.8 6.3 9.8 9.2 14.9l15.6-9c-3.5-5.6-6-10.6-9.7-15.7zm-182.7 19c-5 3.3-10 6.5-14.9 10l10 15c4.8-3.5 9.9-6.8 15-10.2zm-114.8 9.5c-5.79 1.2-11.63 2.2-17.45 3.3c1.05 7 3.86 13.8 6.4 19.2l16.25-7.8c-2.17-5-4.23-10.2-5.2-14.7zm316.1 2.8l-15.6 9c3.1 5.4 6.7 11.2 9.6 15.8l15.1-9.7c-3.4-5.3-6.3-10.3-9.1-15.1zm-231 7.5c-5 3.1-9.9 6.1-15.1 9l8.9 15.7c5.3-3.1 10.6-6.2 15.7-9.5zm-71.3 16.3l-12.3 13.2c5.56 5.3 12.42 8.8 19.9 10.4l4-17.5c-4.44-.9-8.59-3.1-11.6-6.1zm41 .3c-5.01 2.3-10.21 4.1-15.6 5.2l4.1 17.6c6.42-1.3 12.46-3.7 18.5-6.2zm280.3 4.8l-13.9 11.3c4.3 5.3 9.6 10.4 14.2 14l11.1-14.2c-4.4-3.4-8.2-7.5-11.4-11.1zm24.1 17.5l-4.5 17.5c7.9 1.6 13.8 2.1 21.2 1.3l-2.2-17.9c-4.9.8-9.7.3-14.5-.9z"
      />
    </g>
  </svg>
</svg>

                    </div>
                    <div className="grow ms-6">
                      <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                        Total Distance
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-500">
                      {e.t_totaldistance?.toFixed(2)} km
                      </p>
                    </div>
                  </div>
                </a>
                {/* End Card */}

              </div>
              {/* End Grid */}
            </div>
            <div className="py-3 sm:py-6">
              <h4 className="mb-2 text-sm text-left font-semibold uppercase text-gray-600 dark:text-neutral-400">
                Delivery Reports
              </h4>
              {/* Grid */}
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {/* Card */}
                <a
                  className="bg-white p-4 transition duration-300 rounded-lg hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  href="#"
                >
                  <div className="flex justify-center items-center">
                    <div className="mt-1.5 flex justify-center flex-shrink-0 rounded-s-xl dark:text-white">
                    <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-[55px] w-[55px]"
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
    viewBox="0 0 32 32"
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
        d="m29.482 8.624l-10-5.5a1 1 0 0 0-.964 0l-10 5.5a1 1 0 0 0 0 1.752L18 15.591V26.31l-3.036-1.67L14 26.391l4.518 2.485a.998.998 0 0 0 .964 0l10-5.5A1 1 0 0 0 30 22.5v-13a1 1 0 0 0-.518-.876ZM19 5.142L26.925 9.5L19 13.858L11.075 9.5Zm9 16.767l-8 4.4V15.59l8-4.4Z"
      />
      <path fill="currentColor" d="M10 16H2v-2h8zm2 8H4v-2h8zm2-4H6v-2h8z" />
    </g>
  </svg>
</svg>

                    </div>
                    <div className="grow ms-6">
                      <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                        Proof of delivery
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-500">
  <button onClick={() => { openPictureModal(i) }} style={{ padding: "1px 4px", fontSize: "12px" }}>View</button></p>
                                                <dialog className='py-5 px-5 h-auto rounded-sm' id={`dialog${i}`}>
                                                    <div className="proof h-auto">
                                                        <div className="exit text-end">
                                                            <i className='bx bx-window-close' onClick={() => { closePictureModal(i) }}></i>
                                                        </div>
                                                        <img src={`${VITE_UPLOADING_SERVER}${e.t_picture}`} className='rounded-lg h-76 object-contain' />
                                                    </div>

                                                </dialog>
                    </div>
                  </div>
                </a>
                {/* End Card */}
                {/* Card */}
                <a
                  className="bg-white p-4 transition duration-300 rounded-lg hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  href="#"
                >
                  <div className="flex justify-center items-center">
                    <div className="mt-1.5 flex justify-center flex-shrink-0 rounded-s-xl dark:text-white">
                    <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-[55px] w-[55px]"
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
    viewBox="0 0 32 32"
    fill="currentColor"
    x={128}
    y={128}
    role="img"
    style={{ display: "inline-block", verticalAlign: "middle" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor">
      <path fill="currentColor" d="M15 20h2v4h-2zm5-2h2v6h-2zm-10-4h2v10h-2z" />
      <path
        fill="currentColor"
        d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2ZM12 4h8v4h-8Zm13 24H7V7h3v3h12V7h3Z"
      />
    </g>
  </svg>
</svg>

                    </div>
                    <div className="grow ms-6">
                      <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                        Report
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-500">
                      {e.t_remarks}
                      </p>
                    </div>
                  </div>
                </a>
                {/* End Card */}
                {/* Card */}
                <a
                  className="bg-white p-4 transition duration-300 rounded-lg hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  href="#"
                >
                  <div className="flex justify-center items-center">
                    <div className="mt-1.5 flex justify-center flex-shrink-0 rounded-s-xl dark:text-white">
                    <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-[55px] w-[55px]"
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
    viewBox="0 0 512 512"
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
        d="M256 23c-3.7 0-7.4.1-11.1.27l.8 17.98c3.4-.16 6.8-.25 10.3-.25c118.8 0 215 96.2 215 215s-96.2 215-215 215c-89.6 0-166.35-54.7-198.65-132.6l27.63-8.3l-48.43-34.3l-19.05 54.5l22.55-6.7C74.68 428.8 158.4 489 256 489c128.6 0 233-104.4 233-233S384.6 23 256 23zm-30.8 2.04c-13.3 1.75-26.1 4.6-38.6 8.48l5.6 17.09c11.4-3.54 23.3-6.15 35.4-7.75l-2.4-17.82zm-57 15.12c-12.4 5.05-24.2 11.12-35.4 18.12l9.5 15.21c10.3-6.44 21.2-12.03 32.6-16.67l-6.7-16.66zM116.4 69.5a234.139 234.139 0 0 0-29.35 26.12l13.05 12.28c8.3-8.77 17.4-16.81 27-24.06l-4.8-6.57l-5.9-7.77zm69.5 8.58l-4.4 17.44l217 55.48l4.4-17.4l-217-55.52zM74.07 110.5c-8.19 10.2-15.54 21.2-21.94 32.7l15.65 8.8c5.91-10.7 12.69-20.8 20.26-30.3l-13.97-11.2zm127.63 8.8c-3.9 26 2.8 55.2 14.2 79.2c6.4 13.4 14.2 25.2 21.9 33.8c4.2 4.7 8.4 8.3 12.2 10.9l-5.4 21.2c-4.6.4-10 1.6-16 3.7c-10.9 3.8-23.4 10.4-35.4 19.1c-21.6 15.6-41.4 37.9-50.4 62.6l167.5 42.9c3.9-26-2.8-55.2-14.2-79.2c-6.4-13.4-14.2-25.2-21.9-33.8c-4.2-4.7-8.4-8.3-12.2-10.9l5.4-21.2c4.5-.5 10-1.6 16-3.7c10.9-3.8 23.4-10.4 35.4-19.1c21.6-15.6 41.4-37.9 50.4-62.6l-167.5-42.9zM43.24 160.9c-5.33 12-9.7 24.4-13 37.3l17.48 4.2c3.03-11.8 7.04-23.2 11.95-34.2l-16.43-7.3zM26.2 217.5C24.11 230 23 242.9 23 256v.9l18-.2v-.7c0-12.1 1.02-24 2.95-35.6l-17.75-2.9zM113.5 361l-4.4 17.4l217 55.5l4.4-17.4l-217-55.5z"
      />
    </g>
  </svg>
</svg>

                    </div>
                    <div className="grow ms-6">
                      <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                        Duration
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-500">
                      {e.t_totaldrivetime}
                      </p>
                    </div>
                  </div>
                </a>
                {/* End Card */}
                {/* Card */}
                <a
                  className="bg-white p-4 transition duration-300 rounded-lg hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  href="#"
                >
                  <div className="flex justify-center items-center">
                    <div className="mt-1.5 flex justify-center flex-shrink-0 rounded-s-xl dark:text-white">
                    <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-[55px] w-[55px]"
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
        d="M10.75 5a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5ZM4 5.75A3.75 3.75 0 0 1 7.75 2h8.5A3.75 3.75 0 0 1 20 5.75V9.5h1.227a.75.75 0 0 1 0 1.5H20v8.75a1.75 1.75 0 0 1-1.75 1.75h-1.5A1.75 1.75 0 0 1 15 19.75V18.5H9v1.25a1.75 1.75 0 0 1-1.75 1.75h-1.5A1.75 1.75 0 0 1 4 19.75V11H2.75a.75.75 0 0 1 0-1.5H4V5.75ZM16.5 18.5v1.25c0 .138.112.25.25.25h1.5a.25.25 0 0 0 .25-.25V18.5h-2Zm-11 0v1.25c0 .138.112.25.25.25h1.5a.25.25 0 0 0 .25-.25V18.5h-2Zm2.25-15A2.25 2.25 0 0 0 5.5 5.75V12h13V5.75a2.25 2.25 0 0 0-2.25-2.25h-8.5ZM9 15a1 1 0 1 0-2 0a1 1 0 0 0 2 0Zm7 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z"
      />
    </g>
  </svg>
</svg>

                    </div>
                    <div className="grow ms-6">
                      <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                        Vehicle
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-500">
                      {e.name}
                      </p>
                    </div>
                  </div>
                </a>
                {/* End Card */}
                                {/* Card */}
                                <a
                  className="bg-white p-4 transition duration-300 rounded-lg hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  href="#"
                >
                  <div className="flex justify-center items-center">
                    <div className="mt-1.5 flex justify-center flex-shrink-0 rounded-s-xl dark:text-white">
                    <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-[55px] w-[55px]"
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
        d="m18.484 10.504l3.572-4.036l3.547 4.083l5.584-2.146v5.731l5.603.597l-1.254 5.366m.811 1.106l3.217 2.766l-1.396 1.17m-6.981 9.953v4.352l-5.613-2.093l-3.51 4.179l-3.626-4.181l-5.515 2.102V33.84l-5.654-.735l1.357-5.714L4.5 23.965l4.149-3.498l-1.318-5.713l5.583-.671v-5.62l5.57 2.04"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M36.765 25.121c1.265-8.768-11.424-9.587-12.835-1.568c-3.072-2.057-6.934.216-6.208 3.8c-7.245.058-6.19 7.48-1.96 7.671h22.872c6.18.135 7.413-9.578-1.87-9.903l.236-.134"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 29.209a9.966 9.966 0 0 1 16.08-11.26"
      />
    </g>
  </svg>
</svg>

                    </div>
                    <div className="grow ms-6">
                      <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                        Weather
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-500">
                      {e.sd_current_weather}
                      </p>
                    </div>
                  </div>
                </a>
                {/* End Card */}
                                {/* Card */}
                                <a
                  className="bg-white p-4 transition duration-300 rounded-lg hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  href="#"
                >
                  <div className="flex justify-center items-center">
                    <div className="mt-1.5 flex justify-center flex-shrink-0 rounded-s-xl dark:text-white">
                    <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-[55px] w-[55px]"
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
    viewBox="0 0 32 32"
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
        d="M29 26h-6v-4a2.002 2.002 0 0 1 2-2h2v-2h-4v-2h4a2.002 2.002 0 0 1 2 2v2a2.002 2.002 0 0 1-2 2h-2v2h4zm-10-4h-4a2.002 2.002 0 0 1-2-2V10a2.002 2.002 0 0 1 2-2h4a2.002 2.002 0 0 1 2 2v10a2.002 2.002 0 0 1-2 2zm-4-12v10h4V10zm-4 12H5a2.002 2.002 0 0 1-2-2V10a2.002 2.002 0 0 1 2-2h6v2H5v10h6z"
      />
    </g>
  </svg>
</svg>

                    </div>
                    <div className="grow ms-6">
                      <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                        Total Carbon Emission
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-500">
                      {e.sd_carbon_emission}
                      </p>
                    </div>
                  </div>
                </a>
                {/* End Card */}
                                {/* Card */}
                                <a
                  className="bg-white p-4 transition duration-300 rounded-lg hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  href="#"
                >
                  <div className="flex justify-center items-center">
                    <div className="mt-1.5 flex justify-center flex-shrink-0 rounded-s-xl dark:text-white">
                    <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-[55px] w-[55px]"
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
        d="m19.616 6.48l.014-.017l-4-3.24l-1.26 1.554l2.067 1.674a2.99 2.99 0 0 0-1.395 3.058c.149.899.766 1.676 1.565 2.112c.897.49 1.685.446 2.384.197L18.976 18a.996.996 0 0 1-1.39.922a.995.995 0 0 1-.318-.217a.996.996 0 0 1-.291-.705L17 16a2.98 2.98 0 0 0-.877-2.119A3 3 0 0 0 14 13h-1V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h7c1.103 0 2-.897 2-2v-4h1c.136 0 .267.027.391.078a1.028 1.028 0 0 1 .531.533A.994.994 0 0 1 15 16l-.024 2c0 .406.079.799.236 1.168c.151.359.368.68.641.951a2.97 2.97 0 0 0 2.123.881c.406 0 .798-.078 1.168-.236c.358-.15.68-.367.951-.641A2.983 2.983 0 0 0 20.976 18L21 9a2.997 2.997 0 0 0-1.384-2.52zM4 5h7l.001 4H4V5zm0 14v-8h7.001l.001 8H4zm14-9a1 1 0 1 1 0-2a1 1 0 0 1 0 2z"
      />
    </g>
  </svg>
</svg>

                    </div>
                    <div className="grow ms-6">
                      <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                        Total Fuel Usage
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-500">
                      {e.sd_fuelconsumption}
                      </p>
                    </div>
                  </div>
                </a>
                {/* End Card */}
                                {/* Card */}
                                <a
                  className="bg-white p-4 transition duration-300 rounded-lg hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  href="#"
                >
                  <div className="flex justify-center items-center">
                    <div className="mt-1.5 flex justify-center flex-shrink-0 rounded-s-xl dark:text-white">
                    <svg
  width={512}
  height={512}
  viewBox="0 0 512 512"
  style={{ color: "currentColor" }}
  xmlns="http://www.w3.org/2000/svg"
  className="h-[55px] w-[55px]"
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
        d="M20 8h-3V4H1v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4M6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5M15 7h-2v7h-2V7H9v7H7V7H5v7H3V6h12v1m3 11.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5M17 12V9.5h2.5l1.96 2.5H17Z"
      />
    </g>
  </svg>
</svg>

                    </div>
                    <div className="grow ms-6">
                      <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                        Total Cargo Weight
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-500">
                      {e.t_totalweight}kg
                      </p>
                    </div>
                  </div>
                </a>
                {/* End Card */}
              </div>
              {/* End Grid */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
                                    {/* <div className="more-info-modal-box" id={`modalb${i}`}>
                                        <div className="exit">
                                            <i className='bx bx-window-close' onClick={() => { closeModal(i) }}></i>
                                        </div>
                                        <h3>History Information</h3>
                                        <div className="info">
                                            <div className="info-1">
                                                <h4>Delivery Details</h4>
                                                <p>Start: {formatDate(e.t_start_date)}</p>
                                                <p>End: {formatDate(e.t_end_date)}</p>
                                                <p>Distance: {e.t_totaldistance?.toFixed(2)} km</p>


                                            </div>
                                            <div className="info-2">
                                                <h4>Delivery Reports</h4>
                                                {e.t_picture == "N/A" ?
                                                    <p>Reason: {e.t_reason}</p> :
                                                    <p>Proof of Delivery: <button onClick={() => { openPictureModal(i) }} style={{ padding: "1px 4px", fontSize: "12px" }}>View</button></p>}
                                                <dialog id={`dialog${i}`}>
                                                    <div className="proof">
                                                        <div className="exit">
                                                            <i className='bx bx-window-close' onClick={() => { closePictureModal(i) }}></i>
                                                        </div>
                                                        <img src={`${VITE_UPLOADING_SERVER}${e.t_picture}`} />
                                                    </div>

                                                </dialog>
                                                <p>Report: {e.t_remarks}</p>
                                                <p>Duration: {e.t_totaldrivetime}</p>
                                                <p>Vehicle: {e.name}</p>
                                                <p>Weather: {e.sd_current_weather}</p>
                                                <p>Total Emission: {e.sd_carbon_emission}</p>
                                                <p>Total Fuel Usage: {e.sd_fuelconsumption}</p>
                                                <p>Total Weight: {e.t_totalweight}kg</p>




                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminHistory