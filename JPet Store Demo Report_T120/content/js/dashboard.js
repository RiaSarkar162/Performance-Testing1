/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.875, "KoPercent": 1.125};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8232552083333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.745, 500, 1500, "03_CatsPage-98"], "isController": false}, {"data": [0.7183333333333334, 500, 1500, "04_Persian-101"], "isController": false}, {"data": [0.9229166666666667, 500, 1500, "08_ConfirmCheckout-117"], "isController": false}, {"data": [0.7133333333333334, 500, 1500, "09_SignOut-126"], "isController": false}, {"data": [0.7225, 500, 1500, "06_AddtoCart-110"], "isController": false}, {"data": [0.9558333333333333, 500, 1500, "09_SignOut-125"], "isController": false}, {"data": [0.7270833333333333, 500, 1500, "02_SignIn-90"], "isController": false}, {"data": [0.7041666666666667, 500, 1500, "01_HomePage-63"], "isController": false}, {"data": [0.94125, 500, 1500, "03_CatsPage-100"], "isController": false}, {"data": [0.91375, 500, 1500, "07_Checkout-113"], "isController": false}, {"data": [0.73625, 500, 1500, "02_SignIn-86"], "isController": false}, {"data": [0.89125, 500, 1500, "02_SignIn-89"], "isController": false}, {"data": [0.8766666666666667, 500, 1500, "06_AddtoCart-109"], "isController": false}, {"data": [0.7066666666666667, 500, 1500, "05_AdultMalePersian-105"], "isController": false}, {"data": [0.9495833333333333, 500, 1500, "08_Buy-122"], "isController": false}, {"data": [0.9475, 500, 1500, "08_Buy-121"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19200, 216, 1.125, 1483.0961979166561, 88, 123971, 299.0, 1241.9000000000015, 2463.0, 60160.0, 66.9337042576111, 239.3264899503575, 38.96159286528546], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_CatsPage-98", 1200, 15, 1.25, 1784.6666666666642, 160, 123971, 423.5, 1425.8000000000002, 2716.800000000001, 60166.97, 4.249713144362755, 26.752331587409515, 2.2244592240023797], "isController": false}, {"data": ["04_Persian-101", 1200, 26, 2.1666666666666665, 2421.8991666666657, 160, 60467, 434.5, 1702.6000000000058, 4787.1500000000015, 60182.0, 4.2510680808553145, 27.161993314752625, 2.299894254681489], "isController": false}, {"data": ["08_ConfirmCheckout-117", 1200, 10, 0.8333333333333334, 1182.9724999999987, 157, 60234, 185.0, 611.4000000000005, 1262.8500000000001, 32221.89, 4.246359631274439, 3.2453584469381975, 3.815088731223128], "isController": false}, {"data": ["09_SignOut-126", 1200, 5, 0.4166666666666667, 1404.529999999999, 159, 80592, 445.5, 1585.4000000000015, 2777.0, 18801.24, 4.240657301881791, 27.534023958609417, 2.306685661277498], "isController": false}, {"data": ["06_AddtoCart-110", 1200, 5, 0.4166666666666667, 1459.250833333333, 161, 61171, 435.0, 1532.6000000000004, 2667.4500000000007, 32247.7, 4.246209373507192, 27.159039201137627, 2.230918596627802], "isController": false}, {"data": ["09_SignOut-125", 1200, 8, 0.6666666666666666, 730.3275000000012, 156, 60250, 180.0, 461.0, 711.95, 16612.73000000008, 4.242546376335077, 2.7675778971288567, 2.336714996340804], "isController": false}, {"data": ["02_SignIn-90", 1200, 4, 0.3333333333333333, 1355.2608333333346, 160, 60211, 429.0, 1506.1000000000008, 2754.3000000000006, 31626.710000000003, 4.251128320308348, 27.670223370223678, 2.2044425176598956], "isController": false}, {"data": ["01_HomePage-63", 1200, 20, 1.6666666666666667, 1924.3991666666661, 162, 63534, 494.0, 1490.0, 4636.400000000001, 60170.97, 4.238710019250808, 27.593246791164052, 1.9165261122198476], "isController": false}, {"data": ["03_CatsPage-100", 1200, 0, 0.0, 261.2724999999999, 88, 13822, 102.0, 522.6000000000004, 783.7500000000002, 2297.92, 4.250827140114348, 2.299763901975926, 3.2835979178031725], "isController": false}, {"data": ["07_Checkout-113", 1200, 18, 1.5, 1295.214166666666, 156, 60270, 183.0, 523.9000000000001, 766.6500000000003, 60169.99, 4.246089174949489, 3.4344047226242247, 2.2225623025126233], "isController": false}, {"data": ["02_SignIn-86", 1200, 23, 1.9166666666666667, 2218.607500000004, 160, 60309, 418.0, 1653.2000000000016, 4988.350000000006, 60179.99, 4.2512488043362735, 27.122327331765685, 2.2045049952173454], "isController": false}, {"data": ["02_SignIn-89", 1200, 27, 2.25, 1976.9399999999953, 157, 75645, 189.5, 615.900000000001, 1602.8000000000002, 60241.55, 4.252680074421901, 3.468689089217684, 2.8406573934615045], "isController": false}, {"data": ["06_AddtoCart-109", 1200, 20, 1.6666666666666667, 1851.2200000000003, 156, 60295, 186.5, 711.9000000000001, 2365.700000000002, 60165.99, 4.247757537999731, 3.3286579884832674, 2.310547801431494], "isController": false}, {"data": ["05_AdultMalePersian-105", 1200, 30, 2.5, 2802.608333333335, 160, 62388, 448.5, 2512.800000000002, 15833.050000000001, 60194.88, 4.249412164650557, 27.259698923615048, 2.286548928439899], "isController": false}, {"data": ["08_Buy-122", 1200, 2, 0.16666666666666666, 424.11500000000007, 157, 61400, 182.0, 471.0, 723.8500000000001, 1822.8000000000002, 4.244181933932234, 3.075978455250407, 2.3334711218787576], "isController": false}, {"data": ["08_Buy-121", 1200, 3, 0.25, 636.2550000000002, 155, 60222, 185.0, 476.9000000000001, 722.7000000000003, 15642.85, 4.244782454899187, 3.1059869119207644, 2.740040237000354], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 208, 96.29629629629629, 1.0833333333333333], "isController": false}, {"data": ["522", 8, 3.7037037037037037, 0.041666666666666664], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19200, 216, "504/Gateway Time-out", 208, "522", 8, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["03_CatsPage-98", 1200, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["04_Persian-101", 1200, 26, "504/Gateway Time-out", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["08_ConfirmCheckout-117", 1200, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-126", 1200, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-110", 1200, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-125", 1200, 8, "504/Gateway Time-out", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-90", 1200, 4, "504/Gateway Time-out", 2, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["01_HomePage-63", 1200, 20, "504/Gateway Time-out", 18, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["07_Checkout-113", 1200, 18, "504/Gateway Time-out", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-86", 1200, 23, "504/Gateway Time-out", 21, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-89", 1200, 27, "504/Gateway Time-out", 25, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-109", 1200, 20, "504/Gateway Time-out", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["05_AdultMalePersian-105", 1200, 30, "504/Gateway Time-out", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-122", 1200, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-121", 1200, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
