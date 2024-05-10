import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import '/public/assets/css/adminLayout/liveTracking.css'
import Breadcrumbs from '@/components/adminDashboard/Breadcrumbs'
import Sidebar from '@/components/adminDashboard/Sidebar'
import axios from 'axios';
import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
} from 'react-speedometer';



const LiveTracking = ({socket}) => {
  const nav = useNavigate()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const miles = searchParams.get('miles');
  const trip_id = searchParams.get('trip_id');
  const weightInKG = searchParams.get('weight');
  axios.defaults.withCredentials = true;
  const { setIsLoading, mapStyle, setMapStyle } = useOutletContext();
  const mapboxToken = import.meta.env.VITE_MAPBOX_API;
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API;
  const hostServer = import.meta.env.VITE_SERVER_HOST;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [transportDetail, setTransportDetail] = useState(false)
  const tDetail = useRef(null)
  const [transitData, setTransitData] = useState(false)
  const [mapData, setMapData] = useState(true)
  const directions = useRef(null);
  const markerTrack = useRef(null)
  const originTrack = useRef(null)
  const destinationTrack = useRef(null)
  const originMarker = useRef(null)
  const destinationMarker = useRef(null)
  const marker = useRef(null)
  const [carPosition, setCarPosition] = useState(null)
  const [vehicleStats, setVehicleStats] = useState(null)
  const [currentTrip, setCurrentTrip] = useState({})
  const [travelData, setTravelData] = useState([])
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState(null);
  const [formattedCurrentLocation, setFormattedCurrentLocation] = useState('')
  const [carbonEmissions, setCarbonEmissions] = useState(null);
  const [driveTime, setDriveTime] = useState(null);
  const [speed, setSpeed] = useState(0)
  const [weatherCondition, setWeatherConditon] = useState(null)
  const [weatherAlerts, setWeatherAlerts] = useState(null)
  const [weatherIcon, setWeatherIcon] = useState(null)
  const [positionData, setPositionData] = useState(null)
  const [isMobile, setIsMobile] = useState(false);
  const boxInfoNav = useRef([])
  const bInfo = useRef(null)
  const [boxInfoDirection, setBoxInfoDirection] = useState(true)
  const [boxInfoMessage, setBoxInfoMessage] = useState(false)
  const [boxInfoReminder, setBoxInfoboxInfoReminder] = useState(false)
  const mapInstructions = useRef(null)
  const instructionContainer = useRef(null)
  const detail = useRef(null)
  const arrowUp = useRef(null)
  const arrowDown = useRef(null)
  const [isMapSetup, setIsMapSetup] = useState(false)
  const [positionExist, setPositionExist] = useState(false)
  const openDetail = (type) => {
    if (type == "up") {
      detail.current.classList.toggle("open")
      arrowUp.current.style.display = "none"
      arrowDown.current.style.display = "block"
    } else {
      detail.current.classList.toggle("open")
      arrowDown.current.style.display = "none"
      arrowUp.current.style.display = "block"
    }

  }

  useEffect(() => {
    socket.on('deliveryUpdate', (data) => {
      const {deliveryState} = data
      alert("Delivery Status Updated")
      if(deliveryState !== "In Progress"){
        nav('/admin/tracking/trips/ongoing')
      }

    });
    return () => socket.off('deliveryUpdate');

  }, [socket]);
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(isMobileView);
      setTimeout(() => {
        mapInstructions.current = document.querySelector(".mapboxgl-ctrl-directions.mapboxgl-ctrl")
        instructionContainer.current.appendChild(mapInstructions.current)
      }, 100)

    };

    // Initial check on component mount
    handleResize();

    // Attach event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const setupMap = (lng, lat) => {
    setIsMapSetup(!isMapSetup)
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: [positionData ? positionData.longitude : lng, positionData ? positionData.latitude : lat],
      zoom: 15,
    });

    directions.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      profile: 'mapbox/driving',
      interactive: false,
      alternatives: true,
      controls: { profileSwitcher: false, inputs: false },
      flyTo: true,
      geocoder: {
        accessToken: mapboxgl.accessToken,
      }
    });

    originTrack.current = new mapboxgl.Marker({
      element: originMarker.current, scale: '0'
    }).setPopup(new mapboxgl.Popup().setHTML("<p>Origin</p>")) // add popup

    destinationTrack.current = new mapboxgl.Marker({
      element: destinationMarker.current, scale: '0'
    }).setPopup(new mapboxgl.Popup().setHTML("<p>Destination</p>")) // add popup


    // Create a marker with the custom element
    marker.current = new mapboxgl.Marker({
      element: markerTrack.current, scale: '0'
    }).setPopup(new mapboxgl.Popup().setHTML(`<p>${currentTrip.d_first_name} ${currentTrip.d_last_name}</p>`)) // add popup


    // Add the MapboxDirections control to the map
    map.current.addControl(directions.current, 'top-left');
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.current.addControl(new MapboxTraffic(), 'top-right');
  };
  const setupDarkMap = (lng, lat) => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: [positionData ? positionData.longitude : lng, positionData ? positionData.latitude : lat],
      zoom: 13,
    });

    directions.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      profile: 'mapbox/driving',
      interactive: false,
      alternatives: true,
      controls: { profileSwitcher: false, inputs: false },
      flyTo: true,
      geocoder: {
        accessToken: mapboxgl.accessToken,
      }
    });

    // Create a marker with the custom element
    marker.current = new mapboxgl.Marker({
      element: markerTrack.current, scale: '0'
    }).setPopup(new mapboxgl.Popup().setHTML(`<p>${currentTrip.d_first_name} ${currentTrip.d_last_name}</p>`)) // add popup


    // Add the MapboxDirections control to the map
    map.current.addControl(directions.current, 'top-left');
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-left');
    map.current.addControl(new MapboxTraffic(), 'top-right');
    // map.current.on('click', (e) => {
    //   const clickedLngLat = e.lngLat.toArray();
    //   const waypointIndex = directions.current.getWaypoints().length;
    //   directions.current.addWaypoint(waypointIndex, clickedLngLat);
    // });

  };
  const openTransportDetail = () => {
    setTransportDetail(!transportDetail)
    tDetail.current.classList.toggle("open")
  }
  const openInfo = () => {
    if (bInfo.current.style.visibility == "hidden") {
      bInfo.current.style.visibility = "visible"
    } else {
      bInfo.current.style.visibility = "hidden"
    }
  }
  const openBoxInfo = (e) => {
    const boxInfoNavs = boxInfoNav.current?.childNodes
    for (let i = 0; i < boxInfoNavs.length; i++) {
      if (e == 1) {
        instructionContainer.current.style.display = "block"
        setBoxInfoMessage(false)
        setBoxInfoboxInfoReminder(false)
      }
      else if (e == 2) {
        setBoxInfoMessage(true)
        instructionContainer.current.style.display = "none"
        setBoxInfoboxInfoReminder(false)
      }
      else {
        setBoxInfoboxInfoReminder(true)
        instructionContainer.current.style.display = "none"
        setBoxInfoMessage(false)
      }
    }
  }

  const calculteWeatherCondition = async (latitude, longitude) => {
    try {
      const response = await axios.get(`${hostServer}/get-driver-weatherdata?lat=${latitude}&lon=${longitude}`);
      const result = response.data.weatherData
      const alertResult = response.data.weatherAlert
      setWeatherConditon(result)
      const weatherIcon = `https://www.weatherbit.io/static/img/icons/${result.weather.icon}.png`
      setWeatherIcon(weatherIcon)
      setWeatherAlerts({
        alertTitle: alertResult.alerts[0]?.title,
        alertStartTime: alertResult.alerts[0]?.onset_local,
        alertEndTime: alertResult.alerts[0]?.ends_local
      })
    } catch (error) {
      console.log(error)
    }
  }

  const calculateCarbonEmissions = async () => {
    try {
      const result = await axios.get(`${hostServer}/calculateFuelConsumptionWithPrice?miles=${miles}&weightInKG=${weightInKG}`)
      const data = result.data
      console.log(data)
      setVehicleStats(data)
    } catch (error) {
      console.log(error)
    }

  }
  // const retrieveDirection = async (fLongitude, fLatitude, dLongitude=121.03666348624142, dLatitude= 14.726582928426808) => 
  // {
  //   const result = await axios.post(`${hostServer}/getDirections`, 
  //   {
  //     fLongitude, fLatitude, dLongitude, dLatitude,mapboxToken
  //   })
  //   const data = result.data
  //   setTravelData(result.data)
  // }


  const setDirections = (oLongitude, oLatitude, dLongitude, dLatitude) => {
    setIsLoading(true)
    directions.current.setOrigin([oLongitude, oLatitude]);
    directions.current.setDestination([dLongitude, dLatitude]);
    calculteWeatherCondition(oLatitude, oLongitude)
    calculateCarbonEmissions()
    // retrieveDirection(oLongitude, oLatitude)
    setIsLoading(false)
  };

  const getDriverPosition = async () => {
    try {
      const drivePosition = await axios.get(`${hostServer}/getPosition/${trip_id}`)
      const result = drivePosition.data
      setPositionData(result)
      marker.current.setLngLat([result ? result.longitude : 121.0089472, result ? result.latitude : 14.6702336]).addTo(map.current);
      marker.current.setRotation(result ? result.heading : 12)
      const calcSpeed = result?.speed
      setSpeed(Math.round(calcSpeed))
      setCarPosition(result)
    } catch (error) {
      console.log(error)
    }
  }

  const getTripData = async () => {
    try {
      const tripData = await axios.get(`${hostServer}/get-current-trip/${trip_id}`)
      setCurrentTrip(tripData.data)
      setPositionExist(true)
    } catch (error) {
      console.log("mali")
    }
  }


  useEffect(() => {
  }, [carPosition]);
  // WATCH POSITION
  useEffect(() => {
    getTripData()
    if (positionExist) {
      setIsLoading(true);
      if (isMapSetup) {
        mapContainer.current.classList.remove("mapboxgl-map")
        mapContainer.current.innerHTML = ""
        setupDarkMap(currentTrip?.t_trip_fromlog, currentTrip?.t_trip_fromlat)
        setInterval(() => { getDriverPosition() }, 500)
        if (instructionContainer.current) {
          const instructions = instructionContainer.current
          instructionContainer.current.removeChild(instructions.children[0])
        }
        setDirections(currentTrip?.t_trip_fromlog, currentTrip?.t_trip_fromlat, currentTrip?.t_trip_tolog, currentTrip?.t_trip_tolat)
        originTrack.current.setLngLat([currentTrip?.t_trip_fromlog, currentTrip?.t_trip_fromlat]).addTo(map.current);
        destinationTrack.current.setLngLat([currentTrip?.t_trip_tolog, currentTrip?.t_trip_tolat]).addTo(map.current);
        mapInstructions.current = document.querySelector(".mapboxgl-ctrl-directions.mapboxgl-ctrl")
        instructionContainer.current.appendChild(mapInstructions.current)
      }
      else {
        setupMap(currentTrip?.t_trip_fromlog, currentTrip?.t_trip_fromlat);
        setInterval(() => { getDriverPosition() }, 500)

        setIsMapSetup(!isMapSetup)
        if (instructionContainer.current.hasChildNodes()) {
          const instructions = instructionContainer.current
          instructionContainer.current.removeChild(instructions.children[0])
        }
        setDirections(currentTrip?.t_trip_fromlog, currentTrip?.t_trip_fromlat, currentTrip?.t_trip_tolog, currentTrip?.t_trip_tolat)
        originTrack.current.setLngLat([currentTrip?.t_trip_fromlog, currentTrip?.t_trip_fromlat]).addTo(map.current);
        destinationTrack.current.setLngLat([currentTrip?.t_trip_tolog, currentTrip?.t_trip_tolat]).addTo(map.current);
        mapInstructions.current = document.querySelector(".mapboxgl-ctrl-directions.mapboxgl-ctrl")
        instructionContainer.current.appendChild(mapInstructions.current)
      }


      setIsLoading(false);
    }
  }, [positionExist])


  useEffect(() => {
    if (positionExist) {
      setIsLoading(true);
      if (isMapSetup) {
        mapContainer.current.classList.remove("mapboxgl-map")
        mapContainer.current.innerHTML = ""
        setupDarkMap(currentTrip?.t_trip_fromlog, currentTrip?.t_trip_fromlat)
        setIsMapSetup(!isMapSetup)
        if (instructionContainer.current) {
          const instructions = instructionContainer.current
          instructionContainer.current.removeChild(instructions.children[0])
        }
        setDirections(currentTrip?.t_trip_fromlog, currentTrip?.t_trip_fromlat, currentTrip?.t_trip_tolog, currentTrip?.t_trip_tolat)
        mapInstructions.current = document.querySelector(".mapboxgl-ctrl-directions.mapboxgl-ctrl")
        instructionContainer.current.appendChild(mapInstructions.current)
      }
      else {
        setupMap(currentTrip?.t_trip_fromlog, currentTrip?.t_trip_fromlat);
        setIsMapSetup(!isMapSetup)
        if (instructionContainer.current.hasChildNodes()) {
          const instructions = instructionContainer.current
          instructionContainer.current.removeChild(instructions.children[0])
        }
        setDirections(currentTrip?.t_trip_fromlog, currentTrip?.t_trip_fromlat, currentTrip?.t_trip_tolog, currentTrip?.t_trip_tolat)
        mapInstructions.current = document.querySelector(".mapboxgl-ctrl-directions.mapboxgl-ctrl")
        instructionContainer.current.appendChild(mapInstructions.current)
      }
      setIsLoading(false);
    }
  }, [mapStyle])

  const switchPage = () => {

    if (mapContainer.current.style.display !== "none") {
      mapContainer.current.style.display = "none"
      setTransitData(!transitData)

    } else {
      setTransitData(!transitData)
      mapContainer.current.style.display = "block"
    }
  }

  const openSidebar = () => {
    const map = document.querySelector('.map-container')
    const weatherData = document.querySelector('.weatherData')
    const detailSlide = document.querySelector('.detail-slide')
    const sideBar = document.querySelector('#application-sidebar')
    if(weatherData){
      if(weatherData.style.zIndex == 0){
        map.style.zIndex = -1
        weatherData.style.zIndex = -1
      }else{
        map.style.zIndex = 0
        weatherData.style.zIndex = 0
      }

    }
    else {
      if(detailSlide.style.zIndex == 100)
        {
          map.style.zIndex = -1
          detailSlide.style.zIndex = 0
        }
        else{
          map.style.zIndex = 0
          detailSlide.style.zIndex = 100
        }
        console.log(detailSlide)
    }


  }

  return (
    <>
                            <Breadcrumbs title="Tracking" subtitle="Live Tracking"  openSidebar={openSidebar} />
      <Sidebar/>
      <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <div className="LiveTracking">

      <div className="tracking-details sm:flex">

        {isMobile ?
          (<>
            <div className="switch-pager">
              <h4 onClick={switchPage} className='bg-gray-300 text-gray-700 dark:text-neutral-400 dark:bg-neutral-900 border-r-2'>Map Data</h4>
              <h4 onClick={switchPage} className='bg-gray-300 text-gray-700 dark:text-neutral-400 dark:bg-neutral-900'>Transit Data</h4>
            </div>
            <div className="switch-pager-content">
              {transitData && <>
                <div className="transportCard bg-neutral-800 dark:bg-white">

                  <div className="card bg-white dark:bg-neutral-800 dark:text-white">
                    <div className="cardTitle">
                      <i className='bx bxs-car-mechanic' id='carBx'></i>
                      <h4>Vehicle Data</h4>
                    </div>
                    <div className="firstCard" id='speedometer'>
                      {/* <div className="speedometer">
      <Speedometer
        value={speed}
        fontFamily='squada-one'
        accentColor={'#3d93fd'}
        width={160}
      >
        <Background angle={260} />
        <Arc />
        <Needle offset={40} circleRadius={12} />
        <Progress />
        <Marks fontSize={14} lineSize={8} />
        <Indicator fontSize={40} />
      </Speedometer>
    </div> */}

                      <div className="vehicleData">
                        <p>Vehicle: <label htmlFor="">{currentTrip.name}</label></p>
                        {positionData && <p>Speed: {speed == 0 ? <label>Idle</label> : <label>{speed} kph</label>}</p>}
                        {positionData && <p>Altitude: {positionData.altitude == null ? <label>Unavailable</label> : <label>{positionData?.altitude.toFixed(0)} meters</label>}</p>}
                        {positionData && <p>Accuracy: {positionData.accuracy == null ? <label>Unavailable</label> : <label>{positionData?.accuracy.toFixed(0)}</label>} </p>}
                        {positionData && <p>Heading: {positionData.heading == null ? <label>Unavailable</label> : <label>{positionData?.heading.toFixed(0)}</label>}</p>}
                        {driveTime && <p>Drive Time: <label>{driveTime}</label></p>}
                      </div>
                    </div>
                  </div>
                  <div className="card bg-white dark:bg-neutral-800 dark:text-white">
                    <div className="cardTitle">
                      <i className='bx bxs-truck' id='truckBx' ></i>
                      <h4>Transportation Data</h4>
                    </div>
                    <div className="transportData">
                      <div className="transportData1">
                        <p>Driver: {currentTrip.d_first_name} {currentTrip.d_last_name} </p>
                        <p>Destination: {currentTrip.t_trip_tolocation}</p>
                        <p>Cargo Weight: {currentTrip.t_totalweight}kg</p>
                        <p>Carbon Emissions: {vehicleStats.carbonEmission}g</p>
                        <p>Fuel Consumption: {vehicleStats.fuelConsumption}l</p>
                        <p>Estimated Fuel Cost: ₱{vehicleStats.fuelCost}</p>
                      </div>
                      <div className="transportData2">

                      </div>


                      {/* {carbonEmissions && (
<p>Transport Method: {carbonEmissions.data ? <label>{carbonEmissions.data.attributes.transport_method}</label> : carbonEmissions.message}</p>
)}
{carbonEmissions && (
<p>Cargo Weight: {carbonEmissions.data ? <label>{carbonEmissions.data.attributes.weight_value} kg</label> : carbonEmissions.message}</p>
)} */}
                    </div>
                  </div>
                </div>
              </>}
              <>
                <div ref={mapContainer} className="map-container" />
              </>

            </div>
            <div className="detail-slide bg-white dark:bg-neutral-800 dark:text-white" ref={detail}>
              <div className="arrow-up">
                <i className='bx bx-arrow-from-bottom bx-fade-up' id='arrow-up' ref={arrowUp} onClick={() => { openDetail("up") }}></i>
                <i class='bx bx-arrow-from-top bx-fade-down' id='arrow-up' style={{ display: "none" }} ref={arrowDown} onClick={() => { openDetail("down") }}></i>
              </div>
              <center><h3>Directions</h3></center>
              <div className="instruction-container" ref={instructionContainer}>

              </div>
              <div className="weatherDataMobile">
                <center><h3>Weather Condition</h3></center>
                {weatherCondition && <p>Current Weather: {weatherCondition.weather.description} </p> &&
                  <img src={weatherIcon} alt="weather icon" />}
                <details>
                  <summary>Rainfall Rate</summary>
                  {weatherCondition && <p>{parseFloat(weatherCondition.precip)}mm/hr - {
                    parseFloat(weatherCondition.precip) < 2.6 ? <label> Ligh Precipitation: Minimal impact on a driver's view while delivering cargo. Roads may become slightly wet, but visibility remains relatively clear, making for safe driving conditions.</label> :
                      parseFloat(weatherCondition.precip) < 7.7 ? <label> Moderate Precipitation: Reduced visibility during cargo delivery. Rain intensifies, requiring windshield wipers and extra caution on wet roads to ensure cargo safety.</label> :
                        parseFloat(weatherCondition.precip) < 51 ? <label> Heavy Precipitation: Significant reduction in visibility when delivering cargo. Intense rain can impair the driver's view and road conditions, demanding extra care to secure and transport goods safely.</label> :
                          <label> Very Heavvy Precipitation: Extremely poor visibility during cargo delivery. Hazardous conditions arise, posing significant risks to cargo, driver safety, and the timely completion of deliveries.</label>}
                  </p>}
                </details>
                <details>
                  <summary>Air Quality </summary>
                  {weatherCondition && <p>{weatherCondition.aqi} - {
                    weatherCondition.aqi < 51 ? <label> Good: Ideal conditions for cargo delivery and driver well-being. Minimal pollution, allowing for smooth and efficient transportation.</label> :
                      weatherCondition.aqi < 101 ? <label> Moderate: Favorable for cargo delivery and driver comfort. Slightly elevated pollution levels may have minimal impact on logistics.</label> :
                        weatherCondition.aqi < 151 ? <label> Unhealthy for Sensitive Groups: Adequate for cargo delivery but may affect driver health and efficiency. Increased pollution levels may require occasional breaks. </label> :
                          weatherCondition.aqi < 201 ? <label> Unhealthy: Cargo delivery may face delays due to reduced driver efficiency. Drivers with respiratory issues may experience discomfort.</label> :
                            weatherCondition.aqi < 301 ? <label> Very Unhealthy: Challenging conditions for cargo delivery. Reduced visibility and driver discomfort are likely. Delays and safety precautions are necessary.</label> :
                              <label> Hazardous: High risk for cargo delivery and driver safety. Significant visibility issues and health hazards for drivers. Delivery delays and safety measures are crucial.</label>}</p>}
                </details>
                <details>
                  <summary>Wind Speed</summary>
                  {weatherCondition && <p>{weatherCondition.wind_spd}m/s</p>}

                </details>
                <details>
                  <summary>Wind Direction </summary>
                  {weatherCondition && <p>{weatherCondition.wind_cdir_full}</p>}
                </details>
                <details>
                  <summary>Wind Angle </summary>
                  {weatherCondition && <p> {weatherCondition.wind_dir}°</p>}
                </details>
                <details>
                  <summary>Temperature </summary>
                  {weatherCondition && <p>{weatherCondition.temp}°C - {
                    weatherCondition.temp < -31 ? <label> Deep Freeze: Risk of freezing and potential damage to temperature-sensitive items. Proper insulation and heating may be required.</label> :
                      weatherCondition.temp < -21 ? <label> Extreme Cold: Risk of freezing and potential damage to temperature-sensitive items. Proper insulation and heating may be required.</label> :
                        weatherCondition.temp < -11 ? <label> Very Cold: Goods can be at risk of freezing, impacting their quality and integrity. Insulation and temperature control are crucial.</label> :
                          weatherCondition.temp < 1 ? <label> Cold: Perishable items may lose freshness and quality. Adequate refrigeration and temperature monitoring are essential.</label> :
                            weatherCondition.temp < 10.1 ? <label> Cool: Suitable for most perishables but requires controlled conditions to prevent spoilage or freezing.</label> :
                              weatherCondition.temp < 25.1 ? <label> Room Temparature: Ideal for various goods, including pharmaceuticals and electronics. Temperature stability is critical.</label> :
                                weatherCondition.temp < 35.1 ? <label> Warm: Risk of heat-related damage to sensitive cargo, such as chocolate, certain chemicals, and some electronics.</label> :
                                  weatherCondition.temp < 45.1 ? <label> Hot: Increased risk of spoilage, chemical reactions, and damage to goods. Ventilation and cooling are essential.</label> :
                                    <label>Extreme Heat: Cargo can experience severe damage, including melting, combustion, or spoilage. Extreme temperature control measures are necessary.</label>

                  }</p>}
                </details>
                <details>
                  <summary>Humidity</summary>
                  {weatherCondition && <p>{weatherCondition.rh}% -  {
                    weatherCondition.rh < 31 ? <label> Low Humidity: Low humidity can result in a clear windshield but may lead to discomfort due to dry air. Reduced humidity poses minimal visibility challenges for drivers.</label> :
                      weatherCondition.rh < 61 ? <label> Moderate Humidity: Comfortable humidity levels for drivers, maintaining clear visibility through the windshield. Condensation and fogging are less likely.</label> :
                        weatherCondition.rh < 81 ? <label> High Humidity: Increased humidity may lead to slight fogging on the windshield. Drivers may need to use defogging systems occasionally.</label> :
                          <label> Very High Humidity: High humidity can cause significant fogging on the windshield, reducing visibility. Frequent use of defoggers and wipers may be necessary for safe driving.</label>
                  }</p>}
                </details>
                <details>
                  <summary>Visibility</summary>
                  {weatherCondition && <p>{weatherCondition.vis}km - {
                    weatherCondition.vis < 0.5 ? <label> Extremely hazardous conditions for cargo delivery. Nearly zero visibility demands extreme caution, and in some cases, postponing the delivery may be necessary.</label> :
                      weatherCondition.vis < 1.1 ? <label> Very Poor Visibility: Hazardous conditions during cargo delivery. Extreme caution required, as visibility is severely compromised.</label> :
                        weatherCondition.vis < 2.1 ? <label> Poor Visibility: Challenging conditions for cargo delivery. Visibility limitations may impact delivery schedules and safety.</label> :
                          weatherCondition.vis < 4.1 ? <label> Moderate Visibility: Reduced visibility that can affect cargo delivery. Distant objects may be obscured, demanding careful driving.</label> :
                            weatherCondition.vis < 6.1 ? <label> Good Visibility: Fair visibility for cargo delivery. Some distant objects may appear blurry, requiring extra caution.</label> :
                              weatherCondition.vis < 10.1 ? <label> Very Good Visibility: Good conditions for cargo delivery. Most objects are visible, allowing for safe navigation.</label> :
                                <label> Excellent Visibility: Optimal conditions for cargo delivery. Clear visibility ensures safe and efficient transportation.</label>
                  }</p>}
                </details>
                <details>
                  <summary>UV Index</summary>
                  {weatherCondition && <p>{weatherCondition.uv} - {
                    weatherCondition.uv < 3 ? <label> Low: Minimal environmental impact. UV levels are low, and there is minimal risk of harm to the environment.</label> :
                      weatherCondition.uv < 6 ? <label> Moderate: Moderate environmental impact. UV levels pose some risk to ecosystems, potentially affecting plant growth and aquatic habitats.</label> :
                        weatherCondition.uv < 8 ? <label> High: Significant environmental impact. High UV levels can harm aquatic life, damage crops, and impact ecosystems by disrupting natural processes.</label> :
                          weatherCondition.uv < 11 ? <label> Very High: Severe environmental impact. Very high UV levels can lead to extensive damage to crops, aquatic ecosystems, and marine habitats.</label> :
                            <label> Extreme: Extreme environmental impact. Extreme UV levels can cause extensive harm to the environment, including severe damage to ecosystems, aquatic life, and crops.</label>
                  }</p>}
                </details>
                <details>
                  <summary>Solar Radiation</summary>
                  {weatherCondition && <p>{weatherCondition.solar_rad} W/m² {
                    weatherCondition.solar_rad < 101 ? <label> Low Solar Radiation: Limited sunlight, potentially impacting solar energy generation and reducing its environmental benefits. Cargo deliveries may rely more on conventional energy sources.</label> :
                      weatherCondition.solar_rad < 251 ? <label> Moderate Solar Radiation: Adequate sunlight for reasonable solar energy production, contributing to reduced carbon emissions. Cargo deliveries benefit from a cleaner energy mix.</label> :
                        weatherCondition.solar_rad < 501 ? <label> High Solar Radiation: Abundant sunlight, optimizing solar energy generation and reducing reliance on non-renewable energy sources. This positively impacts the environment and cargo deliveries.</label> :
                          weatherCondition.solar_rad < 1000 ? <label> Very High Solar Radiation: Intense sunlight, which can lead to elevated temperatures. Cargo deliveries, especially for heat-sensitive goods, may require special precautions.</label> :
                            <label> Extreme Solar Radiation: Excessive solar exposure, potentially causing extreme heat conditions. Cargo and driver well-being during deliveries become critical concerns.</label>
                  }</p>}
                </details>
                <details>
                  <summary>Pressure</summary>
                  {weatherCondition && <p>{weatherCondition.pres} mb {
                    weatherCondition.slp < 950 ? <label>Very Low Pressure</label> :
                      weatherCondition.slp < 980 ? <label>Low Pressure </label> :
                        weatherCondition.slp < 1000 ? <label>Normal Pressure </label> :
                          weatherCondition.slp < 1014 ? <label>Moderate Pressure </label> :
                            <label>High Sea-Level Pressure: </label>

                  }</p>}
                </details>
                <details>
                  <summary>Sea Level Pressure</summary>
                  {weatherCondition && <p>{weatherCondition.slp} mb {
                    weatherCondition.slp < 950 ? <label>Very Low Sea-Level Pressure: Extreme severe weather, such as hurricanes, posing significant risks to cargo, drivers, and the environment. Deliveries should be halted or rerouted during such events, with safety as the top priority.</label> :
                      weatherCondition.slp < 980 ? <label>Low Sea-Level Pressure: Unsettled weather conditions may lead to delivery delays and driver safety concerns. It advises adopting precautionary measures.</label> :
                        weatherCondition.slp < 1000 ? <label>Normal Sea-Level Pressure: Suitable for cargo deliveries with no significant weather concerns. This is an optimal period for standard delivery schedules. </label> :
                          weatherCondition.slp < 1014 ? <label>Moderate Sea-Level Pressure: Fair weather conditions, ideal for cargo deliveries with minimal disruptions. It's a suitable time for efficient logistics planning. </label> :
                            <label>High Sea-Level Pressure: Stable and clear weather, providing favorable conditions for cargo deliveries. However, extremely high pressure may impact air quality, suggesting the need for pollution monitoring. </label>

                  }</p>}
                </details>
                <details>
                  <summary>Weather Alerts</summary>
                  {weatherAlerts && <p>{weatherAlerts.alertTitle == null ? <label>No current alerts</label> : <label>{weatherAlerts.alertTitle}</label>}</p>}
                  {weatherAlerts?.alertTitle && <p>Weather start time: {weatherAlerts.alertStartTime}</p>}
                  {weatherAlerts?.alertTitle && <p>Weather ends in: {weatherAlerts.alertEndTime}</p>}
                </details>
              </div>
            </div>
          </>
          ) :

          (<>

            <div ref={mapContainer} className="map-container" />
            <div className="weatherData w-full">
              {/* <div className="weatherIcon">
                {weatherCondition && <p>Current Weather: {weatherCondition.weather.description} </p> &&
                  <img src={weatherIcon} alt="weather icon" />}
              </div> */}
              <div class="hs-accordion-group">
              <div class="hs-accordion hs-accordion-active:border-gray-200 bg-white border border-transparent rounded-xl dark:hs-accordion-active:border-neutral-700 dark:bg-neutral-800 dark:border-transparent" id="hs-active-bordered-heading-eight">
    <button class="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex justify-between items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-none dark:focus:text-neutral-400" aria-controls="hs-basic-active-bordered-collapse-two">
      Weather Alert{weatherAlerts?.alertTitle == null ? <label>No current alerts</label> : <label>{weatherAlerts.alertTitle}</label>}

      <svg class="hs-accordion-active:hidden block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
      <svg class="hs-accordion-active:block hidden size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
      </svg>
    </button>
    <div id="hs-basic-active-bordered-collapse-two" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-active-bordered-heading-eight">
      <div class="pb-4 px-5">
        <p class="text-gray-800 dark:text-neutral-200">
        {weatherAlerts?.alertTitle && <p>Weather start time: {weatherAlerts.alertStartTime}</p>}
                {weatherAlerts?.alertTitle && <p>Weather ends in: {weatherAlerts.alertEndTime}</p>}
        </p>
      </div>
    </div>
  </div>
  <div class="hs-accordion hs-accordion-active:border-gray-200 bg-white border border-transparent rounded-xl dark:hs-accordion-active:border-neutral-700 dark:bg-neutral-800 dark:border-transparent" id="hs-active-bordered-heading-one">
    <button class="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex justify-between items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-none dark:focus:text-neutral-400" aria-controls="hs-basic-active-bordered-collapse-one">
      Rainfall Rate <label htmlFor="">{parseFloat(weatherCondition?.precip)} mm/hr</label>  
      <svg class="hs-accordion-active:hidden block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
      <svg class="hs-accordion-active:block hidden size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
      </svg>
    </button>
    <div id="hs-basic-active-bordered-collapse-one" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-active-bordered-heading-one">
      <div class="pb-4 px-5">
        <p class="text-gray-800 dark:text-neutral-200">
        {weatherCondition && <>{
                      parseFloat(weatherCondition.precip) < 2.6 ? <label> Light Precipitation: Minimal impact on a driver's view while delivering cargo. Roads may become slightly wet, but visibility remains relatively clear, making for safe driving conditions.</label> :
                        parseFloat(weatherCondition.precip) < 7.7 ? <label> Moderate Precipitation: Reduced visibility during cargo delivery. Rain intensifies, requiring windshield wipers and extra caution on wet roads to ensure cargo safety.</label> :
                          parseFloat(weatherCondition.precip) < 51 ? <label> Heavy Precipitation: Significant reduction in visibility when delivering cargo. Intense rain can impair the driver's view and road conditions, demanding extra care to secure and transport goods safely.</label> :
                            <label> Very Heavvy Precipitation: Extremely poor visibility during cargo delivery. Hazardous conditions arise, posing significant risks to cargo, driver safety, and the timely completion of deliveries.</label>}
                    </>}
        </p>
      </div>
    </div>
  </div>
  
  <div class="hs-accordion hs-accordion-active:border-gray-200 bg-white border border-transparent rounded-xl dark:hs-accordion-active:border-neutral-700 dark:bg-neutral-800 dark:border-transparent" id="hs-active-bordered-heading-one">
    <button class="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex justify-between items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-none dark:focus:text-neutral-400" aria-controls="hs-basic-active-bordered-collapse-one">
    Temperature <label htmlFor="">{weatherCondition?.temp}°C </label>
      <svg class="hs-accordion-active:hidden block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
      <svg class="hs-accordion-active:block hidden size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
      </svg>
    </button>
    <div id="hs-basic-active-bordered-collapse-one" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-active-bordered-heading-one">
      <div class="pb-4 px-5">
        <p class="text-gray-800 dark:text-neutral-200">
        {weatherCondition && <>{
                      weatherCondition.temp < -31 ? <label> Deep Freeze: Risk of freezing and potential damage to temperature-sensitive items. Proper insulation and heating may be required.</label> :
                        weatherCondition.temp < -21 ? <label> Extreme Cold: Risk of freezing and potential damage to temperature-sensitive items. Proper insulation and heating may be required.</label> :
                          weatherCondition.temp < -11 ? <label> Very Cold: Goods can be at risk of freezing, impacting their quality and integrity. Insulation and temperature control are crucial.</label> :
                            weatherCondition.temp < 1 ? <label> Cold: Perishable items may lose freshness and quality. Adequate refrigeration and temperature monitoring are essential.</label> :
                              weatherCondition.temp < 10.1 ? <label> Cool: Suitable for most perishables but requires controlled conditions to prevent spoilage or freezing.</label> :
                                weatherCondition.temp < 25.1 ? <label> Room Temparature: Ideal for various goods, including pharmaceuticals and electronics. Temperature stability is critical.</label> :
                                  weatherCondition.temp < 35.1 ? <label> Warm: Risk of heat-related damage to sensitive cargo, such as chocolate, certain chemicals, and some electronics.</label> :
                                    weatherCondition.temp < 45.1 ? <label> Hot: Increased risk of spoilage, chemical reactions, and damage to goods. Ventilation and cooling are essential.</label> :
                                      <label>Extreme Heat: Cargo can experience severe damage, including melting, combustion, or spoilage. Extreme temperature control measures are necessary.</label>

                    }</>}
        </p>
      </div>
    </div>
  </div>

  <div class="hs-accordion hs-accordion-active:border-gray-200 bg-white border border-transparent rounded-xl dark:hs-accordion-active:border-neutral-700 dark:bg-neutral-800 dark:border-transparent" id="hs-active-bordered-heading-one">
    <button class="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex justify-between items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-none dark:focus:text-neutral-400" aria-controls="hs-basic-active-bordered-collapse-one">
    Visibility <label htmlFor="">{weatherCondition?.vis}km</label> 
      <svg class="hs-accordion-active:hidden block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
      <svg class="hs-accordion-active:block hidden size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
      </svg>
    </button>
    <div id="hs-basic-active-bordered-collapse-one" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-active-bordered-heading-one">
      <div class="pb-4 px-5">
        <p class="text-gray-800 dark:text-neutral-200">
        {weatherCondition && <> {
                      weatherCondition.vis < 0.5 ? <label> Extremely hazardous conditions for cargo delivery. Nearly zero visibility demands extreme caution, and in some cases, postponing the delivery may be necessary.</label> :
                        weatherCondition.vis < 1.1 ? <label> Very Poor Visibility: Hazardous conditions during cargo delivery. Extreme caution required, as visibility is severely compromised.</label> :
                          weatherCondition.vis < 2.1 ? <label> Poor Visibility: Challenging conditions for cargo delivery. Visibility limitations may impact delivery schedules and safety.</label> :
                            weatherCondition.vis < 4.1 ? <label> Moderate Visibility: Reduced visibility that can affect cargo delivery. Distant objects may be obscured, demanding careful driving.</label> :
                              weatherCondition.vis < 6.1 ? <label> Good Visibility: Fair visibility for cargo delivery. Some distant objects may appear blurry, requiring extra caution.</label> :
                                weatherCondition.vis < 10.1 ? <label> Very Good Visibility: Good conditions for cargo delivery. Most objects are visible, allowing for safe navigation.</label> :
                                  <label> Excellent Visibility: Optimal conditions for cargo delivery. Clear visibility ensures safe and efficient transportation.</label>
                    }</>}
        </p>
      </div>
    </div>
  </div>

  <div class="hs-accordion hs-accordion-active:border-gray-200 bg-white border border-transparent rounded-xl dark:hs-accordion-active:border-neutral-700 dark:bg-neutral-800 dark:border-transparent" id="hs-active-bordered-heading-one">
    <button class="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex justify-between items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-none dark:focus:text-neutral-400" aria-controls="hs-basic-active-bordered-collapse-one">
    Humidity <label htmlFor="">{weatherCondition?.rh}%</label>
      <svg class="hs-accordion-active:hidden block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
      <svg class="hs-accordion-active:block hidden size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
      </svg>
    </button>
    <div id="hs-basic-active-bordered-collapse-one" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-active-bordered-heading-one">
      <div class="pb-4 px-5">
        <p class="text-gray-800 dark:text-neutral-200">
        {weatherCondition && <>{
                      weatherCondition.rh < 31 ? <label> Low Humidity: Low humidity can result in a clear windshield but may lead to discomfort due to dry air. Reduced humidity poses minimal visibility challenges for drivers.</label> :
                        weatherCondition.rh < 61 ? <label> Moderate Humidity: Comfortable humidity levels for drivers, maintaining clear visibility through the windshield. Condensation and fogging are less likely.</label> :
                          weatherCondition.rh < 81 ? <label> High Humidity: Increased humidity may lead to slight fogging on the windshield. Drivers may need to use defogging systems occasionally.</label> :
                            <label> Very High Humidity: High humidity can cause significant fogging on the windshield, reducing visibility. Frequent use of defoggers and wipers may be necessary for safe driving.</label>
                    }</>}
        </p>
      </div>
    </div>
  </div>
  <div class="hs-accordion hs-accordion-active:border-gray-200 bg-white border border-transparent rounded-xl dark:hs-accordion-active:border-neutral-700 dark:bg-neutral-800 dark:border-transparent" id="hs-active-bordered-heading-one">
    <button class="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex justify-between items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-none dark:focus:text-neutral-400" aria-controls="hs-basic-active-bordered-collapse-one">
    Air Pressure <label htmlFor="">{weatherCondition?.pres} mb</label>
      <svg class="hs-accordion-active:hidden block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
      <svg class="hs-accordion-active:block hidden size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
      </svg>
    </button>
    <div id="hs-basic-active-bordered-collapse-one" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-active-bordered-heading-one">
      <div class="pb-4 px-5">
        <p class="text-gray-800 dark:text-neutral-200">
        {weatherCondition && <> {
                        weatherCondition.slp < 950 ? <label>Very Low Air Pressure</label> :
                          weatherCondition.slp < 980 ? <label>Low Air Pressure </label> :
                            weatherCondition.slp < 1000 ? <label>Normal Air Pressure </label> :
                              weatherCondition.slp < 1014 ? <label>Moderate Air Pressure </label> :
                                <label>High Air-Level Pressure: </label>

                      }</>}
                       Sea Pressure <label htmlFor="">{weatherCondition?.slp.toFixed(1)} mb</label>
                       {weatherCondition && <>{
                        weatherCondition.slp < 950 ? <label>Very Low Sea-Level Pressure: Extreme severe weather, such as hurricanes, posing significant risks to cargo, drivers, and the environment. Deliveries should be halted or rerouted during such events, with safety as the top priority.</label> :
                          weatherCondition.slp < 980 ? <label>Low Sea-Level Pressure: Unsettled weather conditions may lead to delivery delays and driver safety concerns. It advises adopting precautionary measures.</label> :
                            weatherCondition.slp < 1000 ? <label>Normal Sea-Level Pressure: Suitable for cargo deliveries with no significant weather concerns. This is an optimal period for standard delivery schedules. </label> :
                              weatherCondition.slp < 1014 ? <label>Moderate Sea-Level Pressure: Fair weather conditions, ideal for cargo deliveries with minimal disruptions. It's a suitable time for efficient logistics planning. </label> :
                                <label>High Sea-Level Pressure: Stable and clear weather, providing favorable conditions for cargo deliveries. However, extremely high pressure may impact air quality, suggesting the need for pollution monitoring. </label>

                      }</>}
        </p>
      </div>
    </div>
  </div>

  <div class="hs-accordion hs-accordion-active:border-gray-200 bg-white border border-transparent rounded-xl dark:hs-accordion-active:border-neutral-700 dark:bg-neutral-800 dark:border-transparent" id="hs-active-bordered-heading-one">
    <button class="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex justify-between items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-none dark:focus:text-neutral-400" aria-controls="hs-basic-active-bordered-collapse-one">
    Solar Radiation: <label htmlFor="">{weatherCondition?.solar_rad} W/m²</label>
      <svg class="hs-accordion-active:hidden block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
      <svg class="hs-accordion-active:block hidden size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
      </svg>
    </button>
    <div id="hs-basic-active-bordered-collapse-one" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-active-bordered-heading-one">
      <div class="pb-4 px-5">
        <p class="text-gray-800 dark:text-neutral-200">
        {weatherCondition && <> {
                        weatherCondition.solar_rad < 101 ? <label> Low Solar Radiation: Limited sunlight, potentially impacting solar energy generation and reducing its environmental benefits. Cargo deliveries may rely more on conventional energy sources.</label> :
                          weatherCondition.solar_rad < 251 ? <label> Moderate Solar Radiation: Adequate sunlight for reasonable solar energy production, contributing to reduced carbon emissions. Cargo deliveries benefit from a cleaner energy mix.</label> :
                            weatherCondition.solar_rad < 501 ? <label> High Solar Radiation: Abundant sunlight, optimizing solar energy generation and reducing reliance on non-renewable energy sources. This positively impacts the environment and cargo deliveries.</label> :
                              weatherCondition.solar_rad < 1000 ? <label> Very High Solar Radiation: Intense sunlight, which can lead to elevated temperatures. Cargo deliveries, especially for heat-sensitive goods, may require special precautions.</label> :
                                <label> Extreme Solar Radiation: Excessive solar exposure, potentially causing extreme heat conditions. Cargo and driver well-being during deliveries become critical concerns.</label>
                      }</>}
        UV Index: <label htmlFor="">{(weatherCondition?.uv)?.toFixed(2)}</label> 
        {weatherCondition && <> {
                        weatherCondition.uv < 3 ? <label> Low: Minimal environmental impact. UV levels are low, and there is minimal risk of harm to the environment.</label> :
                          weatherCondition.uv < 6 ? <label> Moderate: Moderate environmental impact. UV levels pose some risk to ecosystems, potentially affecting plant growth and aquatic habitats.</label> :
                            weatherCondition.uv < 8 ? <label> High: Significant environmental impact. High UV levels can harm aquatic life, damage crops, and impact ecosystems by disrupting natural processes.</label> :
                              weatherCondition.uv < 11 ? <label> Very High: Severe environmental impact. Very high UV levels can lead to extensive damage to crops, aquatic ecosystems, and marine habitats.</label> :
                                <label> Extreme: Extreme environmental impact. Extreme UV levels can cause extensive harm to the environment, including severe damage to ecosystems, aquatic life, and crops.</label>
                      }</>}
        </p>
      </div>
    </div>
  </div>

  
  <div class="hs-accordion hs-accordion-active:border-gray-200 bg-white border border-transparent rounded-xl dark:hs-accordion-active:border-neutral-700 dark:bg-neutral-800 dark:border-transparent" id="hs-active-bordered-heading-one">
    <button class="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex justify-between items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:outline-none dark:focus:text-neutral-400" aria-controls="hs-basic-active-bordered-collapse-one">
    Air Quality <label htmlFor="">{weatherCondition?.aqi} </label>
      <svg class="hs-accordion-active:hidden block size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
      <svg class="hs-accordion-active:block hidden size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
      </svg>
    </button>
    <div id="hs-basic-active-bordered-collapse-one" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-active-bordered-heading-one">
      <div class="pb-4 px-5">
        <p class="text-gray-800 dark:text-neutral-200">
        {weatherCondition && <p>Wind Speed: {weatherCondition?.wind_spd}m/s</p>}
                      {weatherCondition && <p>Wind Direction: {weatherCondition?.wind_cdir_full}</p>}
                      {weatherCondition && <p>Wind Angle: {weatherCondition?.wind_dir}°</p>}
        {weatherCondition && <>{
                        weatherCondition.aqi < 51 ? <label> Good: Ideal conditions for cargo delivery and driver well-being. Minimal pollution, allowing for smooth and efficient transportation.</label> :
                          weatherCondition.aqi < 101 ? <label> Moderate: Favorable for cargo delivery and driver comfort. Slightly elevated pollution levels may have minimal impact on logistics.</label> :
                            weatherCondition.aqi < 151 ? <label> Unhealthy for Sensitive Groups: Adequate for cargo delivery but may affect driver health and efficiency. Increased pollution levels may require occasional breaks. </label> :
                              weatherCondition.aqi < 201 ? <label> Unhealthy: Cargo delivery may face delays due to reduced driver efficiency. Drivers with respiratory issues may experience discomfort.</label> :
                                weatherCondition.aqi < 301 ? <label> Very Unhealthy: Challenging conditions for cargo delivery. Reduced visibility and driver discomfort are likely. Delays and safety precautions are necessary.</label> :
                                  <label> Hazardous: High risk for cargo delivery and driver safety. Significant visibility issues and health hazards for drivers. Delivery delays and safety measures are crucial.</label>}</>}
        </p>
      </div>
    </div>
  </div>




</div>





            </div>
            <div className="transportDetails" ref={tDetail} onClick={openTransportDetail}>
              <i className='bx bxs-up-arrow bx-fade-up' id='showDetail' ></i>
              {transportDetail &&
                <>
                  <div className="transportCard bg-neutral-800 dark:bg-white">

                    <div className="card bg-white dark:bg-neutral-800 dark:text-white">
                      <div className="cardTitle">
                        <i className='bx bxs-car-mechanic' id='carBx'></i>
                        <h4>Vehicle Data</h4>
                      </div>
                      <div className="firstCard" id='speedometer'>
                        <div className="speedometer">
                          <Speedometer
                            value={speed}
                            fontFamily='squada-one'
                            accentColor={'#3d93fd'}
                            width={160}
                          >
                            <Background angle={260} />
                            <Arc />
                            <Needle offset={40} circleRadius={12} />
                            <Progress />
                            <Marks fontSize={14} lineSize={8} />
                            <Indicator fontSize={40} />
                          </Speedometer>
                        </div>

                        <div className="vehicleData">
                          <p>Vehicle: <label htmlFor="">{currentTrip.name}</label></p>
                          {positionData && <p>Speed: {speed == 0 ? <label>Idle</label> : <label>{speed} kph</label>}</p>}
                          {positionData && <p>Altitude: {positionData.altitude == null ? <label>Unavailable</label> : <label>{positionData?.altitude.toFixed(0)} meters</label>}</p>}
                          {positionData && <p>Accuracy: {positionData.accuracy == null ? <label>Unavailable</label> : <label>{positionData?.accuracy.toFixed(0)}</label>} </p>}
                          {positionData && <p>Heading: {positionData.heading == null ? <label>Unavailable</label> : <label>{positionData?.heading.toFixed(0)}</label>}</p>}
                          {driveTime && <p>Drive Time: <label>{driveTime}</label></p>}
                        </div>
                      </div>
                    </div>
                    <div className="card bg-white dark:bg-neutral-800 dark:text-white">
                      <div className="cardTitle">
                        <i className='bx bxs-truck' id='truckBx' ></i>
                        <h4>Transportation Data</h4>
                      </div>
                      <div className="transportData">
                        <div className="transportData1">
                        <p>Driver: {currentTrip.d_first_name} {currentTrip.d_last_name} </p>
                          <p>Destination: {currentTrip.t_trip_tolocation}</p>
                          <p>Cargo Weight: {currentTrip.t_totalweight}kg</p>
                          <p>Carbon Emissions: {vehicleStats.carbonEmission}g</p>
                          <p>Fuel Consumption: {vehicleStats.fuelConsumption}l</p>
                          <p>Estimated Fuel Cost: ₱{vehicleStats.fuelCost}</p>
                        </div>
                        <div className="transportData2">

                        </div>


                        {/* {carbonEmissions && (
              <p>Transport Method: {carbonEmissions.data ? <label>{carbonEmissions.data.attributes.transport_method}</label> : carbonEmissions.message}</p>
            )}
            {carbonEmissions && (
              <p>Cargo Weight: {carbonEmissions.data ? <label>{carbonEmissions.data.attributes.weight_value} kg</label> : carbonEmissions.message}</p>
            )} */}
                      </div>
                    </div>
                  </div>
                </>}
            </div>


            <div className="moreInfo">
              <>
                <div className="boxInfo bg-white dark:bg-neutral-800" ref={bInfo}>
                  <div className="boxInfoNav" ref={boxInfoNav}>
                    <h3 className='dark:text-white' onClick={() => { openBoxInfo(1) }}>Directions</h3>
                    {/* <h4 onClick={() => { openBoxInfo(2) }}>Message</h4>
                    <h4 onClick={() => { openBoxInfo(3) }}>Reminder</h4> */}
                  </div>
                  <div className="boxInfoDetail">
                    <div className="instruction-container" ref={instructionContainer}>
                    </div>
                    {boxInfoMessage &&
                      <>
                        <h1>Message</h1>
                      </>}
                    {boxInfoReminder &&
                      <>
                        <h1>Reminder</h1>
                      </>}
                  </div>
                </div>
              </>
              <i className='bx bxs-right-arrow bx-fade-right' id='showInfo' onClick={openInfo}></i>
            </div>
          </>)}

        <div id="markerTrack" ref={markerTrack}>
        </div>
        <i className='bx bx-map-pin' id='originPin' ref={originMarker}></i>
        <i className='bx bxs-map-pin' id='destinationPin' ref={destinationMarker} ></i>
      </div>
    </div>
    </div>
    </div>
    </>
  );
  
};

export default LiveTracking;