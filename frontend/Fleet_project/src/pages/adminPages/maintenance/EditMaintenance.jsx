import { useEffect, useRef, useState } from 'react';
import '/public/assets/css/adminLayout/maintenance.css';
import { Link, useNavigate, useParams, useOutletContext } from "react-router-dom"
import axios from 'axios';
import Breadcrumbs from '@/components/adminDashboard/Breadcrumbs'
import Sidebar from '@/components/adminDashboard/Sidebar'
const EditMaintenance = () => {
  const { maintenanceID } = useParams();
  const nav = useNavigate()
  const [success, setSuccess] = useState(false)
  const { setIsLoading } = useOutletContext()
  const hostServer = import.meta.env.VITE_SERVER_HOST
  const [vehicleList, setVehicleList] = useState([])
  const [driverList, setDriverList] = useState([])
  const [vehicle, setVehicle] = useState();
  const [sDate, setSDate] = useState();
  const [eDate, setEDate] = useState();
  const [details, setDetails] = useState();
  const [cost, setCost] = useState();
  const [mService, setMService] = useState('')
  const [vendor, setVendor] = useState();
  const [status, setStatus] = useState();

  const maintenanceServices = [
    "Oil Change",
    "Brake Inspection/Service",
    "Tire Rotation",
    "Wheel Alignment",
    "Battery Check/Replacement",
    "Engine Tune-up",
    "Transmission Service",
    "Coolant Flush",
    "Air Filter Replacement",
    "Fuel Filter Replacement",
    "Spark Plug Replacement",
    "Timing Belt Replacement",
    "Serpentine Belt Replacement",
    "Power Steering Fluid Flush",
    "Suspension Inspection/Service",
    "Exhaust System Inspection/Service",
    "HVAC System Inspection/Service",
    "Windshield Wiper Blade Replacement",
    "Headlight/Taillight Bulb Replacement",
    "Fluid Level Check/Top-up",
    "DPF (Diesel Particulate Filter) Cleaning/Replacement",
    "EGR (Exhaust Gas Recirculation) System Cleaning/Service",
    "DEF (Diesel Exhaust Fluid) Refill/Service",
    "Trailer Hitch Inspection/Service",
    "Fifth Wheel Inspection/Service",
    "Trailer Brake Inspection/Service",
    "Trailer Suspension Inspection/Service",
    "Trailer Lighting Inspection/Service",
    "Trailer Tire Inspection/Service",
    "Trailer Coupling Inspection/Service"
  ];
  const maintenanceStatusOptions = [
    "Scheduled",
    "In Progress",
    "Completed",
    "Cancelled",
    "Failed",
    "Deferred",
    "On Hold"
  ];


  const formatDate = (date) => {
    const formattedDate = new Date(date);
    formattedDate.setDate(formattedDate.getDate() + 1);
    return formattedDate.toISOString().split("T")[0];
  };
  const maintenanceUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await axios.put(`${hostServer}/maintenance-update`,
      { vehicle, startDate: sDate, endDate: eDate, details, cost, mService, status, id: maintenanceID })
    setIsLoading(false)
    setSuccess(true)
    setTimeout(()=>{setSuccess(false)}, 2000)
    setTimeout(()=>{nav('/admin/maintenance/list')}, 3000)
  }
  const getMaintenance = async () => {
    setIsLoading(true)
    const fetched = await axios.get(`${hostServer}/maintenancebyid/${maintenanceID}`)
    const data = fetched.data[0]
    setVehicle(data.m_v_id)
    setSDate(formatDate(data.m_start_date))
    setEDate(formatDate(data.m_end_date))
    setDetails(data.m_details)
    setCost(data.m_cost)
    setMService(data.m_service)
    setStatus(data.m_status)
    setIsLoading(false)
  }
  const getAllVehicles = async () => {
    try {
      const res = await axios.get(`${hostServer}/retrieve-vehicles-maintenance`)
      const data = res.data
      setVehicleList(data)
    } catch (error) {

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

  useEffect(() => {
    getAllVehicles()
    getAllDrivers()
    getMaintenance()
  }, [])

  return (
    <>
                <Breadcrumbs title="Maintenance" subtitle="Maintenance Edit" />
            <Sidebar />
            <div className="w-full lg:ps-64">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <>
  {/* Card Section */}
  <div className=" mx-auto">
    {/* Card */}
    <div className="bg-white dark:bg-neutral-800">
      <form  onSubmit={(e)=>{maintenanceUpdate(e)}}>
        {/* Section */}
        <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
          <div className="sm:col-span-12">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Maintenance Management
            </h2>
          </div>
          {/* End Col */}
          <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-full-name"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Select Vehicle
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
          <select
          className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
           name="select-vehicle" id="select-vehicle" onChange={(e) => { setVehicle(e.currentTarget.value) }} value={vehicle}>
              <option disabled selected>Select Vehicle</option>
              {vehicleList.map((e, i) => {
                return <option key={i} value={e.name}>{e.name}</option>
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
              Maintenance Start Date
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
          <input type="date" name="" id=""
           className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
           onChange={(e) => { setSDate(formatDate(e.currentTarget.value)) }} value={sDate} />
          </div>

                    {/* End Col */}
                    <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-full-name"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
            Maintenance End Date
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
          <input type="date" name="" id=""
           className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
           onChange={(e) => { setEDate(formatDate(e.currentTarget.value)) }} value={eDate} />
          </div>
          {/* End Col */}
                    {/* End Col */}
                    <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-full-name"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Service Details
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
          <textarea name="service-details" id="service-details" 
           className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          onChange={(e) => { setDetails(e.currentTarget.value) }} cols="45" rows="6" placeholder='Enter Details' value={details}></textarea>
          </div>
          {/* End Col */}
                    {/* End Col */}
                    <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-full-name"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Total Cost
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
          <input min="1" type="number" placeholder='Enter Price'
           className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          onChange={(e) => { setCost(e.currentTarget.value) }} value={cost} />
          </div>
          {/* End Col */}
                    {/* End Col */}
                    <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-full-name"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Maintenance Service
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
          <select name="parts" id="parts" 
          className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          onChange={(e) => { setMService(e.currentTarget.value) }} value={mService}>
                <option disabled selected>Select Service</option>
                {maintenanceServices.map((e) => {
                  return (
                    <option value={e}>{e}</option>
                  )
                })}
              </select>
          </div>
          {/* End Col */}
          {/* End Col */}
          <div className="sm:col-span-3">
            <label
              htmlFor="af-submit-application-email"
              className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
            >
              Maintenance Status
            </label>
          </div>
          {/* End Col */}
          <div className="sm:col-span-9">
          <select name="maintenance-status" id="maintenance-status"
           className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          onChange={(e) => { setStatus(e.currentTarget.value) }} value={status}>
            <option selected disabled>Choose Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>


          {/* End Col */}
        </div>


        <div class="mt-5 flex justify-end gap-x-2">
     <a href="/admin/maintenance/list"><button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
        Cancel
      </button></a> 
      <button type="submit" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
        Save changes
      </button>
    </div>
      </form>
    </div>
    {/* End Card */}
  </div>
  {/* End Card Section */}
  
</>
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
      Updated Successfully!
      </h3>
      <p className="text-sm text-gray-700 dark:text-neutral-400">
        You have successfully updated maintenance.
      </p>
    </div>
  </div>
</div>
</>)

}
    </>
  );
};

export default EditMaintenance;