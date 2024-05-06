import { useEffect, useRef, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Breadcrumbs from '@/components/adminDashboard/Breadcrumbs'
import Sidebar from '@/components/adminDashboard/Sidebar'
import axios from "axios";
import '/public/assets/css/adminLayout/dashboardAdmin.css';



const AdminDashboard = ({ socket }) => {
    const { u_name, theme, setIsLoading } = useOutletContext()
    const [deliveries, setDeliveries] = useState([])
    const [sustainData, setSustainData] = useState([])
    const [fuelData, setFuelData] = useState()
    const [emissionData, setEmissionData] = useState()
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    useEffect(() => {
        if (theme == "light") {
            defaults.color = "#363949";
        } else {
            defaults.color = "white";
        }
    }, [theme])
    function formatDateTime(datetimeStr) {
        var datetime = new Date(datetimeStr);
        var options = {
            month: 'long',
        };
        // Format the date and time using options
        var formattedDateTime = datetime.toLocaleString('en-US', options);
        return formattedDateTime;
    }
    const downloadEmission = async () => {
        const pdf = new jsPDF("portrait", "pt", "a4");
        const data = await html2canvas(document.querySelector("#emissionTable"));
        const img = data.toDataURL("image/png");
        const imgProperties = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("annual_emission_chart.pdf");

    }
    const downloadFuel = async () => {
        const pdf = new jsPDF("portrait", "pt", "a4");
        const data = await html2canvas(document.querySelector("#fuelTable"));
        const img = data.toDataURL("image/png");
        const imgProperties = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("annual_fuel_chart.pdf");

    }
    const getDeliveries = async () => {
        try {
            const data = await axios.get(`${hostServer}/get-all-trips`)
            const result = data.data
            setDeliveries(result)

        } catch (error) {
            console.log(error)
        }
    }
    const getSustainData = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get(`${hostServer}/getSustainableData`)
            const result = data.data
            setSustainData(result)
            let totalFuel = 0
            let totalEmission = 0
            result.carbonEmissions?.forEach((e) => {
                let parsed = e.total_emission
                totalEmission += parsed
            })
            result.fuelConsumption?.forEach((e) => {
                let parsed = e.total_fuel_consumption
                totalFuel += parsed
            })
            setEmissionData(totalEmission.toFixed(2))
            setFuelData(totalFuel.toFixed(2))
            setIsLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    const getNumberTrips = (type) => {
        let numTrips = ""
        switch (type) {
            case "Pending": numTrips = deliveries.filter((e) => { return e.t_trip_status == type })
                break;
            case "Cancelled": numTrips = deliveries.filter((e) => { return e.t_trip_status == type })
                break;
            case "Completed": numTrips = deliveries.filter((e) => { return e.t_trip_status == type })
                break;
            case "In Progress": numTrips = deliveries.filter((e) => { return e.t_trip_status == type })
                break;
            default: null
        }
        return numTrips.length;

    }
    useEffect(() => {
        getDeliveries();
        getSustainData();
    }, [u_name])
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
                <div className="max-w-[85rem] px-4 py-0 sm:px-6 lg:px-0 lg:py-5 mx-auto">
                    {/* Flex */}
                    <div className="flex flex-col gap-5 sm:flex-row  sm:flex border-y border-gray-200 dark:border-neutral-800">
                        {/* Card */}
                        <div className="p-4 z-[-1] w-full md:p-5 relative before:absolute before:top-0 before:start-0 before:w-full before:h-px sm:before:w-px sm:before:h-full before:bg-gray-200 before:first:bg-transparent dark:before:bg-neutral-900 dark:bg-neutral-900 rounded-xl">
                            <div>
                                <i className='bx bx-wind text-4xl' id="trips-car-emission"></i>
                                <div className="mt-3">
                                    <div className="flex items-center gap-x-2">
                                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                            Total Carbon Emissions
                                        </p>
                                        <div className="hs-tooltip">
                                            <div className="hs-tooltip-toggle">
                                                <svg
                                                    className="size-3.5 text-gray-500 dark:text-neutral-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={16}
                                                    height={16}
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                                                </svg>
                                                <span
                                                    className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700"
                                                    role="tooltip"
                                                >
                                                    The average number of click rate
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-1 lg:flex lg:justify-between lg:items-center">
                                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-neutral-200">
                                            {emissionData} grams
                                        </h3>
                                        <a
                                            className="mt-1 lg:mt-0 min-h-[24px] inline-flex items-center gap-x-1 py-0.5 px-2 text-red-700 bg-red-200/70 hover:bg-red-200 rounded-md dark:bg-red-700 dark:hover:bg-red-800 dark:text-red-100"
                                            href="#"
                                        >
                                            <svg
                                                className="inline-block size-3 self-center"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={16}
                                                height={16}
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                            </svg>
                                            <span className="inline-block text-xs font-semibold">
                                                Need attention
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Card */}
                        {/* Card */}
                        <div className="p-4 z-[-1] w-full md:p-5 relative before:absolute before:top-0 before:start-0 before:w-full before:h-px sm:before:w-px sm:before:h-full before:first:bg-transparentdark:before:bg-neutral-900 dark:bg-neutral-900 rounded-xl">
                            <div>
                                <i className='bx bx-gas-pump text-4xl' id="trips-car-fuel"></i>
                                <div className="mt-3">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                        Total Fuel Consumption
                                    </p>
                                    <div className="mt-1 lg:flex lg:justify-between lg:items-center">
                                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-neutral-200">
                                            {fuelData} liters
                                        </h3>
                                        <a
                                            className="mt-1 lg:mt-0 min-h-[24px] inline-flex items-center gap-x-1 py-0.5 px-2 text-orange-700 bg-orange-200/70 hover:bg-orange-200 rounded-md dark:bg-orange-700 dark:hover:bg-orange-800 dark:text-orange-100"
                                            href="#"
                                        >
                                            <svg
                                                className="inline-block size-3 self-center"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={16}
                                                height={16}
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                            </svg>
                                            <span className="inline-block text-xs font-semibold">
                                                2 warnings
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Card */}
                    </div>
                    {/* End Grid */}
                </div>
                {/* End Card Section */}
            </>
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
                                to="/admin/history/list"
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
                                <div className="flex-shrink-0 flex justify-center items-center size-[46px] bg-teal-100 border border-teal-200 text-white rounded-full dark:text-blue-200">
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






            <div className="flex flex-col  lg:flex-row sm:flex gap-4 sm:gap-6 lg:mt-6 sm:p-0 p-4">
                {/* Card */}
                <div className="w-full md:p-5 min-h-[410px] p-4 flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                                Total Carbon Emissions
                            </h2>
                            <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                {emissionData} grams
                            </p>
                        </div>
                        <div>
                            <span className="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500">
                                <svg
                                    className="inline-block size-3.5"
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
                                    <path d="M12 5v14" />
                                    <path d="m19 12-7 7-7-7" />
                                </svg>
                                2%
                            </span>
                        </div>
                        <div className="export">
                            <div className="export">
                                <svg
                                    onClick={downloadEmission}
                                    width={52}
                                    height={52}
                                    viewBox="0 0 512 512"
                                    style={{ color: "#1976d2" }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-full w-full cursor-pointer"
                                >
                                    <rect
                                        width={512}
                                        height={512}
                                        x={0}
                                        y={0}
                                        rx={103}
                                        fill="transparent"
                                        stroke="transparent"
                                        strokeWidth={0}
                                        strokeOpacity="100%"
                                        paintOrder="stroke"
                                    />
                                    <svg
                                        width="512px"
                                        height="512px"
                                        viewBox="0 0 32 32"
                                        fill="#1976d2"
                                        x={0}
                                        y={0}
                                        role="img"
                                        style={{ display: "inline-block", verticalAlign: "middle" }}
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g fill="#1976d2">
                                            <path
                                                fill="#909090"
                                                d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945L24.1 2.072"
                                            />
                                            <path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873L24.03 2" />
                                            <path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5H8.655" />
                                            <path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077v6.832" />
                                            <path
                                                fill="#464648"
                                                d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2.042 2.042 0 0 0 .647-.117a1.427 1.427 0 0 0 .493-.291a1.224 1.224 0 0 0 .335-.454a2.13 2.13 0 0 0 .105-.908a2.237 2.237 0 0 0-.114-.644a1.173 1.173 0 0 0-.687-.65a2.149 2.149 0 0 0-.409-.104a2.232 2.232 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.942.942 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.677 2.677 0 0 0 1.028-.175a1.71 1.71 0 0 0 .68-.491a1.939 1.939 0 0 0 .373-.749a3.728 3.728 0 0 0 .114-.949a4.416 4.416 0 0 0-.087-1.127a1.777 1.777 0 0 0-.4-.733a1.63 1.63 0 0 0-.535-.4a2.413 2.413 0 0 0-.549-.178a1.282 1.282 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.062 1.062 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a2.926 2.926 0 0 1-.033.513a1.756 1.756 0 0 1-.169.5a1.13 1.13 0 0 1-.363.36a.673.673 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"
                                            />
                                            <path
                                                fill="#dd2025"
                                                d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511Zm-2.357.083a7.543 7.543 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14.216 14.216 0 0 0 1.658 2.252a13.033 13.033 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.787 10.787 0 0 1-.517 2.434a4.426 4.426 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444ZM25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14.228 14.228 0 0 0-2.453.173a12.542 12.542 0 0 1-2.012-2.655a11.76 11.76 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.309 9.309 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.622 9.622 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a22.549 22.549 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"
                                            />
                                            <path fill="#909090" d="M23.954 2.077V7.95h5.633l-5.633-5.873Z" />
                                            <path fill="#f4f4f4" d="M24.031 2v5.873h5.633L24.031 2Z" />
                                            <path
                                                fill="#fff"
                                                d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2.042 2.042 0 0 0 .647-.117a1.428 1.428 0 0 0 .493-.291a1.224 1.224 0 0 0 .332-.454a2.13 2.13 0 0 0 .105-.908a2.237 2.237 0 0 0-.114-.644a1.173 1.173 0 0 0-.687-.65a2.149 2.149 0 0 0-.411-.105a2.232 2.232 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.942.942 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.677 2.677 0 0 0 1.028-.175a1.71 1.71 0 0 0 .68-.491a1.939 1.939 0 0 0 .373-.749a3.728 3.728 0 0 0 .114-.949a4.416 4.416 0 0 0-.087-1.127a1.777 1.777 0 0 0-.4-.733a1.63 1.63 0 0 0-.535-.4a2.413 2.413 0 0 0-.549-.178a1.282 1.282 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.062 1.062 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a2.926 2.926 0 0 1-.033.513a1.756 1.756 0 0 1-.169.5a1.13 1.13 0 0 1-.363.36a.673.673 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"
                                            />
                                        </g>
                                    </svg>
                                </svg>




                            </div>

                        </div>
                    </div>
                    <div className="kpi-card" >
                        <Line id="emissionTable" data={{
                            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                            datasets: [
                                {
                                    label: "Emissions in grams",
                                    data: sustainData.carbonEmissions?.map((e) => { return e.total_emission })
                                },
                            ],

                        }}
                        />
                    </div>
                </div>
                {/* Card */}
                <div className="w-full p-4 md:p-5 min-h-[410px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-sm text-gray-500 dark:text-neutral-500">Total Fuel Consumption</h2>
                            <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                {fuelData} liters
                            </p>
                        </div>
                        <div>
                            <span className="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-500">
                                <svg
                                    className="inline-block size-3.5"
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
                                    <path d="M12 5v14" />
                                    <path d="m19 12-7 7-7-7" />
                                </svg>
                                25%
                            </span>
                            <span></span>
                        </div>
                        <div className="export">
                            <svg
                                onClick={downloadFuel}
                                width={52}
                                height={52}
                                viewBox="0 0 512 512"
                                style={{ color: "#1976d2" }}
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-full w-full cursor-pointer"
                            >
                                <rect
                                    width={512}
                                    height={512}
                                    x={0}
                                    y={0}
                                    rx={103}
                                    fill="transparent"
                                    stroke="transparent"
                                    strokeWidth={0}
                                    strokeOpacity="100%"
                                    paintOrder="stroke"
                                />
                                <svg
                                    width="512px"
                                    height="512px"
                                    viewBox="0 0 32 32"
                                    fill="#1976d2"
                                    x={0}
                                    y={0}
                                    role="img"
                                    style={{ display: "inline-block", verticalAlign: "middle" }}
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g fill="#1976d2">
                                        <path
                                            fill="#909090"
                                            d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945L24.1 2.072"
                                        />
                                        <path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873L24.03 2" />
                                        <path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5H8.655" />
                                        <path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077v6.832" />
                                        <path
                                            fill="#464648"
                                            d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2.042 2.042 0 0 0 .647-.117a1.427 1.427 0 0 0 .493-.291a1.224 1.224 0 0 0 .335-.454a2.13 2.13 0 0 0 .105-.908a2.237 2.237 0 0 0-.114-.644a1.173 1.173 0 0 0-.687-.65a2.149 2.149 0 0 0-.409-.104a2.232 2.232 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.942.942 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.677 2.677 0 0 0 1.028-.175a1.71 1.71 0 0 0 .68-.491a1.939 1.939 0 0 0 .373-.749a3.728 3.728 0 0 0 .114-.949a4.416 4.416 0 0 0-.087-1.127a1.777 1.777 0 0 0-.4-.733a1.63 1.63 0 0 0-.535-.4a2.413 2.413 0 0 0-.549-.178a1.282 1.282 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.062 1.062 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a2.926 2.926 0 0 1-.033.513a1.756 1.756 0 0 1-.169.5a1.13 1.13 0 0 1-.363.36a.673.673 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"
                                        />
                                        <path
                                            fill="#dd2025"
                                            d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511Zm-2.357.083a7.543 7.543 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14.216 14.216 0 0 0 1.658 2.252a13.033 13.033 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.787 10.787 0 0 1-.517 2.434a4.426 4.426 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444ZM25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14.228 14.228 0 0 0-2.453.173a12.542 12.542 0 0 1-2.012-2.655a11.76 11.76 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.309 9.309 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.622 9.622 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a22.549 22.549 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"
                                        />
                                        <path fill="#909090" d="M23.954 2.077V7.95h5.633l-5.633-5.873Z" />
                                        <path fill="#f4f4f4" d="M24.031 2v5.873h5.633L24.031 2Z" />
                                        <path
                                            fill="#fff"
                                            d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2.042 2.042 0 0 0 .647-.117a1.428 1.428 0 0 0 .493-.291a1.224 1.224 0 0 0 .332-.454a2.13 2.13 0 0 0 .105-.908a2.237 2.237 0 0 0-.114-.644a1.173 1.173 0 0 0-.687-.65a2.149 2.149 0 0 0-.411-.105a2.232 2.232 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.942.942 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.677 2.677 0 0 0 1.028-.175a1.71 1.71 0 0 0 .68-.491a1.939 1.939 0 0 0 .373-.749a3.728 3.728 0 0 0 .114-.949a4.416 4.416 0 0 0-.087-1.127a1.777 1.777 0 0 0-.4-.733a1.63 1.63 0 0 0-.535-.4a2.413 2.413 0 0 0-.549-.178a1.282 1.282 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.062 1.062 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a2.926 2.926 0 0 1-.033.513a1.756 1.756 0 0 1-.169.5a1.13 1.13 0 0 1-.363.36a.673.673 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"
                                        />
                                    </g>
                                </svg>
                            </svg>




                        </div>

                    </div>
                    {/* End Header */}
                    <div id="hs-multiple-bar-charts" />
                    <div className="kpi-card" >
                        <Line id="fuelTable" data={{
                            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                            datasets: [
                                {
                                    label: "Fuel Usage in Liters",
                                    data: sustainData.fuelConsumption?.map((e) => { return e.total_fuel_consumption })
                                },
                            ],

                        }} />
                    </div>
                </div>
                {/* End Card */}

            </div>

        </div>
        </div>
         </div>
        </>
    )
}

export default AdminDashboard;