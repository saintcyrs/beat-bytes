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
    this.displayData = data;
    // TODO: Possibly find another color scheme that looks better with existing theme
    this.genreColorMap = d3.scaleOrdinal(["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]);
    this.initVis();
  }

  initVis() {
    let vis = this;
    // TODO: On hover, change all other colors to white (is this CSS?)

    // define margins
    vis.margin = { top: 0, right: 20, bottom: 20, left: 20 };
    vis.width = 600;
    vis.height = 600;

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
    
    vis.cloud = d3.layout.cloud().size([vis.width, vis.height]);

    // TODO: Add tooltip on hover (# of streams)
    vis.wrangleData();
  }

  wrangleData() {
    let vis = this;
    // Redefine displayData to contain the filtered list of just Nov2 data
    vis.displayData = vis.data.filter((d) => d.week === vis.date);
    console.log("DISPLAY DATA", vis.displayData);

    // Count the number of occurrences for each artist
    const counts = {};
    vis.displayData.forEach((d) => {
      // TODO: Change artist to only be defined by the first artist in artist_names
      const artist = vis.getPrimaryArtist(d);
      counts[artist] = (counts[artist] || 0) + 1;
    });

    // Possibly redefine this to include the artist name ??
    // BUT there are many artists who only have one song on the charts
    // Store the processed data for use in getWords
    // Modify the processedData mapping
    vis.processedData = Object.entries(counts).map(([artist, count]) => {
      let primaryGenre = vis.getPrimaryGenre(artist).split(",")[0];
      return {
        artist_names: artist,
        genre: primaryGenre,
        count: count,
        originalColor: vis.genreColorMap(primaryGenre) // Set the original color here
      };
    });
    
    console.log("PROCESSED DATA", vis.processedData);
    // Calculate the min and max counts
    let min = Infinity,
        max = -Infinity;
    Object.values(counts).forEach((count) => {
      if (count < min) min = count;
      if (count > max) max = count;
    });
    vis.minMax = [min, max];
    vis.wordScale = d3.scaleLinear().domain(vis.minMax).range([20, 80]);
    vis.showNewWords();
  }

  // Encapsulate the word cloud functionality
  showNewWords() {
    let vis = this;
    // Calculate word sizes based on counts
    let wordEntries = vis.getWords(vis.processedData).sort((a,b) => b.size - a.size);
    
    // Draw the word cloud with the new words
    vis.cloud
      .words(wordEntries)
      .padding(5)
      .rotate(() => (~~(Math.random() * 2) * 90))
      .font("Impact")
      .fontSize(function(d) {
        //console.log(d);
        return d.size;})
      .on("end", words => {
        vis.draw(words);
      })
      .start();
  }

  getWords(words) {
    let vis = this;
    return words.map(d => ({
      text: d.artist_names,
      genre: d.genre,
      size: vis.wordScale(d.count),
      color: d.originalColor,
    }));
  }

  draw(words) {
    let vis = this;
    // Bind data to text elements and update positions
    let text = vis.svg.selectAll("text")
      .data(words, d => d.text);

    // At the beginning of your script
    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    text.enter()
      .append("text")
      .merge(text)
      .style("font-family", "Impact")
      .style("fill", d => d.color)
      .attr("text-anchor", "middle")
      .attr("font-size", d => d.size)
      .attr("transform", d => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
      .text(d => d.text)
      .on('mouseover', function(event, d) {
        console.log(event);
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html("Genre: " + d.genre)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
        d3.select(this).style("fill", "white");
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
        d3.select(this).style("fill", b => b.color);
      });

    text.exit().remove();
  }

  getPrimaryGenre(aritstName) {
    let vis = this;
    // Find the first occurrence of the artist in the data and return their genre
    let artistData = vis.displayData.find(d => d.artist_names.includes(aritstName));
    return artistData ? artistData.artist_genre : "Unknown";
  }

  getPrimaryArtist(data) {
    return data.artist_names.split(",")[0];
  }
}
