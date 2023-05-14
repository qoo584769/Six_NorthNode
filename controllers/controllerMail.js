require('dotenv').config()
const nodemailer = require('nodemailer')

const controllerMail = {
  async sendMail (email) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      secureConnecton: true,
      port: 587,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS_KEY
      }
    })

    const result = await transporter.sendMail({
      from: '瘋影票 <qoo584769@gmail.com>',
      to: `${email}`,
      // 副本
      // cc:'testaccount@gmail.com',
      // 密件副本
      // bcc:'testaccount2@gmail.com',
      subject: '測試信件123',
      text:
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
        //   + `https://codepen.io/fxq14103/pen/QWQZJaO/${token}\n\n`
        // `https://codepen.io/fxq14103/pen/QWQZJaO/515152\n\n` +
        '測試用' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      //   html: '',
      // 附加檔案 陣列
      attachments: [
        {
          filename: 'test.txt',
          content: '純文字附加檔案'
        }
        // {
        //   filename: 'mon1.png',
        //   path: `${path.join(__dirname, '../utilities/mon.png')}`,
        //   cid: '001'
        // }
      ]
    })
    // console.log(result)
    // res.status(200).json(result)
    return result
  }
}

module.exports = controllerMail
