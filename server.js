const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

// 모든 요청에 대해 CORS 허용 (크롬 확장 프로그램 접근 허용)
app.use(cors());

app.get('/get-stream', async (req, res) => {
    const { bjId, bno } = req.query;
    
    if (!bjId) {
        return res.status(400).json({ success: false, error: 'bjId가 필요합니다.' });
    }

    try {
        // SOOP 스트림 정보 호출 예시 로직
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
