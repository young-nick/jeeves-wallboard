var series = [];
var plot = null;

function createPlot(color) {
     return $.plot("#graph", series, {
          grid: {
          show: true
          },
          xaxis: {
          tickFormatter: function() { return ""; }
          },
          yaxis: {
               tickFormatter: function(value) {
                    return formatBytes(value)
               }
          },
          // colors: [ color ]
     });
}

function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1e3,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

function updatePlot(targets, warning, critical) {
     var query_url = "http://graphite.cbr/render?format=json&from=-1hour&" + targets;
     series = [];
     $.getJSON(query_url, function(targets) {
          $.each(targets, function(index, graphite_series){
               var datapoints = graphite_series.datapoints;
               var target = graphite_series.target;
               var xzero = datapoints[0][1];

               var data = $.map(graphite_series.datapoints, function(value) {
                    if (value[0] === null) return null;
                    // hack of $.map will flat array object
                    return [[ value[1]+"000", value[0] ]];
               });
               // replace null value with previous item value
               var last = data[data.length-1][1];
               console.debug("last: " + last);
               // calculate color to render
               var color = "green";
               if (target === "TX") {
                    color = "blue"
               }

               // update plot
               series.push(               {
                    data: data,
                    color: color,
                    lines: { show: true }
               }
);
               if (plot === null) {
                    plot = createPlot();
               } else {
                    // must call before plot.setData to change color immediately
                    // plot.getOptions().colors = [ color ];
                    plot.setData(series);
                    plot.setupGrid();
                    plot.draw();
               }
          })
     });
}
updatePlot('target=alias(gateway_cbr.snmp.if_octets-wan1.rx,%20"RX")&target=alias(gateway_cbr.snmp.if_octets-wan1.tx,%20"TX")', 2, 3);
setInterval(function () {
updatePlot('target=alias(gateway_cbr.snmp.if_octets-wan1.rx,%20"RX")&target=alias(gateway_cbr.snmp.if_octets-wan1.tx,%20"TX")', 2, 3);
}, 10000);