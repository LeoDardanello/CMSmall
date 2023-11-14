'use strict';
import { Col, Container, Row, Button, Form, Table,Navbar, InputGroup, Spinner} from 'react-bootstrap';
import {FaRegUserCircle} from "react-icons/fa"
import API from "../src/API"
import { useLocation, useNavigate } from 'react-router-dom';
import {GrEdit} from "react-icons/gr"
import {FaInstalod} from "react-icons/fa"
import { useState,useEffect } from 'react';

function MyNavbar(props){
  const [title,setTitle]=useState()
  const [changeTitle,setChangeTitle]=useState()
  const [dirty, setDirty] = useState(true)
  const navigate=useNavigate()
  const location=useLocation()

  useEffect(()=>{
    if(dirty){
    API.getSiteTitle().
    then((res)=>{setTitle(res.title); setChangeTitle();setDirty(false)})
    .catch((err)=>console.log(err))
    }
  },[dirty])

  const changeSiteTitle=(event)=>{
    event.preventDefault()
    API.editSiteTitle(changeTitle)
    .then((res)=>{
                  setDirty(true)
                  
                  })
    .catch((err)=>console.log(err))
    
  }

    return (<>
    <Navbar bg="primary" expand="lg" >  
      <Container fluid>
        <Container fluid>
          <Row >
            <Col className=" d-flex justify-content-start align-items-center"  >
                <FaInstalod size={40}/>
                {props.user.role == "admin" && (changeTitle || changeTitle=="") ? 
                <Form onSubmit={changeSiteTitle}>
                <InputGroup style={{ width: "15vw" }}>
                  <Form.Control required size="sm" value={changeTitle} onChange={(p) => setChangeTitle(p.target.value)}  ></Form.Control>
                  <Button variant='danger' onClick={() => setChangeTitle()}>x</Button><Button variant='success' type='submit'>+</Button>
                </InputGroup></Form>
                  : <Navbar.Text style={{ marginLeft: "1rem" }} >{title ? title : <Spinner animation="border" size="sm" />}</Navbar.Text>
                }
                {props.user.role=="admin"&& <Button style={{marginLeft:"1rem"}} onClick={()=>setChangeTitle(title)}><GrEdit/></Button>}
                {props.user&&<Button variant="danger" style={{marginLeft:"3rem"}} onClick={()=>{
                  if(location.pathname=="/backoffice") 
                  { 
                    navigate("/")}
                  else{
                    navigate("/backoffice")
                  }
                }}>Click to swith to the {location.pathname=="/"?"Back Office":"Front Office"}</Button>}
            </Col>
            <Col className="d-flex justify-content-end align-items-center">
              {props.user?<>Logged in as {props.user.name} </>:<></>}
              <Button variant="danger"style={{marginLeft:"0.5rem"}} onClick={()=>{props.user?props.doLogOut():navigate("/login")}}>
              {props.user?<> Click to log out</>:<>Click to log in</>}<FaRegUserCircle size={30} style={{marginLeft:"0.5rem"}} />
              </Button>
            </Col>
          </Row>
        </Container>
        </Container>
    </Navbar>
    <Row>
        <Button variant="success" style={{width:"10rem"}} onClick={()=>{
          if(props.pageOrder=="ASC")
          props.setPageOrder("DESC")
          if(props.pageOrder=="DESC")
          props.setPageOrder("ASC")
        }}>Ordering By: {props.pageOrder}</Button>
    </Row>
    </>
        );
      }
      export default MyNavbar;