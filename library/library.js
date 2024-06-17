/**
 * File:    library.js
 *
 * Author:  Christian Medina
 * Date:    June 17, 2024
 *
 * Summary:
 *
 *  The library.js program is a minimal example demonstrating CRUD features for books within a library.
 *  The program allows users to add a new book, update its "read" state, and delete it from the library.
 *  A list of all books are finally rendered onto the DOM for viewing.
 */

const library = [];
const addBookDialog = document.getElementById("add-book")
const bookName = document.getElementById("book-name")
const authorName = document.getElementById("author-name")
const pageCount = document.getElementById("page-count")
const finishedReading = document.getElementById("finished-reading")
const newBookForm = document.getElementById("new-book-form")

document.getElementById("show-dialog").addEventListener("click", () => {
   addBookDialog.showModal()
})

document.getElementById("new-book").addEventListener("click", (event) => {
    const newBook = new Book(bookName.value, authorName.value, pageCount.value, finishedReading.checked)
    if (newBookForm.reportValidity()) {
        event.preventDefault()
        addBook(newBook)
        renderAllLibraryBooks()
        addBookDialog.close()
    }
})

function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.info = function() {
        let wasRead
        if (this.read) {
            wasRead = "read"
        }
        else {
            wasRead = "not read yet"
        }
        return `${this.title} by ${this.author}, ${this.pages} pages, ${wasRead}`
    }
}

// addBook takes in a Book and pushes it to the end of the library
function addBook(bookToAdd) {
    library.push(bookToAdd)
}

// deleteBook performs a search for a Book, and deletes it if a matching title is found
function deleteBook(bookToDelete) {
    for (const book of library) {
        if (book.title === bookToDelete.title) {
            library.splice(library.indexOf(book), 1)
            renderAllLibraryBooks()
            break
        }
    }
}

// createBookElement generates the HTML needed for each Book in the library
function createBookElement(book) {
    const bookElement = document.createElement('li')
    const deleteButton = document.createElement('button')
    deleteButton.innerText = "X"
    deleteButton.addEventListener("click", () => {
        deleteBook(book)
    })
    const hasReadBook = document.createElement("input")
    hasReadBook.type = "checkbox"
    hasReadBook.checked = book.read
    hasReadBook.addEventListener("change", (event) => {
        book.read = event.target.checked
        renderAllLibraryBooks()
    })

    bookElement.classList.add('book')
    bookElement.append(book.info())
    bookElement.append(hasReadBook)
    bookElement.append(deleteButton)
    return bookElement
}

// renderAllLibraryBooks compiles the HTML for the DOM and renders it onto the view
function renderAllLibraryBooks() {
    const booksDisplay = document.getElementById('library-books')
    booksDisplay.innerText = ''
    for (const book of library) {
        const bookElement = createBookElement(book)
        booksDisplay.append(bookElement)
    }
}

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", "295", true)
const prideAndPrejudice = new Book("Pride and Prejudice", "Jane Austen", "432", false)
const mobyDick = new Book("Moby-Dick", "Herman Melville", "635", true)
const sherlockHolmes = new Book("Sherlock Holmes", "Arthur Conan Doyle", "307", false)

addBook(theHobbit)
addBook(prideAndPrejudice)
addBook(mobyDick)
addBook(sherlockHolmes)

renderAllLibraryBooks()
