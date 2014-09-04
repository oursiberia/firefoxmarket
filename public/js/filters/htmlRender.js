/**
 * Prevents Angular from filtering out HTML.
 * Ironically in a filter
 */
app.filter('htmlRender',function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});