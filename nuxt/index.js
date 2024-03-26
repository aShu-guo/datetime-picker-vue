const { resolve } = require('path')

module.exports = function DatetimePickerVue () {
  this.addPlugin({
    ssr: false,
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'datetime-picker-vue.js'
  })
}

module.exports.meta = require(__dirname, './../package.json')
