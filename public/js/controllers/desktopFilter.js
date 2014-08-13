/**
 * This filters out the desktop apps from a
 * general category/status search
 */

app.filter("DesktopApps",function(){

    /**
     * Does the filtering.
     * @param{Object} data the object that's passed back from the API query.
     */
    return function(data) {
        var apps = [];
        for (var i = 0; i < data.objects.length; ++i) {
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