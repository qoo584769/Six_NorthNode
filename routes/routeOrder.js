const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const controllerOrder = require('@/controllers/controllerOrder')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')
const Order = require('../models/modelOrder')
const validator = require('validator')
const serviceJWT = require('@/services/serviceJWT')

router.get(
  '/getOrder',
  serviceError.asyncError(async (req, res, next) => {
    const { orderId } = req.query
    console.log(orderId)
    const result = await controllerOrder.getOrder(orderId)
    serviceResponse.success(res, result)
  })
)

router.post(
  '/createOrder',
  serviceError.asyncError(async (req, res, next) => {
    const { ItemDesc, date, position, price } = req.body
    console.log(req.body)
    const result = await controllerOrder.createOrder(ItemDesc, date, position, price)
    serviceResponse.success(res, result)
  })
)

module.exports = router
