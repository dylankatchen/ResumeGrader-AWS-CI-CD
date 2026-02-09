const pdf = require('pdf-parse');
console.log('Type of pdf:', typeof pdf);

try {
    if (typeof pdf === 'function') {
        console.log('pdf is a function');
    } else {
        console.log('pdf is NOT a function');
        console.log('Exports:', Object.keys(pdf));
    }
} catch (e) {
    console.error('Error:', e);
}
