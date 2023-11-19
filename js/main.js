let myStickFigure; // Declare myStickFigure globally
let myEnergyStickFigure; // Declare myEnergyStickFigure globally
let myWordCloud; // Declare word cloud globally
let myPiano; // Declare piano globally
let topTrackVis; // Declare top track visualization globally
let topTrackVis2; // Declare top track visualization globally
let myClock; // Declare clock visualization globally

// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");

// (1) Load data with promises
loadData();

function loadData() {
  d3.csv("data/song-data.csv", (row) => {
    row.acousticness = +row.acousticness;
    row.artist_popularity = +row.artist_popularity;
    row.danceability = +row.danceability;
    row.duration_ms = +row.duration_ms;
    row.energy = +row.energy;
    row.instrumentalness = +row.instrumentalness;
    row.key = +row.key;
    row.liveness = +row.liveness;
    row.loudness = +row.loudness;
    row.mode = +row.mode;
    row.peak_rank = +row.peak_rank;
    row.previous_rank = +row.previous_rank;
    row.rank = +row.rank;
    row.speechiness = +row.speechiness;
    row.streams = +row.streams;
    row.tempo = +row.tempo;
    row.time_signature = +row.time_signature;
    row.valence = +row.valence;
    row.weeks_on_chart = +row.weeks_on_chart;
    return row;
  }).then((csv) => {
    // Store csv data in global variable
    data = csv;

    // Draw the visualization for the first time
    createVis(data);
  });
}

function createVis(data) {
  topTrackVis = new TopTrackVis("albumPage", data, "Oct26");
  topTrackVis2 = new TopTrackVis("albumPage2", data, "Nov2");
  myWordCloud = new wordCloud("wordCloud", data, "Nov2");
  myPiano = new Piano("pianoVis", data);
  myClock = new clockVis("#songClock", data);
  myStickFigure = new stickFigure("#dancingStickFigure", {});
  myEnergyStickFigure = new energyStickFigure("#energyStickFigure", {}); // Make sure to provide the correct ID
  const streamVisualization = new streamVis("#stream-vis", data, (songData) => {
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
}

// TODO: PARSE DATA HERE INSTEAD

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("toggleAnimationButton")
    .addEventListener("click", () => {
      streamVisualization.toggleAnimation();
    });

  // const myMusicSheetScatter = new musicSheetScatter("#musicSheet", "data/data.csv");

  d3.select("#songDropdown").on("change", function () {
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
