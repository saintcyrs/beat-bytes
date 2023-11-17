class energyStickFigure extends stickFigure {
    constructor(id, data) {
        super(id, data); // Call the parent constructor

        this.energy = (data && data.energy) || 0.1; // Default to 0.1 if not provided
        this.updateEnergyLevel(this.energy);
    }

    drawStickFigure(svg) {
        // Adjust these values to move the stick figure higher up
        const yOffset = -40; // Increase the offset to move up by 100 units

        // Head
        svg.append("circle")
            .attr("cx", 200)
            .attr("cy", 60 + yOffset) // Adjust vertical position
            .attr("r", 20)
            .style("fill", "white");

        // Body
        svg.append("line")
            .attr("x1", 200)
            .attr("y1", 80 + yOffset) // Adjust vertical position
            .attr("x2", 200)
            .attr("y2", 160 + yOffset) // Adjust vertical position
            .style("stroke", "white");

        // Left Arm
        svg.append("line")
            .attr("x1", 200)
            .attr("y1", 100 + yOffset) // Adjust vertical position
            .attr("x2", 160)
            .attr("y2", 120 + yOffset) // Adjust vertical position
            .style("stroke", "white");

        // Right Arm
        svg.append("line")
            .attr("x1", 200)
            .attr("y1", 100 + yOffset) // Adjust vertical position
            .attr("x2", 240)
            .attr("y2", 120 + yOffset) // Adjust vertical position
            .style("stroke", "white");

        // Left Leg
        svg.append("line")
            .attr("x1", 200)
            .attr("y1", 160 + yOffset) // Adjust vertical position
            .attr("x2", 180)
            .attr("y2", 200 + yOffset) // Adjust vertical position
            .style("stroke", "white");

        // Right Leg
        svg.append("line")
            .attr("x1", 200)
            .attr("y1", 160 + yOffset) // Adjust vertical position
            .attr("x2", 220)
            .attr("y2", 200 + yOffset) // Adjust vertical position
            .style("stroke", "white");
    }

    animateArms(svg) {
        // Do nothing, keeping the figure's arms stationary
    }

    // Override animateBody to do nothing
    animateBody(svg) {
        // Do nothing, keeping the figure's body stationary
    }

    // Override drawMusicNotes to do nothing
    drawMusicNotes(svg) {
        // Do not draw music notes for the energy stick figure
    }

    drawLightningBolt(svg, x, y) {
        // Example SVG path data for a lightning bolt
        const pathData = "M10,1 L6,5 L10,5 L4,15 L8,9 L4,9 Z";

        svg.append("path")
            .attr("class", "lightning-bolt")
            .attr("d", pathData)
            .attr("transform", `translate(${x - 10}, ${y - 10}) scale(1.5)`) // Adjust position and size as needed
            .style("fill", "white"); // Set the fill color to green
    }


    updateEnergyLevel(energy) {
        this.energy = energy;
        this.svg.selectAll(".lightning-bolt").remove(); // Remove existing bolts

        // Predefined anchor points around the stick figure
        const anchorPoints = [
            { x: 125, y: 50 }, { x: 230, y: 50 },
            { x: 130, y: 150 }, { x: 260, y: 135 },
            { x: 150, y: 20 }, { x: 280, y: 60 },
            { x: 120, y: 75 }, { x: 225, y: 120 },
            { x: 110, y: 120 }, { x: 245, y: 110 },
        ];

        const numberOfBolts = Math.round(energy * 10);
        // Shuffle and select a subset of anchor points
        const selectedPoints = this.shuffleArray(anchorPoints).slice(0, numberOfBolts);

        selectedPoints.forEach(point => {
            this.drawLightningBolt(this.svg, point.x, point.y);
        });

        this.updateEnergyLabel(energy);
    }

    updateEnergyLabel(energy) {
        const energyValue = parseFloat(energy);

        // Select or append the label
        let label = this.svg.select(".energy-label");
        if (label.empty()) {
            label = this.svg.append("text")
                .attr("class", "energy-label")
                .attr("x", 200) // Center X-position below the figure
                .attr("y", 200) // Y-position below the figure
                .style("text-anchor", "middle") // Center the text
                .style("fill", "#1DB954"); // Color of the text
        }

        if (!isNaN(energyValue)) {
            label.text("Energy: " + energyValue.toFixed(3)); // Display energy
        } else {
            console.error("Invalid energy value:", energy);
        }
    }

    // Utility function to shuffle an array
    shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

}
