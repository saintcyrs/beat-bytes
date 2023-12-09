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

    vis.margin = { top: 0, right: 0, bottom: 10, left: 0 };
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

    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

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
      .on("mouseover", (event, d) => {
        var coverPosition = event.currentTarget.getBoundingClientRect();
        var tooltipX = coverPosition.right;
        var tooltipY = coverPosition.top;

        // Check if the cover is in the last column
        var columnIndex = vis.displayData.indexOf(d) % 5;
        if (columnIndex === 5 - 1) {
          // Position tooltip to the left for the last column
          tooltipX = coverPosition.left - tooltip.node().offsetWidth - 10; // 10px for some spacing
        }

        tooltip.transition().duration(0).style("opacity", 0.9);
        tooltip
          .html(
            `<strong>Rank:</strong> ${d.rank}<br><strong>Artist:</strong> ${d.artist_names}<br><strong>Song:</strong> ${d.track_name}`
          )
          .style("left", tooltipX + "px")
          .style("top", tooltipY + "px");
      })
      .on("mouseout", () => {
        // Hide tooltip
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .on("click", (event, d) => {
        console.log("topTrack select: " + d.track_name);
        selectedSong = d;
        barChart.updateVis();
        fullpage_api.moveSectionDown();
      });
  }
}

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}
