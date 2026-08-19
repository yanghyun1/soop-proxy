const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/get-stream', async (req, res) => {
    const { bjId, bno } = req.query;
    if (!bjId) {
        return res.status(400).json({ success: false, error: 'bjId is required' });
    }
    try {
        const response = await axios.get(`https://bjapi.afreecatv.com/api/${bjId}/station`, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 
                'Referer': 'https://play.sooplive.co.kr/' 
            }
        });
        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
