import bcrypt from "bcryptjs";
import { createUser, getUsers, getUserByEmail, findUserByEmail, verifyUserInDatabase } from "../../models/user/index.js";
import { sendVerificationEmail } from "../../Services/emailService/index.js";
import { ERROR_CODES } from "../../utils/errors/Users/index.js";
import { generateToken } from "../../utils/JWT/index.js";

const pendingUsers = new Map();

const generateVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const registerUser = async (req, res) => {
  try {
    const { first_name, lastname, email, password, productKey, signature } = req.body;

    if (!first_name || !lastname || !email || !password || !productKey || !signature) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(409).json(ERROR_CODES.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();
    const timestamp = Date.now();

    pendingUsers.set(email, {
      first_name,
      lastname,
      email,
      hashedPassword,
      productKey,
      signature,
      verificationCode,
      timestamp
    });

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: "Código enviado. Revisa tu correo para verificar tu cuenta." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar el código de verificación" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email y código son requeridos" });
    }

    const pendingUser = pendingUsers.get(email);
    if (!pendingUser) {
      return res.status(400).json({ message: "No se encontró una solicitud de registro para este correo" });
    }

    const currentTime = Date.now();
    if (currentTime - pendingUser.timestamp > 60000) {
      pendingUsers.delete(email);
      return res.status(400).json(ERROR_CODES.VERIFICATION_CODE_EXPIRED);
    }

    if (pendingUser.verificationCode !== code) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    const user = await createUser(
      pendingUser.first_name,
      pendingUser.lastname,
      pendingUser.email,
      pendingUser.hashedPassword,
      pendingUser.signature
    );

    // Verificar usuario en la base de datos
    const verifiedUser = await verifyUserInDatabase(email);

    pendingUsers.delete(email);

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: verifiedUser.id,
        first_name: verifiedUser.first_name,
        last_name: verifiedUser.last_name,
        email: verifiedUser.email,
        verified: verifiedUser.verified
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al verificar el código" });
  }
};

export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email es requerido" });
    }

    const pendingUser = pendingUsers.get(email);
    if (!pendingUser) {
      return res.status(400).json({ message: "No se encontró una solicitud de registro para este correo" });
    }

    const newVerificationCode = generateVerificationCode();
    pendingUser.verificationCode = newVerificationCode;
    pendingUser.timestamp = Date.now();

    await sendVerificationEmail(email, newVerificationCode);

    res.status(200).json({ message: "Nuevo código enviado. Revisa tu correo." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al reenviar el código de verificación" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, remember = false } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json(ERROR_CODES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json(ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Generar token
    const token = generateToken(user, remember);

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        verified: user.verified
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el inicio de sesión" });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await getUsers()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los usuarios' })
  }
};