import bcrypt from "bcryptjs";
import { createUser, getUsers } from "../../models/user/index.js";
import { sendVerificationEmail } from "../../Services/emailService/index.js";


const pendingUsers = new Map();

export const registerUser = async (req, res) => {
  try {
    const { first_name, lastname, email, password, productKey, signature } = req.body;

    if (!first_name || !lastname || !email || !password || !productKey || !signature) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    pendingUsers.set(email, { first_name, lastname, email, hashedPassword, productKey, signature, verificationCode });
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

    if (pendingUser.verificationCode !== code) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    console.log(pendingUser);

    const user = await createUser(
      pendingUser.first_name,
      pendingUser.lastname,
      pendingUser.email,
      pendingUser.hashedPassword,
      pendingUser.signature
    );

    pendingUsers.delete(email);

    res.status(201).json({ message: "Usuario registrado exitosamente", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al verificar el código" });
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
}
