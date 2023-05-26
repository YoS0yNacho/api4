var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre text, 
            email text UNIQUE,
            documento INTEGER,
            telefono  INTEGER,
 			direccion text,
			valor     INTEGER,
			concepto text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,(err) => {
        if (err) {
            // Table already created
        }else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO user (nombre, email) VALUES (?,?,?)'
            db.run(insert, ["admin","admin@example.com", 12345678, 44444444, "dir 123", 1000, "concepto"])
            db.run(insert, ["user","user@example.com", 12345678, 44444444, "dir 123", 1000, "concepto"])
        }
    })  
    }
})


module.exports = db

