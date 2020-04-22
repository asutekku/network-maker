// production config
const merge = require('webpack-merge');
const {resolve} = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const commonConfig = require('./common');

const srcPath = resolve(__dirname, '../../src');
const dstPath = resolve(__dirname, '../../dist');

module.exports = merge(commonConfig, {
    mode: 'production',
    entry: './index.tsx',
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    'sass-loader',
                ],
            }
        ]
    },
    output: {
        filename: 'bundle.[hash].min.js',
        path: dstPath,
        publicPath: '/',
    },
    devtool: 'source-map',
    plugins: [new MiniCssExtractPlugin({
        filename: '[name].css',
    })],
});