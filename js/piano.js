// SOURCE: https://codepen.io/gabrielcarol/pen/rGeEbY

class Piano {
  // Constructor
  constructor(data) {

    this.data = data;
    this.playNote = this.playNote.bind(this);    this.hintsOn = this.hintsOn.bind(this);

    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.keys = document.querySelectorAll(".key");
    vis.note = document.querySelector(".nowplaying");
    vis.hints = document.querySelectorAll(".hints");

    vis.wrangleData();
  }
  // Set up key counts 
  wrangleData() {
    let vis = this;
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

      console.log(vis.convertedCounts);
      vis.updateVis();
    }

  updateVis() {
    let vis = this;

    vis.hints.forEach((hint, index) => vis.hintsOn(hint, index));

    vis.keys.forEach(key => key.addEventListener("transitionend", vis.removeTransition));
    window.addEventListener("keydown", vis.playNote);

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

playNote(e) {
  let vis = this;

  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`),
    key = document.querySelector(`.key[data-key="${e.keyCode}"]`);

  if (!key) return;

  const keyNote = key.getAttribute("data-note");

  key.classList.add("playing");
  // Find the count for this key
  const keyData = vis.convertedCounts.find(d => d.key === keyNote);
  const keyCount = keyData ? keyData.count : 0;

  // Update the display with key note and count
  // TODO: Possibly change how this header works.
  vis.note.innerHTML = `${keyNote} : ${keyCount} songs`;
  audio.currentTime = 0;
  audio.play();
}

removeTransition(e) {
  if (e.propertyName !== "transform") return;
  this.classList.remove("playing");
}

hintsOn(e, index) {
  e.setAttribute("style", "transition-delay:" + index * 50 + "ms");
}

}
