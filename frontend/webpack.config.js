var path = require('path');

module.exports = {
    resolve: {
        extensions: ['', '.js', '.vue']
    }
    , entry: {
        sms: './frontend/source/views/sms.js'
    }
    , output: {
        path: ''
        , filename: 'page-[name].js'
        , publicPath: "/frontend/dist/"
    }
    , module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
          }
          , {
            test: /\.vue$/,
            loader: 'vue'
          }
        ]
    },
    vue: {
        loaders: {
            js: 'babel'
        }
    }
    , babel: {
          "presets": [ "es2015", "stage-0" ],
          "plugins": ["transform-runtime"] 
    },
    externals: {
        "vue": "window.Vue"
    }
}
