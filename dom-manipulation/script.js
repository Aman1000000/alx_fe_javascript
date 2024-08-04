document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "To be or not to be, that is the question.", category: "Philosophy" },
        { text: "The only thing we have to fear is fear itself.", category: "History" },
        { text: "I think, therefore I am.", category: "Philosophy" },
        { text: "The unexamined life is not worth living.", category: "Philosophy" },
        { text: "Float like a butterfly, sting like a bee.", category: "Sports" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuoteBtn');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
    }


    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (text === "" || category === "") {
            alert("Please fill in both fields.");
            return;
        }

        quotes.push({ text, category });
        newQuoteText.value = "";
        newQuoteCategory.value = "";
        alert("Quote added successfully!");
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);

    showRandomQuote();
});
