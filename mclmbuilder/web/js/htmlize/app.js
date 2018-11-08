var jsonFile = '';
process.argv.forEach(function (val, index, array) {
    if (index >= 2) {
        // get slides.json file with timestamp
        jsonFile = val;
    }
});

var fs          = require('fs'),
    ejs         = require('ejs'),
    cheerio     = require('cheerio'),
    data        = require('./' + jsonFile),
    compiled    = ejs.compile(fs.readFileSync(__dirname + '/views/section.ejs', 'utf8')),
    html        = compiled({ sections : data , dirname : __dirname}),
    $           = cheerio.load(html),
    json        = [];

$('body > section').each(function(index , elem) {
    var  slide = $(this);

    if (slide.hasClass('stack')) {
        var children = [],
            child    = $(this).find('section');

        child.each(function() {
            children.push($.html($(this)))
        });

        json[`${index}`] = children;

    } else {
        json[`${index}`] = $.html($(this));
    }
});

console.log(JSON.stringify(json));
