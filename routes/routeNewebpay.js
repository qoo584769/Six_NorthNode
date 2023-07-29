require('dotenv').config()
const express = require('express')
const crypto = require('crypto')

const router = express.Router()

const serviceResponse = require('@/services/serviceResponse')
const serviceError = require('@/services/serviceError')

const controllerNewebpay = require('@/controllers/controllerNewebpay')
const controllerScreens = require('@/controllers/controllerScreens')
const controllerOrder = require('@/controllers/controllerOrder')

const { MERCHANTID, VERSION, HASHKEY, HASHIV } = process.env
const orders = {}

const newebpay = async (req, res, next) => {
  const data = req.body
  console.log(req.body)
  const url = 'https://crazymovieweb.onrender.com'
  const result = await controllerNewebpay.createMpgAesDecrypt(data.TradeInfo)
  const orderRes = await controllerOrder.getOrder(result.Result.MerchantOrderNo)
  const newSeatsStatu = orderRes.screenId.seatsStatus.map((item) => {
    if (item.seat_id === orderRes.position) {
      item.is_booked = !item.is_booked
    }
    return item
  })
  const updateSeatStatus = await controllerScreens.updateScreenSeatsStatu(orderRes.screenId._id, newSeatsStatu)
  console.log('解密付款 : ' + result)
  console.log('訂單資訊 : ' + orderRes)
  console.log('更新座位資訊 : ' + updateSeatStatus)
  return res.redirect(`${url}/#/newebpayreturn/${result.Result.MerchantOrderNo}`)
}

// router.post('/createOrder', createOrder)
// 藍新金流
router.post('/newebpay', newebpay)

// 寄信用
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
