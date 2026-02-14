import { useState } from 'react'
import './App.css'
import { HeroUIProvider } from '@heroui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Pages/Home'
import Register from './auth/Register/Register'
import Login from './auth/Login/Login'
import { AuthContextProvider } from './context/authContext'
import { CounterContextProvider } from './context/counterContext'
import ProtectRoutes from './Pages/ProtectRoutes'
import Profile from './Pages/Profile'
import SinglePost from './Pages/singlePost'
import Notfound from './Components/Notfound/Notfound'

function App() {
  const [count, setCount] = useState(0)

let routers= createBrowserRouter([
  {path:'' , element:<Layout/> , children:[
    {index:true  ,element: <Login/>} ,
    {path:'home'  ,element: <ProtectRoutes><Home/></ProtectRoutes>} ,
      {path:'register'  ,element: <Register/>} ,
        {path:'profile'  ,element: <ProtectRoutes><Profile/></ProtectRoutes>} ,
          {path:'singlepost/:id'  ,element: <ProtectRoutes><SinglePost/></ProtectRoutes>} ,
         
             {path:'*'  ,element: <Notfound/>} ,

  ]}
])

  return (
     <HeroUIProvider>
 <CounterContextProvider>
<AuthContextProvider>

 
        <RouterProvider router={routers}/>



</AuthContextProvider>

</CounterContextProvider>
    
    </ HeroUIProvider>
  )
}

export default App

