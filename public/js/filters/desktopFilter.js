/**
 * @ngdoc filter
 * @name FirefoxMarket.filter:DesktopApps
 *
 * @description
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
            var obj = {};
            for(var a = 0;a<data[i].device_types.length;++a){
                var name = "";

                /**
                 * Save out the name. If there isn't something specified
                 * for the language set in the browser, just loop
                 * through the list of available languages and take the last one.
                 */
                if(data[i].name.hasOwnProperty(navigator.language)){
                    name = data[i].name[navigator.language];
                }else{
                    for(var z in data[i].name){
                        name = data[i].name[z];
                    }
                }

                if(data[i].device_types[a] === "desktop"){
                    obj.icon = data[i].icons["64"];
                    obj.app_type = data[i].premium_type;
                    obj.name =  data[i].name["en-US"];
                    obj.id = data[i].id;
                    obj.manifest_url = data[i].manifest_url;
                    obj.premium_type = data[i].premium_type.charAt(0).toUpperCase() + data[i].premium_type.slice(1);
                    obj.author = data[i].author;
                    obj.classname = "app";
                    obj.rating = data[i].ratings.average;
                    if(data[i].hasOwnProperty("description")){
                        obj.description = data[i].description[navigator.language];
                    }

                    obj.device = "desktop";
                    apps.push(obj);
                }
            }
        }
        return apps;
    };
});