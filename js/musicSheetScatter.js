class musicSheetScatter {
    constructor(id, data) {
        this.id = id.replace("#", "");
        this.data = data.slice(0, 20); // Take the first 20 songs
        this.svg = d3.select(id)
            .append('svg')
            .attr('width', 1500)
            .attr('height', 300)
            .style('background', '#121212');

        this.drawMusicSheet(this.svg);
        this.drawScatterPlot(this.svg, this.data);
    }

    drawMusicSheet(svg) {
        // Draw the staff lines
        for (let i = 1; i <= 5; i++) {
            svg.append("line")
                .attr("x1", 0) // Start from the very left of the SVG
                .attr("y1", i * 40) // Adjust the spacing between lines
                .attr("x2", 1300) // End at the right edge of the SVG
                .attr("y2", i * 40)
                .style("stroke", "green") // Set the lines to green
                .style("stroke-width", 2); // Increase line width if needed
        }

        // Add a treble clef
        svg.append("image")
            .attr("xlink:href", "images/gClef.svg") // Link to the SVG file
            .attr("x", 10) // Adjust X position
            .attr("y", 40) // Adjust Y position to align with the staff lines
            .attr("width", 50) // Set width
            .attr("height", 100); // Set height
    }

    drawScatterPlot(svg, data) {
        // Define a scale for loudness
        const loudnessScale = d3.scaleLinear()
            .domain([d3.min(data, d => Math.abs(d.loudness)), d3.max(data, d => Math.abs(d.loudness))])
            .range([40, 200]); // Adjust range to match line spacing

        // Create scatter plot points based on loudness
        svg.selectAll(".loudness-point")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "loudness-point")
            .attr("cx", (d, i) => 60 + i * 40) // Adjust x position for each point
            .attr("cy", d => loudnessScale(Math.abs(d.loudness))) // Map loudness to y position
            .attr("r", 5) // Radius of points
            .style("fill", "blue"); // Change point color if needed
    }
}
