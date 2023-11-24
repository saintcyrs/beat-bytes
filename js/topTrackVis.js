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

    vis.margin = { top: 0, right: 0, bottom: 60, left: 0 };
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
    vis.displayData = vis.displayData.slice(0, 25);

    // Update the visualization
    vis.updateVis();
  }

  updateVis() {
    let vis = this;

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
      .attr("height", 100);
    // .on("mouseover", (event, d) => {
    //   // Show tooltip on hover
    //   console.log(d.artist_names);
    //   d3.select("#tooltip")
    //     .style("left", event.pageX + "px")
    //     .style("top", event.pageY - 28 + "px")
    //     .style("display", "inline-block")
    //     .html(`<p>${d.artist_names}: ${d.track_name}<p>`);
    // })
    // .on("mouseout", () => {
    //   // Hide tooltip
    //   d3.select("#tooltip").style("display", "none");
    // });

    // Bind data to the song titles
    vis.svg
      .selectAll(".track-label")
      .data(vis.displayData)
      .enter()
      .append("text")
      .attr("class", "track-label")
      .attr("x", (d, i) => (i % 5) * (vis.width / 5) + 50)
      .attr("y", (d, i) => Math.floor(i / 5) * 120 + 115)
      .attr("text-anchor", "middle")
      .text((d) => truncate(d.track_name, 20)) // Truncate long track names
      .append("title") // Tooltip showing full track name and artist
      .text((d) => `${d.track_name} by ${d.artist}`);
  }
}

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}
