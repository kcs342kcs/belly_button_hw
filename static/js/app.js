function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use d3 to select the panel with id of `#sample-metadata`
  var sM = d3.select("#sample-metadata");
  sM.html("");
  d3.json(`/metadata/${sample}`).then(function(sample){
    Object.entries(sample).forEach(function ([key,value]) {
      var row = sM.append("panel-body");
      row.text(`${key}: ${value} \n`);
    });
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
d3.json(`/samples/${sample}`).then(function(sample){
  var trace1 = {
    x: sample.otu_ids,
    y: sample.sample_values,
    type: "scatter",
    mode: "markers",
    marker: {
      size: sample.sample_values,
      color: sample.otu_id
    },
    text: sample.otu_labels,
  };

  var bubbleChart = [trace1];

  Plotly.newPlot("bubble", bubbleChart);

  var trace2 = {
    values: sample.sample_values.slice(0, 10),
    labels: sample.otu_ids.slice(0, 10),
    hovertext: sample.otu_labels.slice(0, 10),
    hoverinfo: "hovertext",
    type: "pie",
    showlegend: true,

  };
  var pieChart = [trace2];


  Plotly.newPlot("pie", pieChart);
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
        //console.log(sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    gauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  gauge(newSample);
}

// Initialize the dashboard
init();
