import { Router } from 'express'
import { createLicense } from '../../Controllers/license/index.js'

const routerLicense = Router()

routerLicense.post('/generate', createLicense)

export default routerLicense
