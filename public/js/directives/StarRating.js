/**
 * @ngdoc directive
 * @name FirefoxMarket.directive:starrating
 *
 * @description
 * This deals with handling the display of a application's star rating.
 * The rating is based on the average rating of the app.
 *
 * If the rating is fractional and the value is at or above .5, the number will be rounded
 * up, if not, then the number is rounded down.
 */
app.directive("starrating",function(){

    return {
        templateUrl:"/build/templates/stars.html",
        controller:function($scope){



        },
        link:function($scope,$el,$attr){



            var starratings = $el[0].children[0].children[0].children;


            /**
             * If this set of stars is for a review.
             */
            if($attr.delay === "true"){

                /**
                 * Not angular way but what the hell.
                 * waits till we actually have a rating value before changing
                 * the appropriate number of stars.
                 * @type {number}
                 */
                var s = setInterval(function(){
                    if($attr.rating !== ""){
                        rating = parseInt($attr.rating);
                        applyStars();
                        clearInterval(s);
                    }
                });

            }else{

                //get the number of stars
                var rating = "";
                var stars = $attr.rating;

                stars = stars.split(".");


                /**
                 * if it's above a .5, upp the rating,
                 * otherwise just floor it.
                 */

                if(stars.length == 1){
                    rating = stars[0];
                }else{

                    var decimals = 0;

                    if(stars[1] !== undefined){
                        decimals = stars[1].split("");
                    }

                    if(parseInt(decimals[0]) >= 5){

                        rating = parseInt(stars) + 1;
                    }else{
                        rating = Math.floor(parseInt(stars));
                    }

                }//end else clause

                applyStars();
            }


            /**
             * Changes all the stars to be filled if
             * necessary.
             */
            function applyStars(){
                /**
                 * loop through and replace the unfilled stars
                 * with the filled stars as needed
                 */
                for(var i = 0;i<starratings.length;++i){
                    if(i < rating){
                        starratings[i].children[0].src = "/img/star_filled.svg";
                    }
                }
            }

        }
    };
});