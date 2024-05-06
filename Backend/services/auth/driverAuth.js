const db = require('../../database/connection')
module.exports = () => {

    const getDriverAccounts = async () => 
    {
        const query = "Select * from fms_g12_drivers"
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const getDriverAccByUsername =  async (usernName) => 
    {
        const query = `Select * from fms_g12_drivers where d_username = '${usernName}'`
        try {
            const data = await db(query)    
            return data
        } catch (error) {
            throw error
        }
    }
    return{
        getDriverAccByUsername,
        getDriverAccounts
    }
}