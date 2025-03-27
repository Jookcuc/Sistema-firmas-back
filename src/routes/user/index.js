import { Router } from 'express'
import {
  registerUser,
  listUsers,
  verifyUser,
  resendVerificationCode,
  loginUser
} from '../../Controllers/user/index.js'
import { authMiddleware } from '../../utils/JWT/index.js'

const routerUser = Router()

routerUser.post('/register', registerUser)
routerUser.post("/verify", verifyUser)
routerUser.post("/resend-code", resendVerificationCode)
routerUser.post("/login", loginUser)
routerUser.get('/', authMiddleware, listUsers)

export default routerUser