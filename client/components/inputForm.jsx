"use strict"
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Row, Button, Form, DropdownButton, Dropdown, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { CiSaveDown2 } from "react-icons/ci"
import { BsFillArrowDownSquareFill, BsFillArrowUpSquareFill, BsTrashFill } from "react-icons/bs"
import API from "../src/API"
import dayjs from 'dayjs';

function MyForm(props) {
    const navigate = useNavigate()
    const { id } = useParams()//passato tramite URL
    const pageToEdit = id && props.pages.find(e => e.id === parseInt(id));
    let [page, setPage] = useState({
        userid: pageToEdit ? pageToEdit.userid : props.user.id,
        title: pageToEdit ? pageToEdit.title : "",
        creationdate: pageToEdit ? dayjs(pageToEdit.creationdate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
        publicationdate: (pageToEdit && pageToEdit.publicationdate) ? dayjs(pageToEdit.publicationdate).format("YYYY-MM-DD") : ""
    })
    const [author, setAuthor] = useState(pageToEdit ? pageToEdit.name : props.user.name)//Modificare quando implemento il login
    const [add, setAdd] = useState(false)
    const [componentsList, setComponentsList] = useState([])
    const [componentsListNew, setComponentsListNew] = useState([])
    const [error, setError] = useState()
    const [imageNames, setImageNames] = useState([])//ATTENZIONE ALLE MAIUSCOLE PER I TIPI DEI CONTENTS
    const [users, setUsers] =useState()

        useEffect(() => {
            if(id){
            API.getPageContent(id)
                .then((res) => {
                    setComponentsList(res)
                    setComponentsListNew(res)//all'inizio le due liste sono uguali 
                })
                .catch((err) => console.log(err))}
                API.getImagesNameAndUsers()
                .then((res) => {
                    setUsers(res.userList)
                    setImageNames(res.image);
                })
                .catch((err) => console.log(err))
        }, [id])

const validatePage = async () => {
    let flagHeader = 0
    let flagNotHeader = 0;
        for (let i = 0; i < componentsListNew.length; i++) {
            if (componentsListNew[i].type == "Header") {
                flagHeader++;
            }
            else {
                flagNotHeader++;
            }
        }
        if (page.type == "") {
            setError("Inserire un titolo")
            return;
        }
         if (author == "") {
            setError("Inserire un autore")
            return;
        }
        if (flagHeader == 0) {
            setError("Inserire almeno un campo header")
            return;
        }
        if(page.publicationdate!="" && dayjs(page.publicationdate).diff(dayjs(page.creationdate))<0){
                setError("la data di pubblicazione è prima di quella di creazione")
                return
        }
        if (flagHeader != 0 && flagNotHeader == 0) {
            setError("Inserire almeno un altro campo di tipo non header")
            return
        }
        if (flagHeader != 0 && flagNotHeader != 0) {
            
            for (let i of componentsListNew){//controllo che il contenuto dei blocchi modificati non sia vuoto
                    if( i.content==""){
                        setError("li blocco che si vuole modificare ha contenuto vuoto")
                        return;
                    }}

            if (pageToEdit) {//EDIT
                const pageEdited = {
                    id: id,
                    userid: page.userid.toString(),
                    title: page.title,
                    creationdate: page.creationdate,
                    publicationdate: page.publicationdate
                }

                await API.editPage(pageEdited).then().catch((err) => console.log("Errore nell'update della pagina:", err))

                let separetedContents=findVectorsBlocks(componentsList, componentsListNew) 
                
                for (let i of separetedContents.add){//Contents da aggiungere
                    const content = {
                        type: i.type,
                        content: i.content,
                        pageid: id,//passato nell'URL
                        position: i.position
                    }
                    await API.addNewPageContent(content).then().catch((err)=>console.log(err))
                }
                for (let i of separetedContents.up){//Contents da aggiornare
                    const content = {
                        id:i.id,
                        type: i.type,
                        content: i.content,
                        pageid: id,//passato nell'URL
                        position: i.position
                    }
                    await API.editPageContent(content).then().catch((err)=>console.log(err))
                }
                for (let i of separetedContents.del){// contents da eliminare
                    const content = {
                        id:i.id,
                        type: i.type,
                        content: i.content,
                        pageid: id,//passato nell'URL
                        position: i.position
                    }
                    await API.deleteContent(content).then().catch((err)=>console.log(err))
                }
                props.setDirty(true);
                navigate("/backoffice")
                }
                else {//ADD
                    const newPage = {
                    userid: page.userid,
                    title: page.title,
                    creationdate: page.creationdate,
                    publicationdate: page.publicationdate,
                    }
                let pageid = await API.addNewPage(newPage).then().catch((err) => console.log("Errore nel inserimento della pagina"))

                for (let i = 0; i < componentsListNew.length; i++) {
                    const content = {
                        type: componentsListNew[i].type,
                        content: componentsListNew[i].content,
                        pageid: pageid,
                        position: componentsListNew[i].position
                    }
                    await API.addNewPageContent(content).then().catch((err) => console.log("Errore nell'inserimento dei contenuti della pagina"))
                }
                props.setDirty(true);
                navigate("/backoffice")
            }
        }
    }
    
    function findVectorsBlocks(oldBlocks, newBlocks) {
        let del = [];
        let up = []; 
        let add = [];
        for (let b of newBlocks) {
          if (!b.id) {
            add.push(b);
          } else {
            let i = oldBlocks.findIndex((x) => x.id == b.id);
            if (i >= 0) {
              if (
                oldBlocks[i].type !== b.type || oldBlocks[i].content !== b.content || oldBlocks[i].position !== b.position
              )
                up.push(b);
              oldBlocks = oldBlocks.filter((x) => x.id !== b.id);
            }
          }
        }
      
        return { add: add, del: oldBlocks, up: up };
    }

    const changeUp = (ToUp) => {//zero in prima posizione
        if (ToUp.position == 0) {
            return;
        }
        const swapDown = componentsListNew.find(e => e.position === parseInt(ToUp.position - 1))//trovo elemento sopra da portare giù
        let swapUpEl = { ...ToUp, position: ToUp.position - 1 }
        let swapDownEl = { ...swapDown, position: swapDown.position + 1 }
        //content da swappare giu

        setComponentsListNew((oldList) => oldList.map((e) => {
            if (e.position === swapDown.position)
                return swapUpEl //porto su elemento
            if (e.position === ToUp.position)
                return swapDownEl //porto giù elemento
            else
                return e;
        }))

    }
    const changeDown = (ToDown) => {
        if (ToDown.position == (componentsListNew.length - 1)) {
            return;
        }
        const swapUp = componentsListNew.find(e => e.position === parseInt(ToDown.position + 1))//trovo elemento sotto da portare sopra
        let swapUpEl = { ...swapUp, position: swapUp.position - 1 }
        let swapDownEl = { ...ToDown, position: ToDown.position + 1 }


        setComponentsListNew((oldList) => oldList.map((e) => {
            if (e.position === swapDownEl.position)
                return swapDownEl //porto su elemento
            if (e.position === ToDown.position)
                return swapUpEl //porto giù elemento
            else
                return e;
        }))
    }

    const removeComponents = (ToRemove) => {

        setComponentsListNew((oldlist) =>
            oldlist.filter((e) => e.position !== ToRemove.position)
        )

        setComponentsListNew((oldlist) => oldlist.map((e) => {
            if (e.position > ToRemove.position)
                return { ...e, position: e.position - 1 }//se elemento appena aggiunto risetto added a
            else
                return e
        }
        ))
    }

    const getMaxPos = () => {
        let positions = componentsListNew.map((e) => e.position)
        let max = Math.max(...positions) + 1

        if (max === -Infinity)
            return 0
        else
            return max
    }

    const changeComponentType=(newType,position)=>{
        setComponentsListNew((old)=>old.map((c)=>{
            return c.position==position?{...c,type:newType,content:""}:c
        }))
    }

    const changeComponentContent=(newContent,position)=>{
        setComponentsListNew((old)=>old.map((c)=>{
            return c.position==position?{...c,content:newContent}:c
        }))
    }

    const handleChangeAuthor=(newAuthor, newId)=>{
        setAuthor(newAuthor);
        setPage((old)=>({...old, userid: newId}))
    }

    return (
        <Form>
            <Form.Group>
                <Row>
                    <Col>
                        <Form.Label>Title</Form.Label>
                        <Form.Control className="border border-dark" type="text" value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })}></Form.Control>
                    </Col>
                    <Col xs={1}>
                        <Form.Label>Author</Form.Label>{
                            props.user.role=="admin"?
                            <DropdownButton id="dropdown-basic-button" title={author} variant="outline-secondary" >
                                 {users && users.map((p,ind)=><Dropdown.Item key={ind} onClick={()=> handleChangeAuthor(p.name, p.id)}>{p.name}</Dropdown.Item>)}
                            </DropdownButton>:
                        <Form.Control className="border border-dark" type="text"
                            value={author} readOnly={true}></Form.Control>}
                    </Col>
                    <Col>
                        <Form.Label>Creation Date</Form.Label>
                        <Form.Control className="border border-dark" type="date"
                            value={page.creationdate} readOnly={true}></Form.Control>
                    </Col>
                    <Col>
                        <Form.Label>Publication Date</Form.Label>
                        <Form.Control className="border border-dark" type="date" value={page.publicationdate}
                            onChange={(e) => setPage({ ...page, publicationdate: dayjs(e.target.value).format("YYYY-MM-DD") })}></Form.Control>
                    </Col>
                </Row>
                {componentsListNew.map((e, ind) => <MyFormRow key={ind} e={e} changeComponentType={changeComponentType} changeComponentContent={changeComponentContent} changeUp={changeUp} changeDown={changeDown} removeComponents={removeComponents} imageNames={imageNames}/>)}

                {add ? <AddContent setAdd={setAdd} setComponentsListNew={setComponentsListNew} 
                        componentsListNew={componentsListNew} setError={setError} pageToEdit={pageToEdit} 
                        getMaxPos={getMaxPos} imageNames={imageNames}/>
                    : <><Button style={{ marginTop: "2rem" }} onClick={() => setAdd(true)}>Add Content</Button>
                        <Button variant="success" style={{ marginTop: "2rem", marginLeft: "2rem" }} onClick={() => validatePage()}><CiSaveDown2 size={25} />{pageToEdit ? "Save Page" : "Add Page"}</Button>
                        <Button variant="danger" style={{ marginTop: "2rem", marginLeft: "2rem" }} onClick={()=>navigate("/backoffice")}>Cancel</Button>
                    </>}
                {error ? <Alert onClose={() => setError("")} dismissible>{error}</Alert> : <></>}
            </Form.Group>
        </Form>

    );
}

