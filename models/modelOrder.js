const { Schema, model } = require('mongoose')

const orderSchema = new Schema(
  {
    isPaid: {
      type: Boolean,
      default: false
    },
    createTime: {
      type: Date,
      default: Date.now,
      required: true
    },
    member: {
      type: Schema.ObjectId,
      ref: 'member',
      require: ['true', '訂票人資訊必填']
    },
    movie: {
      type: Schema.ObjectId,
      ref: 'movie',
      require: ['true', '電影資訊必填']
    }
  },
  { timestamps: true }
)

const order = model('order', orderSchema)
module.exports = order
