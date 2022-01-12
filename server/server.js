const express = require('express')
const mysql = require('mysql')
const dbconfig = require('./config/db')
const connection = mysql.createConnection(dbconfig)

const app = express()
const fs = require('fs')
const ejs = require('ejs')

app.use(express.static('./views'))

app.get('/', (req, res) => {
  fs.readFile('./views/index.html', 'utf-8', (err, data) => {
    res.writeHead(200, { Content_Type: 'text/html' })
    res.end(ejs.render(data))
  })
})

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM Users', (err, data) => {
    if (!err) res.send({ products: data })
    else res.send(err)
  })
})
/*
//DB INSERT
let sql = 'INSERT INTO users (name,email,password,roles) VALUES(?,?,?,?)'
let params = ['test', 'test@hanmail.net', 'dh111111', 'user']

db.query(sql, params, function (err, rows, fields) {
  if (err) {
    console.log(err)
  } else {
    console.log(rows.insertId)
  }
})
*/

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`)
})
