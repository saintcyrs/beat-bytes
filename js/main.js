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
  let topTrackVis = new TopTrackVis("toptrackvis", data, "Nov2");
}
