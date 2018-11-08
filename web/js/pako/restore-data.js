var pako = require('pako');

var compressed = [];
process.argv.forEach(function (val, index, array) {
    if (index >= 2) {
        compressed = val;
    }
});

try {
    compressed = compressed.split(',');
    var uint = new Uint8Array(compressed),
        restored = pako.inflate(uint, {
        to: 'string'
    });
    console.log(restored);
} catch (err) {
    console.log(err);
}