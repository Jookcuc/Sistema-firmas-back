import express from 'express'
import { PORT } from '../config/config.js'

const app = express()

app.get('/', async (req, res) => {
  console.log('nadasssss')
})

app.listen(PORT)
console.log('Server on port', PORT)