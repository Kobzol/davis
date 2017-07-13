const webpackConfig = require('./webpack.config');

const commonsChunkPluginIndex = webpackConfig.plugins.findIndex(plugin => plugin.chunkNames);
webpackConfig.plugins.splice(commonsChunkPluginIndex, 1);

module.exports = function (config) {
    config.set({
        basePath: 'src/spec',
        frameworks: ['jasmine'],
        files: [
            { pattern: 'tests.js', watched: false }
        ],
        exclude: [
        ],
        preprocessors: {
            'tests.js': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome'],
        singleRun: true,
        concurrency: Infinity
    })
};
