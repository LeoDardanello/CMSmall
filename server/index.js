'use strict';
const express = require('express');
const morgan = require("morgan");
const cors=require("cors");
const passport = require('passport'); // auth middleware
const session = require('express-session'); // enable sessions
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const { check, validationResult } = require("express-validator");
const DAO=require("./DAO");
const userQuery=require("./DAO_user")

// init express
const app = new express();
const port = 3001;
app.use(morgan("dev"))
app.use(express.json())
app.use(express.static('public'))

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
  };
app.use(cors(corsOptions));

passport.use(new LocalStrategy(
    function verify(username, password, done) {
        userQuery.getUser(username, password).then((user) => {
        if (!user)
          return done(null, false, { message: 'Incorrect username and/or password.' }); 
        return done(null, user);
      })
    }
  ));
  
  app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'wge8d239bwd93rkskb',//secret, shhhhhhhh!!!!!
    resave: false,
    saveUninitialized: false 
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);

  });

passport.deserializeUser((id, done) => {
    userQuery.getUserById(id)
      .then(user => {
        done(null, user);
      }).catch(err => {
        done(err, null);
      });
  }); 

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    return res.status(401).json({ error: 'Not authenticated'});
  } 

const verifyAuth = (req, verify) => {
    if (verify.type == "One") {
      if (req.user.role !== "admin" && req.user.id !==verify.id) {
        return { error: "User not authorized" };
      }
    }
    if (verify.type == "admin" && req.user.role !== "admin")
      return { error: "Not an admin" };
  };

  app.use(passport.initialize());
  app.use(passport.session());



app.get("/api/pages",async (req, res) => {
  try { 
      const result = await DAO.getPages();
      if (result.error)                        
          res.status(404).json(result);
      else
          res.json(result);
  }
  catch (err) {
      res.status(500).end();
  }
});

app.get("/api/:pageid/getcontents",async (req, res) => {
  try { 
      const result = await DAO.getPageContents(req.params.pageid);
      if (result.error)                                          
          res.status(404).json(result);
      else
          res.json(result);
  }
  catch (err) {
      res.status(500).end();
  }
});

app.get("/api/getimagenamesanduser",isLoggedIn,async (req, res) => {
  try { 
      const result = await DAO.getAllImages();
      if (result.error)                                           
          res.status(404).json(result);
      else{
        const result2= await DAO.getUserName();
          if(result2.error){
            res.status(404).json(result2);
          }else{
            res.json({image: result,userList: result2})
          }
          
      }
  }
  catch (err) {
      res.status(500).end();
  }
});

app.get("/api/getsitetitle",async (req, res) => {
  try { 
      const result = await DAO.getSiteTitle()
      if (result.error)                                           
          res.status(404).json(result);
      else
          res.json(result);
  }
  catch (err) {
      res.status(500).end();
  }
});

app.post("/api/add",isLoggedIn, [check("title").isString().isLength({min:1}),check("creationdate").notEmpty(),check("userid").isInt()],
async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({error: error.array()})
    }
    const errorPermission = verifyAuth(req, {
      type: "One",
      id: req.body.userid,
    });
    if (errorPermission) return res.status(401).json(errorPermission);
    const page={
        userid:req.body.userid,
        title:req.body.title,
        creationdate:req.body.creationdate,
        publicationdate:req.body.publicationdate,
    }
    try{
        const newPageId= await DAO.addPage(page)
        res.status(201).json(newPageId)
    }
    catch(err){
        res.status(503).json("errore nella creazione della pagina")
    }
})

app.post("/api/add/content",isLoggedIn,[check("type").isString().isLength({min:1}),
                  check("content").isString().isLength({min:1}),check("pageid").isInt(),check("position").isInt()],
async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({error: error.array()})
    }
    const content={
            type:req.body.type,
            content:req.body.content,
            pageid:req.body.pageid,
            position:req.body.position
        }
    try{
        const newContentId= await DAO.addContent(content)
        res.status(201).json(newContentId)
    }
    catch(err){
        res.status(503).json("errore nella caricamento dei contenuti")
    }
})

app.delete("/api/delete/:id",isLoggedIn,async(req,res)=>{

  const page = await DAO.getPageById(req.params.id);
  if (page.length!==0) {//se la pagina non esiste la lista è vuota, ritorno 404
    const error = verifyAuth(req, {
      type: "One",
      id: page[0].userid,//estraggo pagina dalla lista che ritorna il DAO
    });
    if (error) return res.status(401).json(error);
  } else return res.status(404).json({ error: "Pagina non trovata" });
    try{
        const changes=await DAO.deletePage(req.params.id)
        res.json(changes);
    }
    catch(err){
        res.status(500).json("errore nella rimozione della pagina")
    }
})

app.delete("/api/deletecontent/:id",isLoggedIn,async(req,res)=>{
    try{
        const changes=await DAO.deleteContent(req.params.id)
        res.json(changes);
    }
    catch(err){
        res.status(500).json("errore nella rimozione del contenuto")
    }
})

app.put("/api/edit/:id",isLoggedIn,[check("id").isInt(),check("userid").isInt(),check("title").isString().isLength({min: 1}),check("creationdate").notEmpty()],
async(req,res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const pageToCheck = await DAO.getPageById(req.params.id);
    if (pageToCheck.length!==0) {//se lista è vuota la pagina non esiste, ritorno 404
      const error = verifyAuth(req, {
        type: "One",
        id: pageToCheck[0].userid,//la chiamata al DAO ritorna una lista, estraggo elemento
      });
      if (error) return res.status(401).json(error);
    } else return res.status(404).json({ error: "Pagina non trovata" });

  const page={
    id:req.params.id,
    userid:req.body.userid,
    title:req.body.title,
    creationdate:req.body.creationdate,
    publicationdate:req.body.publicationdate
}
try {
    const changes=await DAO.editPage(page)
    res.json(changes);
}
catch(err){
    res.status(500).json("errore nel editing della pagina")
}
})

app.put("/api/editcontent/:id",isLoggedIn,[check("id").isInt(),check("type").isString(),check("content").isString(),
                                            check("pageid").isInt(),check("position").isInt()],
async(req,res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  const content={
    id:req.params.id,
    type:req.body.type,
    content:req.body.content,
    pageid:req.body.pageid,
    position:req.body.position
}
try {
    const changes=await DAO.editContent(content)
    res.json(changes);
}
catch(err){
    res.status(503).json("errore nel editing della pagina")
}
})


app.put("/api/editsitetitle",isLoggedIn,[check("title").isString().isLength({min:1})],
async(req,res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
try {

    const error= verifyAuth(req, {type: "admin"})//controllo permessi lato server
    if(error)return res.status(401).json(error)

    const changes=await DAO.editSiteTitle(req.body.title)
    res.json(changes);
}
catch(err){
    res.status(500).json("errore nel editing del titolo della pagina")
}
})

app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          return res.status(401).json(info);
        }
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.json(req.user);
        });
    })(req, res, next);
  });

  //Per controllare se l'utente è autenticato
app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Utente non autenticato'});;
});

//log out
app.delete('/api/sessions/current', (req, res) => {
  req.logout( ()=> { res.end(); } );
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
  