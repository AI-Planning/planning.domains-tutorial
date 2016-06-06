

define(function () {

    //Do setup work here

    return {

        name: "Plan-o-matic 1000",
        author: "John Smith",
        email: "yeah@right.com",
        description: "A plugin template.",

        initialize: function() {
            // This will be called whenever the plugin is loaded or enabled
            console.log("Plugin initialized! :D");
        },

        disable: function() {
            // This is called whenever the plugin is disabled
            console.log("Plugin disabled! :(");
        },

        save: function() {
            // Used to save the plugin settings for later
            return {};
        },

        load: function(settings) {
            // Restore the plugin settings from a previous save call
        }

    };
});

