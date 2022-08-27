import React,{useContext,useEffect} from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { AuthContext } from 'src/context/auth/authContext'
const DefaultLayout = (props) => {
  const { dispatch } = useContext(AuthContext);
  useEffect(()=>{
    dispatch({type:'check',payload:props})
  },[])

  const loading=<div className='animated fadeIn pt-1 text-center'>Loading...</div>

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter fallback={loading} />
      </div>
    </div>
  )
}

export default DefaultLayout