function MyFormRow(props) {
    const { e, changeComponentType,changeComponentContent} = props

    return (
        <Row>
            <Col xs={1}>
            <DropdownButton id="dropdown-basic-button" style={{ marginTop: "2rem" }} title={e.type} variant="outline-secondary" >
                <Dropdown.Item onClick={()=>changeComponentType("Header", e.position)}>Header</Dropdown.Item>
                <Dropdown.Item onClick={()=>changeComponentType("Paragraph",e.position)}>Paragraph</Dropdown.Item>
                <Dropdown.Item onClick={()=>changeComponentType("Image",e.position)}>Image</Dropdown.Item>
            </DropdownButton>
            </Col>
            <Col>
                {e.type!="Image"?<Form.Control style={{ marginTop: "2rem" }} className="border border-dark" type="text" value={e.content} onChange={(p)=>changeComponentContent(p.target.value,e.position)}></Form.Control>
                    :
                    <DropdownButton id="dropdown-basic-button" style={{ marginTop: "2rem" }} title={e.content?e.content:"Chose Image"} variant="outline-secondary" >
                        {props.imageNames && props.imageNames.map((p,ind)=><Dropdown.Item key={ind} onClick={()=>changeComponentContent(p.content, e.position)}>{p.content}</Dropdown.Item>)}
                </DropdownButton>
                }
            </Col>
            <Col>
                <Button style={{ marginTop: "2rem" }} onClick={() => props.changeUp(e)}><BsFillArrowUpSquareFill /></Button>
                <Button style={{ marginTop: "2rem", marginLeft: "1rem" }} onClick={() => props.changeDown(e)}><BsFillArrowDownSquareFill /></Button>
                <Button variant="danger" style={{ marginTop: "2rem", marginLeft: "1rem" }} onClick={() => props.removeComponents(e)}><BsTrashFill /></Button>
            </Col>
        </Row>
    )
}

