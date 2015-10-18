$(function() {
    $(document).ready(function() {
        document.getElementById("incr").value = 10;
        document.getElementById("limit").value = 10;
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
            },
	    labels: {
		enabled: false
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

    var sels = document.getElementById("resource");
    var sel = sels.options[sels.selectedIndex].value;

    var start_date = document.getElementById("start_date").value;
    var end_date = document.getElementById("end_date").value;
    var incr = document.getElementById("incr").value;
    var limit = document.getElementById("limit").value;
    var crowd_analysis = document.getElementById("crowd_analysis");
    var ca = crowd_analysis.options[crowd_analysis.selectedIndex].value;
    url += "start_date=" + start_date + "&end_date=" + end_date + "&room=" + sel + "&cnt=" + limit + "&incr=" + incr +
        "&crowd_analysis=" + ca;

    console.log(url);

    HTTPRequest.get(url, function(status, headers, content) {
        var d = JSON.parse(content);
        var chart = {};
        chart.chart_title = 'Status of ' + sel;
        chart.series = [];
        chart.categories = [];
        chart.yLabel = 'Occupied';

        var obj = {};
        obj.type = 'line';
        obj.name = 'Yes/No';
        obj.data = [];

        var crd = {};
        crd.type = 'column';
        crd.name = 'Crowd Analysis';
        crd.data = [];

        for (var i = 0; i < d.length; i++) {
            chart.categories.push(d[i].start_date);
            obj.data.push(Number(d[i].cnt));
            if (typeof d[i].crd != 'undefined') crd.data.push(Number(d[i].crd));
        }
        chart.series.push(obj);
        if (ca === 'true') chart.series.push(crd);
        barChartMultipleSeries('chart', 'line', 0, 0, chart);
    });

}

function clearChart(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function addSpinner(elementID) {
    document.getElementById(elementID).innerHTML = "<img src=\"/assets/processing.gif\">"
}
