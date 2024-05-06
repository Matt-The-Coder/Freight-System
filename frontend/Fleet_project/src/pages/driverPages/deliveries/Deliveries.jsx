import { useEffect, useRef, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Breadcrumbs from '@/components/driverDashboard/Breadcrumbs'
import Sidebar from '@/components/driverDashboard/Sidebar'
import '/public/assets/css/adminLayout/deliveries.css';

const DriverDeliveries = ({ socket }) => {
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const mapboxToken = import.meta.env.VITE_MAPBOX_API;
    const { d_username: username, setIsLoading, d_id: id } = useOutletContext();
    const [deliveries, setDeliveries] = useState([]);
    const [deliveriesStorage, setDeliveriesStorage] = useState([])
    const nav = useNavigate()
    const [travelData, setTravelData] = useState([])
    const [travelStorage, setTravelStorage] = useState([])
    const [filterData, setFilterData] = useState('')
    const [onGoing, setOnGoing] = useState([])
    const acceptButtonRef = useRef(null);

    const setInProgress = async (trip_id, driverFirstname, t_distance, t_weight) => {
        try {
            if (onGoing.length !== 0) {
                alert('You can only accept one order at a time!');
                return;
            } else {
            setIsLoading(true)
            const data = await axios.post(`${hostServer}/update-trip-pending/${trip_id}`, {
                status: "In Progress"
            })
            let deliveryState = "In Progress"
            let message = ''
            switch (deliveryState) {
                case 'In Progress':
                    message = `Delivery in progress, handled by ${driverFirstname}. Review details for more info.`;
                    break;
                case 'Completed':
                    message = `Delivery successfully completed by ${driverFirstname}. Thank you for your service!`;
                    break;
                case 'Cancelled':
                    message = `Delivery cancelled by ${driverFirstname}. Take necessary action and notify relevant parties.`;
                    break;
                case 'Pending':
                    message = `Delivery set as pending, awaiting action by ${driverFirstname}. Review details and provide instructions.`;
                    break;
            }

            const insertNotif = await axios.post(`${hostServer}/insertNotifications`,
                {
                    description: message
                })
            socket.emit('deliveryUpdate', { deliveryState, trip_id })
            setIsLoading(false)
            nav(`/driver/deliveries/tracking?trip_id=${trip_id}&miles=${convertMiles(t_distance)}&weight=${t_weight}`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const filterDeliveries = (e) => {
        if (e == "") {
            setDeliveries(deliveriesStorage)
            setTravelData(travelStorage)
            setFilterData(e)
        } else {
            setFilterData(e)
            const indexes = []
            const filteredDeliveries = deliveriesStorage.filter((d, i) => {
                const formattedDate = formatDate(d.t_start_date);
                if (formattedDate == e) {
                    indexes.push(i)
                    return d;

                }

            })
            const filterTripData = travelStorage.filter((v, i) => {
                if (i == indexes) {
                    return v
                }
            })
            console.log(filterTripData)
            setTravelData(filterTripData)
            setDeliveries(filteredDeliveries)
        }

    }

    const formatDate = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate());
        return formattedDate.toISOString().split("T")[0];
      };
    function convertTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        const formattedTime = `${hours}h ${minutes}m`;
        return formattedTime;
    }

    function convertMiles(meters) {
        const miles = 0.00062137 * meters
        console.log(miles)
        return miles
    }
    function convertKm(meters) {
        const kilometers = meters / 1000;
        return kilometers.toFixed(2);
    }
    function reverseObject(obj) {
        // Convert the object into an array of key-value pairs
        var entries = Object.entries(obj);

        // Reverse the order of the entries
        var reversedEntries = entries.reverse();

        // Convert the reversed entries back into an object
        var reversedObj = Object.fromEntries(reversedEntries);

        return reversedObj;
    }
    const getDeliveries = async () => {
        try {
            setIsLoading(true);
            const data = await axios.get(`${hostServer}/get-trip?username=${id}`);
            const result = data.data;

            const ongoingTrips = result.filter((e) => { return e.t_trip_status == "In Progress" })
            const pendingTrips = result.filter((e) => { return e.t_trip_status == "Pending" })
            const travelRoutes = await Promise.all(pendingTrips.map(async (e) => {
                const travelTime = await axios.post(`${hostServer}/getDirections`, {
                    fLongitude: e.t_trip_fromlog,
                    fLatitude: e.t_trip_fromlat,
                    dLongitude: e.t_trip_tolog,
                    dLatitude: e.t_trip_tolat,
                    mapboxToken, id: e.t_id
                });
                const travel = travelTime.data?.routes[0];
                return travel;
            }));
            const reverseTravel = travelRoutes
            console.log(reverseTravel)
            setOnGoing(ongoingTrips)
            setTravelData(reverseTravel);
            setTravelStorage(reverseTravel)
            const del = await axios.get(`${hostServer}/get-trip?username=${id}`);
            const updatedDel = del.data;
            const pendingDel = result.filter((e) => { return e.t_trip_status == "Pending" })
            setDeliveries(pendingDel);
            console.log(pendingDel)
            setDeliveriesStorage(pendingDel)
            setIsLoading(false);

        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getDeliveries();
    }, [username]);

    return (
        <>
                         <Breadcrumbs title="History" subtitle="Deliveries" />
            <Sidebar />
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

                            {/* <div className="hs-dropdown [--placement:bottom-right] relative inline-block">
                                <button
                                    id="hs-as-table-table-export-dropdown"
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
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1={12} x2={12} y1={15} y2={3} />
                                    </svg>
                                    Export
                                </button>
                                <div
                                    className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden divide-y divide-gray-200 min-w-48 z-10 bg-white shadow-md rounded-lg p-2 mt-2 dark:divide-neutral-700 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                    aria-labelledby="hs-as-table-table-export-dropdown"
                                >
                                    <div className="py-2 first:pt-0 last:pb-0">
                                        <span className="block py-2 px-3 text-xs font-medium uppercase text-gray-400 dark:text-neutral-600">
                                            Options
                                        </span>
                                        <a
                                            className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
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
                                                <rect width={8} height={4} x={8} y={2} rx={1} ry={1} />
                                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                            </svg>
                                            Copy
                                        </a>
                                        <a
                                            className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
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
                                                <polyline points="6 9 6 2 18 2 18 9" />
                                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                                <rect width={12} height={8} x={6} y={14} />
                                            </svg>
                                            Print
                                        </a>
                                    </div>
                                    <div className="py-2 first:pt-0 last:pb-0">
                                        <span className="block py-2 px-3 text-xs font-medium uppercase text-gray-400 dark:text-neutral-600">
                                            Download options
                                        </span>
                                        <a
                                            className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                                            href="#"
                                            onClick={() => { exportData("Xlsx") }}
                                        >
                                            <svg
                                                className="flex-shrink-0 size-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={16}
                                                height={16}
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z" />
                                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                            </svg>
                                            .XLSX
                                        </a>
                                        <a
                                            className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                                            href="#"
                                            onClick={() => { exportData("Xls") }}
                                        >
                                            <svg
                                                className="flex-shrink-0 size-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={16}
                                                height={16}
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z" />
                                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                            </svg>
                                            .XLS
                                        </a>
                                        <a
                                            className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                                            href="#"
                                            onClick={() => { exportData("CSV") }}
                                        >
                                            <svg
                                                className="flex-shrink-0 size-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={16}
                                                height={16}
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM3.517 14.841a1.13 1.13 0 0 0 .401.823c.13.108.289.192.478.252.19.061.411.091.665.091.338 0 .624-.053.859-.158.236-.105.416-.252.539-.44.125-.189.187-.408.187-.656 0-.224-.045-.41-.134-.56a1.001 1.001 0 0 0-.375-.357 2.027 2.027 0 0 0-.566-.21l-.621-.144a.97.97 0 0 1-.404-.176.37.37 0 0 1-.144-.299c0-.156.062-.284.185-.384.125-.101.296-.152.512-.152.143 0 .266.023.37.068a.624.624 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.2-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.551.05-.776.15-.225.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.122.524.082.149.2.27.352.367.152.095.332.167.539.213l.618.144c.207.049.361.113.463.193a.387.387 0 0 1 .152.326.505.505 0 0 1-.085.29.559.559 0 0 1-.255.193c-.111.047-.249.07-.413.07-.117 0-.223-.013-.32-.04a.838.838 0 0 1-.248-.115.578.578 0 0 1-.255-.384h-.765ZM.806 13.693c0-.248.034-.46.102-.633a.868.868 0 0 1 .302-.399.814.814 0 0 1 .475-.137c.15 0 .283.032.398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.441 1.441 0 0 0-.489-.272 1.838 1.838 0 0 0-.606-.097c-.356 0-.66.074-.911.223-.25.148-.44.359-.572.632-.13.274-.196.6-.196.979v.498c0 .379.064.704.193.976.131.271.322.48.572.626.25.145.554.217.914.217.293 0 .554-.055.785-.164.23-.11.414-.26.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.799.799 0 0 1-.118.363.7.7 0 0 1-.272.25.874.874 0 0 1-.401.087.845.845 0 0 1-.478-.132.833.833 0 0 1-.299-.392 1.699 1.699 0 0 1-.102-.627v-.495Zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879l-1.327 4Z"
                                                />
                                            </svg>
                                            .CSV
                                        </a>
                                    </div>
                                </div>
                            </div> */}
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
        <div className="DriverDeliveries">
            <div className="deliveries-list">
                {deliveries.length === 0 && (
                    <center>
                        <h1>No Upcoming Deliveries Yet</h1>
                    </center>
                )}
                {deliveries?.map((e, i) => {
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
                        <div className="deliveries-container bg-white border-y dark:bg-neutral-800" key={i}>
                        <div className="time-container">
                            <p className='text-sm text-gray-600 dark:text-neutral-400'>Order Date: {formatDate(e?.t_created_date)}</p>
                        </div>
                        <div className="delivery-info">
                            <div className="second-container">
                                <div className="h3-container" style={{ backgroundColor: statusColor }}>
                                    <h3  style={{ color: fontColor }}>{e.t_trip_status}</h3>
                                </div>
                            </div>


                        </div>
                        <div className="deliveries-header">
                            <>

<div className="flex flex-col gap-2 sm:gap-10 sm:flex-row">
  {/* Card */}
  <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
    <div className="p-4 md:p-5 flex gap-x-4">
      <div className="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-800">
        <svg
          className="flex-shrink-0 size-5 text-gray-600 dark:text-neutral-400"
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
          <path d="M5 22h14" />
          <path d="M5 2h14" />
          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </svg>
      </div>
      <div className="grow">
        <div className="flex items-center gap-x-2">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
          Estimated Travel Time:
          </p>
        </div>
        <div className="mt-1 flex items-center gap-x-2">
          <h3 className="text-xl font-medium text-gray-800 dark:text-neutral-200">
          {convertTime(travelData[i]?.duration)}
          </h3>
        </div>
      </div>
    </div>
  </div>
  {/* End Card */}
  {/* Card */}
  <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
    <div className="p-4 md:p-5 flex gap-x-4">
      <div className="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-800">
        <svg
          className="flex-shrink-0 size-5 text-gray-600 dark:text-neutral-400"
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
          <path d="M5 22h14" />
          <path d="M5 2h14" />
          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </svg>
      </div>
      <div className="grow">
        <div className="flex items-center gap-x-2">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
          Estimated Total Distance:
          </p>
        </div>
        <div className="mt-1 flex items-center gap-x-2">
          <h3 className="text-xl font-medium text-gray-800 dark:text-neutral-200">
          {convertKm(travelData[i].distance)} km
          </h3>
        </div>
      </div>
    </div>
  </div>
  {/* End Card */}
</div>
</>

                        </div>
                        <>
                                        {/* Timeline */}
                                        <div className='py-4'>
                                            {/* Heading */}
                                            <div className="ps-2 my-2 first:mt-0">
                                                <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                                                    {formatDate(e.t_start_date)}
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
                                                    {formatDate(e.t_end_date)}
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

                        
                        <div className="more-info">

<div className="trips-button-pending" id={`accept${e.t_id}`}  type="button" >

<button className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" onClick={() => { setInProgress(e.t_id, e.d_first_name, travelData[i]?.distance, e.t_totalweight) }}>Accept Order</button>
</div>
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
  
        </div>
        </div>
        </>
    );
};

export default DriverDeliveries;
