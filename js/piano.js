// SOURCE: https://codepen.io/gabrielcarol/pen/rGeEbY

// // Piano.js
// class Piano {
//   constructor(data) {
//       this.songCountsByKey = data;
//       this.keys = document.querySelectorAll(".key");
//       this.note = document.querySelector(".nowplaying");
//       this.hints = document.querySelectorAll(".hints");

//       this.initVis();
//   }

//   initVis() {
//       this.keys.forEach(key => {
//           key.addEventListener("transitionend", this.removeTransition);
//       });

//       this.hints.forEach((hint, index) => {
//           hint.setAttribute("style", "transition-delay:" + index * 50 + "ms");
//       });

//       this.wrangleData()

//       window.addEventListener("keydown", (e) => this.playNote(e));
//   }

//   wrangleData() {
//     let vis = this;

//     // Set up counts for each key
//     const counts = {};
//     vis.data.forEach((d) => {
//       const key = d.key;
//       if (counts[key]) {
//         counts[key] += 1;
//       } else {
//         counts[key] = 1;
//       }
//     });
//     vis.songCountsByKey = [];
//     Object.keys(counts).forEach((numericKey) => {
//       vis.songCountsByKey.push({
//         key: vis.fromPitchClass(numericKey),
//         count: counts[numericKey],
//       });
//     });
//     console.log(vis.songCountsByKey);
//   }
//   playNote(e) {
//       const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`),
//             key = document.querySelector(`.key[data-key="${e.keyCode}"]`);

//       if (!key) return;

//       const keyNote = key.getAttribute("data-note");

//       key.classList.add("playing");
//       this.note.innerHTML = keyNote;
//       audio.currentTime = 0;
//       audio.play();

//       this.displaySongCount(keyNote);
//   }

//   displaySongCount(keyNote) {
//     let vis = this;
//       const count = vis.songCountsByKey[keyNote];
//       if (count !== undefined) {
//           this.note.innerHTML += ` (${count} songs)`;
//       }
//   }

//   removeTransition(e) {
//       if (e.propertyName !== "transform") return;
//       e.target.classList.remove("playing");
//   }
// }


const keys = document.querySelectorAll(".key"),
  note = document.querySelector(".nowplaying"),
  hints = document.querySelectorAll(".hints");

function playNote(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`),
    key = document.querySelector(`.key[data-key="${e.keyCode}"]`);

  if (!key) return;

  const keyNote = key.getAttribute("data-note");

  key.classList.add("playing");
  note.innerHTML = keyNote;
  audio.currentTime = 0;
  audio.play();
}

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  this.classList.remove("playing");
}

function hintsOn(e, index) {
  e.setAttribute("style", "transition-delay:" + index * 50 + "ms");
}

hints.forEach(hintsOn);

keys.forEach(key => key.addEventListener("transitionend", removeTransition));

window.addEventListener("keydown", playNote);
