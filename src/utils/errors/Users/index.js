export const ERROR_CODES = {
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    message: 'Ya existe un usuario registrado con este correo electrónico'
  },
  VERIFICATION_CODE_EXPIRED: {
    code: 'VERIFICATION_CODE_EXPIRED',
    message: 'El código de verificación ha expirado. Solicite uno nuevo.'
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Correo electrónico o contraseña incorrectos'
  },
  UNVERIFIED_USER: {
    code: 'UNVERIFIED_USER',
    message: 'Por favor, verifica tu cuenta antes de iniciar sesión'
  }
}