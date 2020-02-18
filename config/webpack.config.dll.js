const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['lodash'],
    react: ['react', 'react-dom']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({// 用这个插件来分析上面打包生成的库,并把库里面的映射关系保存成json文件
      name: '[name]',
      path: path.resolve(__dirname, '../dll/[name].manifest.json'),
    })
  ]
}