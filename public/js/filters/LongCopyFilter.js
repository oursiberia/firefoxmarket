/**
 * temporary tool to filter out overly long reviews and/or descriptions down to
 * one sentence
 */

app.filter("LongCopyFilter",function(){

    /**
     * Does the filtering.
     * @param{Object} data the object that's passed back from the API query.
     * @param{number} length the number of items to return from the query
     */
    return function(data) {
        var charlimit = 90;
        
    }
});