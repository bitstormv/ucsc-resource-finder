import https from 'https';

https.get('https://rocketreach.co/university-of-colombo-school-of-computing-profile_b5cfa458f42e0a19', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const match = data.match(/<img[^>]+src="([^">]+)"[^>]*alt="University of Colombo School of Computing Logo"/i);
    if (match) {
      console.log('LOGO_URL:', match[1]);
    } else {
      const match2 = data.match(/<img[^>]+src="([^">]+)"/g);
      console.log('ALL_IMAGES:', match2?.slice(0, 5));
    }
  });
});
