// Define word cloud visualization class
// Based on the wordCloud implelementation from https://github.com/iankelk/iankelk.github.io/blob/main/project/visuals/wordcloud/js/wordcloud.js

class wordCloud {
  constructor(parentElement, data, date) {
    // The DOM element of the parent
    this.parentElement = parentElement;
    this.data = data;
    this.date = date;
    // Step to alternate between rotations for fun
    this.step = 0;
    // Initialize minimum and maximum to be updated later
    this.minMax = [0, 100];
    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.fill = d3.scaleOrdinal(d3.schemeTableau10);

    // define margins
    vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    // console.log(document.getElementById(vis.parentElement));
    vis.width = 300; //document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
    vis.height = 300; //- vis.margin.top - vis.margin.bottom;
    // console.log(vis.width, vis.height)

    // init drawing area
    vis.svg = d3
      .select("#" + vis.parentElement)
      .append("svg")
      .attr("width", vis.width + vis.margin.left + vis.margin.right)
      .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
      .append("g")
      .attr(
        "transform",
        `translate (${vis.margin.left + vis.width / 2}, ${
          vis.margin.top + vis.height / 2
        })`
      );

    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;

    vis.data = vis.data.filter((d) => d.week === vis.date);

    const counts = {};
    vis.data.forEach((d) => {
      const artist = d.artist_names;
      if (counts[artist]) {
        counts[artist] += 1;
      } else {
        counts[artist] = 1;
      }
    });
    // Calculate the min and max counts
    let min = Infinity,
      max = -Infinity;
    Object.values(counts).forEach((count) => {
      if (count < min) min = count;
      if (count > max) max = count;
    });
    // Possibly redefine this to include the artist name ??
    // BUT there are many artists who only have one song on the charts
    // Store the processed data for use in getWords
    vis.processedData = Object.entries(counts).map(([artist, count]) => ({
      artist_names: artist,
      count: count,
    }));
    //console.log(vis.processedData);
    vis.minMax = [min, max];
    vis.wordScale = d3.scaleLinear().domain(vis.minMax).range([7, 80]);
    vis.wordCloud();
    vis.showNewWords(vis.wordCloud());
  }

  // Encapsulate the word cloud functionality
  wordCloud() {
    let vis = this;

    // Draw the word cloud
    function draw(names) {
      const cloud = vis.svg.selectAll("g text").data(names, function (d) {
        return d.text;
      });

      // Entering words
      cloud.join(
        (enter) =>
          enter
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function (d, i) {
              return vis.fill(i);
            })
            .attr("class", "wordcloud-word")
            .attr("text-anchor", "middle")
            .attr("font-size", (d) => d.size)
            .text(function (d) {
              return d.text;
            })
            .attr("transform", function (d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            }),
        //     let word = vis.data.find(item => item.key === d.text);
        //     // TODO: See if remove tooltip
        //     vis.tooltip
        //         .style("opacity", 1)
        //         .style("left", event.pageX + 20 + "px")
        //         .style("top", event.pageY + "px")
        //         .html(`
        //          <div style="border: thin solid grey; border-radius: 5px; background: darkgrey; padding: 10px">
        //              <h4>${word.key}</h4>
        //              <strong>Number of tweets containing this word: </strong> ${word.value}<br />
        //          </div>`)})
        // .on('mouseout', function (event, d) {
        //     vis.tooltip
        //         .style("opacity", 0)
        //         .style("left", 0)
        //         .style("top", 0)
        //         .html(``);
        // })
        // .on('mousemove', (event,d) => {
        //     vis.tooltip
        //         .style("left", event.pageX + 20 + "px")
        //         .style("top", event.pageY + "px")
        //})
        // Entering and existing words
        (update) =>
          update
            .transition()
            .duration(600)
            .style("font-size", function (d) {
              return d.size + "px";
            })
            .attr("transform", function (d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1),
        (exit) =>
          exit
            .transition()
            .duration(200)
            .style("fill-opacity", 1e-6)
            .attr("font-size", 1)
            .remove()
      );
    }

    vis.cloud = d3.layout.cloud().size([vis.width, vis.height]);

    return {
      // Recompute the word cloud. This method will
      // asynchronously call draw when the layout has been computed.
      update: function (words) {
        // Make the 3rd rotation alternate between the angles of [0,60] and [0,-60]
        const thirdRotation =
          ~~(Math.random() * 60) * { 0: 1, 1: -1 }[vis.step % 2];
        vis.cloud
          .words(words)
          .padding(5)
          .spiral("rectangular")
          .font("Impact")
          .fontSize(function (d) {
            return d.size;
          })
          .on("end", draw);
        if (vis.step % 3 === 0) {
          vis.step++;
          vis.cloud
            .rotate(function () {
              return ~~(Math.random() * 2) * 90;
            })
            .start();
        } else if (vis.step % 3 === 1) {
          vis.step++;
          vis.cloud
            .rotate(function () {
              return (~~(Math.random() * 6) - 3) * 30;
            })
            .start();
        } else {
          vis.step++;
          vis.cloud
            .rotate(function () {
              return thirdRotation;
            })
            .start();
        }
      },
    };
  }

  // Prepare one of the sample sentences by removing punctuation,
  // creating an array of words and computing a random size attribute.
  getWords() {
    let vis = this;
    return vis.processedData.map((d) => {
      return { text: d.artist_names, size: vis.wordScale(d.count) };
    });
  }

  // This method tells the word cloud to redraw
  showNewWords(v, i) {
    let vis = this;
    v.update(vis.getWords());
  }
}
