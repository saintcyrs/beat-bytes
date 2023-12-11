class streamVis {
  constructor(element, data) {
    this.element = element;
    this.data = data;
    this.animationInterval = null; // Store interval ID
    this.isAnimating = false; // Animation state
    this.initVis();
  }

  async initVis() {
    // Load data
    this.currentIndex = 0; // Index to track current data
    this.maxVisibleBoxes = 10; // Maximum number of boxes to display at once
    this.updateVis();
    this.startAnimation();
  }
  updateVis() {
    const boxWidth = 200;
    const maxTextLength = 20;

    const visibleData = this.data.slice(
      this.currentIndex,
      this.currentIndex + this.maxVisibleBoxes
    );
    const boxContainer = d3.select(this.element);
    const boxes = boxContainer
      .selectAll(".data-box")
      .data(visibleData, (d) => d.id);

    // Enter new boxes with fade-in effect
    boxes
      .enter()
      .append("div")
      .attr("class", "data-box")
      .style("width", "115px")
      .style("height", "210px")
      .style("opacity", 0) // Start with zero opacity for fade-in
      .style("display", "inline-block")
      .style("position", "absolute")
      .style("left", "0px")
      .text(
        (d) =>
          `Track: ${truncate(d.track_name, maxTextLength)}, Streams: ${Number(
            d.streams
          ).toLocaleString()}`
      )
      .transition()
      .duration(500) // Duration for fade-in
      .style("opacity", 1) // Fade-in to full opacity
      .transition()
      .duration(10000) // Move duration
      .style("left", `${window.innerWidth - boxWidth}px`)
      .ease(d3.easeLinear)
      .transition() // Chain another transition for fading out
      .duration(1500) // Duration for fade-out
      .style("opacity", 0) // End with zero opacity
      .on("end", function () {
        d3.select(this).remove(); // Remove after fade-out
      });

    // Update text of existing boxes without moving them
    boxes.html(
      (d) =>
        `Track: ${truncate(d.track_name, maxTextLength)}, <br>Streams: ${Number(
          d.streams
        ).toLocaleString()}`
    );
  }

  startAnimation() {
    if (this.isAnimating) return;

    // Remove all existing data boxes immediately
    d3.selectAll(".data-box").remove();

    // Calculate the total width occupied by existing data blocks
    let totalOccupiedWidth = 0;
    d3.selectAll(".data-box").each(function () {
      const box = d3.select(this);
      const currentLeft = parseInt(box.style("left"), 10);
      const boxRight = currentLeft + boxWidth;
      totalOccupiedWidth = Math.max(totalOccupiedWidth, boxRight);
    });

    const boxMoveDuration = 10000;
    const boxWidth = 135;
    const interval = boxMoveDuration / this.maxVisibleBoxes;
    const maxAllowedLeft = window.innerWidth - totalOccupiedWidth - 10; // Adjust the 10 as needed for spacing

    // Calculate the time remaining in the animation interval
    const remainingTime = interval - (Date.now() % interval);

    d3.selectAll(".data-box").each(function () {
      const box = d3.select(this);
      const currentLeft = parseInt(box.style("left"), 10);
      const currentOpacity = parseFloat(box.style("opacity"));

      // Restart fade-in for partially visible boxes
      if (currentOpacity < 1) {
        box
          .transition()
          .duration(500 * (1 - currentOpacity)) // Remaining time to complete fade-in
          .style("opacity", 1);
      }

      // Calculate the new left position based on remaining time
      const newLeft = currentLeft + (maxAllowedLeft / interval) * remainingTime;

      // Continue moving to the right within the allowed space
      box
        .transition()
        .duration(remainingTime)
        .style("left", `${newLeft}px`)
        .ease(d3.easeLinear)
        .transition()
        .duration(1500)
        .style("opacity", 0)
        .on("end", function () {
          d3.select(this).remove();
        });
    });

    this.animationInterval = setInterval(() => {
      if (this.currentIndex < this.data.length - this.maxVisibleBoxes) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
      this.updateVis(); // Move this line inside the interval function
    }, interval);

    this.isAnimating = true;
  }

  stopAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    // Interrupt the transitions, but don't remove the boxes
    d3.selectAll(".data-box").interrupt();

    this.isAnimating = false;
  }

  toggleAnimation() {
    if (this.isAnimating) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  }
}

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + ". . ." : str;
}
