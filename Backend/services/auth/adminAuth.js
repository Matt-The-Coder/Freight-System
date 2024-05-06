const db = require('../../database/connection')
module.exports = () => {

    const getAdminAccounts = async () => 
    {
        const query = "Select * from fms_g11_accounts"
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const getAdminAccByUsername =  async (usernName) => 
    {
        const query = `Select * from fms_g11_accounts where u_username = '${usernName}'`
        try {
            const data = await db(query)    
            return data
        } catch (error) {
            throw error
        }
    }
    return{
        getAdminAccByUsername,
        getAdminAccounts
    }
}