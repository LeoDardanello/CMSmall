'use strict';
import {  Container, Row, Button, Form, Table,Card, Alert } from 'react-bootstrap';
import {BsPersonFillLock} from "react-icons/bs"
import {useState} from "react"
import API from "../src/API"
import { useNavigate } from 'react-router-dom';


function LogInCard(props){
    const navigate=useNavigate()
    const [email,setEmail]=useState("harry@email.it")//solo per facilitare test
    const [password,setPassword]=useState("pwd")//solo per facilitare test
    const [error,setError]=useState()

    const doLogIn = (credentials) => {
        API.logIn(credentials)
          .then( user => {
            props.setUser(user) 
            props.setDirty(true)
            navigate("/backoffice")
          })
          .catch(err => {
            setError(err)//setto messaggio di errore nell'Alert
          })
      }


    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        const credentials = { username:email, password: password };

        let valid = true;
        if(email===""){
            setError("Il campo email è vuoto")
            valid=false
        }
        else if(password===""){
            setError("Il campo password è vuoto")
            valid=false
        }

        if(valid==true)
        {
          doLogIn(credentials);
          
        }
    };
    return (
        <Container fluid  className='d-flex align-items-center justify-content-center' style={{height:"100vh"}} >
            <Form onSubmit={handleSubmit}>
            <Card style={{width:"18rem",height:"20rem"}} bg={"info"}>
                <Card.Header className='d-flex  justify-content-center'>
                <BsPersonFillLock size={50} />
                </Card.Header> 
                <Card.Body>
                <Form.Group className="d-flex flex-wrap justify-content-center">
                    <Row style={{width:"16rem"}}>
                    <Form.Label >Email</Form.Label>
                    <Form.Control required type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </Row>
                    <Row style={{width:"16rem"}}>    
                    <Form.Label >Password</Form.Label>
                    <Form.Control required type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>   
                    </Row>
                </Form.Group>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-around">
                    <Button type="submit" varient="light" >Login</Button>
                    <Button type="button" variant="danger" onClick={()=>navigate("/")}>Cancel</Button>
                </Card.Footer>
            </Card>
            {error && <Alert style={{marginTop:"2rem"}} onClose={() => setError("")} dismissible>{error}</Alert>}
            </Form>
        </Container>
        )
    }
    export default LogInCard;
