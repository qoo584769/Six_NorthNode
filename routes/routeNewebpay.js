require('dotenv').config()
const express = require('express')
const crypto = require('crypto')

const router = express.Router()

const serviceResponse = require('@/services/serviceResponse')
const serviceError = require('@/services/serviceError')

const controllerNewebpay = require('@/controllers/controllerNewebpay')

const { MERCHANTID, VERSION, HASHKEY, HASHIV } = process.env
const orders = {}

// 將 aes 解密
function createMpgAesDecrypt (TradeInfo) {
  const HASHKEY = 'O1ni311skcQtjzZ9dosTUklfysy6gAkK'
  const HASHIV = 'CjIIzuIMOIocpRfP'
  const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV)
  decrypt.setAutoPadding(false)
  const text = decrypt.update(TradeInfo, 'hex', 'utf8')
  const plainText = text + decrypt.final('utf8')
  // eslint-disable-next-line no-control-regex
  const result = plainText.replace(/[\x00-\x20]+/g, '')
  return JSON.parse(result)
}

const newebpay = async (req, res, next) => {
  const data = req.body
  console.log(req.body)
  const result = createMpgAesDecrypt(data.TradeInfo)
  // serviceResponse.success(res, req.body)
  return res.redirect(`https://crazymovieweb.onrender.com/#/newebpayreturn/${result.Result.MerchantOrderNo}`)
  // return res.redirect('https://crazymovieweb.onrender.com/')
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
    MerchantOrderNo: TimeStamp,
    Version: VERSION,
    ReturnURL: `https://crazymovieweb.onrender.com/newebpayreturn/${TimeStamp}`
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
