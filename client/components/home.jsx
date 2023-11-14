'use strict';
import MyNavbar from "../components/navbar"
import MyTable from "../components/table"

function HomePage(props){
    return(
        <>
        <MyNavbar pageOrder={props.pageOrder} user={props.user} setPageOrder={props.setPageOrder} doLogOut={props.doLogOut} setDirty={props.setDirty}></MyNavbar>
        <MyTable pages={props.pages} user={props.user} setLoad={props.setLoad} pageOrder={props.pageOrder} setPageOrder={props.setPageOrder} setDirty={props.setDirty}></MyTable>
        </>

    );

}
export default HomePage;