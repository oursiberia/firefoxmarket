
app.factory("API",["Utils",function(Utils){
    var routes = {
        'app': '/api/v1/fireplace/app/{0}/?cache=1&vary=0',
        'app/privacy': '/api/v1/apps/app/{0}/privacy/?cache=1&vary=0',
        'category': '/api/v1/fireplace/search/featured/?cat={0}&cache=1&vary=0',
        'collection': '/api/v1/fireplace/collection/{0}/?cache=1&vary=0',
        'reviews': '/api/v1/apps/rating/',
        'review': '/api/v1/apps/rating/{0}/',
        'settings': '/api/v1/account/settings/mine/',
        'installed': '/api/v1/account/installed/mine/',
        'login': '/api/v1/account/login/',
        'fxa-login': '/api/v1/account/fxa-login/',
        'logout': '/api/v1/account/logout/',
        'newsletter': '/api/v1/account/newsletter/',
        'record_free': '/api/v1/installs/record/',
        'record_paid': '/api/v1/receipts/install/',
        'app_abuse': '/api/v1/abuse/app/',
        'search': '/api/v1/fireplace/search/?cache=1&vary=0',
        'feedback': '/api/v1/account/feedback/',
        'consumer_info': '/api/v1/fireplace/consumer-info/',
        'features': '/api/v1/apps/features/',

        'prepare_nav_pay': '/api/v1/webpay/prepare/',
        'payments_status': '/api/v1/webpay/status/{0}/'
    };

    var re = /\{([^}]+)\}/g;
    function format(s, args) {
        if (!s) {
            throw "Format string is empty!";
        }
        if (!args) return;
        if (!(args instanceof Array || args instanceof Object))
            args = Array.prototype.slice.call(arguments, 1);
        return s.replace(re, function(_, match){ return args[match]; });
    }
    function template(s) {
        if (!s) {
            throw "Template string is empty!";
        }
        return function(args) { return format(s, args); };
    }
    return {
        format: format,
        template: template
    };

    function api(endpoint, args, params) {
        if (!(endpoint in routes)) {
            console.error('Invalid API endpoint: ' + endpoint);
            return '';
        }

        var path = format.format(api_endpoints[endpoint], args || []);
        var url = apiHost(path) + path;

        if (params) {
            return Utils.urlparams(url, params);
        }
        return url;
    }



    return {
        request:api
    };
}]);