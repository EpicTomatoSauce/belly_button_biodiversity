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
    d3.json('samples.json').then (data => {
        var testSubject = data.samples.filter((val) => val.id === sampleID);
        // console.log(testSubject);
        var testSubjectObj = testSubject[0];
        console.log(testSubjectObj);
        var otuIDs = testSubjectObj.otu_ids;
        console.log(otuIDs);
        // create a list to append the members of the otuIDs to
        var otuIDList = [];
        for (var i = 0; i < otuIDs.length; i++) {
            otuIDList.push(`OTU ${otuIDs[i]}`);
        }

        var otuLabels = testSubjectObj.otu_labels;
        var sampleValues = testSubjectObj.sample_values;
        var sampleMetadata = data.metadata.filter((val) => val.id == sampleID);
        sampleMetadata = sampleMetadata[0];
        // for guage chart, we require wfreq result
        var wfreq = sampleMetadata[6];
        // create a variable in which we can call each of the elements of the page
        results = {
            idList: otuIDList,
            ids: otuIDs,
            values: sampleValues,
            labels: otuLabels
        };
        // charting elements
        barChart(results);
        // bubbleChart(results);
        demographicTable(sampleMetadata);
        // guageChart(wfreq);
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
    var otu_ids = results.idList.slice(0,10).reverse();
    var sample_values = results.values.slice(0,10).reverse();
    var otu_labels = results.labels.slice(0,10).reverse();
    var traceBAR = {
        x: sample_values,
        y: otu_ids,
        text: otu_labels,
        marker: {
            color: 'blue'
        },
        type: 'bar',
        orientation: 'h'
    };
    var dataBar = [traceBAR];
    var layoutBar = {
        title: "Top 10 OTUs",
        xaxis: {title: "Sample Value"},
        yaxis: {title: "OTU ID"},
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
    Plotly.newPlot('bar',dataBar, layoutBar);
}

init();

d3.selectAll("#selDataset").on("change", optionChanged);

// CREATE CHANGE CONDITION
function optionChanged() {
    var sampleID = d3.select('#selDataset').node().values;
    d3.selectAll('h5').remove();
    dataretrieval(sampleID);
};