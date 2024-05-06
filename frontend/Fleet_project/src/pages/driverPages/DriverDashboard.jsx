import { useEffect, useRef, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import {Line, Bar, Doughnut} from 'react-chartjs-2'
import Breadcrumbs from "@/components/driverDashboard/Breadcrumbs";
import Sidebar from "@/components/driverDashboard/Sidebar";
import '/public/assets/css/adminLayout/dashboardAdmin.css';
import axios from "axios";


const DriverDashboard = ({socket}) => {
    const { theme, d_username, d_id, setIsLoading } = useOutletContext()
    const [deliveries, setDeliveries] = useState([])
    const [refresh, setRefresh] = useState(false)
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    useEffect(()=>{
        if(theme == "light")
        {
            defaults.color = "#363949";
        }else {
            defaults.color = "white";
        }
    }, [theme])

    const getDeliveries = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/get-all-trips?user=${d_id}`)
            const result = data.data
            console.log(result)
            setDeliveries(result)
            setRefresh(true)
            setIsLoading(false)


        } catch (error) {
            console.log(error)
        }
    }

    const getNumberTrips = (type) => {
        let numTrips = ""
        switch(type){
            case "Pending": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            case "Cancelled": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            case "Completed": {numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})}
            break;
            case "In Progress": numTrips = deliveries.filter((e)=>{return e.t_trip_status == type})
            break;
            default:null
        }
        return numTrips.length;
    }
    useEffect(()=>{
        getDeliveries();
    },[refresh])
    useEffect(() => {
        socket.on('deliveryUpdate', (data) => {
                alert("Delivery Status Updated")
                location.reload()        
        });
        return () => socket.off('deliveryUpdate');
    
      }, [socket]);
defaults.maintainAspectRatio = false
defaults.responsive = true
defaults.plugins.title.display = true
defaults.plugins.title.align = "center"
defaults.plugins.title.font.size = 25
    return (
        <>
        <Breadcrumbs title="History" subtitle="Deliveries" />
      <Sidebar/>
      <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="adminDashboard">
            <>
                {/* Card Section */}
                <div className="max-w-[85rem] px-4 py-6 sm:px-6 lg:px-0 lg:py-0 mx-auto">
                    {/* Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* Card */}
                        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                            <div className="p-4 md:p-5 flex justify-between gap-x-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                        Overall Trips
                                    </p>
                                    <div className="mt-1 flex items-center gap-x-2">
                                        <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                            {deliveries.length}
                                        </h3>
                                        <span className="flex items-center gap-x-1 text-green-600">
                                            <svg
                                                className="inline-block size-5 self-center"
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
                                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                                <polyline points="16 7 22 7 22 13" />
                                            </svg>
                                            <span className="inline-block text-lg">1.7%</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex justify-center items-center size-[46px] bg-light_blue text-white rounded-full dark:text-blue-200">
                                    <i className='bx bx-car text-3xl text-solid_blue' id="trips-car-overall"></i>
                                </div>
                            </div>
                            <Link
                                className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                to="/driver/history/deliveries"
                            >
                                View History
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
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </Link>
                        </div>
                        {/* End Card */}
                        {/* Card */}
                        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                            <div className="p-4 md:p-5 flex justify-between gap-x-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                        Completed Trips
                                    </p>
                                    <div className="mt-1 flex items-center gap-x-2">
                                        <h3 className="mt-1 text-xl font-medium text-gray-800 dark:text-neutral-200">
                                            {getNumberTrips("Completed")}
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex justify-center items-center size-[46px] bg-teal-100  border-teal-200 text-white rounded-full dark:text-blue-200">
                                    <i className='bx bx-car text-3xl text-teal-900 ' id="trips-car-completed"></i>
                                </div>
                            </div>
                            <a
                                className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                href="#"
                            >
                                View Trips
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
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </a>
                        </div>
                        {/* End Card */}
                        {/* Card */}
                        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                            <div className="p-4 md:p-5 flex justify-between gap-x-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                        Cancelled Trips
                                    </p>
                                    <div className="mt-1 flex items-center gap-x-2">
                                        <h3 className="mt-1 text-xl font-medium text-gray-800 dark:text-neutral-200">
                                            {getNumberTrips("Cancelled")}
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex justify-center items-center size-[46px] bg-light_red text-white rounded-full dark:text-blue-200">
                                    <i className='bx bx-car text-3xl text-solid_red ' id="trips-car-unsuccessful"></i>
                                </div>
                            </div>
                            <a
                                className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                href="#"
                            >
                                View Trips
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
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </a>
                        </div>
                        {/* End Card */}

                        {/* Card */}
                        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                            <div className="p-4 md:p-5 flex justify-between gap-x-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                        Pending Trips
                                    </p>
                                    <div className="mt-1 flex items-center gap-x-2">
                                        <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                            {getNumberTrips("Pending")}
                                        </h3>
                                        <span className="flex items-center gap-x-1 text-red-600">
                                            <svg
                                                className="inline-block size-4 self-center"
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
                                                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                                                <polyline points="16 17 22 17 22 11" />
                                            </svg>
                                            <span className="inline-block text-lg">1.7%</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex justify-center items-center size-[46px] bg-light_dark text-white rounded-full dark:text-blue-200">
                                    <i className='bx bx-car text-3xl text-solid_dark' id="trips-car-pending"></i>
                                </div>
                            </div>
                            <a
                                className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                href="#"
                            >
                                View Trips
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
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </a>
                        </div>
                        {/* End Card */}
                        {/* Card */}
                        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                            <div className="p-4 md:p-5 flex justify-between gap-x-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                        In Progress Trips
                                    </p>
                                    <div className="mt-1 flex items-center gap-x-2">
                                        <h3 className="mt-1 text-xl font-medium text-gray-800 dark:text-neutral-200">
                                            {getNumberTrips("In Progress")}
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex justify-center items-center size-[46px] bg-light_yellow text-white rounded-full dark:text-blue-200">
                                    <i className='bx bx-car text-solid_yellow text-3xl' id="trips-car-ongoing"></i>
                                </div>
                            </div>
                            <a
                                className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 hover:bg-gray-50 rounded-b-xl dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                href="#"
                            >
                                View Trips
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
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </a>
                        </div>
                        {/* End Card */}

                    </div>
                    {/* End Grid */}
                </div>
                {/* End Card Section */}
            </>

            </div>
            </div>
            </div>
        </>


    )
}

export default DriverDashboard;