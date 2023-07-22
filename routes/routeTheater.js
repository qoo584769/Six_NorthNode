const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const controllerTheater = require('@/controllers/controllerTheater')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')
const middlewareAdminAuth = require('@/middlewares/middlewareAdminAuth')

router.get('/', middlewareAdminAuth, serviceError.asyncError(async (req, res, next) => {
  const result = await controllerTheater.getTheater()
  serviceResponse.success(res, result)
}))

module.exports = router
