const express = require('express')
const mysql = require('mysql2/promise')
const dbconfig = require('./config/db')
const pool = mysql.createPool(dbconfig)

const app = express()
const fs = require('fs')
const ejs = require('ejs')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('./views'))

app.get('/', (req, res) => {
  fs.readFile('.views/login.html', 'utf-8', (err, data) => {
    res.writeHead(200, { Content_Type: 'text/html' })
    res.end(ejs.render(data))
  })
})
app.get('/myplan', (req, res) => {
  fs.readFile('.views/index.html', 'utf-8', (err, data) => {
    res.writeHead(200, { Content_Type: 'text/html' })
    res.end(ejs.render(data))
  })
})

const toDoRouter = express.Router()
app.use('/todos', toDoRouter)

toDoRouter.param('id', async (req, res, next, value) => {
  console.log(value)
  let [data, nothing] = await pool.query(
    `SELECT * FROM Timelines WHERE time='${value}'`
  )
  if (data[0] === undefined) {
    let temp = `INSERT INTO Timelines (time) VALUES('${value}')`
    await pool.query(temp)
    let [ndata, nothing] = await pool.query(
      `SELECT * FROM Timelines WHERE time='${value}'`
    )
    data = ndata
  }
  console.log(data)
  req.data = data[0]
  next()
})

toDoRouter.get('/:id', async (req, res) => {
  try {
    const data = req.data
    const todos = await pool.query(`SELECT * FROM Todos WHERE num='${data.id}'`)
    res.json(todos[0])
  } catch (err) {
    res.send(err)
  }
})

toDoRouter.post('/:id/add', async (req, res) => {
  try {
    const data = req.data.id
    const todo = req.body.todo
    const todos = await pool.query(
      `INSERT INTO Todos (num, todo) VALUES (${data}, '${todo}')`
    )
    res.json(todos)
  } catch (err) {
    res.send(err)
  }
})

toDoRouter.post('/:id/delete', async (req, res) => {
  try {
    const num = req.body.num
    const text = req.body.todo
    const id = await pool.query(
      `SELECT id FROM Todos WHERE todo='${text}' and num=${num}`
    )
    const todos = await pool.query(
      `DELETE FROM Todos WHERE id = ${id[0][0].id}`
    )
    res.json(todos)
  } catch (err) {
    res.send(err)
  }
})

toDoRouter.post('/:id/done', async (req, res) => {
  try {
    const num = req.body.num
    const text = req.body.todo
    const id = await pool.query(
      `SELECT id FROM Todos WHERE todo='${text}' and num=${num}`
    )
    const todos = await pool.query(
      `UPDATE Todos SET isdone = 1 WHERE id = ${id[0][0].id}`
    )
    res.json(todos)
  } catch (err) {
    res.send(err)
  }
})

toDoRouter.post('/:id/undone', async (req, res) => {
  try {
    const num = req.body.num
    const text = req.body.todo
    const id = await pool.query(
      `SELECT * FROM Todos WHERE todo='${text}' and num=${num}`
    )
    const todos = await pool.query(
      `UPDATE Todos SET isdone = 0 WHERE id = ${id[0][0].id}`
    )
    res.json(todos)
  } catch (err) {
    res.send(err)
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`)
})
