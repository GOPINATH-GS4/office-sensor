$(function() {
    $(document).ready(function() {
	document.getElementById("incr").value = 5;
	document.getElementById("limit").value = 5;
    });
});
function barChartMultipleSeries(element, type, width, height, data) {

    var chart1 = new Highcharts.Chart({
        chart: {
            renderTo: element,
            type: type,
            events: {
                load: function() {
                    console.log('Chart loaded');
                },
                afterPrint: function() {},
                redraw: function() {}
            }

        },
        title: {
            text: data.chart_title
        },
        xAxis: {
            categories: data.categories
        },
        yAxis: {
            title: {
                text: data.yLabel
            },
            plotOptions: {
                series: {
                    animation: {
                        complete: function() {
                            this.hideLoading();
                        }
                    }
                }
            }
        },
        series: data.series
    });

}

function processData() {

	
	clearChart("chart");
	addSpinner("chart");
	var url = "http://localhost:7777/reports?";

        var data = [];
        var self = this;

	var sels = document.getElementById("selection");
	var sel = sels.options[sels.selectedIndex].value;
	
	var start_date = document.getElementById("start_date").value;
	var end_date = document.getElementById("end_date").value;
	var incr = document.getElementById("incr").value;
        var limit = document.getElementById("limit").value;

	url += "start_date=" + start_date + "&end_date=" + end_date + "&room=" + sel + "&cnt=" + limit + "&incr=" + incr;

	console.log(url);

        HTTPRequest.get(url, function(status, headers, content) {
            var d = JSON.parse(content);
            var chart = {};
            chart.chart_title = 'Status of';
            chart.series = [];
            chart.categories = [];
            chart.yLabel = 'Count';
            var obj = {};
            obj.type = 'line';
            obj.name = 'count';
            obj.data = [];
            for (var i = 0; i < d.length; i++) {
                chart.categories.push(d[i].start_date);
                obj.data.push(Number(d[i].cnt));
            }
            chart.series.push(obj);
            barChartMultipleSeries('chart', 'line', 0, 0, chart);
        });

}
function clearChart(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function addSpinner(elementID) {
    document.getElementById(elementID).innerHTML = "<img src=\"/assets/processing.gif\">"
}
