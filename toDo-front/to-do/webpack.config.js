const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const MiniCssExtractPlugin   = require("mini-css-extract-plugin");
const {resolve} = require("@babel/core/lib/vendor/import-meta-resolve");
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseHref = "/";
const production = process.env.NODE_ENV === 'production';

const PATHS = {
    src: path.join(__dirname, '/src'),
    dist: path.join(__dirname, '/dist'),
    public: path.join(__dirname, '/public'),
    assets: 'assets/'
  }

module.exports = {
    entry: './src/index.js',
    // Where files should be sent once they are bundled
 output: {
   path: path.join(__dirname, '/dist'),
   filename: '[name].[contenthash].js'
 },
  // webpack 5 comes with devServer which loads in development mode
 devServer: {
   port: 3000,
   hot: true,
   historyApiFallback: true,
 },
  // Rules of how webpack will take our files, complie & bundle them for the browser
  module: {
    rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /nodeModules/,
            use: {
              loader: 'babel-loader'
            }
          },
         {
             test: /\.s([ac])ss$/,
             exclude: /node_modules/,
             use: [
                 production ? MiniCssExtractPlugin.loader : 'style-loader',
                 {
                     loader: 'css-loader',
                     options: {
                         modules: true,
                         sourceMap: !production
                     },
                 },
                 {
                     loader: 'sass-loader',
                     options: {
                         sourceMap: !production
                     },
                 },
             ],
         },
        {
             test: /\.scss/i,
             use: [
                 'style-loader',
                 'css-loader',
                 'sass-loader'
             ],
         },
 
         {
             test: /\.css|p(ost)?css$/i,
             use: [
                 'style-loader',
                 'css-loader',
                 'postcss-loader'
             ],
         },
 
         {
             test: /\.(jpe?g|gif|png|wav|mp3)$/,
             loader: 'file-loader',
         },
         {
             test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
             type: 'asset/resource',
         },
         {
             test: /\.svg$/,
             use: [{ loader: 'svg-sprite-loader' }],
         },
    ]
  },
 plugins: [
     new HtmlWebpackPlugin({ template: './public/index.html', favicon: "./public/favicon.ico" }),
     new BaseHrefWebpackPlugin({baseHref: baseHref}),
     new CopyWebpackPlugin({
        patterns: [
          {
            from: `${PATHS.src}/${PATHS.assets}fonts`,
            to: `${PATHS.assets}fonts`
          },
          {
            from: `${PATHS.public}/icons`,
            to: `${PATHS.assets}images`
          },
  
        ]
      })
 ],
    mode: production ? 'production' : 'development',
}