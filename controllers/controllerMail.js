require('dotenv').config()
const nodemailer = require('nodemailer')

const validator = require('validator')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const httpCode = require('@/utilities/httpCode')
const serviceResponse = require('@/services/serviceResponse')

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
  },
  async sendTicketMail ({ orderRes, memberRes }) {
    console.log('orderRes mail')
    console.log(orderRes)
    console.log('memberRes mail')
    console.log(memberRes)
    // 是否為 Email
    if (!validator.isEmail(memberRes.email)) {
      throw serviceResponse.error(httpCode.BAD_REQUEST, '信箱格式錯誤')
    }
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_AUTH_CLIENTID,
      process.env.GOOGLE_AUTH_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    )

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_AUTH_REFRESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'uh584697213@gmail.com',
        clientId: process.env.GOOGLE_AUTH_CLIENTID,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
        accessToken
      }
    })
    const html = `
  <div style="width:600px; margin: 10px auto;">
    <div style="padding:10px 10px;">
      <p style="color: #282828;">Hi ! ${memberRes.nickName} :</p>
      <p style="line-height: 24px; color: #626262;font-size: 14px;">
      您已購票成功，預祝您有個愉快的體驗。有任何相關問題，
        <span>
        <a href="#" style="text-decoration: none; color: #008CD6">請聯絡客服</a>。
        </span>
      </p>
    </div>
    
    <div>
      <div style="margin: 5px 10px; border: solid 1px #bbb; padding: 20px;">
        <div style="margin: 20px 0;">
            <span style="">第 1 張票，共 1 張</span>
            <hr />
        </div>
        <div style="">
            <p style="color: #282828">購票人：</p>
            <p style="color: #999999; font-size: 18px;"> ${memberRes.nickName}</p>
        </div>
        <div style="">
          <p style="line-height: 12px;">
              票號：
              <strong>${orderRes._id}</strong>
          </p>
          <p style="line-height: 12px;">
              票券名稱：
  <strong>${orderRes.ItemDesc}</strong>                        
          </p>
          <p style="line-height: 12px;">
              票券可使用時間：
                  <span style="font-weight:600">${orderRes.date} ${orderRes.time}</span>
          </p>
          <p style="line-height: 12px;">
              座位：
                  <span style="font-weight:600">${orderRes.position.join(' , ')}</span>
          </p>
          <p style="line-height: 12px;">
              總價：
                  <span style="font-weight:600">${orderRes.price}}</span>
          </p>
          <a href="#" style="text-decoration: none;">
              <div style="width: 40%; line-height: 50px; text-align: center; background-color: #0088d2; border-radius: 10px; margin-bottom: 5px;">
                  <span style="color: aliceblue; font-size: 16px; font-weight: 800;">App取票</span>
              </div>
          </a>        
        </div>

        
        </div>
        <div style="margin: 20px 10px; background-color: #DDD; color: #0088d2; padding: 10px 20px; border-bottom-right-radius: 30px;">
          <p style="font-size: 16px;">注意事項</p>
          <p style="line-height: 20px;">為配合政府防疫政策，請遵守以下規定：</p>
          <ul style="list-style:none; padding:0">
            <li style="margin:8px 0px">▹ 進入本次活動場地，請全程戴口罩</li>
            <li style="margin:8px 0px">▹ 如額溫超過 37.5 度或未配戴口罩，主辦方有權利禁止入場</li>
            <li style="margin:8px 0px">▹ 場地內全面禁止飲食</li>
          </ul>
        </div>
  
        <div style="padding: 20px 10px;">
          <p style="font-weight: 600; color: #282828">票券使用須知 Terms of Service</p>
          <ol>
            <li style="color: #989898; line-height: 24px; margin-bottom: 10px;">
                每張票券僅限該電影場次使用，恕無法持任何其他憑證要求入場。
            </li>
            <li style="color: #989898; line-height: 24px; margin-bottom: 10px;">
                票券有效狀態依 瘋影票 系統驗證結果為準，影院有最終解釋權。
            </li>
            <li style="color: #989898; line-height: 24px; margin-bottom: 10px;">
                有關票券時間、注意事項等相關問題，請 <a href="#" style="text-decoration: none; color: #008CD6">洽詢客服單位</a>。
            </li>
            <li style="color: #989898; line-height: 24px; margin-bottom: 10px;">
                若您符合退票條件且需要進行退票，請詳<a href="#" style="text-decoration: none; color: #008CD6"> 退票說明 </a>。
            </li>
          </ol>
          </div>
          <div style="text-align:center; ">Copyright © 2023. crazymovie, All rights reserved.</div>
  `

    const mailOptions = {
      from: '瘋影票 <crazymovie@gmail.com>',
      // to: `${memberRes.email}`,
      to: 'uh584697213@gmail.com',
      subject: '訂票成功',
      html
    }

    const result = await transporter.sendMail(mailOptions)
    return result
  }
}

module.exports = controllerMail
