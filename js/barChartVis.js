class BarChartVis {
  constructor(_parentElement, _data, _date) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.date = _date;

    this.initVis();
  }

  initVis() {
    let vis = this;

    // Margins and dimensions
    vis.margin = { top: 20, right: 20, bottom: 200, left: 40 };
    vis.width = 960 - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

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

    // Initialize scales and axes
    vis.x = d3.scaleBand().rangeRound([0, vis.width]).padding(0.1);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    vis.xAxis = d3.axisBottom(vis.x);
    vis.yAxis = d3.axisLeft(vis.y);

    // Append axes to the SVG
    vis.svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g").attr("class", "y-axis");

    // (Filter, aggregate, modify data)
    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    // Filter data based on the specified date and slice the first 25 records
    vis.displayData = vis.data.filter((d) => d.week === vis.date).slice(0, 25);

    console.log(vis.displayData);
    // Update the visualization
    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    // Update scales
    vis.x.domain(vis.displayData.map((d) => truncate(d.track_name, 20)));
    vis.y.domain([0, d3.max(vis.displayData, (d) => d.danceability)]);

    // Update the x-axis
    vis.svg
      .select(".x-axis")
      .call(vis.xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // Update the y-axis
    vis.svg.select(".y-axis").call(vis.yAxis);

    // Bind data and create bars
    let bars = vis.svg.selectAll(".bar").data(vis.displayData);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .merge(bars)
      .transition()
      .duration(1000)
      .attr("x", (d) => vis.x(truncate(d.track_name, 20)))
      .attr("width", vis.x.bandwidth())
      .attr("y", (d) => vis.y(d.danceability))
      .attr("height", (d) => vis.height - vis.y(d.danceability));

    // Remove old bars
    bars.exit().remove();
  }
}

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}
