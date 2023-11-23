class energyStickFigure extends stickFigure {
    constructor(id, data) {
        super(id, data);

        // Clear any music notes drawn by the parent class
        this.svg.selectAll("text").remove();

        // Initialize energy
        this.energy = 0;

        // Add a placeholder for the energy label further down
        this.energyLabel = this.svg.append("text")
            .attr("class", "energy-label")
            .style("fill", "#314149")
            .attr("x", 130) // Center X-position
            .attr("y", -10); // Adjusted Y-position down the page

        // Adjust the initial position of the stick figure group
        this.svg.attr('transform', `translate(${this.margin.left}, 70)`); // Move the entire figure down
    }

    // Override drawMusicNotes to do nothing in this subclass
    drawMusicNotes(svg) {
        // Do not draw music notes for the energy stick figure
    }

    animateArms(svg) {
        // Arms will remain stationary in this implementation
    }

    animateBody(svg) {
        // The jump height and speed will depend on the energy value
        const jumpHeight = 10 + (this.energy * 20); // More energy, higher jump
        const duration = 1000 - (this.energy * 800); // More energy, faster jumps

        const animateJump = () => {
            svg.transition()
                .duration(duration / 2)
                .attr("transform", `translate(0, ${-jumpHeight + 70})`) // Adjusted move up
                .transition()
                .duration(duration / 2)
                .attr("transform", "translate(0, 70)") // Adjusted move down
                .on("end", animateJump);
        }

        animateJump();
    }

    updateEnergyLevel(energy) {
        this.energy = energy;

        // Update the energy label text
        this.energyLabel.text(`Energy: ${energy.toFixed(3)}`); // Display energy with 2 decimal places

        // Update animation based on new energy level
        this.animateBody(this.svg);
    }


    }
