const gulp = require('gulp');
const Config = require('cordova-config');
let fs = require('fs');
let argv = require('yargs').argv;
gulp.task('config', async function () {
    let data;
    let env = argv.channelTag;
    if (!env || env === 'dev') {
        data = fs.readFileSync('src/environments/environment.ts', 'utf-8');
        console.log('Environment configured for dev')
    } else {
        data = fs.readFileSync(`src/environments/environment.${env}.ts`, 'utf-8');
        fs.writeFileSync('src/environments/environment.ts', data, 'utf-8');
        console.log('Environment configured for ' + env);
    }
    let startIndex = data.indexOf("{");
    let lastIndex = (data.lastIndexOf("}")) + 1;
    let configEnv = JSON.parse(data.substring(startIndex, lastIndex))
    const configXml = new Config('config.xml');
    configXml.setID(configEnv.appId);
    configXml.setName(configEnv.appName);
    configXml.setVersion(configEnv.version);
    configXml.writeSync();
});