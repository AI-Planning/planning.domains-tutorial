
/* global $ */
/* global google */
/* global requirejs */
/* global changeDocument */

function launchViz() {

    var did = prompt("Domain ID?", window.viz_dom_id);
    window.viz_dom_id = did;

    $.getJSON('http://api.planning.domains/json/classical/problems/'+did, function(res) {
        if (res.error)
            window.toastr.error(res.message);

        else {

            window.toastr.info('Problems loaded.');

            var data = [];
            var domain = res.result[0].domain;

            for (var i = 0; i < res.result.length; i++) {
                if ((res.result[i].lower_bound !== null) ||
                    (res.result[i].upper_bound !== null)) {
                    var lower, upper, label;
                    if (res.result[i].lower_bound === null) {
                        upper = res.result[i].upper_bound;
                        lower = res.result[i].upper_bound + 1;
                        label = '??&rarr;' + upper;
                    } else if (res.result[i].upper_bound === null) {
                        lower = res.result[i].lower_bound;
                        upper = res.result[i].lower_bound-1;
                        label = lower + '&rarr;??';
                    } else {
                        lower = res.result[i].lower_bound;
                        upper = res.result[i].upper_bound;
                        label = lower + '&rarr;' + upper;
                    }
                    data.push(['', lower, lower, upper, upper,
                               '<strong class="viz_bound_tt">&nbsp;'+label+'&nbsp;</strong>']);
                }
            }

            var gdata = new google.visualization.DataTable();
            gdata.addColumn('string', 'Prob');
            gdata.addColumn('number');
            gdata.addColumn('number');
            gdata.addColumn('number');
            gdata.addColumn('number');
            gdata.addColumn({type:'string',role:'tooltip','p': {'html': true}});

            gdata.addRows(data);

            var options = {
                tooltip: {isHtml: true},
                legend: 'none',
                bar: { groupWidth: '100%' }, // Remove space between bars.
                candlestick: {
                    fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
                    risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
                }
            };

            var tab_name = 'BoundViz (' + did + ')';
            var chart_div = 'chart_d'+did+'_div';
            window.new_tab(tab_name, function(editor_name) {
                var html = '<div class="viz_display">';
                html += '<h2>Lower / Upper Bound Comparison for '+domain+'</h2>\n';
                html += '<div id="'+chart_div+'" style="width: 900px; height: 500px;"></div>\n';
                html += '</div>';
                $('#' + editor_name).html(html);

                changeDocument(editor_name);

                var chart = new google.visualization.CandlestickChart(
                    document.getElementById(chart_div));
                chart.draw(gdata, options);
            });

            window.toastr.success('Data ready!');
        }
    });
}


define(function () {

    window.viz_dom_id = 13;
    window.viz_gcharts_loaded = false;

    return {

        name: "Bound Vizualization",
        author: "Christian Muise",
        email: "christian.muise@gmail.com",
        description: "Given a domain id, plots the lower and upper bounds.",

        // This will be called whenever the plugin is loaded or enabled
        initialize: function() {

            // Add our button to the top menu
            window.add_menu_button('Viz', 'vizMenuItem', 'glyphicon-signal', "launchViz()");

            // Load the google charts api
            if (!(window.viz_gcharts_loaded)) {
                requirejs(['https://www.gstatic.com/charts/loader.js'],
                    function() {
                        window.viz_gcharts_loaded = true;
                        google.charts.load('current', {packages: ['corechart']});
                    });
            }

            // Inject some styles to make things look better
            window.inject_styles(
                '.viz_display { padding: 20px 0px 0px 40px; }\
                 .viz_bound_tt { padding: 10px; font-size: 20px }');

        },

        // This is called whenever the plugin is disabled
        disable: function() {
            window.remove_menu_button('vizMenuItem');
        },

        save: function() {
            // Used to save the plugin settings for later
            return {did: window.viz_dom_id};
        },

        load: function(settings) {
            // Restore the plugin settings from a previous save call
            window.viz_dom_id = settings['did'];
        }

    };
});
