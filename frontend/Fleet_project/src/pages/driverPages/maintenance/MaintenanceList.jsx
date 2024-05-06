import { useEffect, useState } from 'react'
import '/public/assets/css/adminLayout/maintenance.css'
import axios from "axios"
import {Link, useNavigate, useOutletContext, useParams} from "react-router-dom"
const MaintenanceList = () => {
    const nav = useNavigate()
    const {MaintenanceID} = useParams()
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const {setIsLoading} = useOutletContext()
    const [isDelete, setIsDelete] = useState(false)
    const [filterData, setFilterData] = useState("")
    const [maintenanceData, setMaintenanceData] = useState([])
    const [maintenanceStorage, setMaintenanceStorage] = useState([])
    const hostServer = import.meta.env.VITE_SERVER_HOST
    const [maintenanceSearch, setMaintenanceSearch] = useState('')
    const getMaintenanceList = async () => {
        setIsLoading(true)
        const fetchMaintenance = await axios.get(`${hostServer}/maintenance-list?page=${page}&pageSize=${pageSize}`)
        const  data = fetchMaintenance.data;
        setMaintenanceData(data)
        setMaintenanceStorage(data)
        setIsLoading(false)
    }
    const searchMaintenance = async() =>
    {
        setIsLoading(true)
        const fetchMaintenance = await axios.get(`${hostServer}/maintenance-search?search=${maintenanceSearch}`)
        const filteredData = fetchMaintenance.data
        setMaintenanceData(filteredData)
        setIsLoading(false)
    }
    useEffect(()=>{
        getMaintenanceList()
    },[isDelete, page])
    const formatDate = (date) => {
        const formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate());
        return formattedDate.toISOString().split("T")[0];
      };
      const updateData = (e) => {
        if(e){
            nav(`/admin/maintenance/edit/${e}`)
        }
        
    }
    const deleteData = async (e) => {
        try {
            setIsLoading(true)
            const fetched = await axios.delete(`${hostServer}/maintenance-delete/${e}`)
            setIsLoading(false)
            alert(fetched.data.message)
            setIsDelete(!isDelete)
 
        } catch (error) {
            console.log(error)
        }

    }

    const filterMaintenance = (e) => {
        if(e == "" || e == []){
            setFilterData(e)
            setMaintenanceData(maintenanceStorage)
        }else{
            setFilterData(e)
            const filtered =  maintenanceStorage.filter((m)=>{
                const formattedDate = formatDate(m.m_start_date)
                if(formattedDate == e){
                    return m
                }
            })
            setMaintenanceData(filtered)
        }
        console.log(e)
    }
    return (
        <div className="Maintenance">
            <div className="adminHeader">
                <div className="left">
                    <h1>Maintenance</h1>
                    <ul className="breadcrumb" >
                        <li><Link to="/admin/dashboard" >Maintenance</Link></li>
                        /
                        <li><a href="#" className="active">Maintenance List</a></li>
                    </ul>
                </div>
            </div>
                <div className="filter">
                {/* <h3>Filter</h3> */}
                <div className="filter-container">
                    <p htmlFor=""> Start Date</p>
                    <div className="filter-input">
                    <input type="date" id='date-input' value={filterData} 
                    onChange={(e)=>{filterMaintenance(e.currentTarget.value)}}/>
                        <i className='bx bx-filter' ></i>
                    </div>

                </div>

            </div>
            <div className="maintenance-details">
                <div className="maintenance-search">
                    <input type="text" id='search' onChange={(e)=>{setMaintenanceSearch(e.target.value)}}/>
                    <button onClick={searchMaintenance}>Search</button>
                </div>
                <div className="maintenance-list" id='maintenanceReports'>
                    <table className='maintenance-table'>
                        <thead>
                            <tr>
                                <th>M.No</th>
                                <th>Vehicle</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Service Info</th>
                                <th>Vendor</th>
                                <th>Cost</th>
                                <th>Status</th>
                                {/* <th>Manage</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                maintenanceData.map((e, i)=> 
                                {
                                    return(
                                    <tr key={i}>
                                        <td>ML-{e?.m_id}</td>
                                        <td>{e?.m_v_id} </td>
                                        <td> {formatDate(e?.m_start_date)}</td>
                                        <td> {formatDate(e?.m_end_date)}</td>
                                        <td>{e?.m_service} </td>
                                        <td> {e?.m_vendor_name}</td>
                                        <td> {e?.m_cost}</td>
                                        <td> {e?.m_status}</td>
                                        {/* <td><button onClick={()=>{updateData(e.m_id)}}>Edit</button><button onClick={()=>{deleteData(e.m_id)}}>Delete</button></td> */}
                                    </tr>
                                )})
                            }
                        </tbody>

                    </table>
                </div>
                <div className="pagination-container">
                        <div className='pagination'>
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </button>
                            <span>Page {page}</span>
                            <button disabled={maintenanceData.length < 5} onClick={() => setPage(page + 1)}>Next</button>
                        </div>
                    </div>
            </div>

        </div>
    )
}

export default MaintenanceList;