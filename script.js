document.addEventListener("DOMContentLoaded", () => {
  const RENDER_EVENT = "render_book";
  const STORAGE_KEY = "books_data";
  const books = [];

  // View Render to Page
  const bookItem = (book) => {
    const article = document.createElement("article");
    article.classList.add("book_item");
    const title = document.createElement("h3");
    title.innerText = book.title;
    const author = document.createElement("p");
    author.innerText = book.author;
    const year = document.createElement("p");
    year.innerText = book.year;

    const action = document.createElement("div");
    action.classList.add("action");

    const svgCheck = document.createElement("img");
    svgCheck.setAttribute("width", "16px");

    const btnIsComplete = document.createElement("button");
    btnIsComplete.classList.add("green");
    if (book.isComplete) {
      svgCheck.setAttribute("src", "assets/undo.svg");
    } else {
      svgCheck.setAttribute("src", "assets/check-on.svg");
    }

    btnIsComplete.append(svgCheck);

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("red");
    const svgDelete = document.createElement("img");
    svgDelete.setAttribute("width", "16px");
    svgDelete.setAttribute("src", "assets/trash.svg");
    btnDelete.append(svgDelete);

    btnIsComplete.addEventListener("click", () => isCompleteBook(book.id));
    btnDelete.addEventListener("click", () => deleteBook(book.id));

    action.append(btnIsComplete, btnDelete);

    article.append(title, author, year, action);

    return article;
  };

  document.addEventListener(RENDER_EVENT, () => {
    const incompleteBooks = document.getElementById("incompleteBookshelfList");
    incompleteBooks.innerHTML = "";
    const completedBooks = document.getElementById("completeBookshelfList");
    completedBooks.innerHTML = "";
    books.map((dt) => {
      let item = bookItem(dt);
      if (dt.isComplete) {
        completedBooks.append(item);
      } else {
        incompleteBooks.append(item);
      }
    });
  });

  // Model to localStorage
  const isStorageExist = () => {
    if (typeof Storage === undefined) return false;
    return true;
  };

  const loadDataStorage = () => {
    if (!isStorageExist()) return;
    let data = localStorage.getItem(STORAGE_KEY);
    data = JSON.parse(data);
    books.splice(0, books.length);
    if (data !== null) {
      data.map((dt) => {
        books.push(dt);
      });
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  loadDataStorage();

  const saveDataToStorage = () => {
    if (isStorageExist()) {
      const data = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, data);
    }
  };

  const addData = (data) => {
    loadDataStorage();
    books.push(data);
    saveDataToStorage();
  };

  const isCompleteBook = (bookId) => {
    loadDataStorage();
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === bookId) {
        books[i].isComplete = books[i].isComplete ? false : true;
        break;
      }
    }
    saveDataToStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  const deleteBook = (bookId) => {
    loadDataStorage();
    let bookIndex = -1;
    for (index in books) {
      if (books[index].id === bookId) {
        bookIndex = index;
        break;
      }
    }
    if (bookIndex === -1) return;
    books.splice(bookIndex, 1);
    saveDataToStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  const findBook = (params) => {
    let datas = localStorage.getItem(STORAGE_KEY);
    datas = JSON.parse(datas);
    books.splice(0, books.length);
    datas.map((book) => {
      let key = params.toLowerCase();
      let data = book.title.toLowerCase();
      if (data.includes(key)) {
        books.push(book);
      }
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  // Generate Data
  const generateID = () => {
    return +new Date();
  };

  const generateBooksObj = (id, title, author, year, isComplete) => {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  };

  // Form
  const titleInput = document.getElementById("inputBookTitle");
  const authorInput = document.getElementById("inputBookAuthor");
  const yearInput = document.getElementById("inputBookYear");
  const isCompleteInput = document.getElementById("inputBookIsComplete");
  const submitBtn = document.getElementById("bookSubmit");

  submitBtn.innerText = "Add Books";

  const formBook = document.getElementById("inputBook");

  formBook.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = generateID();

    const data = generateBooksObj(
      id,
      titleInput.value,
      authorInput.value,
      yearInput.value,
      isCompleteInput.checked
    );
    addData(data);
    document.dispatchEvent(new Event(RENDER_EVENT));
    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteInput.checked = false;
  });

  // Search Event
  const searchForm = document.getElementById("searchBook");
  const searchInput = document.getElementById("searchBookTitle");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    findBook(searchInput.value);
  });
});
