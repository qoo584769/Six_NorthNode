const { Schema, model } = require('mongoose')

const orderSchema = new Schema(
  {
    // isPaid: {
    //   type: Boolean,
    //   default: false
    // },
    createTime: {
      type: Date,
      default: Date.now,
      required: true
    },
    ItemDesc: {
      type: String,
      default: '',
      required: true
    },
    date: {
      type: String,
      default: '',
      required: true
    },
    position: {
      type: String,
      default: '',
      required: true
    },
    price: {
      type: Number,
      default: 0,
      required: true
    },
    time: {
      type: String,
      default: '',
      require: true
    }
    // member: {
    //   type: Schema.ObjectId,
    //   ref: 'member',
    //   require: ['true', '訂票人資訊必填']
    // },
    // movie: {
    //   type: Schema.ObjectId,
    //   ref: 'movie',
    //   require: ['true', '電影資訊必填']
    // }
  },
  { timestamps: true }
)

const order = model('order', orderSchema)
module.exports = order
