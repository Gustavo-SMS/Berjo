const express = require('express')
const router = require('./router')
const cors = require('cors')

const app = express()

app.use(cors({
    origin: '*'
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(router)

app.listen(3333, () => console.log('Server running on port 3333'))