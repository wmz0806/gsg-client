#!/usr/bin/env node

/*
- nodejs
- commander模块(命令行参数处理模块)
- co 模块(异步流程控制模块)
- co-prompt 模块(消息提示模块)
- chalk 模块（输出字体颜色模块）
- github （远程托管仓库）
 */
const commander = require('commander');
const pack = require('./package.json');
const chalk = require('chalk');
const init = require('./bin/init');
const list = require('./bin/list');
const about = require('./bin/about');

commander
    .version(pack.version, '-v, --version')
    .usage('<command> [options]')
    .description(chalk.yellow('固守前端脚手架 ' + pack.version));

commander.command('init (template)')
    .description(chalk.green('创建新新项目'))
    .alias('i')
    .action(function (template) {
        init(typeof template === 'string' ? template : undefined);
    });

commander.command('list')
    .description(chalk.green('显示可使用的模板列表'))
    .alias('l')
    .action(function () {
        list();
    });

commander.command('about')
    .description(chalk.green('关于'))
    .alias('a')
    .action(function () {
        about();
    });

commander.parse(process.argv);
if (commander.args.length === 0) {
    //这里是处理默认没有输入参数或者命令的时候，显示help信息
    commander.help();
}
