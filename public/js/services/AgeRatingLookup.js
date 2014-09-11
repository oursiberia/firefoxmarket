/**
 * @ngdoc service
 * @name FirefoxMarket.service:RatingLookup
 *
 * @description
 * Does a lookup of the age based ratings that the
 * application in question is suitable for.
 */
app.factory("AgeRatingLookup",function(){
    /**
     * The rules we use to figure out what rating image to show
     * from which body
     * @type {{body: {name: string}}}
     *
     * TODO perhaps better as JSON?
     */
    var rules = {
        general:{
          "img": "/img/content_ratings/generic/general.png"
        },
        bodies:[
            {
                "name":"generic",
                "rating_types":[
                    {
                        "name":"three",
                        "rating":"3",
                        "img":"/img/content_ratings/generic/generic.png"
                    }
                ]
            },
            {
                "name":"esrb",
                rating_types:[
                    {
                        "name":"Early Childhood",
                        "slug":"childhood",
                        "img":""
                    },
                    {
                        "name":"Everyone",
                        "slug":"everyone",
                        "img":"/img/content_ratings/esrb/everyone.png"
                    },
                    {
                        "name":"Everyone 10+",
                        "img":"",
                        "slug":"everyone10",
                        "ratingNumber":10
                    },
                    {
                        "name":"Teen",
                        "img":"",
                        "slug":"teen"
                    },

                    {
                        "name":"Mature",
                        "img":"/img/content_ratings/esrb/mature.png",
                        "slug":"mature",
                        "ratingNumber":17
                    }

                ]

            }
        ]//end body
    }



    var API = {
        /**
         * Returns the appropriate rating image to show based
         * on the apps
         * @param app the app "object" containing all the information for a application
         */
        getImage:function(app){
            var ratings = app.content_ratings;
            var image = ""

            switch(ratings.body){
                case "generic":
                    //fetch the "generic" rating object from the rules object
                    var types = rules.bodies[0].rating_types;

                    for(var i = 0;i<types.length;++i){

                        if(types[i].rating === ratings.rating){
                            console.log(types[i]);
                            image = types[i].img
                        }else{
                            image = rules.general.img;
                        }
                    }

                    break;

                case "esrb":
                    var rule = rules.bodes[1];
                    for(var i = 0;i<rule.rating_types.length;++i){
                        if(rule.rating_types[i].ratingNumber === ratings.rating ){
                            image = rule.rating_types[i].img;
                        }else{
                            image = rules.general.img;
                        }
                    }
                    break;
            }

            return image;
        }

    };




    return API;

});