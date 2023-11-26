// Declare global variables for visualizations
let myStickFigure;
let myEnergyStickFigure;
let myWordCloud;
let myPiano;
let topTrackVis;
let topTrackVis2;
let barChart;
let barChart2;
let myClock;
let streamVisualization; // Declare streamVisualization globally

// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");

// Define switchView function globally
function switchView() {
  const switchButton = document.getElementById("switchViewButton");
  const stateCarousel = new bootstrap.Carousel(
    document.getElementById("stateCarousel")
  );

  if (switchButton.innerHTML === "Danceability") {
    stateCarousel.next(); // Go to the next carousel item
  } else if (switchButton.innerHTML === "Time") {
    stateCarousel.next(); // Go to the next carousel item
  } else {
    stateCarousel.prev(); // Go to the previous carousel item
  }
}

// (1) Load data with promises
loadData();

document.addEventListener("DOMContentLoaded", function () {
  // Your JavaScript code here
  let carousel = new bootstrap.Carousel(
    document.getElementById("stateCarousel"),
    { interval: false }
  );
});

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
  console.log("Creating visualizations...");
  topTrackVis = new TopTrackVis("albumPage", data, "Oct26");
  topTrackVis2 = new TopTrackVis("albumPage2", data, "Nov2");
  barChart = new BarChartVis("barChart", data, "Oct26");
  barChart2 = new BarChartVis("barChart2", data, "Nov2");
  myWordCloud = new wordCloud("wordCloud", data, "Nov2");
  myPiano = new Piano(data);
  myClock = new clockVis("#songClock", data);
  myStickFigure = new stickFigure("#dancingStickFigure", {});
  myEnergyStickFigure = new energyStickFigure("#energyStickFigure", {}); // Make sure to provide the correct ID
  streamVisualization = new streamVis("#stream-vis", data, (songData) => {
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
  console.log("Visualizations created.");
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("toggleAnimationButton")
    .addEventListener("click", () => {
      // Check if streamVisualization is defined before toggling animation
      if (streamVisualization) {
        streamVisualization.toggleAnimation();
      }
    });

  // const myMusicSheetScatter = new musicSheetScatter("#musicSheet", "data/data.csv");

  d3.select("#songDropdown").on("change", function () {
    let selectedIndex = d3.select(this).property("value");
    // Make sure to access the songData from the myClock instance
    let selectedSong = myClock.songData[selectedIndex];

    if (selectedSong && selectedSong.duration_ms) {
      myClock.updateVis(selectedSong.duration_ms);
      myClock.updateSongInfo(selectedSong); // Update song info label when a song is selected

      // Adjust dance speed if danceability is available
      if (selectedSong.danceability) {
        myStickFigure.adjustDanceSpeed(selectedSong.danceability);
        myStickFigure.updateDanceabilityLabel(selectedSong.danceability);
      }

      // Adjust energy level if energy is available
      if (selectedSong && selectedSong.energy) {
        myEnergyStickFigure.updateEnergyLevel(selectedSong.energy);
      }
    } else {
      console.error("Invalid song data or missing duration:", selectedSong);
    }
  });
});

// Define piano visualization
// main.js
// document.addEventListener('DOMContentLoaded', () => {
//   const songCountsByKey = {
//       'C': 10,
//       'C#': 5,
//       'D': 15,
//       // ... other keys
//   };

//   myPiano = new Piano(songCountsByKey);
// });

