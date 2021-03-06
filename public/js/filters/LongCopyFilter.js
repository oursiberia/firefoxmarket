/**
 *
 * @ngdoc filter
 * @name FirefoxMarket.filter:LongCopyFilter
 *
 * @description
 * temporary tool to filter out overly long reviews and/or descriptions down to
 * one sentence
 */

app.filter("LongCopyFilter",function() {

    /**
     * Does the filtering.
     * @param{Object} data the object that's passed back from the API query.
     * @param{number} length the number of items to return from the query
     */
    return function(data,appid,length) {
        var charlimit = 160;

        if(length !== undefined){
            charlimit = length;
        }

        delimiter =  ' <a href="/app/' + appid + '\" class=\"text-delimiter\">[...]</a>';

        //split the sentence based on spaces
        var review = data.split(" ");
        var short_review = [];

        var count = 0;

        for (var i = 0;i<review.length;++i) {
            var word = review[i];
            /**
             * get the character count of the word
             */
            var len = word.split("").length;
            count += len;
            if (count < charlimit) {
                short_review.push(word);
            }
        }
        if(count >= charlimit){
            short_review[short_review.length - 1] += delimiter;
        }
        short_review = short_review.join(" ");
        return short_review;
    };

});