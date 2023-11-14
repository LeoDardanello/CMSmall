'use strict';
import { useState,useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "../components/home"
import Page from "../components/page"
import MyForm from "../components/inputForm"
import LogInCard from '../components/login';
import BackOffice from "../components/backoffice"
import API from "./API"

function App() {
  const [pages,setPages]=useState(undefined)
  const [pageOrder,setPageOrder]=useState("ASC")
  const [dirty,setDirty]=useState(false)
  const [load,setLoad]=useState(false)
  const [user,setUser]=useState("")
 

  useEffect(()=>{
  API.getPages()
    .then((res)=>{
      setPages(res)
    setDirty(false);})
    .catch((err)=>console.log(err))
   },[dirty])


   const doLogOut=()=>{
    API.logOut().then().catch((err)=>console.log(err))
    setUser("")
    setDirty(true)
  }

  return (   
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage pages={pages}  user={user} setLoad={setLoad} pageOrder={pageOrder} 
                      setPageOrder={setPageOrder} setDirty={setDirty} doLogOut={doLogOut}/>}/>
      <Route path="/backoffice" element={user ?<BackOffice pages={pages}  user={user} setLoad={setLoad} pageOrder={pageOrder} 
                      setPageOrder={setPageOrder} setDirty={setDirty} doLogOut={doLogOut}/>: <Navigate replace to="/"/>}/>
      <Route path="/page/:id" element={<Page load={load} pages={pages}/>} />
      <Route path="/add" element={<MyForm pages={pages} user={user} setDirty={setDirty}/>}/>
      <Route path="/edit/:id" element={<MyForm pages={pages} user={user} setDirty={setDirty}/>}/>
      <Route path="/login" element={<LogInCard setUser={setUser} setDirty={setDirty}  />}/>
    </Routes>
  </BrowserRouter>
    
  )
}

export default App
