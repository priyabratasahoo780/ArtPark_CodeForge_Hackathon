const http = require('http');
const data = JSON.stringify({
    resumes: ['react resume', 'github resume'],
    job_description_text: 'need a react dev',
    candidate_names: ['react', 'github']
});
const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/hr/analyze-multiple',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};
const req = http.request(options, res => {
    let body = '';
    res.on('data', d => { body += d; });
    res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('BODY:', body);
    });
});
req.on('error', e => { console.error('REQUEST ERROR:', e); });
req.write(data);
req.end();
