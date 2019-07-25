const fs = require('fs');
const path = require('path');

const utils = {
    copyFolder: function (from, to) { // 复制文件夹到指定目录
        let files = [];
        if (fs.existsSync(to)) { // 文件是否存在 如果不存在则创建
            files = fs.readdirSync(from);
            files.forEach((file) => {
                const targetPath = path.join(from, file);
                const toPath = path.join(to, file);
                if (fs.statSync(targetPath).isDirectory()) { // 复制文件夹
                    utils.copyFolder(targetPath, toPath);
                } else { // 拷贝文件
                    fs.copyFileSync(targetPath, toPath);
                }
            });
        } else {
            fs.mkdirSync(to);
            utils.copyFolder(from, to);
        }
    },
    deleteFolder: function (p) {
        let files = [];
        if (fs.existsSync(p)) {
            if (fs.statSync(p).isDirectory()) {
                files = fs.readdirSync(p);
                files.forEach((file) => {
                    const curPath = path.join(p, file);
                    if (fs.statSync(curPath).isDirectory()) {
                        utils.deleteFolder(curPath);
                    } else {
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(p);
            } else {
                fs.unlinkSync(p);
            }
        }
    },
};

module.exports = utils;
