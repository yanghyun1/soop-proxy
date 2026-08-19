const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// CORS 설정
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
        // SOOP 1080p 원본 스트림 API 호출
        const formData = new URLSearchParams();
        formData.append('bid', bjId);
        formData.append('bno', bno || '');
        formData.append('type', 'aid');
        formData.append('pwd', '');
        formData.append('player_type', 'html5');
        formData.append('stream_type', 'common');
        formData.append('quality', 'master'); // 1080p 최고화질 요청

        const response = await fetch('https://live.sooplive.co.kr/afreeca/get_live_stream.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://play.sooplive.co.kr/'
            },
            body: formData
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
