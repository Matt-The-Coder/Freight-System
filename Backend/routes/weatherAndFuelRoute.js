const express = require('express')
const WFRoute = express.Router()
const axios = require('axios')
const db = require('../database/connection')
const host = process.env.VITE_SERVER_HOST
// Calculate Emissions and Consumptions
WFRoute.get('/calculateFuelConsumptionWithPrice', (req, res)=>
{
  const {miles, weightInKG} = req.query
  // Fuel Consumption
    const runMiles = miles
    const milesPerLiter = 21.58
    const fuelConsumptionPerLiter = runMiles / milesPerLiter
    const dieselFuelPricePerLiter = 66.52
    const totalCostForAllDieselUsed = fuelConsumptionPerLiter * dieselFuelPricePerLiter
  // Carbon Emissions
    const truckEmissionFactorInGramsPerTonMiles = 161.8
    const cargoWeightInTons = weightInKG / 1000
    const totalAmountOfTonMiles = runMiles * cargoWeightInTons;
    const carbonEmissionsInGrams = totalAmountOfTonMiles * truckEmissionFactorInGramsPerTonMiles
    res.json({fuelConsumption: fuelConsumptionPerLiter.toFixed(2), fuelCost:totalCostForAllDieselUsed.toFixed(2), 
      carbonEmission: carbonEmissionsInGrams.toFixed(2)})
})

WFRoute.get('/get-driver-weatherdata', async (req, res)=> 
{   
  let latitude = req.query.lat;
  let longitude = req.query.lon
    const API = process.env.WEATHER_API
    const weatherData = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${API}`)
    const weatherAlert = await axios.get(`https://api.weatherbit.io/v2.0/alerts?lat=${latitude}&lon=${longitude}&key=${API}`);
    res.json({weatherData:weatherData.data.data[0], weatherAlert:weatherAlert.data})
})
WFRoute.get('/weatherdata', async (req, res)=> 
{   
  const {lat:latitude, lon:longitude, tripID, miles, weight} = req.query
    const API = process.env.WEATHER_API
    try {
      const weatherData = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${API}`);
      const weatherAlert = await axios.get(`https://api.weatherbit.io/v2.0/alerts?lat=${latitude}&lon=${longitude}&key=${API}`);
      const {precip, weather, aqi, wind_spd, wind_cdir_full, wind_dir, temp, rh, vis, uv, solar_rad, pres, slp  } = weatherData.data.data[0]
      const formattedUV = uv.toFixed(2)
      const {description} = weather
      const alert = weatherAlert.data?.alerts[0]?.title?weatherAlert.data.alerts[0].title:"No Current Alerts"
      const fuelAndCarbon = await axios.get(`${host}/calculateFuelConsumptionWithPrice?miles=${miles}&weightInKG=${weight}`)
      const {fuelConsumption, fuelCost, carbonEmission} = fuelAndCarbon.data
      const sustainData = await db(`Select * from fms_g11_sustainability_data where sd_trip_id = ${tripID}`)
    if (sustainData.length !== 0) {
      await db(`Update fms_g11_sustainability_data set sd_carbon_emission = '${carbonEmission}g', sd_fuelcost = '₱${fuelCost}',	
      sd_fuelconsumption = '${fuelConsumption}l', sd_rainfall_rate = '${precip}mm/hr',
      sd_current_weather = '${description}', sd_air_quality = '${aqi}AQI', sd_wind_speed = '${wind_spd}m/s', sd_wind_direction = '${wind_cdir_full}',
      sd_wind_angle = '${wind_dir}°', sd_temperature = '${temp}°C',  sd_humidity = '${rh}%RH', sd_visibility = '${vis}km', sd_uv_index = '${formattedUV}UV Index',
      sd_solar_radiation = '${solar_rad}W/m2', sd_pressure = '${pres}mb', sd_sealevel_pressure = '${slp}mb', alerts = '${alert}' where sd_trip_id = ${tripID} `)
    }else{
       await db(`Insert into fms_g11_sustainability_data 
      (sd_trip_id, sd_fuelcost,	sd_fuelconsumption, sd_carbon_emission,	sd_rainfall_rate,	sd_current_weather,	
        sd_air_quality,	
        sd_wind_speed,	sd_wind_direction,	sd_wind_angle,	sd_temperature,	sd_humidity,	sd_visibility,	
        sd_uv_index,	sd_solar_radiation,	sd_pressure,	sd_sealevel_pressure, alerts)
      values (${tripID}, '₱${fuelCost}', '${fuelConsumption}l', '${carbonEmission}g', '${precip}mm/hr','${description}',
      '${aqi}AQI', '${wind_spd}m/s', '${wind_cdir_full}', '${wind_dir}°', '${temp}°C', '${rh}%RH', '${vis}km', '${formattedUV}UV Index',
       '${solar_rad}W/m2', '${pres}mb', '${slp}mb', '${alert}')`)
    }
      res.json({weatherData:weatherData.data.data[0], weatherAlert:weatherAlert.data})
    } catch (error) {
      console.log(error)
    }
})

WFRoute.get('/getSustainableData',  async (req, res)=> {
  try {
    let carbonArray = ""
    let carbonEmissions = []
    let fuelArray = ""
    let fuelConsumption = []
    for(let i=1; i<13; i++){
      carbonArray = await db(`SELECT SUM(sd_carbon_emission) AS total_emission
       from fms_g11_sustainability_data where MONTH(sd_modified_date) = ${i}`)
      carbonEmissions.push(carbonArray[0])
    }
    for(let i=1; i<13; i++){
      fuelArray = await db(`SELECT SUM(sd_fuelconsumption) AS total_fuel_consumption
       from fms_g11_sustainability_data where MONTH(sd_modified_date) = ${i}`)
      fuelConsumption.push(fuelArray[0])
    }
    res.json({carbonEmissions, fuelConsumption})
  } catch (error) {
    console.log(error)
  }
})

WFRoute.get('/getSustainableReports',  async (req, res)=> {
  try {
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);
    const data = await db(`Select * from fms_g11_sustainability_data LIMIT ${limit} OFFSET ${offset}`)
    res.json(data)
  } catch (error) {
    console.log(error)
  }
})
WFRoute.get('/getSustainableReportsFull',  async (req, res)=> {
  try {
    const data = await db(`Select * from fms_g11_sustainability_data`)
    res.json(data)
  } catch (error) {
    console.log(error)
  }
})

WFRoute.get('/getSustainableById/:id',  async (req, res)=> {
  try {
    const {id} = req.params
    const data = await db(`Select * from fms_g11_sustainability_data where sd_trip_id = ${id}`)
    res.json(data)
  } catch (error) {
    console.log(error)
  }
})

module.exports = WFRoute