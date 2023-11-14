'use strict';
import { Button } from 'react-bootstrap';
import MyNavbar from "../components/navbar"
import MyTable from "../components/table"
import { useNavigate } from 'react-router-dom'

function BackOffice(props){
    const navigate=useNavigate()
    return(
        <>
        <MyNavbar pageOrder={props.pageOrder} user={props.user} setPageOrder={props.setPageOrder} doLogOut={props.doLogOut} setDirty={props.setDirty}></MyNavbar>
        <MyTable pages={props.pages} user={props.user} setLoad={props.setLoad} pageOrder={props.pageOrder} setPageOrder={props.setPageOrder} setDirty={props.setDirty}></MyTable>
        <Button onClick={()=>navigate("/add")}>Create Page</Button>
        </>

    );

}
export default BackOffice;