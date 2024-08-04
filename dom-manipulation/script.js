document.addEventListener('DOMContentLoaded', () => {
    const quotesKey = 'quotes';
    let quotes = JSON.parse(localStorage.getItem(quotesKey)) || [
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
    const importFileInput = document.getElementById('importFile');
    const exportButton = document.getElementById('exportQuotesBtn');

    // Function to show a random quote
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
        sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
    }

    // Function to add a new quote
    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (text === "" || category === "") {
            alert("Please fill in both fields.");
            return;
        }

        quotes.push({ text, category });
        saveQuotes();
        newQuoteText.value = "";
        newQuoteCategory.value = "";
        alert("Quote added successfully!");
    }

    // Function to save quotes to local storage
    function saveQuotes() {
        localStorage.setItem(quotesKey, JSON.stringify(quotes));
    }

    // Function to export quotes to a JSON file
    function exportToJsonFile() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        a.click();
    }

    // Function to import quotes from a JSON file
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Event listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);
    exportButton.addEventListener('click', exportToJsonFile);
    importFileInput.addEventListener('change', importFromJsonFile);

    // Load last viewed quote from session storage
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        const quote = JSON.parse(lastQuote);
        quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    } else {
        showRandomQuote();
    }
});
