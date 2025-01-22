const express = require('express');
const axios = require('axios');
const moment = require('moment');
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد EJS كالمحرك القوالب
app.set('view engine', 'ejs');

// إعداد مجلد الملفات الثابتة
app.use(express.static('public'));

// مفتاح API الخاص بـ TMDB
const TMDB_API_KEY = '6883f42bc0c798fcf298e08b93bd29ed';

// نقطة البداية
app.get('/', async (req, res) => {
    try {
        // جلب الأنميات الشائعة
        const trendingResponse = await axios.get(`https://api.themoviedb.org/3/discover/tv`, {
            params: {
                api_key: TMDB_API_KEY,
                with_genres: '16', // النوع الخاص بالأنمي
                sort_by: 'popularity.desc', // ترتيب حسب الشعبية
                region: 'SA' // تحديد المنطقة (مثال: السعودية)
            }
        });
        const animeShows = trendingResponse.data.results;
        const topAnime = animeShows[0]; // اختيار الأنمي الأكثر شعبية

        // جلب أحدث الأنميات
        const latestResponse = await axios.get(`https://api.themoviedb.org/3/discover/tv`, {
            params: {
                api_key: TMDB_API_KEY,
                with_genres: '16', // النوع الخاص بالأنمي
                sort_by: 'first_air_date.desc', // ترتيب حسب تاريخ الإصدار
                first_air_date_year: new Date().getFullYear() // السنة الحالية
            }
        });
        const latestAnime = latestResponse.data.results.map(anime => ({
            ...anime,
            relativeTime: moment(anime.first_air_date).fromNow() // حساب الوقت النسبي
        }));

        // تمرير البيانات إلى القالب
        res.render('index', { animeShows, latestAnime, topAnime });
    } catch (error) {
        console.error('Error fetching data from TMDB:', error);
        res.status(500).send('Error fetching data');
    }
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 