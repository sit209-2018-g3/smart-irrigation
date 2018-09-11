var webpack = require('webpack');

module.exports = {
    entry: "./src/client.js",
    output: {
        path: __dirname + "/public/",
        filename: "client.min.js"
    },
    devServer: {
        inline: true,
        contentBase: __dirname + "/public/",
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                query: {
                    presets: ["@babel/env", "@babel/react", "minify"],
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!autoprefixer-loader'
            },
        ]
    },
};