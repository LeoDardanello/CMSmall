'use strict';
import { Button, Table, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from "react-router-dom";
import { BsTrashFill } from "react-icons/bs"
import { CiEdit } from "react-icons/ci"
import API from "../src/API"
import dayjs from "dayjs";


function MyTable(props) {

    const location = useLocation()

    const ChangeOrder = (pages, pageOrder) => {
        if (pageOrder == "ASC") {
            const ordered = pages.sort((a, b) => {
                if(!a.publicationdate)
                    return 1;
                if(!b.publicationdate)
                    return -1;
                return dayjs(a.publicationdate).diff(dayjs(b.publicationdate))
            })
            return ordered
        }
        if (pageOrder == "DESC") {
            const ordered = pages.sort((a, b) => {
                if(!a.publicationdate)
                    return 1;
                if(!b.publicationdate)
                    return -1;
                return dayjs(b.publicationdate).diff(dayjs(a.publicationdate))
            });
            return ordered
        }
    }

    const filterPage = (pages) => {
        return pages.filter((e) => e.publicationdate != null && dayjs().isAfter(dayjs(e.publicationdate)))
    }
    return (
        <div>{props.pages ?
            <Table striped bordered hover>
                <thead >
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publication Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {location.pathname == "/backoffice" && ChangeOrder(props.pages, props.pageOrder).map((e, ind) => <MyRow e={e} key={ind} user={props.user} setLoad={props.setLoad} setDirty={props.setDirty} />)}
                    {location.pathname == "/" && ChangeOrder(filterPage(props.pages), props.pageOrder).map((e, ind) => <MyRow e={e} key={ind} user={props.user} setLoad={props.setLoad} setDirty={props.setDirty} />)}
                </tbody>

            </Table> : <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}
            ><Spinner animation="grow" variant="info" /></div>}
        </div>
    )
}
function MyRow(props) {
    const { e } = props


    const navigate = useNavigate()
    const location = useLocation()
    return (
        <tr style={{ borderRadius: "10px", border: "1px solid black" }}   >
            <td>
                <Link to={`/page/${e.id}`} state={location.pathname}><Button variant="link" onClick={() => { props.setLoad(true) }}>{e.title}</Button></Link>
            </td>
            <td>
                {e.name}
            </td>
            <td>
                {e.publicationdate}
            </td>
            <td>
                {e.publicationdate==null?"Draft":(dayjs().isAfter(dayjs(e.publicationdate)) ? "Published":"Programmed")}
            </td>
            <td>
                {props.user && location.pathname == "/backoffice" && (props.user.id == e.userid || props.user.role == "admin") &&
                    <Button onClick={() => navigate(`/edit/${e.id}`)}><CiEdit size={20} /></Button>}
                {props.user && location.pathname == "/backoffice" && (props.user.id == e.userid || props.user.role == "admin") &&
                    <Button variant='danger' style={{ marginLeft: "2rem" }} onClick={() => { API.deletePage(e); props.setDirty(true) }}><BsTrashFill /></Button>}

            </td>
        </tr>
    )

}
export default MyTable;
//onClick={()=>navigate(`/edit/${e.ID}`)
/*  <td>
                <Button  size ="20" variant="danger" style={{marginRight:"10px"}} ><BsTrash/></Button>
               <Button ><BiEdit size="20"/></Button>
            </td>*/