require('dotenv').config()
const express = require('express')
const router = express.Router()

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

module.exports = router
