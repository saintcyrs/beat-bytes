let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");

let myStickFigure; // Declare myStickFigure globally
let myEnergyStickFigure; // Declare myEnergyStickFigure globally
let myWordCloud; // Declare word cloud globally
let myPiano; // Declare piano globally

// TODO: PARSE DATA HERE INSTEAD

document.addEventListener("DOMContentLoaded", function() {
    // Initialize myStickFigure with empty danceability data initially
    myStickFigure = new stickFigure("#dancingStickFigure", {});

    // Initialize myEnergyStickFigure with empty energy data initially
    myEnergyStickFigure = new energyStickFigure("#energyStickFigure", {}); // Make sure to provide the correct ID

    // Initialize streamVisualization with a callback to update the song in the dropdown
    const streamVisualization = new streamVis("#stream-vis", "data/data.csv", (songData) => {
        // Update the dropdown with the selected song
        const dropdown = document.getElementById("songDropdown");
        if (dropdown) {
            dropdown.value = songData.track_name; // Update dropdown value based on the clicked song data
        }

        // Adjust dance speed if danceability is available
        if (songData.danceability) {
            myStickFigure.adjustDanceSpeed(songData.danceability);
            myStickFigure.updateDanceabilityLabel(songData.danceability);
        }

        // Adjust energy level if energy is available
        if (songData.energy) {
            myEnergyStickFigure.updateEnergyLevel(songData.energy);
        }
    });

    const clock = new clockVis("#songClock", "data/data.csv");

    document.getElementById('toggleAnimationButton').addEventListener('click', () => {
        streamVisualization.toggleAnimation();
    },

    myWordCloud = new wordCloud("wordCloud", "data/data.csv"),
    myPiano = new Piano("pianoVis", "data/data.csv")

    );

   // const myMusicSheetScatter = new musicSheetScatter("#musicSheet", "data/data.csv");

    d3.select("#songDropdown").on("change", function() {
        let selectedIndex = d3.select(this).property("value");
        let selectedSong = clock.songData[selectedIndex];

        if (selectedSong && selectedSong.duration_ms) {
            clock.updateVis(selectedSong.duration_ms);
            clock.updateSongInfo(selectedSong); // Update song info label when a song is selected

            // Adjust dance speed if danceability is available
            if (selectedSong.danceability) {
                myStickFigure.adjustDanceSpeed(selectedSong.danceability);
                myStickFigure.updateDanceabilityLabel(selectedSong.danceability);
            }

            // Adjust energy level if energy is available
            if (selectedSong.energy) {
                myEnergyStickFigure.updateEnergyLevel(selectedSong.energy);
            }
        } else {
            console.error("Invalid song data or missing duration:", selectedSong);
        }
    });
});
