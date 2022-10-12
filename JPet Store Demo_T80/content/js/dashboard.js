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

    var data = {"OkPercent": 99.34375, "KoPercent": 0.65625};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8856640625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.835, 500, 1500, "03_CatsPage-98"], "isController": false}, {"data": [0.830625, 500, 1500, "04_Persian-101"], "isController": false}, {"data": [0.9475, 500, 1500, "08_ConfirmCheckout-117"], "isController": false}, {"data": [0.83625, 500, 1500, "09_SignOut-126"], "isController": false}, {"data": [0.8175, 500, 1500, "06_AddtoCart-110"], "isController": false}, {"data": [0.95375, 500, 1500, "09_SignOut-125"], "isController": false}, {"data": [0.820625, 500, 1500, "02_SignIn-90"], "isController": false}, {"data": [0.80125, 500, 1500, "01_HomePage-63"], "isController": false}, {"data": [0.9825, 500, 1500, "03_CatsPage-100"], "isController": false}, {"data": [0.935, 500, 1500, "07_Checkout-113"], "isController": false}, {"data": [0.833125, 500, 1500, "02_SignIn-86"], "isController": false}, {"data": [0.9325, 500, 1500, "02_SignIn-89"], "isController": false}, {"data": [0.928125, 500, 1500, "06_AddtoCart-109"], "isController": false}, {"data": [0.81875, 500, 1500, "05_AdultMalePersian-105"], "isController": false}, {"data": [0.951875, 500, 1500, "08_Buy-122"], "isController": false}, {"data": [0.94625, 500, 1500, "08_Buy-121"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12800, 84, 0.65625, 879.2491406250008, 72, 63425, 257.0, 827.8999999999996, 1318.949999999999, 15833.879999999997, 80.78207142902222, 286.87253620598796, 47.022620557774964], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_CatsPage-98", 800, 7, 0.875, 1055.7125000000017, 156, 60364, 315.5, 1233.5, 1516.999999999996, 15788.270000000062, 5.169160786746271, 32.45851849428808, 2.7057325993125017], "isController": false}, {"data": ["04_Persian-101", 800, 13, 1.625, 1609.7937500000007, 156, 60193, 336.0, 1261.6, 1551.599999999998, 60165.99, 5.175882973285974, 32.89199706389951, 2.80023356171917], "isController": false}, {"data": ["08_ConfirmCheckout-117", 800, 2, 0.25, 550.4487500000001, 152, 60181, 179.0, 461.0, 1187.85, 7592.830000000002, 5.170731076740113, 3.7701774651460407, 4.645578701758694], "isController": false}, {"data": ["09_SignOut-126", 800, 3, 0.375, 808.6512500000002, 156, 60184, 333.0, 1060.8999999999983, 1363.7499999999995, 8985.570000000036, 5.166890565257828, 33.41999312157694, 2.810505903172471], "isController": false}, {"data": ["06_AddtoCart-110", 800, 6, 0.75, 1131.43375, 156, 60201, 342.5, 1292.8, 1534.9999999999986, 17542.240000000013, 5.168760014472528, 32.96421496832519, 2.7156180544787305], "isController": false}, {"data": ["09_SignOut-125", 800, 2, 0.25, 480.8662499999997, 150, 60286, 177.0, 449.0, 1186.0, 2341.2800000000025, 5.16976206170111, 3.2396965228503483, 2.8474080105463146], "isController": false}, {"data": ["02_SignIn-90", 800, 1, 0.125, 783.1875000000003, 155, 60172, 333.0, 1274.6999999999998, 1543.199999999999, 15483.020000000059, 5.172737089171522, 33.5347497304519, 2.682347064794998], "isController": false}, {"data": ["01_HomePage-63", 800, 8, 1.0, 1247.8462500000016, 155, 60211, 368.0, 1268.9, 1487.8999999999985, 59737.49000000038, 5.149562609025896, 33.39143731332835, 2.328366687479482], "isController": false}, {"data": ["03_CatsPage-100", 800, 0, 0.0, 157.23124999999987, 72, 6225, 85.0, 344.0, 392.94999999999993, 699.7100000000003, 5.1725364178892175, 2.7984230229595957, 3.9955823306155964], "isController": false}, {"data": ["07_Checkout-113", 800, 6, 0.75, 853.7687499999993, 151, 60222, 177.0, 503.9, 1203.0, 15693.96, 5.170129576372508, 3.945625535189194, 2.7062397001324845], "isController": false}, {"data": ["02_SignIn-86", 800, 5, 0.625, 999.7412500000003, 157, 60180, 321.5, 1202.1999999999985, 1499.7499999999995, 15858.78, 5.1753472334534445, 32.90096861879686, 2.68370056734744], "isController": false}, {"data": ["02_SignIn-89", 800, 7, 0.875, 861.5300000000001, 151, 60202, 182.5, 510.9, 1218.85, 15778.420000000002, 5.175882973285974, 3.7830131867749723, 3.4573280798121155], "isController": false}, {"data": ["06_AddtoCart-109", 800, 9, 1.125, 1036.6512500000008, 151, 63425, 177.0, 513.0, 1243.0499999999988, 31770.760000000006, 5.172770535899027, 3.890230323669951, 2.813704285640389], "isController": false}, {"data": ["05_AdultMalePersian-105", 800, 9, 1.125, 1353.763750000002, 159, 60312, 316.0, 1259.5, 2291.4499999999994, 31681.25000000001, 5.172670197014076, 33.078455565954776, 2.783341092338629], "isController": false}, {"data": ["08_Buy-122", 800, 2, 0.25, 508.8775000000004, 151, 60195, 176.5, 459.9, 1173.85, 3221.78, 5.170096163788647, 3.7738798865487024, 2.8425431056767656], "isController": false}, {"data": ["08_Buy-121", 800, 4, 0.5, 628.4825000000003, 152, 60244, 178.0, 473.0, 1198.85, 3203.9700000000003, 5.170463725965423, 3.862150842220068, 3.3375747293585394], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 76, 90.47619047619048, 0.59375], "isController": false}, {"data": ["522", 8, 9.523809523809524, 0.0625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12800, 84, "504/Gateway Time-out", 76, "522", 8, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["03_CatsPage-98", 800, 7, "504/Gateway Time-out", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["04_Persian-101", 800, 13, "504/Gateway Time-out", 12, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["08_ConfirmCheckout-117", 800, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-126", 800, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-110", 800, 6, "504/Gateway Time-out", 5, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-125", 800, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-90", 800, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["01_HomePage-63", 800, 8, "504/Gateway Time-out", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["07_Checkout-113", 800, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-86", 800, 5, "504/Gateway Time-out", 4, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-89", 800, 7, "504/Gateway Time-out", 6, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-109", 800, 9, "504/Gateway Time-out", 7, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["05_AdultMalePersian-105", 800, 9, "504/Gateway Time-out", 7, "522", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-122", 800, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-121", 800, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
