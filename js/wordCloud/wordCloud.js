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
    this.displayData = this.data.filter((d) => d.week === this.date);
    this.genreColorMap = d3.scaleOrdinal( [
      "#645c9b", "#8e398d", "#698a8c", "#5e9178", "#915272", "#8a5274",
      "#833cc6", "#5599be", "#4787b5", "#5860aa", "#9855a4", "#918072",
      "#799965", "#8934a2", "#863e80", "#3869b8", "#789176", "#447dc4",
      "#7a7a8f", "#5540a7"
      ]);
    this.initVis();
  }

  initVis() {
    let vis = this;

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
    vis.generateGenreOptions(vis.displayData);
    vis.updateWordCloud();
  }

  wrangleData(selectedGenres) {
    console.log(selectedGenres)
    let vis = this;
    // Redefine displayData to contain the filtered list of just Nov2 data

    vis.filteredData = vis.displayData.filter(d => {
      // If no genres are selected, or the artist's genre is in the selected genres, include the data point
      return d.artist_genre.split(',').some(genre => selectedGenres.includes(genre));
    });

    // Count the number of occurrences for each artist
    const counts = {};
    vis.filteredData.forEach((d) => {
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

  generateGenreOptions(data) {
    let vis = this;
    // Create set of genres from data
    vis.genres = new Set(data.map(d => d.artist_genre.split(",")).flat());

    // Select the container where checkboxes will be appended
    const container = d3.select('.genre-select')
        .style('overflow-y', 'scroll') // Add vertical scrollbar
        .style('max-height', '500px'); // Set a maximum height

    // Add 'All' checkbox first and set it to checked by default
    let allLabel = container.append('label')
    .attr('class', 'genre-label');

    allLabel.append('input')
      .attr('type', 'checkbox')
      .attr('value', 'all')
      .attr('checked', true) // Set checked attribute
      .attr('class', 'genre-checkbox')
      .on('change', function() {
          // When 'All' is checked or unchecked, update all checkboxes
          const isChecked = d3.select(this).property('checked');
          d3.selectAll('.genre-checkbox').property('checked', isChecked);
          vis.updateWordCloud();
      });

    allLabel.append('span').text(' all');
    container.append('br'); // Line break after 'All'


    // Add checkboxes and labels for other genres
    vis.genres.forEach(genre => {
        if (genre !== "All") {
            let label = container.append('label')
                .attr('class', 'genre-label');

            label.append('input')
                .attr('type', 'checkbox')
                .attr('value', genre)
                .attr('checked', true)
                .attr('class', 'genre-checkbox')
                .on('change', function() {
                    vis.updateWordCloud();
                });

            label.append('span')
                .text(` ${genre}`);

            container.append('br'); // Line break after each genre
        }
    });
}

  updateWordCloud() {
    let vis = this;
    const selectedGenres = d3.selectAll('.genre-checkbox:checked').nodes()
      .map(node => node.value);
    vis.wrangleData(selectedGenres);
  }
}
