import express from 'express'
import { PORT } from '../config/config.js'
import routerUser from '../routes/user/index.js'
import routerLicense from '../routes/license/index.js'

const app = express()

app.use(express.json())

app.use('/api/users', routerUser)
app.use('/api/licenses', routerLicense)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
