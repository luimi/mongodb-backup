require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const utils = require('./utils.js');
const cloud = require('./cloud.js');

const app = express();
app.use(express.json());

const upload = multer({
    dest: 'uploads/'
});

const { PORT = 3000, BACKUP_PATH, MONGO_URI, API_PASSWORD } = process.env;

const validatePassword = (req, res) => {
    const password =
        req.body ? req.body.password : undefined ||
            req.headers['x-password'];
    if (!password) {
        res.status(401).json({
            success: false,
            error: 'Password required'
        });

        return false;
    }

    if (password !== API_PASSWORD) {
        res.status(401).json({
            success: false,
            error: 'Invalid password'
        });

        return false;
    }

    return true;
}

app.get('/', (req, res) => {
    res.json({ success: true })
})

app.post('/backup', async (req, res) => {
    if (!validatePassword(req, res)) return;
    try {

        const date = new Date().toISOString().replace(/[:.]/g, '-');

        const dumpDir = path.join(BACKUP_PATH, `dump-${date}`);
        const zipPath = path.join(BACKUP_PATH, `backup-${date}.zip`);

        // Crear dump
        await utils.runCommand(`mongodump --uri="${MONGO_URI}" --out="${dumpDir}"`);

        // Comprimir
        await utils.zipDirectory(dumpDir, zipPath);

        // Cloud
        await cloud.saveFile(zipPath, `backup-${date}.zip`)

        // Limpiar dump
        utils.clearDirectory(dumpDir);

        res.json({
            success: true
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.toString()
        });
    }
});

app.post('/restore', upload.single('backup'), async (req, res) => {
    if (!validatePassword(req, res)) return;
    if(!req.file) {
        res.json({
            success: false,
            message: 'Falta archivo de backup'
        });
        return;
    }
    if(!req.body.databaseName) {
        res.json({
            success: false,
            message: 'Falta nombre de base de datos'
        });
        return;
    }
    try {

        const zipFile = req.file.path;

        const extractPath = path.join(
            BACKUP_PATH,
            `restore-${Date.now()}`
        );

        await utils.unzipDirectory(zipFile, extractPath)

        // Restaurar
        await utils.runCommand(`mongorestore --uri="${MONGO_URI}" --drop "${extractPath}/${req.body.databaseName}"`);

        // Limpiar
        utils.clearDirectory(extractPath);

        fs.unlinkSync(zipFile);

        res.json({
            success: true
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.toString()
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});