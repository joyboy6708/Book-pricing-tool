// Book price and publisher database
const books = [
  {
    title: "Atomic Habits",
    publisher: "Penguin",
    prices: {
      amazon: {
        price: 350,
        link: "https://www.amazon.in/dp/0143453609",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
      },
      flipkart: {
        price: 340,
        link: "https://www.flipkart.com/atomic-habits/p/itmfc7a7cc9051c2",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Flipkart_logo.png"
      }
    }
  },
  {
    title: "The Alchemist",
    publisher: "HarperOne",
    prices: {
      amazon: {
        price: 280,
        link: "https://www.amazon.in/dp/0061122416",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
      },
      flipkart: {
        price: 275,
        link: "https://www.flipkart.com/alchemist/p/itmdx99fywddzgyz",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Flipkart_logo.png"
      }
    }
  }
];

// Listen for Enter key in search input
document.getElementById("searchInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBook();
  }
});

function searchBook() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = "";

  if (!query) {
    resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data.items || data.items.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
      }

      data.items.forEach(book => {
        const volumeInfo = book.volumeInfo;

        const title = volumeInfo.title || "No Title";
        const authors = volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author";
        const thumbnail = volumeInfo.imageLinks?.thumbnail || "";

        const bookCard = document.createElement("div");
        bookCard.className = "book-card";

        bookCard.innerHTML = `
          <img src="${thumbnail}" alt="${title}" />
          <h3>${title}</h3>
          <p><strong>Author:</strong> ${authors}</p>
        `;

        // Match local price data
        const matchedBook = books.find(b => b.title.toLowerCase() === title.toLowerCase());

        if (matchedBook) {
          const pricingCards = Object.entries(matchedBook.prices).map(([store, details]) => {
            return `
              <div class="price-card">
                <img src="${details.logo}" alt="${store} logo" class="amazon-class" />
                <h4>${store.toUpperCase()}</h4>
                <p><strong>Publisher:</strong> ${matchedBook.publisher}</p>
                <p><strong>Price:</strong> ₹${details.price}</p>
                <a href="${details.link}" class="buy-btn" target="_blank">Buy now</a>
              </div>
            `;
          }).join("");

          bookCard.innerHTML += `<div class="pricing-section">${pricingCards}</div>`;
        }

        resultsContainer.appendChild(bookCard);
      });
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      resultsContainer.innerHTML = "<p>Error fetching book data.</p>";
    });
}

