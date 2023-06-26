const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    devServer: {
        static: './dist',
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader","css-loader"]
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: {
                    loader: "file-loader",
                    options:{
                        name:'[name].[ext]',
                        outputPath:'assets/images/'
                        //the images will be emited to dist/assets/images/ folder
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jQuery",
            "window.$": "jquery"
        })
    ],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'src/static'),
    }
}