// create initialisation function which loads on index 0 on the samples key (id 940)
// this loads and generates on the demographic info table
// call the function which retrieves the information required to generate the necessary charts and tables
// create functions for charts and tables which are called in the above retrieval
// change function that refreshes the above data retrieval


// create initialisation function
function init() {
    var dropdown = d3.select('#selDataset');
    d3.json('samples.json').then((data) => {
        var name = data.names;
        name.forEach((sample) => {
            dropdown.append('option').text(sample).property('value',sample.name);
        })
        // as per example, initialise on 0 index to display ID 940
        var sampleID = name[0];
        dataretrieval(sampleID);
        });
}

// function which pulls the data required from samples.json
function dataretrieval(sampleID) {
    d3.json('samples.json').then ((data) => {
        var testSubject = data.samples.filter((val) => val.id == sampleID);
        // test
        console.log(data);
        console.log(testSubject);
        var testSubjectObj = testSubject[0];
        // test
        console.log(testSubjectObj);
        var otuIDs = testSubjectObj.otu_ids;
        // test
        console.log(otuIDs);
        // create a list to append the members of the otuIDs to
        var otuIDList = [];
        for (var i = 0; i < otuIDs.length; i++) {
            otuIDList.push(`OTU ${otuIDs[i]}`);
        }

        var otuLabels = testSubjectObj.otu_labels;
        var sampleValues = testSubjectObj.sample_values;
        let sampleMetadata = data.metadata.filter((val) => val.id == sampleID);
        sampleMetadata = sampleMetadata[0];
        // for guage chart, we require wfreq result
        var wfreq = Object.values(sampleMetadata)[6];
        console.log(wfreq);
        // create a variable in which we can call each of the elements of the page
        results = {
            idList: otuIDList,
            ids: otuIDs,
            values: sampleValues,
            labels: otuLabels
        };
        // charting elements
        barChart(results);
        bubbleChart(results);
        demographicTable(sampleMetadata);
        gaugeChart(wfreq);
    })
}

// DEMOGRAPHICS INFO TABLE
function demographicTable(sampleMetadata) {
    // console.log(sampleMetadata);
      // Use d3 to select the required panel
      var demographicData = d3.select("#sample-metadata");
  
      // Clear the existing data in the html
      demographicData.html("");
  
      // Use `Object.entries` to add each key and value pair to the panelData
      Object.entries(sampleMetadata).forEach(([key, value]) => {
        demographicData.append('h5').text(`${key.toUpperCase()}: ${value}`);
      });
};


// BAR CHART
function barChart(results){
    // create variables which are called from the pull data above
    var otuIDs = results.idList.slice(0,10).reverse();
    var sampleValues = results.values.slice(0,10).reverse();
    var otuLabels = results.labels.slice(0,10).reverse();
    var traceBAR = {
        x: sampleValues,
        y: otuIDs,
        text: otuLabels,
        marker: {
            color: 'blue'
        },
        type: 'bar',
        orientation: 'h'
    };
    var dataBAR = [traceBAR];
    var layoutBAR = {
        title: "<b>Top 10 OTUs</b>",
        xaxis: {title: "<b>Sample Value</b>"},
        yaxis: {title: "<b>OTU ID</b>"},
        yAxis: {
            tickmode: 'linear',
        },
        margin: {
            l: 100,
            r: 100,
            t: 50,
            b: 50
        }
    };
    Plotly.newPlot('bar',dataBAR, layoutBAR);
}

// BUBBLE CHART
function bubbleChart(results) {
    // create variables which are called from the pull data above
    var otuIDs = results.ids;
    var sampleValues = results.values;
    var otuLabels = results.labels;
    var traceBUBBLE = {
        x: otuIDs,
        y: sampleValues,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuIDs,
            // https://plotly.com/javascript/colorscales/
            colorscale: 'Earth'
        },
        text: otuLabels
    };
    var dataBUBBLE = [traceBUBBLE];
    var layoutBUBBLE = {
        title: "<b>OTU ID compared to Sample Value</b>",
        xaxis: {title: "<b>OTU ID</b>"},
        yaxis: {title: "<b>Sample Value</b>"},
        height: 500,
        width: 1000
    };
    // PLOT BUBBLE CHART ON ID "BUBBLE"
    Plotly.newPlot("bubble", dataBUBBLE, layoutBUBBLE);
}

// GUAGE CHART
// https://plotly.com/javascript/gauge-charts/

function gaugeChart(wfreq) {
    console.log(wfreq);
    var dataGAUGE = [
        {
            domain: {
                x: [0,1], 
                y: [0,1]
            },
            value: wfreq,
            title: "<b>Weekly Washing Frequency</b><br>Scrubs per Week",
            type: 'indicator',
            mode: 'gauge+number',
            gauge: {
                axis: {
                    range: [null, 9],
                    tickwidth: 2,
                    tickcolor: "black"
                },
                bar: {
                    color: "gray"
                },
                borderwidth: 2,
                bordercolor: "black",
                steps: [
                    // https://www.w3schools.com/colors/colors_picker.asp?colorhex=DC143C
                    { range: [0, 1], color: "#db1414" },
                    { range: [1, 2], color: "#db4614" },
                    { range: [2, 3], color: "#db7814" },
                    { range: [3, 4], color: "#dbaa14" },
                    { range: [4, 5], color: "#dbdb14" },
                    { range: [5, 6], color: "#aadb14" },
                    { range: [6, 7], color: "#78db14" },
                    { range: [7, 8], color: "#46db14" },
                    { range: [8, 9], color: "#14db14" },
                  ],
                threshold: {
                    line: {color: 'red',
                    width: 4
                    },
                    thickness: 1,
                    value: 490
                },
            },
        },
    ];
    var layoutGAUGE = {
        width: 500,
        height: 400,
        margin: {
            t: 0,
            b: 0
        }
    };
    // PLOT GUAGE CHART ON ID "GUAGE"
    Plotly.newPlot('gauge', dataGAUGE, layoutGAUGE);
}

init();

d3.selectAll("#selDataset").on("change", optionChanged);

// CREATE CHANGE CONDITION
function optionChanged() {
    d3.selectAll('h5').remove();
    var sampleID = d3.select("#selDataset").node().value;
    dataretrieval(sampleID);
};