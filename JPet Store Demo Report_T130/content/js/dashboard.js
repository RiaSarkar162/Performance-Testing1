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

    var data = {"OkPercent": 98.55288461538461, "KoPercent": 1.4471153846153846};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.735, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6219230769230769, 500, 1500, "03_CatsPage-98"], "isController": false}, {"data": [0.6284615384615385, 500, 1500, "04_Persian-101"], "isController": false}, {"data": [0.813076923076923, 500, 1500, "08_ConfirmCheckout-117"], "isController": false}, {"data": [0.6680769230769231, 500, 1500, "09_SignOut-126"], "isController": false}, {"data": [0.6411538461538462, 500, 1500, "06_AddtoCart-110"], "isController": false}, {"data": [0.8426923076923077, 500, 1500, "09_SignOut-125"], "isController": false}, {"data": [0.6246153846153846, 500, 1500, "02_SignIn-90"], "isController": false}, {"data": [0.6184615384615385, 500, 1500, "01_HomePage-63"], "isController": false}, {"data": [0.9515384615384616, 500, 1500, "03_CatsPage-100"], "isController": false}, {"data": [0.8161538461538461, 500, 1500, "07_Checkout-113"], "isController": false}, {"data": [0.6388461538461538, 500, 1500, "02_SignIn-86"], "isController": false}, {"data": [0.7973076923076923, 500, 1500, "02_SignIn-89"], "isController": false}, {"data": [0.785, 500, 1500, "06_AddtoCart-109"], "isController": false}, {"data": [0.6388461538461538, 500, 1500, "05_AdultMalePersian-105"], "isController": false}, {"data": [0.8430769230769231, 500, 1500, "08_Buy-122"], "isController": false}, {"data": [0.8307692307692308, 500, 1500, "08_Buy-121"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20800, 301, 1.4471153846153846, 1624.7713461538344, 87, 75347, 373.0, 1714.800000000003, 3568.9000000000015, 60160.98, 71.72166477018034, 256.09455344751046, 41.748627741284785], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_CatsPage-98", 1300, 30, 2.3076923076923075, 2356.804615384617, 160, 62042, 611.5, 2787.700000000002, 5442.750000000004, 60580.74, 4.552729361252071, 28.610056514036415, 2.3830692750303806], "isController": false}, {"data": ["04_Persian-101", 1300, 38, 2.923076923076923, 2644.3361538461545, 160, 67728, 602.5, 2432.1000000000017, 8759.500000000055, 60704.98, 4.561643595276944, 29.018111698861343, 2.467920460726003], "isController": false}, {"data": ["08_ConfirmCheckout-117", 1300, 15, 1.1538461538461537, 1277.1207692307696, 156, 61099, 211.0, 1209.9, 2297.4500000000007, 32470.05, 4.580868180232496, 3.6009987283686122, 4.115623755677634], "isController": false}, {"data": ["09_SignOut-126", 1300, 7, 0.5384615384615384, 1191.1253846153847, 160, 60903, 546.0, 1761.8000000000002, 3276.0, 11215.000000000007, 4.603953733806478, 29.799505561930264, 2.504299052470907], "isController": false}, {"data": ["06_AddtoCart-110", 1300, 16, 1.2307692307692308, 1715.4615384615377, 161, 61499, 570.0, 2385.5000000000014, 4112.600000000001, 31124.56, 4.572940154283965, 29.14964226636673, 2.402579885746849], "isController": false}, {"data": ["09_SignOut-125", 1300, 6, 0.46153846153846156, 840.180769230769, 155, 61187, 196.5, 1191.0, 1653.700000000003, 7962.560000000002, 4.597034559091344, 2.9463634915007906, 2.5319604407495286], "isController": false}, {"data": ["02_SignIn-90", 1300, 13, 1.0, 1876.6676923076934, 161, 61666, 619.0, 2520.7000000000003, 4834.050000000002, 32184.56, 4.552075746540423, 29.525826081380607, 2.3605002162235977], "isController": false}, {"data": ["01_HomePage-63", 1300, 23, 1.7692307692307692, 2056.77846153846, 162, 67761, 634.0, 2523.6000000000004, 4739.400000000002, 60298.47, 4.537632682124869, 29.468215628305057, 2.0516835271716936], "isController": false}, {"data": ["03_CatsPage-100", 1300, 0, 0.0, 228.42153846153838, 87, 2737, 104.0, 445.7000000000003, 649.9000000000001, 1272.94, 4.556080088878608, 2.4649105168347156, 3.5193938967802527], "isController": false}, {"data": ["07_Checkout-113", 1300, 20, 1.5384615384615385, 1436.473076923077, 156, 75347, 209.0, 1205.0, 3194.4500000000007, 60442.16, 4.576127399386799, 3.726415618410816, 2.3953166856165273], "isController": false}, {"data": ["02_SignIn-86", 1300, 25, 1.9230769230769231, 2046.1084615384616, 160, 63444, 599.0, 2431.100000000001, 5469.450000000003, 59888.05000000025, 4.551741040948163, 28.920850311181525, 2.360326653069799], "isController": false}, {"data": ["02_SignIn-89", 1300, 27, 2.076923076923077, 1675.3161538461543, 157, 61098, 236.0, 1258.0000000000018, 3220.4500000000007, 60227.0, 4.553127998935269, 3.687031525814485, 3.041347218038793], "isController": false}, {"data": ["06_AddtoCart-109", 1300, 26, 2.0, 2041.7230769230753, 155, 63110, 219.5, 1491.8000000000002, 7368.850000000002, 60657.97, 4.568552893299691, 3.6881661191724597, 2.4850429312186795], "isController": false}, {"data": ["05_AdultMalePersian-105", 1300, 39, 3.0, 2657.626153846153, 160, 61350, 587.5, 2567.700000000004, 9261.600000000008, 60702.63, 4.564895253211228, 29.20054309085546, 2.4563059419134636], "isController": false}, {"data": ["08_Buy-122", 1300, 6, 0.46153846153846156, 822.2492307692312, 157, 61250, 197.0, 1192.0, 1598.4000000000024, 9476.260000000002, 4.592568517589537, 3.4167992182035287, 2.525015698635654], "isController": false}, {"data": ["08_Buy-121", 1300, 10, 0.7692307692307693, 1129.948461538462, 156, 61021, 197.5, 1193.0, 2321.1500000000015, 31438.580000000125, 4.5872692691774315, 3.50428846270903, 2.961118151295198], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 202, 67.10963455149502, 0.9711538461538461], "isController": false}, {"data": ["522", 99, 32.89036544850498, 0.47596153846153844], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20800, 301, "504/Gateway Time-out", 202, "522", 99, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["03_CatsPage-98", 1300, 30, "504/Gateway Time-out", 23, "522", 7, "", "", "", "", "", ""], "isController": false}, {"data": ["04_Persian-101", 1300, 38, "504/Gateway Time-out", 24, "522", 14, "", "", "", "", "", ""], "isController": false}, {"data": ["08_ConfirmCheckout-117", 1300, 15, "504/Gateway Time-out", 11, "522", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-126", 1300, 7, "522", 4, "504/Gateway Time-out", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-110", 1300, 16, "504/Gateway Time-out", 10, "522", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-125", 1300, 6, "504/Gateway Time-out", 4, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-90", 1300, 13, "504/Gateway Time-out", 10, "522", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["01_HomePage-63", 1300, 23, "504/Gateway Time-out", 16, "522", 7, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["07_Checkout-113", 1300, 20, "504/Gateway Time-out", 14, "522", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-86", 1300, 25, "504/Gateway Time-out", 13, "522", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-89", 1300, 27, "504/Gateway Time-out", 16, "522", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-109", 1300, 26, "504/Gateway Time-out", 20, "522", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["05_AdultMalePersian-105", 1300, 39, "504/Gateway Time-out", 25, "522", 14, "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-122", 1300, 6, "504/Gateway Time-out", 4, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-121", 1300, 10, "504/Gateway Time-out", 9, "522", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
