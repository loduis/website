const path = require('path')
const webpack = require('webpack')
const entry = require('webpack-glob-entry')
const WebpackCleanPlugin = require('webpack-clean')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: entries(),
  output: {
    path: __dirname + '/dist',
    filename: 'bundle/[name].js'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'dist'),
      'node_modules'
    ],
    alias: {
      js: './dist/js'
    }
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, 'build'),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          },
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href', 'script:src', 'form:action'],
              minimize: true,
              minifyJS: false,
              removeComments: true,
              preserveLineBreaks: true,
              removeScriptTypeAttributes: true
            }
          },
          {
            loader: 'html-merge-assets-loader',
            options: {
              js: {
                inline: [
                  'js/km.js',
                  'js/drift.js',
                  'js/advisor.js',
                  'js/scroll.js'
                ],
                'js/app-ie9.js': [
                  'js/html5shiv.js',
                  'js/respond.min.js'
                ],
                'js/app-main.js': [
                  'js/jquery.min.js',
                  'js/bootstrap.min.js',
                  'js/plugins.js',
                  'js/bskit-scripts.js'
                ]
              },
              css: {
                'css/app-main.css': [
                  'bootstrap/css/bootstrap.min.css',
                  'css/font-awesome.min.css',
                  'css/style-library-1.css',
                  'css/plugins.css',
                  'css/blocks.css',
                  'css/custom.css'
                ]
              }
            }
          },
          {
            loader: 'html-ext-remove-loader',
            options: {
              ignore: [
                // '/help/',
                '/privacy.html',
                '/terms.html'
              ]
            }
          },
          'pinegrow-remove-properties-loader'
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '/images/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '/fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/css/[name].[hash:7].[ext]'
            }
          },
          'extract-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'file-loader',
        options: {
          name: '/js/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.php$/,
        use:[
          {
            loader: 'file-loader',
            options: {
              name: '/[path][name].[ext]'
            }
          },
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href', 'script:src', 'form:action'],
              removeComments: true,
              preserveLineBreaks: true,
              removeScriptTypeAttributes: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      // { from : 'videos/.htaccess', to : 'videos/.htaccess', toType: 'file' },
      { from : 'videos/routes.json', to : 'videos/routes.json' },
      { from : 'videos/bootstrap.php', to : 'videos/bootstrap.php' },
      { from: 'js/km.js', to: 'js/km.js' }, // help use to km
      { from: 'js/faqs-es.js', to: 'js/faqs-es.js' }, // help use to km
      { from: 'js/faqs-en.js', to: 'js/faqs-en.js' }, // help use to km
      { from: 'js/videos-es.js', to: 'js/videos-es.js' }, // help use to km
      { from: 'js/videos-en.js', to: 'js/videos-en.js' }, // help use to km
      { from: 'js/course-es.js', to: 'js/course-es.js' }, // help use to km
      { from: 'js/course-en.js', to: 'js/course-en.js' }, // help use to km
      { from: 'images/favicon.png', to: 'images/favicon.png' } // other page use this file
    ]),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    // split vendor js into its own file
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        ['js', 'css', 'svg'].join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    }),
    new WebpackCleanPlugin(['dist/bundle', 'js/app-main.js', 'js/app-ie9.js', 'css/app-main.css'])
  ]
}


function entries () {
  return Object.entries(
    entry(entry.basePath(), '*.html', 'colombia/*.html', 'paraguay/*.html', 'help/*.html', 'videos/player.php')
  ).reduce((obj, [key, file]) => {
    if (key.indexOf('master-') === -1) obj[key] = './' + file;
    return obj;
  }, {});
}
