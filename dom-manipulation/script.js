document.addEventListener('DOMContentLoaded', () => {
           const quotesKey = 'quotes';
           const filterKey = 'categoryFilter';
           const lastSyncKey = 'lastSync';
           const serverUrl = 'https://jsonplaceholder.typicode.com/posts';
           let quotes = JSON.parse(localStorage.getItem(quotesKey)) || [];

           const quoteDisplay = document.getElementById('quoteDisplay');
           const newQuoteButton = document.getElementById('newQuote');
           const addQuoteButton = document.getElementById('addQuoteBtn');
           const newQuoteText = document.getElementById('newQuoteText');
           const newQuoteCategory = document.getElementById('newQuoteCategory');
           const importFileInput = document.getElementById('importFile');
           const exportButton = document.getElementById('exportQuotesBtn');
           const categoryFilter = document.getElementById('categoryFilter');

           function showRandomQuote() {
               const filteredQuotes = getFilteredQuotes();
               const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
               const randomQuote = filteredQuotes[randomIndex];
               quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
               sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
           }

           function addQuote() {
               const text = newQuoteText.value.trim();
               const category = newQuoteCategory.value.trim();

               if (text === "" || category === "") {
                   alert("Please fill in both fields.");
                   return;
               }

               const newQuote = { text, category };

               quotes.push(newQuote);
               saveQuotes();
               updateCategoryFilter();
               newQuoteText.value = "";
               newQuoteCategory.value = "";
               alert("Quote added successfully!");
               syncWithServer(newQuote, 'add');
           }

           function saveQuotes() {
               localStorage.setItem(quotesKey, JSON.stringify(quotes));
           }

           function exportToJsonFile() {
               const dataStr = JSON.stringify(quotes, null, 2);
               const dataBlob = new Blob([dataStr], { type: 'application/json' });
               const url = URL.createObjectURL(dataBlob);
               const a = document.createElement('a');
               a.href = url;
               a.download = 'quotes.json';
               a.click();
           }

           function importFromJsonFile(event) {
               const fileReader = new FileReader();
               fileReader.onload = function(event) {
                   const importedQuotes = JSON.parse(event.target.result);
                   quotes.push(...importedQuotes);
                   saveQuotes();
                   updateCategoryFilter();
                   alert('Quotes imported successfully!');
               };
               fileReader.readAsText(event.target.files[0]);
           }
           function updateCategoryFilter() {
               const categories = Array.from(new Set(quotes.map(q => q.category)));
               categoryFilter.innerHTML = '<option value="all">All Categories</option>';
               categories.forEach(category => {
                   const option = document.createElement('option');
                   option.value = category;
                   option.textContent = category;
                   categoryFilter.appendChild(option);
               });
               const savedFilter = localStorage.getItem(filterKey);
               if (savedFilter) {
                   categoryFilter.value = savedFilter;
               }
           }


           function getFilteredQuotes() {
               const selectedCategory = categoryFilter.value;
               if (selectedCategory === 'all') {
                   return quotes;
               }
               return quotes.filter(quote => quote.category === selectedCategory);
           }

           function filterQuotes() {
               const selectedCategory = categoryFilter.value;
               localStorage.setItem(filterKey, selectedCategory);
               showRandomQuote();
           }

           async function syncWithServer(newQuote = null, action = null) {
               try {
                   const response = await fetch(serverUrl);
                   const serverQuotes = await response.json();
                   const serverLastSync = new Date(localStorage.getItem(lastSyncKey));
                   serverQuotes.forEach(serverQuote => {
                       const match = quotes.find(localQuote => localQuote.text === serverQuote.body);
                       if (!match) {
                           quotes.push({ text: serverQuote.body, category: 'Imported' });
                       } else {

                           match.category = serverQuote.title;
                       }
                   });

                   if (newQuote && action === 'add') {
                       await fetch(serverUrl, {
                           method: 'POST',
                           body: JSON.stringify({
                               title: newQuote.category,
                               body: newQuote.text,
                               userId: 1
                           }),
                           headers: {
                               'Content-type': 'application/json; charset=UTF-8',
                           },
                       });
                   }

                   saveQuotes();
                   updateCategoryFilter();
                   localStorage.setItem(lastSyncKey, new Date().toISOString());
                   alert('Data synced successfully with the server.');
               } catch (error) {
                   console.error('Error syncing with server:', error);
                   alert('Failed to sync with the server.');
               }
           }
           newQuoteButton.addEventListener('click', showRandomQuote);
           addQuoteButton.addEventListener('click', addQuote);
           exportButton.addEventListener('click', exportToJsonFile);
           importFileInput.addEventListener('change', importFromJsonFile);
           categoryFilter.addEventListener('change', filterQuotes);


           const lastQuote = sessionStorage.getItem('lastQuote');
           if (lastQuote) {
               const quote = JSON.parse(lastQuote);
               quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
           } else {
               showRandomQuote();
           }


           updateCategoryFilter();
           filterQuotes();


           setInterval(syncWithServer, 60000); // Sync every minute
       });
