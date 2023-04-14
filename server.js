const express = require('express')
const bodyParser = require('body-parser')
// const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const db = {
    users: [
        {
            id: 123,
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: 124,
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(db.users)
})

app.post('/signin', (req, res) => {
    if (req.body.email === db.users[0].email && req.body.password === db.users[0].password) {
        res.json('success')
    } else {
        res.status(400).json('error logging in')
    }
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body
    const newUser = {
        id: 126,
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    }
    db.users.push(newUser)
    res.json(newUser)
})

app.get('/profile/:id', (req, res) => {
    let { id } = req.params
    id = parseInt(id)
    const user = db.users.filter(user => {
        return id === parseInt(user.id)
    })
    user.length !== 0 ? res.json(user) : res.status(404).json('user not found')
})

app.put('/image', (req, res) => {
    let { id } = req.body
    id = parseInt(id)
    const user = db.users.filter(user => {
        return id === parseInt(user.id)
    })
    if (user.length > 0) {
        user[0].entries++
        res.json(user[0].entries)
    } else {
        res.status(404).json('user not found')
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000')
})
