import { Resend } from "resend";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend("re_Em95ijT1_BPebzTreNttUtsH3m4MG3S9x");

export const sendVerificationEmail = async (to, code) => {
  try {
    const imagePath = path.resolve(__dirname, 'jook.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    const response = await resend.emails.send({
      from: 'Jook <noreply@jookcucuta.online>',
      to: to,
      subject: "Verificación de cuenta en Jook",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src='https://i.postimg.cc/JGjpszr3/jook.png' border='0' alt='jook'/>
          </div>
          <div style="padding: 20px;">
            <p style="margin-bottom: 15px;">Estimado usuario:</p>
            <p style="margin-bottom: 15px;">Para completar la verificación de tu cuenta en ProyectoFirmas.com, usa el siguiente código:</p>
            <div style="background-color: #f2f2f2; display: inline-block; padding: 10px 20px; border-radius: 5px; font-size: 24px; margin: 20px 0;">
              ${code}
            </div>
            <p style="margin-top: 15px; font-size: 0.9em; color: #666;">
              Si no solicitaste este código, ignora este correo.
            </p>
            <p style="margin-top: 20px; font-size: 0.8em; color: #888;">Atentamente,<br>El equipo de Jook en relación con ProyectoFirmas.com</p>
          </div>
        </div>
      `
    });

    console.log("Correo enviado:", response);
    return response;
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
};