function AddContent(props) {
    const [contentType, setContentType] = useState("")
    const [inputContent, setInputContent] = useState("")
    
    const validateContent = () => {
        if (contentType == "") {
            props.setError("Selezionare un tipo per il contenuto")
        }
        //Errore mutuamente esclusivi
        if (contentType != "") {
            if (inputContent != "") {
                props.setAdd(false);
                props.setComponentsListNew((oldList) => [...oldList, { type: contentType, content: inputContent, position: props.getMaxPos() }])//creo componente e lo inserisco in lista

            }
            else {
                props.setError("Il blocco che si vuole inserire ha contenuto vuoto")
            }
        }
    }
    return (<>
        <Row>
            <Col style={{ paddingTop: "2rem",paddingRight:"1rem" }} xs={1}>
                <DropdownButton id="dropdown-basic-button" style={{ marginTop: "2rem" }} title={contentType?contentType:"Chose Type"} variant="outline-secondary" >
                    <Dropdown.Item onClick={()=>{setContentType("Header");setInputContent("");}}>Header</Dropdown.Item>
                    <Dropdown.Item onClick={()=>{setContentType("Paragraph");setInputContent("");}}>Paragraph</Dropdown.Item>
                    <Dropdown.Item onClick={()=>{setContentType("Image");setInputContent("");}}>Image</Dropdown.Item>
                </DropdownButton>
            </Col>
            <Col xs={5}>

                {contentType == "Image" ? <>

                <DropdownButton id="dropdown-basic-button" style={{ marginTop: "4rem" }} title={inputContent?inputContent:"Chose Image"} variant="outline-secondary" >
                        {props.imageNames.map((p,ind)=><Dropdown.Item key={ind} onClick={()=>setInputContent(p.content)}>{p.content}</Dropdown.Item>)}
                </DropdownButton>

                </> : <>
                    <Form.Label style={{ marginTop: "2rem" }}>Content</Form.Label>
                    <Form.Control className="border border-dark" value={inputContent} type="text" onChange={(e) => setInputContent(e.target.value)}>
                    </Form.Control></>}

            </Col>
        </Row>
        <Row>
            <Col style={{ paddingTop: "2rem" }}>
                <Button onClick={() => validateContent()}>Confirm</Button>
                <Button style={{ marginLeft: "2rem" }} variant="danger" onClick={() => props.setAdd(false)}>Cancel</Button>
            </Col>
        </Row>
    </>
    )
}
export default MyForm;
