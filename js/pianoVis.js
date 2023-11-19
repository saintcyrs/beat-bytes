class Piano{
    // Constructor
    constructor(parentElement, dataFile){
        this.parentElement = parentElement;
        this.dataFile = dataFile;
        this.initVis();
    }
    // Initialize
    initVis() {
        let vis = this;

        vis.svg = d3.select(vis.parentElement).select('#piano-svg');
        vis.wrangleData();
    }

    // Wrangle data
    wrangleData() {
        let vis = this;

        d3.csv(vis.dataFile).then((data) => {
            vis.data = data;
            data.forEach(d => {
                d.duration = +d.duration;
            });
        // Set up counts for each key
        const counts = {}
        data.forEach(d => {
            const key = d.key;
            if (counts[key]) {
                counts[key] += 1;
            } else {
                counts[key] = 1;
            }
        });
        vis.convertedCounts = [];
        Object.keys(counts).forEach(numericKey => {
            convertedCounts.push({
                key: vis.fromPitchClass(numericKey),
                count: counts[numericKey]
            });
        });
        }).catch(error => {
            console.error("Error loading the CSV file:", error);
        });
    }

    // Update vis
    updateVis() {
        let vis = this;
        // Bind the data to the piano keys and append text overlays for the counts
        // Assume each key in the SVG has an id corresponding to its note name (e.g., id="C", id="C#", etc.)
        vis.svg.selectAll('.piano-key')
        .data(vis.convertedCounts, d => d.key)
        .join(
            enter => {
                // For new data elements, append text to each key for the count
                enter.append('text')
                    .attr('x', (d,i)=> 5 + i)
                    .attr('y', 10 /* logic to determine y position based on key id */)
                    .text(d => d.count)
                    .attr('color', 'black')
                    .attr('class', 'key-count')
                    .attr('text-anchor', 'middle')
                    .attr('alignment-baseline', 'middle')
                    .attr('pointer-events', 'none'); // Ensure that the text doesn't interfere with key events
            },
            update => {
                // For existing elements, update the text
                update.select('.key-count')
                    .text(d => d.count);
            },
            exit => {
                // Remove text for keys that are no longer present
                exit.select('.key-count').remove();
            }
        );
    }

    fromPitchClass(pitchClass) {
        const pitchClasses = {
            0: "C",
            1: "C#",
            2: "D",
            3: "D#",
            4: "E",
            5: "F",
            6: "F#",
            7: "G",
            8: "G#",
            9: "A",
            10: "A#",
            11: "B"
        };
        return pitchClasses[pitchClass];
    }
}