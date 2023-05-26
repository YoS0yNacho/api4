var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require("md5")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});


app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});


app.post("/api/user/", (req, res, next) => {
    var errors=[]
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        nombre: req.body.nombre,
        email: req.body.email,
        documento: req.body.documento,
        telefono:  req.body.telefono,
 		direccion: req.body.direccion,
		valor:     req.body.valor,
		concepto:  req.body.concepto,
    }
    var sql ='INSERT INTO user (nombre, email, documento, telefono, direccion, valor, concepto) VALUES (?,?,?,?,?,?,?)'
    var params =[data.nombre, data.email, data.documento, data.telefono, data.direccion, data.valor, data.concepto]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})



app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        nombre: req.body.nombre,
        email: req.body.email,
        documento: req.body.documento,
        telefono:  req.body.telefono,
 		direccion: req.body.direccion,
		valor:     req.body.valor,
		concepto:  req.body.concepto,
    }
    db.run(
        `UPDATE user set 
           nombre = coalesce(?,nombre), 
           email = COALESCE(?,email),
           documento = COALESCE(?,documento),
           telefono = COALESCE(?,telefono),
           direccion = COALESCE(?,direccion),
           valor = COALESCE(?,valor),
           concepto = COALESCE(?,concepto)		   
           WHERE id = ?`,
        [data.nombre, data.email, data.documento, data.telefono, data.direccion, data.valor, data.concepto, req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data
            })
    });
})


app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
    });
})


// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

