import https from 'https';

https.get('https://apiv2.rahilatialmasiya.com/public/api/posts?all=1', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.length > 0) {
                console.log('--- Raw Post Content (AR) ---');
                console.log(parsed[0].content_ar);
                console.log('--- Raw Post Content (EN) ---');
                console.log(parsed[0].content_en);
                console.log('-------------------');
            } else {
                console.log('No posts found.');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Error fetching data:', err.message);
});
