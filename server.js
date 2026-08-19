const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// CORS 허용
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.get('/get-stream', async (req, res) => {
    const { bjId, bno } = req.query;
    
    if (!bjId) {
        return res.status(400).json({ success: false, error: 'bjId가 필요합니다.' });
    }

    try {
        // SOOP HLS 스트림 정보 간소화 요청 (500 에러 방지 처리)
        const targetUrl = `https://live.sooplive.co.kr/afreeca/get_live_stream.php?action=get_data&bjid=${encodeURIComponent(bjId)}&bno=${encodeURIComponent(bno || '')}&type=aid&player_type=html5`;
        
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': 'https://play.sooplive.co.kr',
                'Referer': 'https://play.sooplive.co.kr/'
            }
        });
        
        const data = await response.json();
        res.json({ success: true, data });
    } catch (error) {
        // 에러가 발생해도 500을 뱉지 않고 성공 응답 형태로 넘겨 확장 프로그램이 끊기지 않게 함
        res.json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
