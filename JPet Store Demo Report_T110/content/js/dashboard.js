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

    var data = {"OkPercent": 98.9715909090909, "KoPercent": 1.0284090909090908};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8645170454545454, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7795454545454545, 500, 1500, "03_CatsPage-98"], "isController": false}, {"data": [0.7713636363636364, 500, 1500, "04_Persian-101"], "isController": false}, {"data": [0.9440909090909091, 500, 1500, "08_ConfirmCheckout-117"], "isController": false}, {"data": [0.7945454545454546, 500, 1500, "09_SignOut-126"], "isController": false}, {"data": [0.7872727272727272, 500, 1500, "06_AddtoCart-110"], "isController": false}, {"data": [0.9640909090909091, 500, 1500, "09_SignOut-125"], "isController": false}, {"data": [0.7872727272727272, 500, 1500, "02_SignIn-90"], "isController": false}, {"data": [0.7731818181818182, 500, 1500, "01_HomePage-63"], "isController": false}, {"data": [0.975909090909091, 500, 1500, "03_CatsPage-100"], "isController": false}, {"data": [0.9240909090909091, 500, 1500, "07_Checkout-113"], "isController": false}, {"data": [0.7968181818181819, 500, 1500, "02_SignIn-86"], "isController": false}, {"data": [0.925, 500, 1500, "02_SignIn-89"], "isController": false}, {"data": [0.9190909090909091, 500, 1500, "06_AddtoCart-109"], "isController": false}, {"data": [0.7672727272727272, 500, 1500, "05_AdultMalePersian-105"], "isController": false}, {"data": [0.9627272727272728, 500, 1500, "08_Buy-122"], "isController": false}, {"data": [0.96, 500, 1500, "08_Buy-121"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17600, 181, 1.0284090909090908, 1329.8283522727302, 72, 76671, 246.0, 866.8999999999996, 1599.9500000000007, 49843.610000014305, 64.66332817741267, 230.34836377783557, 37.64002446459867], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_CatsPage-98", 1100, 12, 1.0909090909090908, 1688.514545454548, 154, 76270, 349.0, 1436.6999999999998, 2526.050000000001, 59902.59000000024, 4.096895298253978, 25.74202906537714, 2.144468632679817], "isController": false}, {"data": ["04_Persian-101", 1100, 26, 2.3636363636363638, 2426.155454545452, 154, 76671, 365.0, 1520.6, 7064.850000000104, 60179.94, 4.099506195844592, 26.105669285148608, 2.217896906736234], "isController": false}, {"data": ["08_ConfirmCheckout-117", 1100, 8, 0.7272727272727273, 1209.5999999999992, 151, 60279, 179.5, 456.79999999999995, 1018.7500000000011, 32125.4, 4.0972157556569515, 3.107620297513735, 3.6810922804730417], "isController": false}, {"data": ["09_SignOut-126", 1100, 2, 0.18181818181818182, 867.7063636363627, 155, 60166, 350.5, 1302.6999999999998, 2445.9500000000007, 9423.820000000002, 4.097322585932029, 26.479907521566815, 2.2287194144181055], "isController": false}, {"data": ["06_AddtoCart-110", 1100, 6, 0.5454545454545454, 1390.0990909090892, 153, 70400, 340.0, 1312.5, 2380.6500000000015, 34135.98, 4.097063150641564, 26.119032196863884, 2.1525585693800395], "isController": false}, {"data": ["09_SignOut-125", 1100, 3, 0.2727272727272727, 450.4427272727273, 151, 60236, 173.0, 442.0, 603.8000000000002, 1263.89, 4.098727158911378, 2.5744474985654455, 2.2575020679941575], "isController": false}, {"data": ["02_SignIn-90", 1100, 13, 1.1818181818181819, 1653.7563636363627, 154, 60192, 357.0, 1303.0, 2610.800000000001, 60159.97, 4.097994218102703, 26.591693115416284, 2.1250341111450544], "isController": false}, {"data": ["01_HomePage-63", 1100, 13, 1.1818181818181819, 1437.072727272728, 153, 60259, 384.0, 1292.0, 2457.5000000000005, 60165.99, 4.085179710769276, 26.462339111232016, 1.8471076231310302], "isController": false}, {"data": ["03_CatsPage-100", 1100, 0, 0.0, 177.56181818181827, 72, 8333, 86.0, 344.0, 448.8000000000002, 1231.0, 4.099185380069016, 2.217723340388901, 3.1664605816744054], "isController": false}, {"data": ["07_Checkout-113", 1100, 23, 2.090909090909091, 1658.0190909090886, 150, 60619, 180.0, 510.0, 1116.6000000000022, 60173.98, 4.097078410631545, 3.4640281462303157, 2.14456448056495], "isController": false}, {"data": ["02_SignIn-86", 1100, 10, 0.9090909090909091, 1663.944545454546, 153, 74136, 330.0, 1366.6, 2667.75, 60166.91, 4.098895161440575, 26.007045849402864, 2.1255012995360794], "isController": false}, {"data": ["02_SignIn-89", 1100, 19, 1.7272727272727273, 1574.1872727272714, 150, 75834, 181.5, 508.0, 1061.1000000000008, 60169.0, 4.099338143223421, 3.209238778527667, 2.7382297753562694], "isController": false}, {"data": ["06_AddtoCart-109", 1100, 18, 1.6363636363636365, 1684.31, 150, 76078, 179.0, 513.8, 1177.950000000001, 60165.0, 4.0983606557377055, 3.205224391067437, 2.229284067622951], "isController": false}, {"data": ["05_AdultMalePersian-105", 1100, 22, 2.0, 2311.20909090909, 153, 75925, 384.0, 1430.1999999999998, 4636.400000000007, 60171.99, 4.098192697020614, 26.200720251545206, 2.2051798594319907], "isController": false}, {"data": ["08_Buy-122", 1100, 1, 0.09090909090909091, 415.30000000000024, 151, 60208, 175.0, 442.0, 594.7500000000002, 3772.2400000000052, 4.098238502578164, 2.95158309597702, 2.253230739210456], "isController": false}, {"data": ["08_Buy-121", 1100, 5, 0.45454545454545453, 669.3745454545457, 150, 62340, 176.0, 444.9, 689.8000000000002, 15622.58000000007, 4.097627845988795, 3.049826136020757, 2.645050787303314], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 172, 95.02762430939227, 0.9772727272727273], "isController": false}, {"data": ["522", 9, 4.972375690607735, 0.05113636363636364], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17600, 181, "504/Gateway Time-out", 172, "522", 9, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["03_CatsPage-98", 1100, 12, "504/Gateway Time-out", 11, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["04_Persian-101", 1100, 26, "504/Gateway Time-out", 24, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["08_ConfirmCheckout-117", 1100, 8, "504/Gateway Time-out", 7, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-126", 1100, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-110", 1100, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-125", 1100, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-90", 1100, 13, "504/Gateway Time-out", 12, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["01_HomePage-63", 1100, 13, "504/Gateway Time-out", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["07_Checkout-113", 1100, 23, "504/Gateway Time-out", 22, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-86", 1100, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-89", 1100, 19, "504/Gateway Time-out", 18, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-109", 1100, 18, "504/Gateway Time-out", 17, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["05_AdultMalePersian-105", 1100, 22, "504/Gateway Time-out", 21, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-122", 1100, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-121", 1100, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
