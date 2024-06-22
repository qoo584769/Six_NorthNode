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
  },
  // 解密藍新付款成功的回傳資料
  async createMpgAesDecrypt (TradeInfo) {
    const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV)
    decrypt.setAutoPadding(false)
    const text = decrypt.update(TradeInfo, 'hex', 'utf8')
    const plainText = text + decrypt.final('utf8')
    // eslint-disable-next-line no-control-regex
    const result = plainText.replace(/[\x00-\x20]+/g, '')
    return JSON.parse(result)
  }
}

module.exports = controllerNewebpay
