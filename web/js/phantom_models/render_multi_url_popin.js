// Render Multiple URLs to file

'use strict';
var RenderUrlsToFile, arrayOfUrls, system;

system = require('system');

/*
Render given urls
@param array of URLs to render
@param callbackPerUrl Function called after finishing each URL, including the last URL
@param callbackFinal Function called after finishing everything
*/
RenderUrlsToFile = function (urls, callbackPerUrl, callbackFinal) {
    var getFilename, next, page, retrieve, urlIndex, webpage;

    urlIndex = '';
    webpage = require('webpage');
    page = null;
    getFilename = function () {
        return 'popin-' + urlIndex + '.png';
    };
    next = function (status, url, file) {
        page.close();
        callbackPerUrl(status, url, file);
        return retrieve();
    };
    retrieve = function () {
        var url, pos, indicesString = '';

        if (urls.length > 0) {
            url     = urls.shift();
            var pos = url.indexOf('presentations');

            var urlres  = url.substr(pos + 14),
                res     = urlres.split('/');

            urlIndex            = res[1];
            page                = webpage.create();
            page.viewportSize   = {
                width   : res[3],
                height  : res[2]
            };
            page.settings.userAgent = 'Phantom.js bot';
            return page.open(url, function (status) {
                var file;

                file = getFilename();
                if (status === 'success') {
                    return window.setTimeout((function () {
                        page.render(file);
                        return next(status, url, file);
                    }), 200);
                } else {
                    return next(status, url, file);
                }
            });
        } else {
            return callbackFinal();
        }
    };
    return retrieve();
};

arrayOfUrls = null;

if (system.args.length > 1) {
    arrayOfUrls = Array.prototype.slice.call(system.args, 1);
} else {
    console.log('Usage: phantomjs render_multi_url.js [domain.name1, domain.name2, ...]');
    arrayOfUrls = [ 'www.google.com', 'www.bbc.co.uk', 'phantomjs.org' ];
}

RenderUrlsToFile(arrayOfUrls, (function (status, url, file) {
    if (status !== "success") {
        return console.log("Unable to render '" + url + "'");
    } else {
        return console.log("Rendered '" + url + "' at '" + file + "'");
    }
}), function () {
    return phantom.exit();
});