// webpack.config.js

const path = require("path")
const webpack = require("webpack")

module.exports = {
    entry    : "./src/index.js",
    module   : {
        rules: [
            {
                test   : /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader : "babel-loader"
            },
            {
                test: /\.s?css$/,
                use : ["style-loader", "css-loader"]
            }
        ]
    },
    output   : {
        path      : path.resolve(__dirname, "dist/"),
        publicPath: "/dist/",
        filename  : "xv-validation.js",
    },
    devServer: {
        contentBase: path.join(__dirname, "public/"),
        port       : 3000,
        publicPath : "http://localhost:3000/dist/",
    },
}