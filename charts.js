function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
  var metadata = data.metadata;
  // Filter the data for the object with the desired sample number
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];
  // Use d3 to select the panel with id of `#sample-metadata`
  var PANEL = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  PANEL.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  Object.entries(result).forEach(([key, value]) => {
    PANEL.append("h4").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// CHALLENGE DELIVERABLE I
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 

  d3.json("samples.json").then((data) => {

  // 3. Create a variable that holds the samples array. 
  var samples = data.samples;
    
  // 4. Create a variable that filters the samples for the object with the desired sample number.
  var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
  //console.log(sampleArray);
    
  //  5. Create a variable that holds the first sample in the array.
  var result = sampleArray[0];

  // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels;
  var sample_values = result.sample_values;

  // 7. Create the yticks for the bar chart.
  // Hint: Get the the top 10 otu_ids and map them in descending order  
  //  so the otu_ids with the most bacteria are last. 
  var yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();

  // 8. Create the trace for the bar chart. 
  var barData = [{
    x: sample_values.slice(0,10).reverse(),
    y: yticks,
    text: otu_labels.slice(0,10).reverse(),
    type:'bar',
    orientation: 'h',
    marker: {
      //plotly.com/python/bar-charts/#colored-bars
      color: 'rgb(300,180,100)',
      opacity: 1.0,}
    }];

  // 9. Create the layout for the bar chart. 
  var barLayout = {
    title: "Top 10 Bacterial Species",
    xaxis: {title: "Sample Values"},
    yaxis: {title: "Taxonomic Unit"}
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData, barLayout);



  // CHALLENGE DELIVERABLE II
  // plotly.com/python/bubble-charts/
  // 1. Create the trace for the bubble chart.
  var bubbleData = [{
    x: otu_ids.slice(0,10).reverse(),
    y: sample_values.slice(0,10).reverse(),
    text: otu_labels.slice(0,10).reverse(),
      mode: 'markers',
      marker: {
        size: sample_values.slice(0,10).reverse(),
        color: otu_ids.slice(0,10).reverse(),
        //plotly.com/python/builtin-colorscales/
        colorscale: 'Rainbow'
      }
    }];

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: "Top 10 Bacterial Species",
    xaxis: {title: "Taxonomic Unit IDs"},
    yaxis: {title: "Sample Values"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

 
    
  // CHALLENGE DELIVERABLE III
  var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
  var metadata = metadataArray[0];
  
  // 1. Create a variable that holds the washing frequency.
  var washing = parseFloat(metadata.wfreq);
  //console.log(washing);

  // 2. Create the trace for the gauge chart.
  var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: washing,
      title: {text: "Belly Button Washing Frequency" },
      domain: {x: [0, 1], y: [0, 1]},
      gauge: {
        axis: { range : [null,10], tickwidth:3},
        bar: { color: "darkblue" },
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "limegreen"},
          {range: [8, 10], color: "lightblue"}
          ]
        }     
      }
    ];
  
  // 3. Create the layout for the gauge chart.
  var gaugeLayout = {width: 600, height: 500, margin: {t: 0, b: 0} };

    // 4. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
