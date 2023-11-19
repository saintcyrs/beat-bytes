class TopTrackVis {
  constructor(_parentElement, _data, _date) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.date = _date;

    this.displayData = data;

    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };
    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right;
    vis.height = 1000 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3
      .select("#" + vis.parentElement)
      .append("svg")
      .attr("width", vis.width + vis.margin.left + vis.margin.right)
      .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + vis.margin.left + "," + vis.margin.top + ")"
      );

    // (Filter, aggregate, modify data)
    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    vis.displayData = vis.data.filter((d) => d.week === vis.date);

    // Update the visualization
    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    console.log(vis.displayData);

    // Bind data to the album covers
    var covers = vis.svg
      .selectAll(".album-cover")
      .data(vis.displayData)
      .enter()
      .append("image")
      .attr("class", "album-cover")
      .attr("xlink:href", (d) => d.album_cover_url)
      .attr("x", (d, i) => (i % 5) * (vis.width / 5))
      .attr("y", (d, i) => Math.floor(i / 5) * 120)
      .attr("width", 100)
      .attr("height", 100)
      .on("click", function (event, d) {
        // This function toggles the 'selected' class on click
        d3.select(this).classed(
          "selected",
          !d3.select(this).classed("selected")
        );
      });

    // Bind data to the song titles
    vis.svg
      .selectAll(".track-label")
      .data(vis.displayData)
      .enter()
      .append("text")
      .attr("class", "track-label")
      .attr("x", (d, i) => (i % 5) * (vis.width / 5) + 50) // center the label
      .attr("y", (d, i) => Math.floor(i / 5) * 120 + 115) // position below the album cover
      .attr("text-anchor", "middle") // center the text
      .text((d) => d.track_name);
  }
}

// Apply styles in your CSS for .album-cover and .track-label as needed
