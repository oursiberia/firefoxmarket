app.directive("starrating",function(){

    return {
        templateUrl:"/build/templates/stars.html",
        controller:function($scope){


        },
        link:function($scope,$el,$attr){

            //get the number of stars
            var rating = ""
            var stars = $attr.rating;
            stars = stars.split(".");

            var starratings = document.getElementById("rating").children;


            /**
             * if it's above a .5, upp the rating,
             * otherwise just floor it.
             */
            if(parseInt(stars[1]) >= 5){
                rating = parseInt(stars) + 1;
            }else{
                rating = parseInt(stars);
            }

            /**
             * loop through and replace the unfilled stars
             * with the filled stars as needed
             */
            for(var i = 0;i<starratings.length;++i){
                if(i < rating){
                    starratings[i].children[0].src = "/img/star_filled.png";
                }
            }

        }
    }
});