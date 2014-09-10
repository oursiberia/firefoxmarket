/**
 *
 * @ngdoc service
 * @name FirefoxMarket.service:Utils
 *
 * @description
 * Common functionality that could be useful across a wide variety of contexts.
 * Currently not used.
 */

app.factory("Utils",function(){


    function baseurl(url) {
        return url.split('?')[0];
    }

    function encodeURIComponent(uri) {
        return window.encodeURIComponent(uri).replace(/%20/g, '+');
    }

    function decodeURIComponent(uri) {
        return window.decodeURIComponent(uri.replace(/\+/g, ' '));
    }

    function urlparams(url, kwargs) {
        return baseurl(url) + '?' + urlencode(_.defaults(kwargs, querystring(url)));
    }
    return {
        baseurl:baseurl,
        encodeURIComponent:encodeURIComponent,
        decodeURIComponent:decodeURIComponent,
        urlparams:urlparams
    }

});