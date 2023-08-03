const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const controllerOrder = require('@/controllers/controllerOrder')
const serviceResponse = require('@/services/serviceResponse')
const middlewareAuth = require('@/middlewares/middlewareAuth')
const httpCode = require('@/utilities/httpCode')
const Order = require('../models/modelOrder')
const validator = require('validator')
const serviceJWT = require('@/services/serviceJWT')

router.get(
  '/getOrder',
  serviceError.asyncError(async (req, res, next) => {
    const { orderId } = req.query
    const result = await controllerOrder.getOrder(orderId)
    serviceResponse.success(res, result)
  })
)

router.post(
  '/createOrder',
  middlewareAuth.loginAuth,
  serviceError.asyncError(async (req, res, next) => {
    // 從jwt取得使用者id
    const { user } = req
    const { ItemDesc, date, position, price, time, screenId } = req.body
    const result = await controllerOrder.createOrder(ItemDesc, date, position, price, time, screenId, user)
    serviceResponse.success(res, result)
  })
)

module.exports = router
