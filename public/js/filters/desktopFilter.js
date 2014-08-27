/**
 * This filters out the desktop apps from a
 * general category/status search
 */

app.filter("DesktopApps",function(){

    /**
     * Does the filtering.
     * @param{Object} data the object that's passed back from the API query.
     * @param{number} length the number of items to return from the query
     */
    return function(data,length) {
        var apps = [];
        var limit = 0;
        if(length){
            limit = length;
        }else{
            limit = data.length;
        }

        for (var i = 0; i < limit; ++i) {
            var name = data[i].name["en-US"];
            var obj = {};


           for(var a = 0;a<data[i].device_types.length;++a){
               if(data[i].device_types[a] === "desktop"){
                   obj["icon"] = data[i].icons["64"];
                   obj["name"] =  data[i].name["en-US"];
                   obj["id"] = data[i].id;
                   obj["author"] = data[i].author;
                   obj["classname"] = "app";

                   obj["device"] = "desktop";
                   apps.push(obj);
               }
           };




        }

        /*
         obj["icon"] = data[i].icons["64"];
         obj["name"] =  data[i].name["en-US"];
         obj["id"] = data[i].id;
         obj["author"] = data[i].author;
         obj["classname"] = "app";

         obj["device"] = "desktop";

         console.log(obj);
         apps.push(obj);
         */


        return apps;
    }
});