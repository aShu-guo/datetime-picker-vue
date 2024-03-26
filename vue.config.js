const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/datetime-picker-vue/'
    : '/',
  lintOnSave: undefined,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true
            },
            warnings: false
          },
          sourceMap: false,
          parallel: true
        })
      )
    }
  }
}
