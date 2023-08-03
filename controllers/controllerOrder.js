
const Order = require('../models/modelOrder')
const serviceResponse = require('@/services/serviceResponse.js')
const httpCode = require('@/utilities/httpCode')

const controllerOrder = {
  async createOrder (ItemDesc, date, position, price, time, screenId, user) {
    const newOrder = await Order.create({
      ItemDesc,
      date,
      position,
      price,
      time,
      screenId,
      member: user
    })
    return newOrder
  },
  async getOrder (orderId) {
    const ObjectId = require('mongoose').Types.ObjectId
    const orderRes = await Order.findOne({ _id: new ObjectId(orderId) }).populate({
      path: 'screenId'
    })
    console.log(orderRes)
    return orderRes
  }

}

module.exports = controllerOrder
