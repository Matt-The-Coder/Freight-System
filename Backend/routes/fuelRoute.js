const express = require('express')
const fuelRoute = express.Router()
const fuelServices = require('../services/fuel/fuel')
const db = require('../database/connection')
const {getFuelList, addFuel, fuelSearch, updateFuel} = fuelServices()
// Add Fuel
fuelRoute.post("/add-fuel", async (req, res) => {
    const {vehicle, driver, date, quantity, odometerReading, amount, remarks} = req.body
    const d = new Date()
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const created_date = `${year}-${month}-${day}`
    const result = await addFuel(vehicle, driver, date, quantity, odometerReading, amount, remarks, created_date)
    res.json(result).status(200)
})
// Get Fuel
fuelRoute.get("/retrieve-fuel", async (req, res) => {
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);
    const fuelData = await getFuelList(offset, limit)
    res.json(fuelData)
})
fuelRoute.get("/retrieve-fuel-full", async (req, res) => {
    const fuelData = await db("Select * from fms_g11_fuel")
    res.json(fuelData)
})
// Search
fuelRoute.get("/fuel", async (req, res) => {
    const {search} = req.query
    const fuelData = await fuelSearch(search)
    res.json(fuelData)
})
// update
fuelRoute.put("/fuel-update", async (req, res) => {
    const {vehicle, driver, date, quantity, odometerReading, amount, remarks, id} = req.body
    const result = await updateFuel(vehicle, driver, date, quantity, odometerReading, amount, remarks, id)
    res.json(result).status(200)
})
// get fuel by id
fuelRoute.get("/fuelbyid/:id", async (req, res) => {
    const {id} = req.params
    const fuelData = await db(`Select * from fms_g11_fuel where v_fuel_id = ${id}`)
    res.json(fuelData)
})

fuelRoute.put('/fuel-delete/:id', async (req, res) => {
    const {id} = req.params;
    console.log(id)
    const query = `Delete from v_fuel_id where v_fuel_id = ${id}`
    try {
        await db(query)
        res.json({message:"Deleted Successfully!"})
    } catch (error) {
        console.log(error)
    }
})

module.exports = fuelRoute