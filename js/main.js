

let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");

const streamVisualization = new streamVis("#stream-vis", "data/data.csv");

document.getElementById('toggleAnimationButton').addEventListener('click', () => {
    streamVisualization.toggleAnimation();
});