const merge = require('webpack-merge')
const commonConfig = require('./webpack.config.common')
const devConfig = {
  devtool: 'cheap-module-eval-source-map',
  mode: 'development', //'development' 和 'production'

  devServer: {
    contentBase: '../dist', // 服务器要起在哪一个文件夹下
    open: true, // 当webpackDevServer启动时,会自动帮我们打开浏览器,并访问服务器的地址
    // proxy: {
    //   '/react/api': {
    //     target: 'http://www.***.com',
    //     secure: false, // 可以实现对https网址请求的转发
    //     pathRewrite: {
    //       '***': '***'
    //     },
    //     changeOrigin: true
    //   }
    // },
    hot: true, // 让webpack-dev-server开启HotMoudleReplacement功能
    // hotOnly: true // 即便是html的功能没有生效,也不要让浏览器自动刷新,一般如果html出了问题,webpack会帮我们自动刷新一次,这个配置项要求html不要帮我们做额外的刷新
    historyApiFallback: true // 解决单页面应用路由问题
  },

  // 在development模式下开启treeshaking
  optimization: {
    usedExports: true
  }
}
module.exports = merge(commonConfig, devConfig)