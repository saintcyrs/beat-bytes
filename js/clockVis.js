class clockVis {
  constructor(id, data) {
    this.svg = d3
      .select(id)
      .append("svg")
      .style("margin-top", "30px")
      .style("margin-bottom", "40px")
      .style("margin-left", "30px")
      .style("margin-right", "320px");
    this.data = data;
    this.initVis();
  }
  initVis() {
    let vis = this;

    // Dimensions and SVG setup
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    vis.svg.attr("width", width).attr("height", height);

    vis.g = vis.svg
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Draw clock face with Spotify green color
    vis.g.append("circle").attr("r", radius).style("fill", "#314149");

    // Hour markers
    for (let i = 0; i < 12; i++) {
      vis.g
        .append("line")
        .attr("x1", 0)
        .attr("y1", radius - 10)
        .attr("x2", 0)
        .attr("y2", radius)
        .attr("transform", `rotate(${i * 30})`)
        .style("stroke", "#83a5a6") // Change the stroke to white
        .style("stroke-width", 2);
    }

    // Clock hands with white color
    vis.hourHand = vis.g
      .append("line")
      .style("stroke", "white") // White color for hour hand
      .style("stroke-width", 6)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", -radius / 2);

    vis.minuteHand = vis.g
      .append("line")
      .style("stroke", "white") // White color for minute hand
      .style("stroke-width", 4)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", -radius / 1.5);

    vis.secondHand = vis.g
      .append("line")
      .style("stroke", "white") // White color for second hand
      .style("stroke-width", 2)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", -radius / 1.2);

    vis.arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius - 10) // Adjusted to be inside the clock face
      .startAngle(0);

    // Add an arc path and keep a reference to it
    vis.arcPath = vis.g
      .append("path")
      .datum({ endAngle: 0 })
      .style("fill", "none") // Set to 'none' or another color
      .attr("d", vis.arc);

    // Load data
    this.loadData();
  }

  loadData() {
    let vis = this;
    // Assuming 'data' is the array of songs
    vis.songData = data; // Make sure to set this properly
    vis.populateDropdown();
    vis.updateVis(data[0].duration);
  }

  populateDropdown() {
    let vis = this;
    let dropdown = d3.select("#songDropdown");

    // Clear existing options
    dropdown.selectAll("option").remove();

    // Add default option
    dropdown.append("option")
        .text("Pick a song here!")
        .attr("value", "")
        .attr("disabled", true)
        .attr("selected", true);

    // Add song options
    dropdown.selectAll("option.song")
        .data(vis.songData)
        .enter()
        .append("option")
        .classed("song", true)
        .text((d) => d.track_name) // Assuming 'track_name' is the correct field
        .attr("value", (d, i) => i); // Use the index as the value
  }

  updateVis(durationInMilliseconds) {
    let vis = this;

    // Validate the duration value
    if (isNaN(durationInMilliseconds) || durationInMilliseconds === undefined) {
      console.error("Invalid duration: ", durationInMilliseconds);
      return; // Exit the function if duration is not valid
    }

    // Convert duration from milliseconds to total seconds
    let totalSeconds = durationInMilliseconds / 1000;

    // Calculate hours, minutes, and seconds
    let hours = Math.floor(totalSeconds / 3600) % 12; // Convert to 12-hour format
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = Math.floor(totalSeconds % 60);

    // Calculate rotation angles
    let hourAngle = (hours + minutes / 60) * 30; // 30 degrees per hour
    let minuteAngle = minutes * 6; // 6 degrees per minute
    let secondAngle = seconds * 6; // 6 degrees per second

    // Update clock hands
    let cx = vis.svg.attr("width") / 2;
    let cy = vis.svg.attr("height") / 2;

    vis.hourHand.attr("transform", `rotate(${hourAngle})`);
    vis.minuteHand.attr("transform", `rotate(${minuteAngle})`);
    vis.secondHand.attr("transform", `rotate(${secondAngle})`);
  }

  updateDanceabilityLabel(song) {
    if (!song) {
      console.error("Invalid song data:", song);
      return;
    }

    let durationMinutes = Math.floor(song.duration_ms / 60000);
    let durationSeconds = Math.floor((song.duration_ms % 60000) / 1000);
    durationSeconds = durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;
    let durationFormatted = durationMinutes + ":" + durationSeconds;

    let labelId = this.svg.node().parentNode.id === "songClock2" ? "songClockLabel2" : "songClockLabel";
    d3.select(`#${labelId}`).html(`Duration: ${durationFormatted}<br>`);
  }


  updateSongInfo(song) {
    if (!song) {
      console.error("Invalid song data:", song);
      return;
    }

    // Convert duration from milliseconds to minutes and seconds
    let durationMinutes = Math.floor(song.duration_ms / 60000);
    let durationSeconds = Math.floor((song.duration_ms % 60000) / 1000);

    // Ensure seconds are two digits. For example, '9' becomes '09'
    durationSeconds =
      durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;

    let durationFormatted = durationMinutes + ":" + durationSeconds;

    // Update the song information display
    d3.select("#songInfo").html(`
        Track: ${song.track_name}<br>
        Artist: ${song.artist_names}<br>
    `);
    this.updateDanceabilityLabel(song);
  }

}
