import axios from "axios";
import * as XLSX from 'xlsx';
import { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import EditModal from '../../../components/fuel/EditModal'
import DeleteModal from "@/components/fuel/DeleteModal";
import Breadcrumbs from '@/components/adminDashboard/Breadcrumbs'
import Sidebar from '@/components/adminDashboard/Sidebar'
const FuelManagement = () => {
    const deliveryTable = useRef(null)
    const nav = useNavigate()
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const { setIsLoading } = useOutletContext()
    const [isDelete, setIsDelete] = useState(false)
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const [fuelList, setFuelList] = useState([])
    const [filterData, setFilterData] = useState("")
    const [fuelData, setFuelData] = useState([])
    const [fuelSearch, setFuelSearch] = useState('')
    const exportData = (type) => {
        const fileName = `fuel-report-sheet.${type}`
        const wb = XLSX.utils.table_to_book(deliveryTable.current)
        XLSX.writeFile(wb, fileName)
      }
    const getFuelList = async () => {
        setIsLoading(true)
        const fetchFuel = await axios.get(`${hostServer}/retrieve-fuel?page=${page}&pageSize=${pageSize}`)
        const data = fetchFuel.data;
        setFuelList(data)
        setIsLoading(false)
    }
    const getFuelListFull = async () => {
        setIsLoading(true)
        const fetchFuel = await axios.get(`${hostServer}/retrieve-fuel-full`)
        const data = fetchFuel.data;
        setFuelData(data)
        setIsLoading(false)
    }
    const searchFuel = async (e) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const fetchFuel = await axios.get(`${hostServer}/fuel?search=${fuelSearch}`)
            const filteredData = fetchFuel.data
            setFuelList(filteredData)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }

    }
    const updateData = (e) => {
        if (e) {
            nav(`/admin/fuel/edit/${e}`)
        }
    }
    const filterFuel = (e) => {
        if (e == [] || e == "") {
            setFuelList(fuelData)
        } else {
            setFilterData(e)
            const filtered = fuelData.filter((f) => {
                const formattedDate = formatDate(f.v_fuelfilldate);
                if (formattedDate == e) {
                    return f
                }
            })
            setFuelList(filtered)
        }

    }
    useEffect(() => {
        getFuelList()
        getFuelListFull()
    }, [isDelete, page])
    const formatDate = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate());
        return formattedDate.toISOString().split("T")[0];
    };
    const deleteData = async (e) => {
        try {
            setIsLoading(true)
            const fetched = await axios.put(`${hostServer}/fuel-delete/${e}`)
            setIsDelete(!isDelete)
            setIsLoading(false)
            alert(fetched.data.message)
        } catch (error) {
            console.log(error)
        }

    }
    const openModal = (e) => {
        const num = e
        const modalInfo = document.querySelector("#modal" + e)
        const modalbg = document.querySelector("#modalbg" + e)
        const modalb = document.querySelector("#modalb" + e)
        modalInfo.style.display = "block"
        modalb.style.display = 'block'
        modalbg.style.display = 'block'
    }
    const closeModal = (e) => {
        const num = e
        const modalInfo = document.querySelector("#modal" + e)
        const modalbg = document.querySelector("#modalbg" + e)
        const modalb = document.querySelector("#modalb" + e)
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
    return (
        <>
            <Breadcrumbs title="Fuel" subtitle="Fuel Management" />
            <Sidebar />
            <div className="w-full lg:ps-64">
                <div className="sm:space-y-6">
                    <div className="flex flex-col">
                        <div className="w-auto px-6 py-4 flex gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700 items-center">
                            {/* Input */}
                            <div className="flex gap-1">
                                <div className="sm:col-span-1">

                                    <label htmlFor="hs-as-table-product-review-search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <form className='p-0' onSubmit={(e) => { searchFuel(e) }}>
                                            <input
                                                type="text"
                                                id="hs-as-table-product-review-search"
                                                name="hs-as-table-product-review-search"
                                                className="py-2 px-3 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                placeholder="Search"
                                                onChange={(e) => { setFuelSearch(e.target.value) }}
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
                                <div className="hs-dropdown [--placement:bottom-right] relative inline-block">
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
                                    <div className="hs-tooltip-content !w-auto !transform-none relative left-0 hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible hidden opacity-0 transition-opacity invisible z-10 max-w-xs bg-white border border-gray-100 text-start rounded-xl shadow-md after:absolute after:top-0 after:-start-4 after:w-4 after:h-full dark:bg-neutral-800 dark:border-neutral-700">
                                        <div
                                            className="transition-[opacity,margin] duration divide-y divide-gray-200 min-w-48 z-10 bg-white shadow-md rounded-lg mt-2 dark:divide-neutral-700 dark:bg-neutral-800 dark:border dark:border-neutral-700"

                                        >
                                            <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                                                <label
                                                    className="flex py-2.5 px-3 w-full"
                                                >

                                                    <input type="date"
                                                        className="w-full py-1 text-gray-800 dark:text-neutral-200 text-sm border-gray-300 rounded-lg focus:ring-blue-500 disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800 "
                                                        value={filterData} onChange={(e) => { filterFuel(e.currentTarget.value) }} />
                                                    <span className="ms-3 text-xs py-2 px-0 text-gray-800 dark:text-neutral-200 grid place-content-center">
                                                        Fill Date
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

                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    <table ref={deliveryTable} className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                        <thead>
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                >
                                                    F.No
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                >
                                                    Fill Date
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                >
                                                    Vehicle
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                >
                                                    Quantity
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                >
                                                    Total Price
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                >
                                                    Filled By
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                >
                                                    Odometer Reading
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                >
                                                    Remarks
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                >
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                            {
                                                fuelList.map((e, i) => {
                                                    return (
                                                        <tr key={i} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                                                FL-{e?.v_fuel_id}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                                {formatDate(e?.v_fuelfilldate)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                                {e?.v_id}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                                {e.v_fuel_quantity}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                                {e.v_fuelprice}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                                {e?.v_fueladdedby}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                                {e?.v_odometerreading}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                                {e?.v_fuelcomments}
                                                            </td>
                                                            <span className="flex justify-center items-center gap-2">
                                                                <div className="more-info grid place-content-center">
                                                                    <button onClick={()=>{updateData(e.v_fuel_id)}}>
                                                                        <i class='bx bxs-edit-alt bg-light_yellow text-solid_yellow py-2 px-2 rounded-md' ></i></button>
                                                                </div>

                                                                <button onClick={() => { deleteData(e.v_fuel_id) }}>
                                                                    <i  className='bx bx-x-circle bg-light_red text-solid_red py-2 px-2 rounded-md' ></i></button>
                                                            </span>
                                                        </tr>
                                                    )
                                                })
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class=" px-6 py-4 z-0 grid gap-3 justify-center items-center md:flex md:justify-end md:items-center dark:border-neutral-700">
                            <div>
                                <div class="inline-flex gap-x-2">
                                    <button disabled={page === 1}
                                        onClick={() => setPage(page - 1)} type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                                        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                        Prev
                                    </button>
                                    <span className='grid place-content-center text-sm dark:text-neutral-200 text-gray-900'>{page}</span>
                                    <button
                                        disabled={fuelList.length < 5} onClick={() => setPage(page + 1)}
                                        type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                                        Next
                                        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default FuelManagement;