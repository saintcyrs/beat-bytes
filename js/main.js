// Declare global variables for visualizations
let myStickFigure;
let myEnergyStickFigure;
let myWordCloud;
let myPiano;
let topTrackVis;
let topTrackVis2;
let barChart;
let quoteVisInstance;
let barChart2;
let myClock;
let streamVisualization;
let selectedSong = null;
let myClock2;
let myStickFigure2;
let myEnergyStickFigure2;
let selectedCategory = "danceability";
let selectedCategory2 = "danceability";

// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");

// (1) Load data with promises
loadData();

document.addEventListener("DOMContentLoaded", function () {
  // Your JavaScript code here
  let carousel = new bootstrap.Carousel(
      document.getElementById("stateCarousel"),
      { interval: false }
  );

  // Update this variable inside your dropdown change event handler
  document.getElementById("category2").addEventListener("change", function () {
    selectedCategory2 = this.value;
    updateVisualization2(selectedCategory2);
  });
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
  myPiano = new Piano(data, "Oct26");
  myClock = new clockVis("#songClock", data);
  myClock2 = new clockVis("#songClock2", data);
  myStickFigure = new stickFigure("#dancingStickFigure", {}, "Oct26");
  myStickFigure2 = new stickFigure("#dancingStickFigure2", {}, "Nov2");
  myEnergyStickFigure = new energyStickFigure("#energyStickFigure", {});
  myEnergyStickFigure2 = new energyStickFigure("#energyStickFigure2", {});
  streamVisualization = new streamVis("#stream-vis", data, (songData) => {
    // Update the dropdown with the selected song
    const dropdown = document.getElementById("songDropdown");
    if (dropdown) {
      dropdown.value = songData.track_name; // Update dropdown value based on the clicked song data
    }

    topTrackVis = new TopTrackVis("albumPage", data, "Oct26");
    topTrackVis2 = new TopTrackVis("albumPage2", data, "Nov2");

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
  let defaultCategory2 = "danceability";
  updateVisualization2(defaultCategory2);
  console.log("Visualizations created.");
  selectedSong = data[0]; // Set the selected song to the first song in the data
  updateDropdown();
  updateSectionsVisibility(selectedCategory);
}

updateDropdown = () => {
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
};

document.addEventListener("DOMContentLoaded", function () {
  document
      .getElementById("toggleAnimationButton")
      .addEventListener("click", () => {
        // Check if streamVisualization is defined before toggling animation
        if (streamVisualization) {
          streamVisualization.toggleAnimation();
        }
      });
});

function onChange() {
  value = d3.select("#category").property("value");
  selectedCategory = value;
  updateSectionsVisibility(selectedCategory);
  barChart.updateVis();
}

function updateSectionsVisibility(selectedCategory) {
  console.log("Updating sections visibility...");
  // Hide all sections first
  document.getElementById("danceabilitySection").style.display = "none";
  document.getElementById("energySection").style.display = "none";
  document.getElementById("clockSection").style.display = "none";

  console.log(
      "energy display: " + document.getElementById("energySection").style.display
  );
  // Show the relevant section based on selectedCategory
  if (selectedCategory === "danceability") {
    document.getElementById("danceabilitySection").style.display = "block";
  } else if (selectedCategory === "energy") {
    document.getElementById("energySection").style.display = "block";
  } else if (selectedCategory === "duration_ms") {
    // Assuming 'time' is a category
    document.getElementById("clockSection").style.display = "block";
  }
}

/* function updateSectionsVisibility2(selectedCategory) {
  console.log("Updating sections visibility in taylor section...");
  // Hide all sections first
  document.getElementById("danceabilitySection2").style.display = "none";
  document.getElementById("energySection2").style.display = "none";
  document.getElementById("clockSection2").style.display = "none";

  console.log(
      "energy display: " + document.getElementById("energySection").style.display
  );
  // Show the relevant section based on selectedCategory
  if (selectedCategory === "danceability") {
    document.getElementById("danceabilitySection2").style.display = "block";
  } else if (selectedCategory === "energy") {
    document.getElementById("energySection").style.display = "block";
  } else if (selectedCategory === "duration_ms") {
    // Assuming 'time' is a category
    document.getElementById("clockSection2").style.display = "block";
  }
}*/
function updateVisualization2(selectedCategory) {
  // Hide all visualizations first
  d3.select("#danceabilitySection2").style("display", "none");
  d3.select("#energySection2").style("display", "none");
  d3.select("#clockSection2").style("display", "none");

  // Update the visualizations based on the selected category
  if (selectedCategory === "danceability") {
    d3.select("#danceabilitySection2").style("display", "block");
    if (selectedSong && selectedSong.danceability) {
      myStickFigure2.adjustDanceSpeed(selectedSong.danceability);
      myStickFigure2.updateDanceabilityLabel(selectedSong.danceability);
    }
  } else if (selectedCategory === "energy") {
    d3.select("#energySection2").style("display", "block");
    if (selectedSong && selectedSong.energy) {
      myEnergyStickFigure2.updateEnergyLevel(selectedSong.energy);
    }
  } else if (selectedCategory === "duration_ms") {
    d3.select("#clockSection2").style("display", "block");
    if (selectedSong && selectedSong.duration_ms) {
      myClock2.updateVis(selectedSong.duration_ms);
      myClock2.updateSongInfo(selectedSong);
    } else {
      // Reset the clock to the default state if no song is selected
      myClock2.updateVis(0); // Or any default value you prefer
    }
  }
}


function updateSecondAnimation(songData) {
  if (selectedCategory2 === "danceability" && myStickFigure2) {
    myStickFigure2.adjustDanceSpeed(songData.danceability);
    myStickFigure2.updateDanceabilityLabel(songData.danceability);
  }
  else if (selectedCategory2 === "duration_ms" && myClock2) {
    myClock2.updateVis(songData.duration_ms);
    myClock2.updateSongInfo(songData);
  }
  else if (selectedCategory2 === "energy" && myEnergyStickFigure2) {
    myEnergyStickFigure2.updateEnergyLevel(songData.energy);
  }
}

function updateSongInfo2(song) {
  if (!song) {
    console.error("Invalid song data:", song);
    return;
  }

  // Convert duration from milliseconds to minutes and seconds
  let durationMinutes = Math.floor(song.duration_ms / 60000);
  let durationSeconds = Math.floor((song.duration_ms % 60000) / 1000);
  durationSeconds = durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;
  let durationFormatted = durationMinutes + ":" + durationSeconds;

  // Update the song information display for the second set of visualizations
  d3.select("#songInfo2").html(`
    <span style="color: white;">Track:</span> ${song.track_name}<br>
    <span style="color: white;">Artist:</span> ${song.artist_names}<br>
`);
}

