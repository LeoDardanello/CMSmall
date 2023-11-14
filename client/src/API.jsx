"use strict";

const URL = "http://localhost:3001/api";

async function getPages() {
    const response = await fetch(URL +"/pages");
    const pages = await response.json();
    if (response.ok) {
        return pages.map((e)=>({id:e.id,userid:e.userid,name:e.name,title:e.title,creationdate:e.creationdate,publicationdate: e.publicationdate}))
    } else {
      throw pages;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
  }

  async function getPageContent(pageid) {
    const response = await fetch(URL +`/${pageid}/getcontents`);
    const contents = await response.json();
    if (response.ok) {
        return contents.map((e)=>({id:e.id,type:e.type,content:e.content,pageid:e.pageid,position:e.position}))
    }else{
      throw contents;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
  }
 //get ALL images name, content field

async function getImagesNameAndUsers() {
  const response = await fetch(URL +"/getimagenamesanduser",{
    method:"GET",
    credentials: 'include',
    headers:{'Content-Type':'application/json'}
  });
  const imagesAndUsers = await response.json();
  if (response.ok) {
      return imagesAndUsers
  }else{
    throw imagesAndUsers;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function addNewPage(pageToAdd){
  const response = await fetch(URL+`/add`,{
    method:'POST',
    credentials: 'include',
    headers:{'Content-Type':'application/json',
  },
    body:JSON.stringify(pageToAdd),
  })
  if(response.ok){
    const addedPage= await response.json()
    return addedPage //ritorno la pagina che ho aggiunto
  }
  else{
    const message= await response.json()
    throw new Error(message) // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getSiteTitle() {
  const response = await fetch(URL +"/getsitetitle");
  const result = await response.json();
  if (response.ok) {
      return result
  } else {
    throw result;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}


async function addNewPageContent(contentToAdd){
  const response = await fetch(URL+`/add/content`,{
    method:'POST',
    credentials: 'include',
    headers:{'Content-Type':'application/json',
  },
    body:JSON.stringify(contentToAdd),
  })
  if(response.ok){
    const addedContent= await response.json()
    return addedContent//ritorno la pagina che ho aggiunto
  }
  else{
    const message= await response.json()
    throw new Error(message) // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function deletePage(PageToDelete){
  const response = await fetch(URL+`/delete/${PageToDelete.id}`,{
    method:'DELETE',
    credentials: 'include',
    headers:{'Content-Type':'application/json',
  }})
  if(response.ok){
    const result= await response.json()
    return result 
  }
  else{
    const message= await response.json()
    throw new Error(message) // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function deleteContent(ContentToDelete){
  const response = await fetch(URL+`/deletecontent/${ContentToDelete.id}`,{
    method:'DELETE',
    credentials: 'include',
    headers:{'Content-Type':'application/json',
  }})
  if(response.ok){
    const result= await response.json()
    return result 
  }
  else{
    const message= await response.json()
    throw new Error(message) // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function editSiteTitle(newTitle){
  const response = await fetch(URL+`/editsitetitle`,{
    method:'PUT',
    credentials: 'include',
    headers:{'Content-Type':'application/json',
  },
    body:JSON.stringify({title: newTitle}),
  })
  if(response.ok){
    const newSiteTitle= await response.json()
    return newSiteTitle 
  }
  else{
    const message= await response.json()
    throw new Error(message) // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}



async function editPage(pageEdited){
  const response = await fetch(URL+`/edit/${pageEdited.id}`,{
    method:'PUT',
    credentials: 'include',
    headers:{'Content-Type':'application/json',
  },
    body:JSON.stringify(pageEdited),
  })
  if(response.ok){
    const editedPage= await response.json()
    return editedPage 
  }
  else{
    const message= await response.json()
    throw new Error(message) // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function editPageContent(contentEdited){
  const response = await fetch(URL+`/editcontent/${contentEdited.id}`,{
    method:'PUT',
    credentials: 'include',
    headers:{'Content-Type':'application/json',
  },
    body:JSON.stringify(contentEdited),
  })
  if(response.ok){
    const editedContent= await response.json()
    return editedContent 
  }
  else{
    const message= await response.json()
    throw new Error(message) // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function logIn(credentials){
  let response = await fetch(URL + '/sessions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(URL+'/sessions/current', {
    method: 'DELETE', 
    credentials: 'include' 
  });
}

  const API={getPages,getPageContent,getImagesNameAndUsers,addNewPage,deletePage,
    addNewPageContent,editPage,editPageContent,getSiteTitle,editSiteTitle,deleteContent,logIn,logOut}
  export default API;