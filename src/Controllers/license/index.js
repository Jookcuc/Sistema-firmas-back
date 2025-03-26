import { generateLicense } from "../../models/license/index.js"

export const createLicense = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ message: 'Se requiere el ID del usuario' })
    }

    const license = await generateLicense(userId)
    res.status(201).json(license)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al generar la licencia' })
  }
}
