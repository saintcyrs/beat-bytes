class QuoteVis {
    // Array of quotes
    constructor() {
        this.quotes = [
            "♪ Karma is my boyfriend ♪",
            "♪ I don't know about you, but I'm feeling 22 ♪",
            "♪ We were both young when I first saw you ♪",
            "♪ Shake it off ♪",
            "♪ We never go out of style ♪",
            "♪ It's me, hi, I'm the problem, it's me ♪",
            "♪ You belong with me ♪",
            "♪ Darling, I'm a nightmare dressed like a daydream ♪",
            "♪ I knew you were trouble when you walked in ♪",
        ];

        this.usedQuotes = [];
    }

    getRandomQuote() {
        const unusedQuotes = this.quotes.filter(quote => !this.usedQuotes.includes(quote));
        if (unusedQuotes.length === 0) {
            // if all quotes have been used, reset usedQuotes array
            this.usedQuotes = [];
        }
        const randomIndex = Math.floor(Math.random() * unusedQuotes.length);
        const randomQuote = unusedQuotes[randomIndex];
        this.usedQuotes.push(randomQuote);
        return randomQuote;
    }

    createRandomQuote() {
        const quoteContainer = document.querySelector("#quote-container");
        const bigTitle = document.querySelector("#title");

        // Create a new quote element
        const quote = document.createElement("div");
        quote.classList.add("quote");
        quote.textContent = this.getRandomQuote();

        // Get the dimensions and position of the big-title div
        const bigTitleRect = bigTitle.getBoundingClientRect();
        console.log("bigTitleRect, ", bigTitleRect)

        // Calculate the maximum X and Y positions relative to the big-title div
        const maxX = bigTitleRect.left;
        console.log('maxX ', maxX);
        const maxY = bigTitleRect.top;
        console.log('maxY ', maxY);

        // Randomly position the quote within the defined boundaries
        const x = bigTitleRect.left;
        const y = bigTitleRect.top;

        // Set the exact x and y coordinates
        quote.style.transform = `translate(${92}px, ${10}px)`;

        // Append the quote to the container
        quoteContainer.appendChild(quote);
    }

    generateQuotes() {
        // Create a number of quotes (adjust as needed)
        const numberOfQuotes = 10;
        for (let i = 0; i < numberOfQuotes; i++) {
            this.createRandomQuote();
        }
    }
}