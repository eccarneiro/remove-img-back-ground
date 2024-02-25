require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.post('/remove-bg', upload.array('image', 2), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append('image_file', fs.createReadStream(req.files[0].path)); // Changed from req.file.path to req.files[0].path
        formData.append('size', 'auto');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': process.env.REMOVE_BG_API_KEY
            },
            body: formData
        });

        if (!response.ok) throw new Error(`Unexpected response ${response.statusText}`);

        const imageBuffer = await response.buffer();
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
