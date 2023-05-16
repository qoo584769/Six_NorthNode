require('dotenv').config()
const crypto = require('crypto')

const { MERCHANTID, HASHKEY, HASHIV, VERSION } = process.env

const controllerNewebpay = {
  // 付款訊息串接
  async genDataChain (order) {
    return `MerchantID=${MERCHANTID}&RespondType=JSON&TimeStamp=${
      order.TimeStamp
    }&Version=${VERSION}&MerchantOrderNo=${order.MerchantOrderNo}&Amt=${
      order.Amt
    }&ItemDesc=${encodeURIComponent(order.ItemDesc)}&Email=${encodeURIComponent(
      order.Email
    )}`
  },
  // AES第一次加密
  async aesEncrypt (tradeInfo) {
    const encrypt = crypto.createCipheriv('aes256', HASHKEY, HASHIV)
    const enc = encrypt.update(tradeInfo, 'utf8', 'hex')
    return enc + encrypt.final('hex')
  },
  // SHA第二次加密
  async shaEncrypt  (aesEncrypt) {
    const sha = crypto.createHash('sha256')
    const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`

    return sha.update(plainText).digest('hex').toUpperCase()
  }
}

module.exports = controllerNewebpay
