const utils = require('./utils.js');

const { PHPFILES_URL, PHPFILES_PASSWORD } = process.env;

module.exports = {
    saveFile: async (file, name) => {
        await phpFiles(file, name);
    }
}

const phpFiles = async (file, name) => {
    const formdata = new FormData();
    const blob = await utils.getBlobFromPath(file);
    formdata.append("file", blob, name);
    formdata.append("password", PHPFILES_PASSWORD);

    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };

    const result = await fetch(PHPFILES_URL, requestOptions);
}