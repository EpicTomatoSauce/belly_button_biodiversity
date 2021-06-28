// create initialisation function
function init() {
    var dropdown = d3.select('#selDataset');
    d3.json('samples.json').then((data) => {
        var name = data.names;

        name.forEach((sample) => {
            dropdown.append('option').text(sample).property('value',sample.name);
        })
        // as per example, initialise on 0 index to display ID 940
        var sample = name[0];
        plots(sample);
        getDemographic(sample);
        });
}

// function for change event
function selectionChanged(newSample) {
    plots(newSample);
    getDemographic(newSample);
}

function plots(sample) {
    d3.json("samples.json").then ((data => {
        var sampleData = data.samples;
        var array = sampleData.filter(sampleObj => sampleObj.id == sample);
        var result = array[0];
        var otuIDs = result.otu_ids;
        var otuLabels = result.otu_labels;
        var sampleValues = result.sample_values;

        // BAR CHART

        // create trace where x = sampleValues and y = OTUids
        var bar_xTicks = sampleValues.slice(0,10).reverse();
        var bar_yTicks = otuIDs.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var bar_labels = otuLabels.slice(0,10).reverse();
        var trace_bar = {
            x: bar_xTicks,
            y: bar_yTicks,
            text: bar_labels,
            marker: {
                color: 'blue'
            },
            type: 'bar',
            orientation: 'h',
        };
        // create data variable
        var data_bar = [trace_bar];
        var layout_bar = {
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
        }
    // PLOT BAR CHART ON ID "BAR"
    Plotly.newPlot("bar", data_bar, layout_bar);

    // Bubble Chart
    // https://plotly.com/javascript/bubble-charts/
    var trace_bubble = {
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
    var data_bubble = [trace_bubble];
    var layout_bubble = {
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Sample Value"},
        height: 500,
        width: 1000
    };

    // PLOT BUBBLE CHART ON ID "BUBBLE"
    Plotly.newPlot("bubble", data_bubble, layout_bubble);

    }));
}

// create a function to retrieve demographic information on ID selection
function getDemographic(sample) {
    // read JSON to get data
    d3.json('samples.json').then((data) => {
        var metadata = data.metadata;
        console.log(metadata);

    // filter data
    var array = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = array[0];
    var demographicInfo = d3.select('#sample-metadata');
    demographicInfo.html("");
    // Use `Object.entries` to add each key and value pair to the panelData
    Object.entries(result).forEach(([key, value]) => {
        demographicInfo.append('h5').text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

init();

d3.selectAll("#selDataset").on("change",selectionChanged);