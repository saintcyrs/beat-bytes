class stickFigure {
  constructor(id, data, date) {
    this.data = data;
    this.date = date;
    this.id = id.replace("#", ""); // Store the ID without the hash
    this.margin = { top: 0, right: 10, bottom: 30, left: 10 }; // Define margins
    this.width = 400 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.svg = d3
        .select(id)
        .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    //this.wrangleData();
    this.danceability = (this.data && this.data.danceability) || 0.3; // Default to 0.3 if not provided
    this.adjustDanceSpeed(this.danceability);

    this.drawStickFigure(this.svg);
    this.drawMusicNotes(this.svg);
    this.animateArms(this.svg);
    this.animateBody(this.svg);

    /*this.streamVisualization = new streamVis(
      "#streamVisElement",
      "data.csv",
      this.updateSongDropdown.bind(this)
    ); */
  }

  updateSongDropdown(songData) {
    // Logic to update the dropdown
    // For example, if the dropdown has the same id as the song track name
    const dropdown = document.getElementById("songDropdown");
    if (dropdown) {
      dropdown.value = songData.track_name; // Update dropdown value
    }
  }

  wrangleData() {
    let vis = this;

    // Filter data based on the specified date and slice the first 25 records
    vis.displayData = vis.data.filter((d) => d.week === vis.date).slice(0, 25);
    // vis.displayData.sort((a, b) => b[selectedCategory] - a[selectedCategory]);

  }

  drawStickFigure(svg) {
    // Adjust these values to move the stick figure within the SVG
    const yOffset = 0; // Increase the offset to move down by 40 units

    // Head
    svg
        .append("circle")
        .attr("cx", 200)
        .attr("cy", 60 + yOffset) // Adjust vertical position
        .attr("r", 20)
        .style("fill", "#314149")
        .style("z-index", "1000");

    // Body
    svg
        .append("line")
        .attr("x1", 200)
        .attr("y1", 80 + yOffset) // Adjust vertical position
        .attr("x2", 200)
        .attr("y2", 160 + yOffset) // Adjust vertical position
        .style("stroke", "#314149");

    // Left Arm
    svg
        .append("line")
        .attr("x1", 200)
        .attr("y1", 100 + yOffset) // Adjust vertical position
        .attr("x2", 160)
        .attr("y2", 120 + yOffset) // Adjust vertical position
        .style("stroke", "#314149");

    // Right Arm
    svg
        .append("line")
        .attr("x1", 200)
        .attr("y1", 100 + yOffset) // Adjust vertical position
        .attr("x2", 240)
        .attr("y2", 120 + yOffset) // Adjust vertical position
        .style("stroke", "#314149");

    // Left Leg
    svg
        .append("line")
        .attr("x1", 200)
        .attr("y1", 160 + yOffset) // Adjust vertical position
        .attr("x2", 180)
        .attr("y2", 200 + yOffset) // Adjust vertical position
        .style("stroke", "#314149");

    // Right Leg
    svg
        .append("line")
        .attr("x1", 200)
        .attr("y1", 160 + yOffset) // Adjust vertical position
        .attr("x2", 220)
        .attr("y2", 200 + yOffset) // Adjust vertical position
        .style("stroke", "#314149");
  }

  animateArms(svg) {
    let duration = this.mapDanceabilityToSpeed(this.danceability);

    const animateArms = () => {
      this.svg
          .selectAll("line[x1='200'][y1='100']")
          .transition()
          .duration(duration / 2)
          .attr("y2", 100) // Move arms up
          .transition()
          .duration(duration / 2)
          .attr("y2", 120) // Move arms back down
          .on("end", animateArms);
    };

    animateArms();
  }

  animateBody(svg) {
    let duration = this.mapDanceabilityToSpeed(this.danceability);

    const animateBody = () => {
      const partsToAnimate = this.svg.selectAll(
          "line[x1='200'], circle[cx='200']"
      );

      partsToAnimate
          .transition()
          .duration(duration / 2)
          .attr("transform", "rotate(10,200,120)")
          .transition()
          .duration(duration / 2)
          .attr("transform", "rotate(-10,200,120)")
          .on("end", animateBody);
    };

    animateBody();
  }

  adjustDanceSpeed(danceability) {
    this.danceability = danceability;
    this.animateArms(this.svg);
    this.animateBody(this.svg);
  }

  mapDanceabilityToSpeed(danceability) {
    // Create a more pronounced effect in speed change
    // Map 0.3 to 1.0 danceability to 2000ms to 300ms duration range
    const minDuration = 300; // Fastest speed
    const maxDuration = 2000; // Slowest speed
    return (
        maxDuration - ((danceability - 0.3) * (maxDuration - minDuration)) / 0.7
    );
  }

  drawMusicNotes(svg) {
    // Define positions for music notes
    const notesPositions = [
      { x: 120, y: 50 },
      { x: 250, y: 20 },
      { x: 300, y: 100 },
      // ... add more positions as needed
    ];

    // Draw music notes at each position
    notesPositions.forEach((pos) => {
      this.drawMusicNote(svg, pos.x, pos.y);
    });
  }

  drawMusicNote(svg, x, y) {
    // Simple representation of a music note
    svg
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .text("♪")
        .attr("font-family", "Arial")
        .attr("font-size", "30px")
        .style("fill", "#314149");
  }

  updateDanceabilityLabel(danceability) {
    const danceabilityValue = parseFloat(danceability);
    const label = document.getElementById(this.id === "dancingStickFigure2" ? "danceabilityLabel2" : "danceabilityLabel");

    if (!isNaN(danceabilityValue)) {
      label.textContent = "Danceability: " + danceabilityValue.toFixed(3);
    } else {
      console.error("Invalid danceability value:", danceability);
    }
  }

}
