
const Order = require('../models/modelOrder')
const serviceResponse = require('@/services/serviceResponse.js')
const httpCode = require('@/utilities/httpCode')

const controllerOrder = {
  async createOrder (ItemDesc, date, position, price) {
    const newOrder = await Order.create({
      ItemDesc,
      date,
      position,
      price
    })
    return newOrder
  },
  async getOrder (orderId) {
    const ObjectId = require('mongoose').Types.ObjectId
    const orderRes = await Order.findOne({ _id: new ObjectId(orderId) })
    console.log(orderRes)
    return orderRes
  }

}

module.exports = controllerOrder
