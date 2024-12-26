document.addEventListener('DOMContentLoaded', function() {
    const addBookForm = document.getElementById('addBookForm');
    const authorSelect = document.getElementById('author');
    const bookList = document.getElementById('bookList');

    // Fetch authors and populate the author select dropdown
    fetch('/api/authors')
        .then(response => response.json())
        .then(authors => {
            authors.forEach(author => {
                const option = document.createElement('option');
                option.value = author._id;
                option.textContent = author.name;
                authorSelect.appendChild(option);
            });
        });

    // Handle form submission for adding a new book
    addBookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const isbn = document.getElementById('isbn').value;
        const availableCopies = document.getElementById('availableCopies').value;
        const author = authorSelect.value;

        const newBook = {
            title,
            isbn,
            availableCopies,
            author
        };

        fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBook)
        })
        .then(response => response.json())
        .then(book => {
            // Add new book to the list
            const div = document.createElement('div');
            div.textContent = `${book.title} - ${book.isbn}`;
            bookList.appendChild(div);
        })
        .catch(error => alert(error));
    });
});
