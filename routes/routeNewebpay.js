require('dotenv').config()
const express = require('express')

const router = express.Router()

const serviceResponse = require('@/services/serviceResponse')
const serviceError = require('@/services/serviceError')

const controllerNewebpay = require('@/controllers/controllerNewebpay')

const { MERCHANTID, VERSION } = process.env
const orders = {}

const newebpay = async (req, res, next) => {
  console.log(req.body)
  // serviceResponse.success(res, req.body)
  // return res.redirect('https://crazymovieweb.onrender.com/newebpayreturn/123')
  return res.redirect('https://crazymovieweb.onrender.com/')
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
