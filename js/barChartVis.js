class BarChartVis {
  constructor(_parentElement, _data, _date, _category) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.date = _date;
    this.category = _category;

    this.initVis();
  }

  initVis() {
    let vis = this;

    // Margins and dimensions
    vis.margin = { top: 20, right: 0, bottom: 200, left: 30 };
    vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right;
    vis.height = 650 - vis.margin.top - vis.margin.bottom;

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
    if (vis.category === "duration_ms") {
      vis.displayData.forEach((d) => {
        if (d[vis.category] > 60000) {
          // convert duration_ms to minutes and round to 2 decimal places
          d.duration = Math.round((d[vis.category] / 60000) * 100) / 100;
          console.log(d[vis.category]);
        }
      });
    }
    console.log(vis.displayData);

    // Update the visualization
    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    if (vis.category === "duration_ms") {
      vis.category = "duration";
    }

    // Update scales
    vis.x.domain(vis.displayData.map((d) => truncate(d.track_name, 15)));
    vis.y.domain([0, d3.max(vis.displayData, (d) => d[vis.category])]);

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
      .on("click", function (event, d) {
        vis.svg.selectAll(".bar").style("fill", "#8aa4ad");

        // Update selected song and other visualizations
        if (vis.date === "Oct26") {
          selectedSong = d;
          updateDropdown();
        } else {
          selectedSong2 = d;
          updateDropdown2();
          updateSecondAnimation(d);
        }
        d3.select(this).style("fill", "#314149");
      })
      .transition()
      .duration(1000)
      .attr("x", (d) => vis.x(truncate(d.track_name, 15)))
      .attr("width", vis.x.bandwidth())
      .attr("y", (d) => vis.y(d[this.category]))
      .attr("height", (d) => vis.height - vis.y(d[this.category]))
      .style("cursor", "pointer");

    // Remove old bars
    bars.exit().remove();
    if (vis.date === "Oct26") {
      vis.svg.selectAll(".bar").style("fill", "#8aa4ad");
      vis.svg
        .selectAll(".bar")
        .filter((d, i) => i === selectedSong.rank - 1)
        .style("fill", "#314149");
      updateDropdown();
    } else {
      vis.svg.selectAll(".bar").style("fill", "#8aa4ad");
      vis.svg
        .selectAll(".bar")
        .filter((d, i) => d.artist_names === "Taylor Swift")
        .style("stroke", (d) => "black")
        .style("stroke-width", (d) => 2);
      vis.svg
        .selectAll(".bar")
        .filter((d, i) => i === selectedSong2.rank - 1)
        .style("fill", "#314149");
      updateDropdown2();
    }
  }

  setCategory(newCategory) {
    this.category = newCategory;
    this.wrangleData(); // to re-process data
    this.updateVis(); // to re-draw the visualization
  }
}

function truncate(str, n) {
  // Check if the string contains '('
  const parenthesisIndex = str.indexOf('(');

  // If '(' is found and before the truncation length
  if (parenthesisIndex > -1 && parenthesisIndex < n) {
    // Find the last space before '('
    const lastSpaceIndex = str.lastIndexOf(' ', parenthesisIndex);
    // If a space is found, truncate up to the space
    if (lastSpaceIndex > -1) {
      return str.substr(0, lastSpaceIndex);
    }
  }

  // Original truncation if '(' not found or no space before it within the limit
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}
