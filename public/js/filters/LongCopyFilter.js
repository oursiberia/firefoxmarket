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

        //split the sentence based on spaces
        var review = data.split(" ");
        var short_review = [];

        for(var i = 0;i<review.length;++i){
            var word = review[i];
            var count = 0;
            /**
             * get the character count of the word
             */
            var len = word.split("").length;
            count += len;
            if(count < charlimit){
                short_review.push(word);
            }


        }

        short_review = short_review.join(" ")+ " ...";

        return short_review;
    }
});