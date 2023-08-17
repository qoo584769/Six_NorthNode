require('dotenv').config()
const express = require('express')
const router = express.Router()

const validator = require('validator')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const httpCode = require('@/utilities/httpCode')
const serviceResponse = require('@/services/serviceResponse')
const serviceError = require('@/services/serviceError')

const controllerMail = require('@/controllers/controllerMail')

// 寄信用
router.post('/', serviceError.asyncError(async (req, res, next) => {
  const { email } = req.body
  const result = await controllerMail.sendMail(email)
  console.log(result)
  serviceResponse.success(res, result)
}))

router.post('/personalMail', serviceError.asyncError(async (req, res, next) => {
  const { to, subject, text } = req.body
  // 內容不可為空
  if (!to || !subject | !text) {
    throw serviceResponse.error(httpCode.BAD_REQUEST, '欄位不可為空', next)
  }
  // 是否為 Email
  if (!validator.isEmail(to)) {
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
      <p style="color: #282828;">Hi ! 盧建成 :</p>
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
            <p style="color: #282828">參加人：</p>
            <p style="color: #999999; font-size: 18px;"> 盧建成</p>
        </div>
        <div style="">
          <p style="line-height: 12px;">
              票號：
              <strong>2212290557016483143790</strong>
          </p>
          <p style="line-height: 12px;">
              票券名稱：
  <strong>2023Yourator數位職涯博覽會｜重聚，邁向新未來 入場券</strong>                        
          </p>
          <p style="line-height: 12px;">
              票券可使用時間：
                  <span style="font-weight:600">2023-01-15(日)10:00 ~ 2023-01-15(日)17:00  (GMT+8)</span>
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
                有關票券時間、注意事項等相關問題，請 <a href="https://www.accupass.com/event/2211140558381956060137?contact" style="text-decoration: none; color: #008CD6">洽詢客服單位</a>。
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
    to,
    subject,
    text,
    html
  }

  await transporter.sendMail(mailOptions)

  serviceResponse.success(res, {
    status: 'success',
    message: '信件發送成功'
  })
}))

module.exports = router
