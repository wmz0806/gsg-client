const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const templates = require("../templates");
const download = require('download-git-repo');
const ora = require('ora'); //node.js 命令行环境的 loading效果
const fs = require('fs');
const path = require('path');
const utils = require('../utils/utils');
const os = require('os');

const downPrefixPath = os.tmpdir();


module.exports = function (name) {
    const templatesMap = getTemps(templates);

    let tpls = null;

    if (!name && templatesMap[name]) {
        tpls = templatesMap[name];
    } else {
        const list = templates.list || [];
        tpls = list[0];
    }

    co(generator(tpls));
};

function getTemps(templates) {
    const list = templates.list || [];
    const templatesMap = {};
    list.forEach(function (item) {
        templatesMap[item.name] = item;
    });
    return templatesMap;
}

const generator = function* (tpls) {
    if (!tpls) {
        line();
        console.log(chalk.red(`✘模版不存在`));
        process.exit(0);
    } else {
        const downFolder = path.join(downPrefixPath, tpls.name);
        downloadTemplates(downFolder, tpls.path);
    }
};


function downloadTemplates(downFolder, p) {
    console.log(chalk.green('★'), chalk.green('1. 检查冗余文件......'));
    if (fs.existsSync(downFolder)) utils.deleteFolder(downFolder); // 刪除原文件
    console.log(chalk.green('★'), chalk.green('2. 创建临时文件......'));
    if (!fs.existsSync(downFolder)) fs.mkdirSync(downFolder);

    let spanner = ora(chalk.blue('正在构建，请稍等......'));
    spanner.start();

    download(p, downFolder, {clone: true}, function (err) {
        if (err) {
            spanner.clear();
            spanner.stop();
            line();
            console.log(chalk.red('✘构建失败'));
            line();
            console.log(err);
            line();
            process.exit(0);
        }

        startBuildProject(spanner, downFolder);
    })

}

function startBuildProject(spanner, downFolder) {
    const targetPath = process.cwd();

    if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
    spanner.clear();
    console.log(chalk.green('★'), chalk.green('3. 复制脚手架......'));
    utils.copyFolder(downFolder, targetPath);
    console.log(chalk.green('★'), chalk.green('4. 项目构建成功'));
    spanner.stop();
    process.exit(0);
}

function line() {
    console.log(chalk.yellow('\n----------------------------------------\n'));
}
