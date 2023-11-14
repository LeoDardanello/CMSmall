"use strict"
import { Container, Row, Button, Card} from 'react-bootstrap';
import { useState, useEffect } from "react"
import { useNavigate, useParams,useLocation } from 'react-router-dom';
import API from "../src/API"




function MyPage(props) {
  const [contents, setContents] = useState([])
  const [load, setLoad] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()
  const location=useLocation()
  const selectedPage = props.pages.find(e => e.id === parseInt(id));

  useEffect(() => {
    if (load == true) {
      API.getPageContent(id)
        .then((res) => {
          setContents(res);
          setLoad(false);
        })
        .catch((err) => console.log(err))
    }
  }, [load])

  return (

    <Container fluid className='d-flex align-items-center justify-content-center' style={{ minHeight: "100vh" }} >
      <Card style={{ width: "20rem" }} bg={"info"}>
        <Card.Header className='d-flex  justify-content-center'>
          {selectedPage.title}
        </Card.Header>
        <Card.Body >
              {
              contents.map((e,ind) => {
                if (e.type == "Image") { return (<MyDisplayImage  e={e} key={ind}/>) } //Image maiuscolo!!
                else { return (<MyDisplayContent e={e} key={ind}/>) }
              })}
        </Card.Body>
        <Card.Footer className="d-flex justify-content-around">
          <Button type="button" variant="danger" onClick={() => navigate(location.state)}>Home</Button>
        </Card.Footer>
      </Card>
    </Container>

  );
}


function MyDisplayContent(props) {
  const { e } = props
  return (
      <Row >
        <Card.Text className='d-flex  justify-content-center'>{e.type=="Header"? <span style={{fontWeight:"bold"}}>{e.content}</span>:e.content}</Card.Text>
      </Row>
  );
}
function MyDisplayImage(props) {
  const { e } = props
  const URL = "http://localhost:3001/"
  return (
    <Row >
      <Card.Img  className='d-flex  justify-content-center align-items-center' style={{width:"286px",height:"180px",margin:"15px"}} src={URL + `${e.content}`} />
    </Row>
  );
}
export default MyPage;