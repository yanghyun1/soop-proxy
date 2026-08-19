const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// cors 패키지 없이 직접 CORS 헤더를 허용하는 미들웨어
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.get('/get-stream', async (req, res) => {
    const { bjId, bno } = req.query;
    
    if (!bjId) {
        return res.status(400).json({ success: false, error: 'bjId가 필요합니다.' });
    }

    try {
        const targetUrl = `https://live.sooplive.co.kr/afreeca/get_live_stream.php?action=get_data&bjid=${bjId}&bno=${bno || ''}`;
        
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://play.sooplive.co.kr/'
            }
        });
        
        const data = await response.json();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
