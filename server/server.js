const PORT = process.env.PORT ?? 8000
const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')
const { v4 : uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

app.get('/todos/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail
    try {
        const todos = await pool.query(
            'SELECT * FROM todos WHERE user_email = $1', [userEmail]
        )
        res.json(todos.rows)
    } catch (err) {
        console.log(err)
    }
})

app.post('/todos', (req, res) => {
    const { user_email, title, progress, date } = req.body
    const id = uuidv4()
    try {
        pool.query(
            `INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5);`, 
            [id, user_email, title, progress, date]
        )
    } catch (err) {
        console.error(err)
    }
})

app.put('/todos/:id', async(req, res) => {
    const { id } = req.params
    const { user_email, title, progress, date } = req.body

    try {
        await pool.query(
            `UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;`,
            [user_email, title, progress, date, id]
        )
    } catch (err) {
        console.error(err)
    }
})

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params
    try {
        await pool.query('DELETE FROM todos WHERE id = $1', [id])
    } catch (err) {
        console.error(err)
    }
})

app.post('/signup', async (req, res) => {
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hash(password, salt)
    try {
        const signup = await pool.query(
            `INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
            [email, hashedPassword]
        )

        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
        res.json({ email, token })
    } catch (error) {
        console.error(error)
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        
    } catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
