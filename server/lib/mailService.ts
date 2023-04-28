import { link } from 'fs';
import nodemailer from 'nodemailer';
const config = useRuntimeConfig()

const transporter = nodemailer.createTransport({
  service: 'Mail.ru',
  //   host: 'smtp.mail.ru',
  //   port: 465,
  //   secure: true,
  auth: {
    user: 'mr_flane@mail.ru',
    pass: 'M1fwVpi5WjVnyfrwnajn',
  },
});

export const sendConfirmationEmail = async (to: string | undefined, link: string) => {
  await transporter
    .sendMail({
      from: config.MAIL_USER,
      to,
      subject: 'Активация аккаунта на Advertisement-cab',
      text: '',
      html: `
                <div>
                    <h1>Для активации аккаунта перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
    })
    .then((info) => {
      console.log(info);
    });
};
