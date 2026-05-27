class Book {
    private static idCounter: number = 0;
    private id: number;
    private title: string;
    private author: string;
    private createdAt: Date;

    constructor(title: string, author: string) {
        this.id = ++Book.idCounter;
        this.title = title;
        this.author = author;
        this.createdAt = new Date();
    }

    getId(): number {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getAuthor(): string {
        return this.author;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getInfo(): string {
        return `ID: ${this.id} Название: "${this.title}" Автор: ${this.author}`;
    }
}

class BookStorage {
    private books: Book[] = [];

    hasDuplicate(book: Book): boolean {
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

    addBook(book: Book): boolean {
        if (this.hasDuplicate(book)) {
            return false;
        }

        this.books.push(book);
        return true;
    }

    getBooks(): Book[] {
        return this.books;
    }

    getCount(): number {
        return this.books.length;
    }
}

class BookApp {
    private storage: BookStorage;
    private titleInput: HTMLInputElement;
    private authorInput: HTMLInputElement;
    private addButton: HTMLButtonElement;
    private errorBlock: HTMLDivElement;
    private counterSpan: HTMLSpanElement;
    private container: HTMLDivElement;

    constructor() {
        this.storage = new BookStorage();

        this.titleInput = document.getElementById('book-title') as HTMLInputElement;
        this.authorInput = document.getElementById('book-author') as HTMLInputElement;
        this.addButton = document.getElementById('add-btn') as HTMLButtonElement;
        this.errorBlock = document.getElementById('error-block') as HTMLDivElement;
        this.counterSpan = document.getElementById('book-counter') as HTMLSpanElement;
        this.container = document.getElementById('book-container') as HTMLDivElement;

        this.addButton.addEventListener('click', () => {
            this.handleAddBook();
        });
    }

    private normalizeString(str: string): string {
        return str.trim();
    }

    private showError(message: string): void {
        this.errorBlock.textContent = message;
    }

    private hideError(): void {
        this.errorBlock.textContent = '';
    }

    private handleAddBook(): void {
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

    private clearInputs(): void {
        this.titleInput.value = '';
        this.authorInput.value = '';
    }

    private createBookCard(book: Book): HTMLDivElement {
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

    private render(): void {
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
