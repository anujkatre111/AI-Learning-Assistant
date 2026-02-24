import React, { useEffect } from 'react'
import progressService from '../../services/ProgressService';

const DashboardPage = () => {

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const fetchDashboardData = async () => {
      try{
        const data = await progressService.getDashboardData()
        setDashboardData(data.data)
      }catch(error){
        setError(error.message || 'Failed to fetch dashboard data')
      }finally{
        setLoading(false)
      }
    }
    fetchDashboardData()
  },[])

  if(loading){
    return(
      <div className='flex items-center justify-center h-screen'>
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      
    </div>
  )
}

export default DashboardPage
