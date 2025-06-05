const express = require('express')
const router = require('./router')
const cookieParser = require("cookie-parser")
const cors = require('cors')

const app = express()

// app.use(cors({
//     origin: [
//         'http://127.0.0.1:5173',
//         'capacitor://localhost',  
//         'http://localhost',
//         'http://192.168.0.2:5173',
//         'https://localhost'
//     ]
// }))
app.use(cors({
  origin: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.listen(3333, '0.0.0.0', () => console.log('Server running on port 3333'))