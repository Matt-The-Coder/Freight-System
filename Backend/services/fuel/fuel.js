const db = require('../../database/connection')
module.exports = () => {

    const getFuelList = async (offset, limit) => 
    {
        const query = `Select * from fms_g11_fuel LIMIT ${limit} OFFSET ${offset}`
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const addFuel =  async (vehicle, driver, date, quantity, odometerReading, amount, remarks, created_date) => 
    {
        const query = `INSERT INTO fms_g11_fuel (v_id, v_fuel_quantity, v_odometerreading,	
            v_fuelprice, v_fuelfilldate, v_fueladdedby,	v_fuelcomments,	v_created_date)
            values ('${vehicle}', ${quantity}, ${odometerReading}, ${amount}, 
                '${date}', '${driver}', '${remarks}', '${created_date}')`
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const updateFuel =  async (vehicle, driver, date, quantity, odometerReading, amount, remarks, f_id) => 
    {
        const query = `UPDATE fms_g11_fuel set
        v_id ='${vehicle}',
        v_fuel_quantity	= ${quantity},
        v_odometerreading = ${odometerReading},
        v_fuelprice	= ${amount},
        v_fuelfilldate = '${date}',
        v_fueladdedby = '${driver}',
        v_fuelcomments = '${remarks}' where v_fuel_id= ${f_id}`
        
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const fuelSearch = async (search) => {
        const query = `SELECT * FROM fms_g11_fuel WHERE v_fueladdedby LIKE '%${search}%' OR v_id LIKE '%${search}%'`;
        const data = await db(query)
        return data

    }
    return{
        getFuelList,
        addFuel,
        fuelSearch,
        updateFuel
    }
}