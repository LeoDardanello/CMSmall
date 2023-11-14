## Student: s319060 DARDANELLO LEONARDO

## React Client Application Routes

- Route `/`: pagina iniziale, mostra il frontoffice
- Route `/backoffice`: pagina a cui si accede dopo essersi loggati, mostra i contenuti del backoffice
- Route `/page/:id`:  visulizzazione dei contenuti delle pagine del sito
- Route `/add`: pagina per la creazione di una nuova pagina 
- Route `/edit/:id`: pagina per la modifica di una pagina 
- Route `/login`: pagina per effettuare il login

## API Server

POST `/api/session`
  - Permette di eseguire il login di un utente.
  - Request body: //
  - Response: `200 OK` (in caso successo), `401 Unauthorized` (in caso di credenziali errate).
  - Response body: un oggetto contenente le informazioni relative l'utente appena loggato
    {
      "id": 1,
      "username": "harry@email.it",
      "name": "Harry",
      "role": "admin"
    }

 DELETE `/api/sessions/current`
  - Permette di eseguire il logout di un utente.
  - Request body: //
  - Response: `200 OK` (in caso successo), `500 Internal Server Error` (errore generico)
  - Response body: //

GET `/api/sessions/current`
  - Permette di ottenere le informazioni sull'utente attualmente autenticato
  - Request body://
  - Response: `200 OK` (in caso successo), `401 Unauthorized` (utente non autenticato)
  - Response body: un oggetto contenente le informazioni sullo user loggato
    {
      "id": 1,
      "name": "Harry",
      "role": "admin
    }

GET `/api/pages`
  - viene usata per ottenere le informazioni sulle pagine, NON è riservata agli utenti loggati
  - Request body: //
  - Response: `200 OK` (successo), `404 Not Found`,`500 Internal Server Error` (errore generico)
  - Response body: una lista di oggetti ognuno dei quali contiene le informazioni relative ad ogni pagina
    [
      {
        "id": 1,
        "userid": 1,
        "title": "Page1"
        "creationdate": "2023-06-07",
        "publicationdate": NULL,
        "name":"Harry"
      },
      ...
    ]
  
GET `/${pageid}/getcontents`
  - viene usata per ottenere le informazioni sui blocchi delle pagine in ordine rispetto alla posizione, NON è riservata agli utenti loggati
  - Request body: //
  - Response: `200 OK` (successo), `404 Not Found`,`500 Internal Server Error` (errore generico)
  - Response body: una lista di oggetti contenenti le informazioni sui blocchi della pagina avente id passato come  parametro
[ 
  {
    "id":7
    "type":"Header"
    "content":"Questo è un Header"
    "pageid":3
    "position":1
  }
    {
    "id":5
    "type":"Image"
    "content":"car.jpg"
    "pageid":3
    "position":0
  }
]
GET `/api/getimagenamesanduser"`
  - viene usata per ottenere le informazioni sui nomi delle immagini presenti nel db e sui nomi degli utenti
  - Request body: //
  - Response: `200 OK` (successo), `404 Not Found`,`500 Internal Server Error` (errore generico)
  - Response body: un oggetto con due campi, nel primo campo la lista dei nomi delle immagini mentre nel secondo la lista dei nomi degli utente
  {
    image:[
      {
        "content":car.jpg
      },
      {
        "content":city.jpg
      }
      ...
    ],
    userList:[
        {
          "name":Harry
        },
        {
          "name":Giovanni
        }
        ...
    ]
  }

GET `/api/getsitetitle`
  - viene usata per ottenere le informazioni sui nomi delle immagini presentu nel db e sui nomi degli utenti,
  - Request body: //
  - Response: `200 OK` (successo), `404 Not Found`,`500 Internal Server Error` (errore generico)
  - Response body:ritorno un oggetto contente il nome del sito da mostrare nella navbar
  {
    setting:name,title:CMSmall
  }

GET `/api/getsitetitle`
  - viene usata per ottenere le informazioni sui nomi delle immagini presenti nel db e sui nomi degli utenti
  - Request body: //
  - Response: `200 OK` (successo), `404 Not Found`,`500 Internal Server Error` (errore generico)
  - Response body:ritorno un oggetto contente il nome del sito da mostrare nella navbar
  {
    setting:name,title:CMSmall
  }

POST `/api/add`
  - viene usata per creare delle nuove pagine,
  - Request body: //
  - Response: `201 Created` (successo),`401 Not Authorized`(non loggato), `422 Unprocessable Entity`(Errore nei parametri del body),`500 Internal Server Error` (errore generico)
  - Response body: //

POST `/api/add/content`
  - viene usata per creare dei nuovi blocchi per una pagina
  - Request body: //
  - Response: `201 Created` (successo),c`422 Unprocessable Entity`(Errore nei parametri del body),`500 Internal Server Error` (errore generico)
  - Response body: //

DELETE `/api/delete/:id`
  - viene usata per eliminare le pagine
  - Request body: //
  - Response: `401 Not Authorized`(non loggato), `404 Not Found`(La pagina da cancellare non esiste),`500 Internal Server Error` (errore generico)
  - Response body: //

DELETE `/api/deletecontent/:id`
  - viene usata per eliminare i blocchi delle pagine
  - Request body: //
  - Response:`401 Not Authorized`(non loggato), `404 Not Found`(La pagina da cancellare non esiste),`500 Internal Server Error` (errore generico)
  - Response body: //

PUT `/api/edit/:id`
  - viene usata per aggiornare la pagina avente come id il parametro passato 
  - Request body: //
  - Response: `422 Unprocessable Entity`(Errore nei parametri del body),`500 Internal Server Error` (errore generico),changes(in caso di successo)
  - Response body: //

PUT `/api/editcontent/:id`
  - viene usata per aggiornare il blocco avente come id il parametro passato
  - Request body: //
  - Response: `422 Unprocessable Entity`(Errore nei parametri del body),`500 Internal Server Error` (errore generico),changes(in caso di successo)
  - Response body: //

PUT `/api/editsitetitle`
  - viene usata per aggiornare il nome del sito
  - Request body: //
  - Response: `422 Unprocessable Entity`(Errore nei parametri del body),`500 Internal Server Error` (errore generico),changes(in caso di successo)
  - Response body: //



## Database Tables
 Table `pages` (`id`,`userid`,`title` TEXT NOT NULL,`creationdate` DATE NOT NULL,`publicationdate`);
 Table `users` (`id`,`email`,`name`,`salt`,`password`,`role`);
 Table `contents` (`id`,`type`,`content`,`pageid`,`position`);
 Table `images` (`id`,`content`);
 Table `siteTitle`(`setting`,`title`);


## Main React Components

- `MyTable` (in `table.jsx`): tabella per visualizzare le pagine e le informazioni relative
- `MyForm` (in `InputForm.jsx`): componenete per gestire l'inserimento e l'editing delle pagine
- `LogInCard`(in `login.jsx`): componente per la effettuare il login
- `MyPage`(in `page.jsx`): componente per visualizzare le pagine create all'interno di una card
- `MyNavBar`(in `navbar.jsx`): componente che include il pulsante per il login e quello per passare da 
                               frontoffice e backoffice


(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/home.jpg)
![Screenshot](./img/add.jpg)
## Users Credentials

- username, password (plus any other requested info)
- harry@email.it, pwd , admin
- giovanni@email.it, pwd , regular
- antony@email.it, pwd , admin
- jeremiah@email.it, pwd , regular
