/**
 * Assets Config file
 */

const serverConfiguration = {
  internal: {
    server: {
      baseDir: 'dist',
    },
    port: 3000,
  },
  external: {
    proxy: 'http://localhost:9000/path/to/project/',
  },
};

const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinPlugin = require('imagemin-webpack-plugin').default;
const FileIncludeWebpackPlugin = require('file-include-webpack-plugin');

let targetServerConfiguration = serverConfiguration.internal;

const config = function (env, args) {
  if (args.externalServer !== undefined && args.externalServer) {
    targetServerConfiguration = serverConfiguration.external;
  }

  return {
    entry: {
      app: './src/js/app.js',
    },
    output: {
      filename: 'js/[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
        {
          test: /\.(png|gif|jpg|jpeg)$/,
          use: [
            {
              loader: 'url-loader',
              options: { name: 'images/design/[name].[hash:6].[ext]', publicPath: '../', limit: 8192 },
            },
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'url-loader',
              options: { name: 'fonts/[name].[hash:6].[ext]', publicPath: '../', limit: 8192 },
            },

          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
        new OptimizeCssAssetsPlugin({}),
      ],
    },
    watchOptions: {
      poll: 1000,
      ignored: /node_modules/,
    },
    plugins: [
      new BrowserSyncPlugin({
        ...targetServerConfiguration,
        files: ['src/*'],
        ghostMode: {
          clicks: false,
          location: false,
          forms: false,
          scroll: false,
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'wepback',
        notify: true,
        reloadDelay: 0,
      }),
      new FileIncludeWebpackPlugin(
        {
          source: './src', // relative path to your templates
          replace: [{
            regex: /\[\[FILE_VERSION]]/, // additional things to replace
            to: 'v=1.0.0',
          }],
        },
      ),
      new HtmlWebpackPlugin({
        inject: true,
        hash: false,
        filename: 'index.html',
        template: path.resolve(__dirname, 'src', 'index.html'),
        favicon: path.resolve(__dirname, 'src/img/favicon', 'favicon.ico'),
      }),
      // Design guideline pages
      new HtmlWebpackPlugin({
        filename: 'guideline-typeface/index.html',
        template: path.resolve(__dirname, 'src', 'guideline-typeface/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'guideline-headings/index.html',
        template: path.resolve(__dirname, 'src', 'guideline-headings/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'guideline-bodytext/index.html',
        template: path.resolve(__dirname, 'src', 'guideline-bodytext/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'guideline-colours/index.html',
        template: path.resolve(__dirname, 'src', 'guideline-colours/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'guideline-buttons/index.html',
        template: path.resolve(__dirname, 'src', 'guideline-buttons/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'guideline-forms/index.html',
        template: path.resolve(__dirname, 'src', 'guideline-forms/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'guideline-icons/index.html',
        template: path.resolve(__dirname, 'src', 'guideline-icons/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'guideline-panels/index.html',
        template: path.resolve(__dirname, 'src', 'guideline-panels/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'guideline-interactive/index.html',
        template: path.resolve(__dirname, 'src', 'guideline-interactive/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'guideline-utility/index.html',
        template: path.resolve(__dirname, 'src', 'guideline-utility/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'guideline-home/index.html',
        template: path.resolve(__dirname, 'src', 'guideline-home/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'about/index.html',
        template: path.resolve(__dirname, 'src', 'about/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'blog/index.html',
        template: path.resolve(__dirname, 'src', 'blog/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'blog/article/index.html',
        template: path.resolve(__dirname, 'src', 'blog/article/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'blog/3-day-detox-plan/index.html',
        template: path.resolve(__dirname, 'src', 'blog/3-day-detox-plan/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'blog/detox-guide/index.html',
        template: path.resolve(__dirname, 'src', 'blog/detox-guide/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'blog/nutrition-guide/index.html',
        template: path.resolve(__dirname, 'src', 'blog/nutrition-guide/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'blog/supplements-guide/index.html',
        template: path.resolve(__dirname, 'src', 'blog/supplements-guide/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'blog/alternate-day-diet/index.html',
        template: path.resolve(__dirname, 'src', 'blog/alternate-day-diet/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'blog/workout-guide/index.html',
        template: path.resolve(__dirname, 'src', 'blog/workout-guide/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'faq/index.html',
        template: path.resolve(__dirname, 'src', 'faq/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'profile/index.html',
        template: path.resolve(__dirname, 'src', 'profile/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'subscriptions/index.html',
        template: path.resolve(__dirname, 'src', 'subscriptions/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'checkout/index.html',
        template: path.resolve(__dirname, 'src', 'checkout/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'checkout/2.html',
        template: path.resolve(__dirname, 'src', 'checkout/2.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'checkout/3.html',
        template: path.resolve(__dirname, 'src', 'checkout/3.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'checkout/4.html',
        template: path.resolve(__dirname, 'src', 'checkout/4.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'guarantee/index.html',
        template: path.resolve(__dirname, 'src', 'guarantee/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'privacy-policy/index.html',
        template: path.resolve(__dirname, 'src', 'privacy-policy/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'terms-conditions/index.html',
        template: path.resolve(__dirname, 'src', 'terms-conditions/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'contact-us/index.html',
        template: path.resolve(__dirname, 'src', 'contact-us/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'track-your-order/index.html',
        template: path.resolve(__dirname, 'src', 'track-your-order/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'complete-keto-meal-shake/index.html',
        template: path.resolve(__dirname, 'src', 'complete-keto-meal-shake/index.html'),
      }),
      new HtmlWebpackPlugin({
        filename: 'cart/index.html',
        template: path.resolve(__dirname, 'src', 'cart/index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
      new ImageMinPlugin({ test: /\.(jpg|jpeg|png|gif|svg)$/i }),
      new CleanWebpackPlugin({
        /**
         * Some plugins used do not correctly save to webpack's asset list.
         * Disable automatic asset cleaning until resolved
         */
        cleanStaleWebpackAssets: false,
        verbose: true,
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'src','browserconfig.xml'),
          to: path.resolve(__dirname, 'dist','browserconfig.xml'),
          toType: 'file',
        },
        {
          from: path.resolve(__dirname, 'src', 'site.webmanifest'),
          to: path.resolve(__dirname, 'dist', 'site.webmanifest'),
          toType: 'file',
        },
        // Looks like each time a new folder is added inside img, a new rule will need to be added here.
        {
          from: path.resolve(__dirname, 'src', 'img', 'favicon'),
          to: path.resolve(__dirname, 'dist', 'img', 'favicon'),
          toType: 'dir',
        },
        {
          from: path.resolve(__dirname, 'src', 'img', 'bg'),
          to: path.resolve(__dirname, 'dist', 'img', 'bg'),
          toType: 'dir',
        },
        {
          from: path.resolve(__dirname, 'src', 'img', 'include'),
          to: path.resolve(__dirname, 'dist', 'img', 'include'),
          toType: 'dir',
        },
        {
          from: path.resolve(__dirname, 'src', 'img', 'og'),
          to: path.resolve(__dirname, 'dist', 'img', 'og'),
          toType: 'dir',
        },
        {
          from: path.resolve(__dirname, 'src', 'img', 'content/blog'),
          to: path.resolve(__dirname, 'dist', 'img', 'content/blog'),
          toType: 'dir',
        },
      ]),
    ],
  };
};

module.exports = config;