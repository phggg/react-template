const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const fs = require('fs')
const devMode = process.env.NODE_ENV !== 'production';

const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "../src/index.html"),
  }),
  new MiniCssExtractPlugin({
    filename: devMode ? 'styles/[name].css' : 'styles/[name].[hash].css',
    chunkFilename: devMode ? 'styles/[id].css' : 'styles/[id].[hash].css',
  }),
]

const files = fs.readdirSync(path.resolve(__dirname, '../dll'))
files.forEach(file => {
  if (/.*.dll.js/.test(file)) {
    plugins.push(
      new AddAssetHtmlWebpackPlugin({
        filepath: path.resolve(__dirname, '../dll/', file)
      }),
    )
  }
  if (/.*.manifest.json/.test(file)) {
    plugins.push(
      new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, '../dll/', file)
      }),
    )
  }
})

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index.js'),
  },
  resolve: {
    extensions: ['.js', '.jsx'], // 引入时不写后缀名默认引入这两种文件类型
    mainFiles: ['index'], // 引入某个文件夹下的文件时,如果不写具体文件,则引入index,可以写数组,写在前面的优先级高
    alias: { // 配置路径别名
      'pages': path.resolve(__dirname, '../src/pages')
    },
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        // use: useLoader('sass-loader')
        loaders: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.resolve(__dirname, '../dist/styles/'),
              hmr: process.env.NODE_ENV === 'development'
            },
          },
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              // modules: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  "overrideBrowserslist": [
                    "> 0.01%",
                    "last 2 versions",
                    "not ie <= 8"
                  ],
                })
              ]
            }
          },
        ]
      },
      {
        test: /\.jsx?$/, // 即x可有可无,这样不管是js文件还是jsx文件,都会使用babel-loader
        exclude: /(node_modules|bower_components)/,
        // 配置loader有3种写法    字符串 数组 函数
        // use: {
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'images/',
            limit: 2048
          }
        }
      },
    ]
  },
  plugins,
  // plugins: [

  // new AddAssetHtmlWebpackPlugin({
  //   filepath: path.resolve(__dirname, '../dll/vendors.dll.js')
  // }),
  // new AddAssetHtmlWebpackPlugin({
  //   filepath: path.resolve(__dirname, '../dll/react.dll.js')
  // }),
  // new webpack.DllReferencePlugin({
  //   manifest: path.resolve(__dirname, '../dll/vendors.manifest.json')
  // }),
  // new webpack.DllReferencePlugin({
  //   manifest: path.resolve(__dirname, '../dll/react.manifest.json')
  // }),
  // ],
  optimization: {

    usedExports: true, // treeShaking

    splitChunks: {
      chunks: "all", // async为只对异步引入模块有效,initial为只对同步引入生效,如果想要同步异步都生效,则改为all,同时需要对cacheGroups中的vendors进行配置
      minSize: 30000, // 引入的包大于30kb才会帮助我们做代码分割
      minChunks: 1, // 当一个模块被引入至少多少次之后才会进行分割
      // maxSize: 50000, // 如果引入的模块大于50kb,那么会尝试二次分割,例如引入的模块为1Mb,那么会尝试将该模块分割为20个20kb的模块
      maxAsyncRequests: 5, // 同时加载的模块数,例如我引入了10个模块,只会对前5个进行分割,超过的就不会再分割了
      maxInitialRequests: 3, // 入口文件做代码分割,只会分割三个文件
      automaticNameDelimiter: '~', // 文件生成时文件名中间的连接符
      name: true, // cacheGroups中配置的name有效
      cacheGroups: { // 将符合某个组的要求的js文件打包到一个文件中去
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 引入的库是否在node_modules下,如果是,就将该组件打包到vendors的组里去
          priority: -10, // 优先级,例如引入三方包,希望三方包被分割的要求按照vendors的配置来分割,就不会按照default的配置分割了
          name: 'vendors' // 打包后的文件名
        },
        // vendors: false,
        // default: {
        //   // minChunks: 2,
        //   priority: -20,
        //   reuseExistingChunk: true, // 如果一个模块已经被打包过了,那么再次引入时会忽略这个模块
        //   name: 'default'
        // }
        default: false
      }
    }
  },
  output: {
    // publicPath: '/',
    filename: 'script/[name].js',
    chunkFilename: 'script/[name].js', // 非入口文件打包后的文件名
    path: path.resolve(__dirname, '../dist')
  }
}