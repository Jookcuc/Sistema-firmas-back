import { Router } from 'express'
import { registerUser, listUsers, verifyUser } from '../../Controllers/user/index.js'

const routerUser = Router()

routerUser.post('/register', registerUser)
routerUser.post("/verify", verifyUser);
routerUser.get('/', listUsers)

export default routerUser
