"use strict";
class Book {
    static idCounter = 0;
    id;
    title;
    author;
    createdAt;
    constructor(title, author) {
        this.id = ++Book.idCounter;
        this.title = title;
        this.author = author;
        this.createdAt = new Date();
    }
    getId() {
        return this.id;
    }
    getTitle() {
        return this.title;
    }
    getAuthor() {
        return this.author;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getInfo() {
        return `ID: ${this.id} Название: "${this.title}" Автор: ${this.author}`;
    }
}
class BookStorage {
    books = [];
    hasDuplicate(book) {
        let newTitle = book.getTitle().trim().toLowerCase();
        let newAuthor = book.getAuthor().trim().toLowerCase();
        for (let i = 0; i < this.books.length; i++) {
            let existingBook = this.books[i];
            let existingTitle = existingBook.getTitle().trim().toLowerCase();
            let existingAuthor = existingBook.getAuthor().trim().toLowerCase();
            if (existingTitle === newTitle && existingAuthor === newAuthor) {
                return true;
            }
        }
        return false;
    }
    addBook(book) {
        if (this.hasDuplicate(book)) {
            return false;
        }
        this.books.push(book);
        return true;
    }
    getBooks() {
        return this.books;
    }
    getCount() {
        return this.books.length;
    }
}
class BookApp {
    storage;
    titleInput;
    authorInput;
    addButton;
    errorBlock;
    counterSpan;
    container;
    constructor() {
        this.storage = new BookStorage();
        this.titleInput = document.getElementById('book-title');
        this.authorInput = document.getElementById('book-author');
        this.addButton = document.getElementById('add-btn');
        this.errorBlock = document.getElementById('error-block');
        this.counterSpan = document.getElementById('book-counter');
        this.container = document.getElementById('book-container');
        this.addButton.addEventListener('click', () => {
            this.handleAddBook();
        });
    }
    normalizeString(str) {
        return str.trim();
    }
    showError(message) {
        this.errorBlock.textContent = message;
    }
    hideError() {
        this.errorBlock.textContent = '';
    }
    handleAddBook() {
        let rawTitle = this.titleInput.value;
        let rawAuthor = this.authorInput.value;
        let title = this.normalizeString(rawTitle);
        let author = this.normalizeString(rawAuthor);
        if (title === '' || author === '') {
            this.showError('Пожалуйста, заполните оба поля');
            return;
        }
        let newBook = new Book(title, author);
        let added = this.storage.addBook(newBook);
        if (!added) {
            this.showError('Такая книга уже есть в списке');
            return;
        }
        this.hideError();
        this.clearInputs();
        this.render();
    }
    clearInputs() {
        this.titleInput.value = '';
        this.authorInput.value = '';
    }
    createBookCard(book) {
        let card = document.createElement('div');
        let titleElement = document.createElement('p');
        titleElement.textContent = `Название: ${book.getTitle()}`;
        let authorElement = document.createElement('p');
        authorElement.textContent = `Автор: ${book.getAuthor()}`;
        let idElement = document.createElement('p');
        idElement.textContent = `ID: ${book.getId()}`;
        let separator = document.createElement('hr');
        card.appendChild(titleElement);
        card.appendChild(authorElement);
        card.appendChild(idElement);
        card.appendChild(separator);
        return card;
    }
    render() {
        this.container.innerHTML = '';
        let books = this.storage.getBooks();
        for (let i = 0; i < books.length; i++) {
            let book = books[i];
            let card = this.createBookCard(book);
            this.container.appendChild(card);
        }
        this.counterSpan.textContent = String(this.storage.getCount());
    }
}
window.addEventListener('DOMContentLoaded', () => {
    new BookApp();
});
