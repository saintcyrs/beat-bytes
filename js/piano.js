// SOURCE: https://codepen.io/gabrielcarol/pen/rGeEbY

class Piano {
  // Constructor
  constructor(data, date) {
    this.date = date;
    this.data = data.filter((d) => d.week === this.date);
    this.playNote = this.playNote.bind(this);
    this.hintsOn = this.hintsOn.bind(this);

    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.keys = document.querySelectorAll(".key");
    vis.note = document.querySelector(".nowplaying");
    vis.hints = document.querySelectorAll(".hints");
    vis.sidebar = document.querySelector(".key-info");

    vis.wrangleData();
  }
  // Set up key counts 
  wrangleData() {
    let vis = this;
      // TODO: Set up top 3 songs for each key
      // TODO: Search through the data and find the top 3 songs for each key
      // Object to hold top 3 songs for each key
      vis.topSongs = {};

      // Iterate through the data and populate topSongs
    vis.data.forEach(song => {
      let key = vis.fromPitchClass(song.key);

      // Initialize the array for this key if it doesn't exist
      if (!vis.topSongs[key]) {
        vis.topSongs[key] = [];
      }

      // Create an object with the desired information
      const songInfo = {
        artistNames: song.artist_names,
        trackName: song.track_name,
        key: key
      };

      // Push the songInfo object to the array for its key
      vis.topSongs[key].push(songInfo);

      // Sort the array by streams (or another attribute) and keep only top 3
      // Assuming 'streams' is a property in your data
      vis.topSongs[key] = vis.topSongs[key].sort((a, b) => b.streams - a.streams).slice(0, 3);
    });

      console.log("Top Songs by Key", vis.topSongs);

      // Set up counts for each key
      const counts = {};
      vis.data.forEach((d) => {
        let key = d.key;
        if (counts[key]) {
          counts[key] += 1;
        } else {
          counts[key] = 1;
        }
      });
      vis.convertedCounts = [];
      Object.keys(counts).forEach((numericKey) => {
        vis.convertedCounts.push({
          key: vis.fromPitchClass(numericKey),
          count: counts[numericKey],
        });
      });

      console.log("CONVERTED COUNTS", vis.convertedCounts);
      vis.updateVis();
    }

  updateVis() {
    let vis = this;

    vis.hints.forEach((hint, index) => vis.hintsOn(hint, index));

    // Add event listeners for both keyboard and mouse
    vis.keys.forEach(key => {
      key.addEventListener("transitionend", vis.removeTransition);
      key.addEventListener("click", (e) => vis.playNote(e, key)); // Mouse click event
    });
    window.addEventListener("keydown", (e) => vis.playNote(e));

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
    11: "B",
  };
  return pitchClasses[pitchClass];
}

playNote(e, clickedKey = null) {
  let vis = this;

  // Determine whether the event is from a mouse click or a keyboard press
  let keyCode = clickedKey ? clickedKey.getAttribute("data-key") : e.keyCode;
  let key = document.querySelector(`.key[data-key="${keyCode}"]`);
  let audio = document.querySelector(`audio[data-key="${keyCode}"]`);

  if (!key || !audio) return;  // Exit if key or audio is not found

  const keyNote = key.getAttribute("data-note");
  key.classList.add("playing");
  audio.currentTime = 0;
  audio.play();

  // Update the sidebar with top songs for the key
  vis.updateSidebar(keyNote);
}

removeTransition(e) {
  if (e.propertyName !== "transform") return;
  this.classList.remove("playing");
}

hintsOn(e, index) {
  e.setAttribute("style", "transition-delay:" + index * 50 + "ms");
}

updateSidebar(keyNote) {
  let vis = this;

  // Find the top songs for this key
  let songsForKey = vis.topSongs[keyNote];

  // Find the total number of songs for this key
  let totalSongs = vis.convertedCounts.find(d => d.key === keyNote)?.count || 0;

  // Clear existing content
  vis.sidebar.innerHTML = '';

  // Check if there are songs for this key
  if (songsForKey && songsForKey.length > 0) {
    // Create a header for the key information
    let header = document.createElement('h3');
    header.textContent = `Key of ${keyNote} - ${totalSongs} songs`;
    vis.sidebar.appendChild(header);

    // Create a list of songs
    let list = document.createElement('ul');
    songsForKey.forEach(song => {
      let listItem = document.createElement('li');
      listItem.textContent = `${song.artistNames} - ${song.trackName}`;
      list.appendChild(listItem);
    });

    vis.sidebar.appendChild(list);
  } else {
    // Display a message if no songs are available for this key
    vis.sidebar.textContent = `No top songs for the key of ${keyNote}.`;
  }
}


}

