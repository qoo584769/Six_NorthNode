const serviceResponse = require('@/services/serviceResponse')
const serviceError = require('@/services/serviceError')
const httpCode = require('@/utilities/httpCode')
const serviceJWT = require('@/services/serviceJWT')

const middlewareAuth = {
  loginAuth: serviceError.asyncError(async (req, res, next) => {
    let token = null
    console.log('登入權限驗證 :' + req.headers)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      next(serviceResponse.error(httpCode.UNAUTHORIZED, '沒有權限'))
    }

    const decode = await serviceJWT.decode(token)

    req.user = decode.id

    next()
  })
}

module.exports = middlewareAuth
