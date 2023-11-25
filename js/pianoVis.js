class Piano {
  // Constructor
  constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.initVis();
  }
  // Initialize 
  initVis() {
    let vis = this;

    vis.svg = d3.select("#" + vis.parentElement); //.select('#piano-svg');

    vis.wrangleData();
  }

  // Wrangle data
  wrangleData() {
    let vis = this;

    // Set up counts for each key
    const counts = {};
    vis.data.forEach((d) => {
      const key = d.key;
      if (counts[key]) {
        counts[key] += 1;
      } else {
        counts[key] = 1;
      }
    });
    vis.convertedCounts = [];
    Object.keys(counts).forEach((numericKey) => {
      vis.convertedCounts.push({
        key: vis.fromPitchClass(numericKey),
        count: counts[numericKey],
      });
    });

    vis.updateVis();
  }

  // Update vis
  updateVis() {
    let vis = this;
    const keyPositions = {
      'C': { x: 50, y: 120 },
      'C#': { x: 100, y: 80 },
      'D': { x: 150, y: 120 },
      'D#': { x: 200, y: 80 },
      'E': { x: 250, y: 120 },
      'F': { x: 300, y: 120 },
      'F#': { x: 350, y: 80 },
      'G': { x: 400, y: 120 },
      'G#': { x: 450, y: 80 },
      'A': { x: 500, y: 120 },
      'A#': { x: 550, y: 80 },
      'B': { x: 600, y: 120 },
    };
    
    // Append the key names to the SVG
    // Loop over the convertedCounts and position the text elements
    vis.convertedCounts.forEach((keyCount) => {
      const position = keyPositions[keyCount.key];
      vis.svg
        .append("text")
        .attr('x', position.x)
        .attr('y', position.y)
        .text(keyCount.count)
        .attr('class', 'piano-key-text')
        .attr('text-anchor', 'middle')  // Centers the text horizontally
        .attr('dominant-baseline', 'middle') // Centers the text vertically, may work better in some browsers
        .attr('pointer-events', 'none')
        .style('font-size', '30px') // Adjust the font size as necessary
        .attr('fill', 'black'); // Ensure text is black
    });
  }

  fromPitchClass(pitchClass) {
    const pitchClasses = {
      0: "C",
      1: "C#",
      2: "D",
      3: "D#",
      4: "E",
      5: "F",
      6: "F#",
      7: "G",
      8: "G#",
      9: "A",
      10: "A#",
      11: "B",
    };
    return pitchClasses[pitchClass];
  }
}
