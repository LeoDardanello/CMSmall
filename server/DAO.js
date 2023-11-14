'use strict';

const sqlite = require("sqlite3");

const db = new sqlite.Database('./CMS_db.sqlite', (err) => {
    if (err) throw err;
});

exports.getPages = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT pages.id,pages.userid,pages.title,pages.creationdate,pages.publicationdate,users.name FROM pages,users WHERE pages.userid=users.id "
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows)
        })
    })

}

exports.getPageById = (pageId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT pages.id,pages.userid,pages.title,pages.creationdate,pages.publicationdate,users.name FROM pages,users WHERE pages.userid=users.id AND pages.id=? "
        db.all(sql, [pageId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows)
        })
    })

}

exports.getPageContents = (pageid) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM contents where pageid=? ORDER BY position"
        db.all(sql, [pageid], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}
exports.getAllImages = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT content FROM  images `
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err)
                return;
            }
            resolve(rows);
        })
    })
}

exports.getSiteTitle = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM  siteTitle `
        db.get(sql, [], (err, rows) => {
            if (err) {
                reject(err)
                return;
            }
            resolve(rows);
        })
    })
}

exports.getUserName = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT name,id FROM  users `
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err)
                return;
            }
            resolve(rows);
        })
    })
}

exports.addPage=(page)=>{
    return new Promise((resolve,reject)=>{
        const sql="INSERT INTO pages(userid,title,creationdate,publicationdate) VALUES(?,?,DATE(?),DATE(?))";
        db.run(sql,[page.userid,page.title,page.creationdate,page.publicationdate],function(err){
            if(err){
                reject(err)
                return;
            }
            resolve(this.lastID)//ritorna ultimo id creato dal server
        })
    })
}

exports.addContent=(content)=>{
    return new Promise((resolve,reject)=>{
        const sql="INSERT INTO contents(type,content,pageid,position) VALUES(?,?,?,?)";
        db.run(sql,[content.type,content.content,content.pageid,content.position],function(err){
            if(err){
                reject(err)
                return;
            }
            resolve(this.lastID)//ritorna ultimo id creato dal server
        })
    })
}


exports.deletePage=(id)=>{
    return new Promise((resolve,reject)=>{
        const sql="DELETE FROM pages WHERE id=?";
        db.run(sql,[id],function(err){
            if(err){
                reject(err)
                return;
            }else{
                const sql="DELETE FROM contents WHERE pageid=?";
                db.run(sql,[id],function(err){
                    if(err){
                        reject(err)
                        return;
                    }
                    resolve(this.changes)
            })
            
        }})
    })
}
exports.deleteContent=(id)=>{
    return new Promise((resolve,reject)=>{
        const sql="DELETE FROM contents WHERE id=?";
        db.run(sql,[id],function(err){
            if(err){
                reject(err)
                return;
            }
            resolve(this.changes)//ritorna il numero di linee modificate
        })
    })
}

exports.editPage=(page)=>{
    return new Promise((resolve,reject)=>{
        const sql="UPDATE pages SET userid=?,title=?,creationdate=DATE(?),publicationdate=DATE(?) WHERE id=?";
        db.run(sql,[page.userid,page.title,page.creationdate,page.publicationdate,page.id],function(err){
            if(err){
                reject(err)
                return;
            }
            resolve(this.changes)
        })
    })
}

exports.editSiteTitle=(newTitle)=>{
    return new Promise((resolve,reject)=>{
        const sql='UPDATE siteTitle SET title=? WHERE setting="name" ';
        db.run(sql,[newTitle],function(err){
            if(err){
                reject(err)
                return;
            }
            resolve(this.changes)
        })
    })
}

exports.editContent=(content)=>{
    return new Promise((resolve,reject)=>{
        const sql="UPDATE contents SET type=?,content=?,pageid=?,position=? WHERE id=?";
        db.run(sql,[content.type,content.content,content.pageid,content.position,content.id],function(err){
            if(err){
                reject(err)
                return;
            }
            resolve(this.changes)
        })
    })
}