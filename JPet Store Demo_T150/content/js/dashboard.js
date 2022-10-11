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

    var data = {"OkPercent": 98.42083333333333, "KoPercent": 1.5791666666666666};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6043958333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.495, 500, 1500, "03_CatsPage-98"], "isController": false}, {"data": [0.4706666666666667, 500, 1500, "04_Persian-101"], "isController": false}, {"data": [0.692, 500, 1500, "08_ConfirmCheckout-117"], "isController": false}, {"data": [0.4693333333333333, 500, 1500, "09_SignOut-126"], "isController": false}, {"data": [0.48, 500, 1500, "06_AddtoCart-110"], "isController": false}, {"data": [0.7103333333333334, 500, 1500, "09_SignOut-125"], "isController": false}, {"data": [0.4846666666666667, 500, 1500, "02_SignIn-90"], "isController": false}, {"data": [0.462, 500, 1500, "01_HomePage-63"], "isController": false}, {"data": [0.97, 500, 1500, "03_CatsPage-100"], "isController": false}, {"data": [0.695, 500, 1500, "07_Checkout-113"], "isController": false}, {"data": [0.495, 500, 1500, "02_SignIn-86"], "isController": false}, {"data": [0.6793333333333333, 500, 1500, "02_SignIn-89"], "isController": false}, {"data": [0.6903333333333334, 500, 1500, "06_AddtoCart-109"], "isController": false}, {"data": [0.48033333333333333, 500, 1500, "05_AdultMalePersian-105"], "isController": false}, {"data": [0.703, 500, 1500, "08_Buy-122"], "isController": false}, {"data": [0.6933333333333334, 500, 1500, "08_Buy-121"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24000, 379, 1.5791666666666666, 2103.4241249999936, 88, 83820, 672.0, 2557.9000000000015, 5340.850000000002, 60278.0, 60.42417772764809, 215.40789830941333, 35.16741972002835], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_CatsPage-98", 1500, 37, 2.466666666666667, 2777.6786666666667, 262, 78879, 831.0, 2835.900000000003, 7432.250000000005, 60285.99, 3.8368862900379086, 24.002231708923574, 2.0083701674417176], "isController": false}, {"data": ["04_Persian-101", 1500, 34, 2.2666666666666666, 2800.209333333334, 260, 60474, 824.0, 3277.1000000000017, 7935.6500000000015, 60279.99, 3.8392825148836187, 24.309754493080334, 2.077111829341333], "isController": false}, {"data": ["08_ConfirmCheckout-117", 1500, 20, 1.3333333333333333, 1771.5393333333325, 257, 62230, 486.0, 1862.800000000001, 3180.550000000001, 60275.99, 3.8350518626846894, 3.0502394590403674, 3.445554407880776], "isController": false}, {"data": ["09_SignOut-126", 1500, 24, 1.6, 2406.4306666666653, 262, 61402, 865.5, 2840.6000000000004, 5511.900000000003, 60284.93, 3.834042205136594, 24.720463876772605, 2.085509285411214], "isController": false}, {"data": ["06_AddtoCart-110", 1500, 12, 0.8, 2081.1093333333342, 262, 61565, 853.0, 2789.7000000000003, 5324.150000000001, 36608.86, 3.834218611808371, 24.3459751648075, 2.0144625128446325], "isController": false}, {"data": ["09_SignOut-125", 1500, 16, 1.0666666666666667, 1401.1366666666647, 256, 60364, 465.0, 1572.0, 2308.5000000000005, 60272.92, 3.8352773928295654, 2.5972768172183502, 2.1123988765194093], "isController": false}, {"data": ["02_SignIn-90", 1500, 19, 1.2666666666666666, 2477.048666666666, 260, 71275, 845.5, 2907.5000000000005, 7641.900000000005, 60262.97, 3.8388010656511757, 24.816404340596343, 1.9906282869734124], "isController": false}, {"data": ["01_HomePage-63", 1500, 31, 2.066666666666667, 2674.8293333333354, 263, 70508, 870.0, 3288.400000000007, 5510.150000000007, 60274.99, 3.8272726344903605, 24.688786422080558, 1.7293416780102775], "isController": false}, {"data": ["03_CatsPage-100", 1500, 2, 0.13333333333333333, 238.8666666666665, 88, 18384, 113.0, 360.0, 439.8000000000002, 1579.5100000000004, 3.839046687926454, 2.0847423167878953, 2.961559585523723], "isController": false}, {"data": ["07_Checkout-113", 1500, 38, 2.533333333333333, 2253.4686666666653, 256, 69223, 483.5, 1756.5000000000005, 3218.9, 60285.97, 3.8348361630163286, 3.346071813538761, 2.0072970540788595], "isController": false}, {"data": ["02_SignIn-86", 1500, 29, 1.9333333333333333, 2754.6466666666674, 262, 60421, 818.0, 3319.800000000001, 7539.6500000000115, 60275.0, 3.840206449498725, 24.278287700746795, 1.991357055355296], "isController": false}, {"data": ["02_SignIn-89", 1500, 39, 2.6, 2643.168000000006, 256, 83820, 505.0, 1957.9, 4176.0, 60287.99, 3.840501415864855, 3.214082130562966, 2.5653349301284774], "isController": false}, {"data": ["06_AddtoCart-109", 1500, 25, 1.6666666666666667, 1970.042, 256, 60433, 484.0, 1923.3000000000006, 3412.3000000000043, 60271.0, 3.8358462388249013, 3.0088268016330475, 2.0864905810795604], "isController": false}, {"data": ["05_AdultMalePersian-105", 1500, 26, 1.7333333333333334, 2638.70066666667, 263, 73383, 852.0, 3072.4000000000015, 8136.650000000001, 60280.94, 3.8367194514002745, 24.421358761404647, 2.0644847829312023], "isController": false}, {"data": ["08_Buy-122", 1500, 6, 0.4, 1080.5986666666672, 258, 60297, 491.5, 1509.0, 2615.95, 8465.67, 3.8352577804596173, 2.8355189375441054, 2.1086427054675436], "isController": false}, {"data": ["08_Buy-121", 1500, 21, 1.4, 1685.312666666665, 257, 60437, 491.0, 1718.4000000000005, 2640.4000000000005, 60272.99, 3.8351008887207128, 3.0782052774503734, 2.475587585394913], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 1, 0.2638522427440633, 0.004166666666666667], "isController": false}, {"data": ["504/Gateway Time-out", 344, 90.76517150395779, 1.4333333333333333], "isController": false}, {"data": ["522", 32, 8.443271767810026, 0.13333333333333333], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.google-analytics.com:443 failed to respond", 2, 0.5277044854881267, 0.008333333333333333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24000, 379, "504/Gateway Time-out", 344, "522", 32, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.google-analytics.com:443 failed to respond", 2, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["03_CatsPage-98", 1500, 37, "504/Gateway Time-out", 32, "522", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["04_Persian-101", 1500, 34, "504/Gateway Time-out", 30, "522", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["08_ConfirmCheckout-117", 1500, 20, "504/Gateway Time-out", 19, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-126", 1500, 24, "504/Gateway Time-out", 22, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-110", 1500, 12, "504/Gateway Time-out", 11, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-125", 1500, 16, "504/Gateway Time-out", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-90", 1500, 19, "504/Gateway Time-out", 15, "522", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["01_HomePage-63", 1500, 31, "504/Gateway Time-out", 29, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 1, "522", 1, "", "", "", ""], "isController": false}, {"data": ["03_CatsPage-100", 1500, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.google-analytics.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["07_Checkout-113", 1500, 38, "504/Gateway Time-out", 36, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-86", 1500, 29, "504/Gateway Time-out", 27, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-89", 1500, 39, "504/Gateway Time-out", 37, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-109", 1500, 25, "504/Gateway Time-out", 23, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["05_AdultMalePersian-105", 1500, 26, "504/Gateway Time-out", 23, "522", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-122", 1500, 6, "504/Gateway Time-out", 5, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-121", 1500, 21, "504/Gateway Time-out", 19, "522", 2, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
