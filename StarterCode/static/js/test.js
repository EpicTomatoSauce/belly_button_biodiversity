//Build function to read json file using d3
function buildMetaData(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      console.log(metadata);

    // Filter the data
    var buildingArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = buildingArray[0];
    // Use d3 to select the required panel
    var panelData = d3.select("#sample-metadata");

    // Clear the existing data in the html
    panelData.html("");

    // Use `Object.entries` to add each key and value pair to the panelData
    Object.entries(result).forEach(([key, value]) => {
      panelData.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var sampleData = data.samples;
      var buildingArray = sampleData.filter(sampleObj => sampleObj.id == sample);
      var result = buildingArray[0];
  
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;

      // Build a Bubble Chart
    var bubbleChart = {
        title: "Bacteria Cultures Per Sample",
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
      };
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleChart);
      
      //Create a horizontal bar chart
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      var chartLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, chartLayout);
    });
  };

  function init() {
    // Grab a reference to the dropdown select element
    var selectDropdown = d3.select("#selDataset");
  
    // Populate the select options by using the list of sample names
    d3.json("samples.json").then((data) => {
      var name = data.names;
  
      name.forEach((sample) => {
        selectDropdown
          .append("option")
          .text(sample)
          .property("value", sample);
      })
  
      // Use the sample data from the list to build the plots
      var sampleData = name[0];
      buildCharts(sampleData);
      buildMetaData(sampleData);
    });
  };
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetaData(newSample);
  };

  
// Initialize the dashboard
  init()