const modelTheaters = require('../models/modelTheaters')

const controllerTheater = {
  async getTheater () {
    const res = await modelTheaters.find()
    return res
  }
}

module.exports = controllerTheater
