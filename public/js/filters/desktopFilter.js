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
            limit = data.objects.length;
        }

        for (var i = 0; i < limit; ++i) {
            var name = data.objects[i].name["en-US"];


            var obj = {
                icon: data.objects[i].icons["64"],
                name: data.objects[i].name["en-US"],
                id: data.objects[i].id,
                author: data.objects[i].author
            };


            for (var a = 0; a < data.objects[i].device_types; ++a) {
                if (data.objects[i].device_types[a] === "desktop") {
                    obj["device"] = "desktop";
                }
            }


            apps.push(obj);
        }
        return apps;
    }
});