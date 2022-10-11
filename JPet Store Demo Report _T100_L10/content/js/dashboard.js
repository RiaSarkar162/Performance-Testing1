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

    var data = {"OkPercent": 99.13125, "KoPercent": 0.86875};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8654375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.796, 500, 1500, "03_CatsPage-98"], "isController": false}, {"data": [0.7845, 500, 1500, "04_Persian-101"], "isController": false}, {"data": [0.949, 500, 1500, "08_ConfirmCheckout-117"], "isController": false}, {"data": [0.8015, 500, 1500, "09_SignOut-126"], "isController": false}, {"data": [0.7785, 500, 1500, "06_AddtoCart-110"], "isController": false}, {"data": [0.9575, 500, 1500, "09_SignOut-125"], "isController": false}, {"data": [0.783, 500, 1500, "02_SignIn-90"], "isController": false}, {"data": [0.76, 500, 1500, "01_HomePage-63"], "isController": false}, {"data": [0.969, 500, 1500, "03_CatsPage-100"], "isController": false}, {"data": [0.932, 500, 1500, "07_Checkout-113"], "isController": false}, {"data": [0.783, 500, 1500, "02_SignIn-86"], "isController": false}, {"data": [0.9305, 500, 1500, "02_SignIn-89"], "isController": false}, {"data": [0.928, 500, 1500, "06_AddtoCart-109"], "isController": false}, {"data": [0.7835, 500, 1500, "05_AdultMalePersian-105"], "isController": false}, {"data": [0.9535, 500, 1500, "08_Buy-122"], "isController": false}, {"data": [0.9575, 500, 1500, "08_Buy-121"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16000, 139, 0.86875, 1158.8591874999986, 75, 60459, 260.0, 809.0, 1428.0, 32077.989999999998, 58.78333198621531, 207.39935980703456, 34.21732404495456], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_CatsPage-98", 1000, 10, 1.0, 1305.2750000000005, 163, 60398, 341.0, 1230.6999999999998, 2416.7499999999955, 59873.900000000256, 3.724616736937769, 23.124541261071425, 1.9496040732408637], "isController": false}, {"data": ["04_Persian-101", 1000, 17, 1.7, 1857.6860000000017, 160, 60407, 364.0, 1344.8, 2896.69999999999, 60175.99, 3.7261294829995344, 23.468800943176525, 2.01589427107592], "isController": false}, {"data": ["08_ConfirmCheckout-117", 1000, 5, 0.5, 776.7799999999997, 157, 60237, 184.0, 461.9, 703.8499999999998, 19174.260000000002, 3.7231190802406626, 2.7694006790503813, 3.3449897986537205], "isController": false}, {"data": ["09_SignOut-126", 1000, 3, 0.3, 988.471999999998, 161, 60329, 375.0, 1095.699999999999, 1496.0, 18945.690000000028, 3.7224954120244047, 23.85412866619267, 2.0248339301734313], "isController": false}, {"data": ["06_AddtoCart-110", 1000, 11, 1.1, 1635.7580000000012, 161, 60402, 363.5, 1279.8, 2545.7499999999995, 60164.96, 3.723257701558556, 23.548437808332277, 1.9561646908579131], "isController": false}, {"data": ["09_SignOut-125", 1000, 6, 0.6, 778.1670000000004, 157, 60417, 184.0, 455.0, 607.8999999999999, 15717.96, 3.723618165298858, 2.4134354776098843, 2.0508990676060117], "isController": false}, {"data": ["02_SignIn-90", 1000, 8, 0.8, 1322.0149999999994, 162, 60426, 359.0, 1279.9, 2527.5999999999967, 32629.610000000004, 3.725948999210099, 23.98242731837862, 1.9321083189263306], "isController": false}, {"data": ["01_HomePage-63", 1000, 11, 1.1, 1401.470000000002, 162, 60406, 405.0, 1304.6, 2466.3499999999963, 60173.97, 3.7165602491581993, 23.904378363487027, 1.6804369095314906], "isController": false}, {"data": ["03_CatsPage-100", 1000, 0, 0.0, 179.25399999999985, 75, 3226, 89.0, 357.0, 563.4999999999993, 1133.8500000000001, 3.7257962958133226, 2.0157140116021295, 2.8780320995979864], "isController": false}, {"data": ["07_Checkout-113", 1000, 9, 0.9, 1043.135000000001, 157, 60245, 183.0, 512.9, 706.0, 32078.91, 3.723202251792722, 2.8743921290573593, 1.9488636786727527], "isController": false}, {"data": ["02_SignIn-86", 1000, 12, 1.2, 1581.0030000000008, 162, 60459, 362.0, 1274.6999999999998, 2559.8499999999985, 60162.97, 3.7260878313423604, 23.439381237703913, 1.9321803109792905], "isController": false}, {"data": ["02_SignIn-89", 1000, 10, 1.0, 1145.8580000000006, 157, 60403, 188.0, 510.0, 713.3999999999992, 59878.78000000026, 3.7273100003727313, 2.7494189181948636, 2.4897266018114723], "isController": false}, {"data": ["06_AddtoCart-109", 1000, 14, 1.4, 1325.7949999999996, 158, 60370, 187.0, 517.9, 727.8499999999998, 60167.99, 3.72469997541698, 2.860507745280805, 2.0260330920969314], "isController": false}, {"data": ["05_AdultMalePersian-105", 1000, 11, 1.1, 1729.486000000001, 161, 60437, 362.0, 1360.9999999999998, 2722.4499999999966, 60164.96, 3.7247554698034073, 23.60479389996797, 2.0042385389274195], "isController": false}, {"data": ["08_Buy-122", 1000, 7, 0.7, 803.7760000000004, 157, 60252, 183.0, 464.0, 704.5499999999994, 19165.760000000002, 3.7237290912611525, 2.8203647776654455, 2.047323709355497], "isController": false}, {"data": ["08_Buy-121", 1000, 5, 0.5, 667.8170000000003, 157, 60373, 183.0, 460.0, 637.0999999999988, 15586.170000000113, 3.7236043000182457, 2.781605138760114, 2.403615666320371], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 137, 98.56115107913669, 0.85625], "isController": false}, {"data": ["522", 2, 1.4388489208633093, 0.0125], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16000, 139, "504/Gateway Time-out", 137, "522", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["03_CatsPage-98", 1000, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["04_Persian-101", 1000, 17, "504/Gateway Time-out", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["08_ConfirmCheckout-117", 1000, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-126", 1000, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-110", 1000, 11, "504/Gateway Time-out", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["09_SignOut-125", 1000, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-90", 1000, 8, "504/Gateway Time-out", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["01_HomePage-63", 1000, 11, "504/Gateway Time-out", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["07_Checkout-113", 1000, 9, "504/Gateway Time-out", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-86", 1000, 12, "504/Gateway Time-out", 11, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["02_SignIn-89", 1000, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["06_AddtoCart-109", 1000, 14, "504/Gateway Time-out", 13, "522", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["05_AdultMalePersian-105", 1000, 11, "504/Gateway Time-out", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-122", 1000, 7, "504/Gateway Time-out", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["08_Buy-121", 1000, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
