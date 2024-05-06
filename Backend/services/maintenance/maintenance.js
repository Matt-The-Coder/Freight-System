const db = require('../../database/connection')
module.exports = () => 
{
    const getMaintenanceList = async (offset, limit) => 
    {
        const query = `Select * from fms_g11_maintenance LIMIT ${limit} OFFSET ${offset}`
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const addMaintenance = async (vehicle, startDate, endDate, details, cost, mService, status) => 
    {
        const d = new Date()
        const year = d.getFullYear()
        const month = d.getMonth() + 1
        const day = d.getDate()
        const created_date = `${year}-${month}-${day}`
        const query = `Insert into fms_g11_maintenance 	(m_v_id, m_start_date, m_end_date,
        m_details, m_cost, m_service, m_status, v_created_date) 
        values('${vehicle}', '${startDate}', '${endDate}', '${details}', '${cost}',
            '${mService}', '${status}', '${created_date}')`

        const data = await db(query)
        return data
    }
    const updateMaintenance = async (vehicle, startDate, endDate, details, cost, mService, status, id, modifiedDate) => 
    {
        const query = `UPDATE fms_g11_maintenance set
        m_v_id ='${vehicle}',
        m_start_date	= '${startDate}',
        m_end_date = '${endDate}',
        m_details	= '${details}',
        m_cost = ${cost},
        m_service = '${mService}',
        m_status =  '${status}', v_modified_date = '${modifiedDate}' where m_id= ${id}`
        
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const maintenanceSearch = async (search) => {
        const query = `SELECT * FROM fms_g11_maintenance WHERE m_v_id LIKE '%${search}%' OR m_status LIKE '%${search}%'`;
        const data = await db(query)
        return data

    }

    return {
        getMaintenanceList,
        addMaintenance,
        maintenanceSearch,
        updateMaintenance
    }
}