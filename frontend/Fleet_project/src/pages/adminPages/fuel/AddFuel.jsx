import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import '/public/assets/css/adminLayout/fuel.css'
import axios from 'axios'
import Breadcrumbs from '@/components/adminDashboard/Breadcrumbs'
import Sidebar from '@/components/adminDashboard/Sidebar'
const AddFuel = () => {
    const {setIsLoading, handleLogout} = useOutletContext()
    const nav = useNavigate()
    const [success, setSuccess] = useState(false)
    const [vehicle, setVehicle] = useState("")
    const [vehicleList, setVehicleList] = useState([])
    const [driverList, setDriverList] = useState([])
    const [driver, setDriver] = useState("")
    const [date, setDate] = useState("")
    const [quantity, setQuantity] = useState("")
    const [odometerReading, setOdometerReading] = useState("")
    const [amount, setAmount] = useState("")
    const [remarks, setRemarks] = useState("")
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const AddFueled = async (e) => 
    {
        e.preventDefault()
        setIsLoading(true)
        const result = await axios.post(`${hostServer}/add-fuel`, 
        {vehicle, driver, date, quantity, odometerReading, amount, remarks})
        setIsLoading(false)
        setSuccess(true)
        setTimeout(()=>{setSuccess(false)}, 2000)
        setTimeout(()=>{nav('/admin/fuel/manage')}, 3000)
    }
    const getAllVehicles = async () => {
        try {
            const res = await axios.get(`${hostServer}/retrieve-vehicles`)
            const data = res.data
            setVehicleList(data)
        } catch (error) {
           console.log(error) 
        }
    }
    const getAllDrivers = async () => {
        try {
            const res = await axios.get(`${hostServer}/retrieve-drivers`)
            const data = res.data
            setDriverList(data)
            console.log(data)
        } catch (error) {
            
        }
    }

    const getVehicle = async (e) =>{
        setDriver(e)
        try {
            setIsLoading(true)
            const res = await axios.get(`${hostServer}/retrieve-vehicles?driver=${e}`)
            const data = res.data
            setVehicleList(data)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
           console.log(error) 
        }
    }

    useEffect(()=>{
        getAllVehicles()
        getAllDrivers()
    },[])
  
    useEffect(()=>{
        const opt = document.querySelector("#vehicle")
        setVehicle(opt.value)
    }, [vehicleList])
    return (
        <>
                <Breadcrumbs title="Fuel" subtitle="Add Fuel" isModal={true} />
            <Sidebar isModal={true} handleLogout={handleLogout} />
            <div className="w-full lg:ps-64">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 lg-[600px] bg-white dark:bg-neutral-800">
                <>
  {/* Card Section */}
  <div className=" mx-auto">
    {/* Card */}
    <div className="bg-white dark:bg-neutral-800">
      <form onSubmit={(e)=>{AddFueled(e)}}>
        {/* Section */}
        <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
          <div className="sm:col-span-12">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Fuel Management
            </h2>
          </div>
          {/* End Col */}
          <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-full-name"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Driver
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
            <select required onChange={(e)=>{getVehicle(e.currentTarget.value)}} className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
            <option disabled selected>Select Driver</option>
                                {driverList.map((e, i)=>{
                                    return <option key={i} value={`${e.d_first_name}`}>{e.d_first_name} {e.d_last_name}</option>
                                })}

            </select>
          </div>
          {/* End Col */}
                    {/* End Col */}
                    <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-full-name"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Vehicle
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
            <select name="vehicle" disabled required id='vehicle'  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
            <option disabled>Select Vehicle</option>
                                {vehicleList.map((e, i)=>{
                                    return <option selected key={i} value={e.name}>{e.name}</option>
                                })}
            </select>
          </div>

                    {/* End Col */}
                    <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-full-name"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Fill Date
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
          <input
              id="af-submit-application-email"
              required onChange={(e) => { setDate(e.currentTarget.value) }} value={date}
              type="date"
              className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
          </div>
          {/* End Col */}
                    {/* End Col */}
                    <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-full-name"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Quantity in Liters
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
          <input
          type="number" required placeholder='Enter Volume' onChange={(e) => { setQuantity(e.currentTarget.value) }} value={quantity} 
              id="af-submit-application-email"
              className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
          </div>
          {/* End Col */}
                    {/* End Col */}
                    <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-full-name"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Odometer Reading
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
          <input
              id="af-submit-application-email"
              type="number" placeholder='Enter Usage' required onChange={(e) => { setOdometerReading(e.currentTarget.value) }} value={odometerReading}
              className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
          </div>
          {/* End Col */}
                    {/* End Col */}
                    <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-full-name"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Amount
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
          <input
              id="af-submit-application-email"
              type="number" placeholder='Enter Price' required onChange={(e) => { setAmount(e.currentTarget.value) }} value={amount}

              className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
          </div>
          {/* End Col */}
          {/* End Col */}
          <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-email"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Remarks
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
            <input
              id="af-submit-application-email"
              type="text" placeholder='Enter Comment' onChange={(e) => { setRemarks(e.currentTarget.value) }} value={remarks}
              className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
          </div>


          {/* End Col */}
        </div>


        <div class="mt-5 flex justify-end gap-x-2">
     <a href="/admin/fuel/manage"><button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
        Cancel
      </button></a> 
      <button type="submit" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
        Create
      </button>
    </div>
      </form>
    </div>
    {/* End Card */}
  </div>
  {/* End Card Section */}
  
</>
        {/* <div className="AddFuel">
            <div className="adminHeader">
                <div className="left">
                    <h1>Add Fuel</h1>
                    <ul className="breadcrumb">
                        <li><a href="#">
                            Fuel
                        </a></li>
                        /
                        <li><a href="#" className="active">Add Fuel</a></li>
                    </ul>
                </div>
            </div>

                <div className="fuel-details">
                <form onSubmit={(e)=>{AddFuel(e)}}>
                    <div className="first-row">
                        <div className="driver">
                            <h4>Driver</h4>
                            
                            <select required onChange={(e)=>{getVehicle(e.currentTarget.value)}}>
                                <option disabled selected>Select Driver</option>
                                {driverList.map((e, i)=>{
                                    return <option key={i} value={`${e.d_first_name}`}>{e.d_first_name} {e.d_last_name}</option>
                                })}

                            </select>
                        </div>
                        <div className="vehicle">
                            <h4>Vehicle</h4>
                            <select name="vehicle" disabled required id='vehicle'>
                                <option disabled>Select Vehicle</option>
                                {vehicleList.map((e, i)=>{
                                    return <option selected key={i} value={e.name}>{e.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="fill-date" >
                            <h4>Fill Date</h4>
                            <input type="date"  required onChange={(e)=>{setDate(e.currentTarget.value)}}/>
                        </div>
                        <div className="quantity">
                            <h4>Quantity</h4>
                            <input type="number"  required placeholder='Enter Volume' onChange={(e)=>{setQuantity(e.currentTarget.value)}}/>
                        </div>
                    </div>
                    <div className="second-row">
                        <div className="odometer-reading">
                            <h4>Odometer Reading</h4>
                            <input type="number" placeholder='Enter Usage' required onChange={(e)=>{setOdometerReading(e.currentTarget.value)}} />
                        </div>
                        <div className="amount">
                            <h4>Amount</h4>
                            <input type="number" placeholder='Enter Price'  required onChange={(e)=>{setAmount(e.currentTarget.value)}} />
                        </div>
                        <div className="comment">
                            <h4>Remarks</h4>
                            <input type="text" placeholder='Enter Comment' onChange={(e)=>{setRemarks(e.currentTarget.value)}}/>
                        </div>
                    </div>
                    <div className="add-button">
                        <button type='submit'>Add Fuel</button>
                    </div>
                    </form>
                </div>


                </div> */}
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
        Added Successfully.
      </h3>
      <p className="text-sm text-gray-700 dark:text-neutral-400">
        You have successfully added fuel.
      </p>
    </div>
  </div>
</div>
</>)

}
        </>
    )
}

export default AddFuel;