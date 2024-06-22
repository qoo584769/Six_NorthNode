require('dotenv').config()
const express = require('express')
const crypto = require('crypto')

const router = express.Router()

const serviceResponse = require('@/services/serviceResponse')
const serviceError = require('@/services/serviceError')

const controllerNewebpay = require('@/controllers/controllerNewebpay')
const controllerScreens = require('@/controllers/controllerScreens')
const controllerOrder = require('@/controllers/controllerOrder')
const controllerMember = require('@/controllers/controllerMember')
const controllerMail = require('@/controllers/controllerMail')

const { MERCHANTID, VERSION, HASHKEY, HASHIV } = process.env
const orders = {}

const newebpay = async (req, res, next) => {
  const data = req.body
  console.log(req.body)
  const url = 'https://crazymovieweb.onrender.com'
  const result = await controllerNewebpay.createMpgAesDecrypt(data.TradeInfo)
  const orderRes = await controllerOrder.getOrder(result.Result.MerchantOrderNo)
  const memberRes = await controllerMember.updateUserOrder(orderRes.member, orderRes._id)
  const newSeatsStatu = orderRes.screenId.seatsStatus.map((item) => {
    for (let i = 0; i < orderRes.position.length; i++) {
      if (item.seat_id === orderRes.position[i]) {
        item.is_booked = !item.is_booked
        console.log(item.seat_id)
        console.log(orderRes.position[i])
      }
    }
    return item
  })
  const updateSeatStatus = await controllerScreens.updateScreenSeatsStatu(orderRes.screenId._id, newSeatsStatu)
  const mailRes = await controllerMail.sendTicketMail({ orderRes, memberRes })
  console.log('解密付款 : ' + result)
  console.log('訂單資訊 : ' + orderRes)
  console.log('會員訂單更新 : ' + memberRes)
  console.log('更新座位資訊 : ' + updateSeatStatus)
  console.log('訂票成功信件 : ' + mailRes)
  return res.redirect(`${url}/#/newebpayreturn/${result.Result.MerchantOrderNo}`)
}

// router.post('/createOrder', createOrder)
// 藍新金流
router.post('/newebpay', newebpay)

router.post('/createOrder', serviceError.asyncError(async (req, res, next) => {
  const data = req.body
  console.log(data)
  const TimeStamp = Math.round(new Date().getTime() / 1000)
  orders.TimeStamp = {
    ...data,
    TimeStamp,
    MerchantID: MERCHANTID,
    MerchantOrderNo: data.orderId,
    Version: VERSION
  }

  const chainData = await controllerNewebpay.genDataChain(orders.TimeStamp)
  const aes = await controllerNewebpay.aesEncrypt(chainData)
  const sha = await controllerNewebpay.shaEncrypt(aes)
  const result = {
    order: orders.TimeStamp,
    aes,
    sha
  }
  console.log(result)
  serviceResponse.success(res, result)
}))

module.exports = router
