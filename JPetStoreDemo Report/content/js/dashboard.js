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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9765625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.985, 500, 1500, "03_CatsPage-98"], "isController": false}, {"data": [0.995, 500, 1500, "04_Persian-101"], "isController": false}, {"data": [1.0, 500, 1500, "08_ConfirmCheckout-117"], "isController": false}, {"data": [0.99, 500, 1500, "09_SignOut-126"], "isController": false}, {"data": [0.99, 500, 1500, "06_AddtoCart-110"], "isController": false}, {"data": [1.0, 500, 1500, "09_SignOut-125"], "isController": false}, {"data": [0.98, 500, 1500, "02_SignIn-90"], "isController": false}, {"data": [0.735, 500, 1500, "01_HomePage-63"], "isController": false}, {"data": [1.0, 500, 1500, "03_CatsPage-100"], "isController": false}, {"data": [1.0, 500, 1500, "07_Checkout-113"], "isController": false}, {"data": [0.965, 500, 1500, "02_SignIn-86"], "isController": false}, {"data": [1.0, 500, 1500, "02_SignIn-89"], "isController": false}, {"data": [1.0, 500, 1500, "06_AddtoCart-109"], "isController": false}, {"data": [0.985, 500, 1500, "05_AdultMalePersian-105"], "isController": false}, {"data": [1.0, 500, 1500, "08_Buy-122"], "isController": false}, {"data": [1.0, 500, 1500, "08_Buy-121"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1600, 0, 0.0, 232.20000000000036, 158, 1589, 187.0, 318.9000000000001, 470.7999999999993, 783.97, 121.01959004613872, 423.3720117379548, 70.44456971862945], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_CatsPage-98", 100, 0, 0.0, 231.49, 162, 1229, 189.0, 285.1, 327.89999999999975, 1228.97, 10.588733587462938, 65.64125536054637, 5.542540237187632], "isController": false}, {"data": ["04_Persian-101", 100, 0, 0.0, 241.96, 164, 610, 215.0, 321.8000000000001, 444.79999999999995, 608.8199999999994, 10.679196924391286, 67.18445476025202, 5.777612398547629], "isController": false}, {"data": ["08_ConfirmCheckout-117", 100, 0, 0.0, 181.07999999999996, 160, 453, 174.0, 205.0, 216.84999999999997, 450.80999999999887, 10.530749789385004, 7.514677232518955, 9.461220513900589], "isController": false}, {"data": ["09_SignOut-126", 100, 0, 0.0, 245.29000000000002, 163, 581, 257.5, 301.9, 342.9, 580.2999999999996, 10.413412475268144, 66.70278819119025, 5.66432690305113], "isController": false}, {"data": ["06_AddtoCart-110", 100, 0, 0.0, 223.02999999999997, 163, 651, 195.0, 281.70000000000005, 297.95, 649.6299999999993, 10.529640939243972, 66.40851222754554, 5.532174634094978], "isController": false}, {"data": ["09_SignOut-125", 100, 0, 0.0, 179.59, 158, 445, 173.0, 200.0, 205.0, 442.80999999999887, 10.52742393936204, 6.433859814190967, 5.798307716601747], "isController": false}, {"data": ["02_SignIn-90", 100, 0, 0.0, 232.03000000000003, 162, 711, 190.0, 316.80000000000007, 491.89999999999975, 710.2799999999996, 10.59322033898305, 67.89881819385593, 5.4931640625], "isController": false}, {"data": ["01_HomePage-63", 100, 0, 0.0, 533.1499999999997, 291, 1589, 568.0, 776.2000000000003, 920.1499999999999, 1583.5199999999973, 9.704968944099377, 61.736586671438275, 4.388086544060559], "isController": false}, {"data": ["03_CatsPage-100", 100, 0, 0.0, 217.55000000000007, 201, 486, 209.0, 224.70000000000002, 289.8499999999995, 485.12999999999954, 10.54629824931449, 5.705712138789285, 8.146603432820081], "isController": false}, {"data": ["07_Checkout-113", 100, 0, 0.0, 176.57000000000008, 159, 375, 171.0, 191.0, 202.79999999999995, 373.46999999999923, 10.519671786240268, 7.545296227382705, 5.506390700610141], "isController": false}, {"data": ["02_SignIn-86", 100, 0, 0.0, 272.40000000000015, 161, 1221, 256.0, 437.6000000000003, 550.3499999999997, 1220.62, 10.501995379122032, 66.09457457073094, 5.44585893194707], "isController": false}, {"data": ["02_SignIn-89", 100, 0, 0.0, 187.23999999999995, 159, 461, 175.5, 200.9, 219.89999999999998, 460.4399999999997, 10.584250635055039, 7.162664221263759, 7.06994866638442], "isController": false}, {"data": ["06_AddtoCart-109", 100, 0, 0.0, 187.02000000000007, 160, 371, 177.0, 204.0, 218.84999999999997, 370.86999999999995, 10.659844366272251, 7.2610820741392175, 5.798372375013325], "isController": false}, {"data": ["05_AdultMalePersian-105", 100, 0, 0.0, 240.86000000000004, 163, 1220, 197.5, 300.70000000000005, 413.1499999999998, 1215.6399999999978, 10.647359454855195, 67.44228798445486, 5.729194394165248], "isController": false}, {"data": ["08_Buy-122", 100, 0, 0.0, 182.73000000000002, 159, 437, 173.0, 203.9, 213.84999999999997, 436.3899999999997, 10.530749789385004, 7.528457705876158, 5.789855597093513], "isController": false}, {"data": ["08_Buy-121", 100, 0, 0.0, 183.21, 160, 442, 172.0, 198.9, 206.95, 441.9, 10.530749789385004, 7.549642612679023, 6.79768126053075], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
