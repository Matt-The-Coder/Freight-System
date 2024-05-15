import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Breadcrumbs from '@/components/driverDashboard/Breadcrumbs'
import Sidebar from '@/components/driverDashboard/Sidebar'
import '/public/assets/css/adminLayout/deliveries.css';

const Inprogress = () => {
  const hostServer = import.meta.env.VITE_SERVER_HOST;
  const mapboxToken = import.meta.env.VITE_MAPBOX_API;
  const { d_username: username, setIsLoading, d_id: id, handleLogout } = useOutletContext();
  const [deliveries, setDeliveries] = useState({});
  const [travelData, setTravelData]= useState([])
  const acceptButtonRef = useRef(null);

  const acceptOrder = (deliveryId) => {
    const updatedDeliveries = { ...deliveries };
    updatedDeliveries[deliveryId].isShow = true;
    setDeliveries(updatedDeliveries);
  };

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

  function convertMiles (meters) {
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
      const pendingTrips = result.filter((e)=>{ return e.t_trip_status == "In Progress"})
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
      const reverseTravel = travelRoutes.reverse()
      setTravelData(reverseTravel);
      console.log(reverseTravel)
      setIsLoading(false);
      const deliveriesObject = {};
      pendingTrips.forEach((delivery) => {
        deliveriesObject[delivery.t_id] = {
          ...delivery,
          isShow: false,
        };
      });
      setDeliveries(deliveriesObject);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDeliveries();
  }, [username]);

  return (
    <>
                        <Breadcrumbs title="Deliveries" subtitle="In Progress" />
            <Sidebar handleLogout={handleLogout}/>
            <div className="w-full lg:ps-64">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <div className="DriverDeliveries">
      <div className="deliveries-list">
        {Object.entries(deliveries).length === 0 && (
          <center>
            <h1 className='dark:text-white text-gray-600'>No Deliveries Assigned Yet</h1>
          </center>
        )}
        {Object.entries(deliveries).reverse().map(([deliveryId, delivery], i) => {
          const { t_trip_status, t_trip_fromlocation, t_trip_tolocation, t_created_date, t_totalweight, t_start_date, t_end_date } = delivery;
          let statusColor = '';
          let fontColor = ''
          if (t_trip_status == 'Completed') {
              statusColor = "#ccfbf1";
              fontColor = '#115e59'
          } else if (t_trip_status == 'In Progress') {
              statusColor = '#fef9c3';
              fontColor = '#854d0e'
          } else if (t_trip_status == 'Cancelled') {
              statusColor = '#fee2e2';
              fontColor = '#991b1b'
          }

          return (

            <>
            <div className="deliveries-container bg-white border-y dark:bg-neutral-800" key={deliveryId}>
                            <div className="time-container">
                                <p className='text-sm text-gray-600 dark:text-neutral-400'>Order Date: {formatDate(t_created_date)}</p>
                            </div>
                            <div className="delivery-info">
                                <div className="second-container">
                                    <div className="h3-container" style={{ backgroundColor: statusColor }}>
                                        <h3  style={{ color: fontColor }}>{t_trip_status}</h3>
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
              {convertTime(travelData[i].duration)}
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
                                                    <span className='font-semibold text-xs'>Start Date:</span>     {formatDate(t_start_date)}
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
                                                            {t_trip_fromlocation}
                                                        </p>
                                                    </div>
                                                    {/* End Right Content */}
                                                </div>
                                                {/* End Item */}
                                                {/* Heading */}
                                                <div className="ps-2 my-2 first:mt-0">
                                                    <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                                                    <span className='font-semibold text-xs'>End Date:</span>       {formatDate(t_end_date)}
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
                                                            {t_trip_tolocation}
                                                        </p>
                                                    </div>
                                                    {/* End Right Content */}
                                                </div>
                                                {/* End Item */}
                                            </div>
                                            {/* End Timeline */}
                                        </>

                            
                            <div className="more-info">
                    <a href={`/driver/deliveries/tracking?trip_id=${deliveryId}&miles=${convertMiles(travelData[i].distance)}&weight=${t_totalweight}`}>
                            <button  type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                            View on Map
</button>
</a>
                            </div>
                        </div>
            </>

          );
        })}
      </div>
    </div>
    </div>
    </div>
    </>
  );
};

export default Inprogress;
