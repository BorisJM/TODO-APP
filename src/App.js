import { useRef, useState, useEffect } from "react";
import SunIcon from "./images/icon-sun.svg";
import MoonIcon from "./images/icon-moon.svg";
import checkIcon from "./images/icon-check.svg";

function bodyTheme(theme) {
  document.body.classList.remove(theme === "dark" ? "light" : "dark");
  document.body.classList.add(theme);
}

export default function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const [active, setActive] = useState(false);
  const [activeButton, setActiveButton] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(
    function () {
      bodyTheme(theme);
    },
    [theme]
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!item) return;

    const id = new Date().getMilliseconds();

    const itemObj = {
      description: item,
      completed: false,
      active: false,
      id,
    };

    setItems([...items, itemObj]);
  }

  function handleItem(e) {
    setItem(e.target.value);
  }

  function handleDelete(id) {
    const newArray = items.filter((el) => el.id !== id);
    setItems(newArray);
  }

  function handleComplete(item) {
    item.completed = !item.completed;
    const newArray = items.map((el) => (el.id === item.id ? item : el));
    setItems(newArray);
  }

  function handleClearCompleted() {
    const newArray = items.filter((el) => !el.completed);
    setItems(newArray);
  }

  function handleSortCompleted() {
    setActiveButton(3);
    setActive(false);
    setCompleted(true);
  }

  function handleSortActive() {
    setActiveButton(2);
    setCompleted(false);
    setActive(true);
  }

  function handleSortAll() {
    setActiveButton(1);
    setCompleted(false);
    setActive(false);
  }

  return (
    <div className={`App ${theme}`}>
      <Header theme={theme} />
      <Main>
        <div className="header-container">
          <Logo />
          <DarkLightButton setTheme={setTheme} theme={theme} />
        </div>
        <SearchField
          theme={theme}
          handleItem={handleItem}
          handleSubmit={handleSubmit}
        />
        <List
          theme={theme}
          items={items}
          active={active}
          completed={completed}
          handleComplete={handleComplete}
          handleDelete={handleDelete}
          handleClearCompleted={handleClearCompleted}
          handleSortCompleted={handleSortCompleted}
          handleSortActive={handleSortActive}
          handleSortAll={handleSortAll}
          activeButton={activeButton}
        />
        <Drag />
        <Footer theme={theme} />
      </Main>
    </div>
  );
}

function Header({ theme }) {
  return <header className={theme}></header>;
}
function Main({ children }) {
  return <main>{children}</main>;
}
function Logo() {
  return <h1 className="logo">Todo</h1>;
}
function DarkLightButton({ setTheme, theme }) {
  return (
    <button
      onClick={() => setTheme((theme) => (theme === "dark" ? "light" : "dark"))}
      className="mode-btn"
    >
      <img src={theme === "dark" ? SunIcon : MoonIcon} alt="mode icon" />
    </button>
  );
}
function SearchField({ handleSubmit, handleItem, theme }) {
  const ref = useRef(null);
  const [placeholder, setPlaceHolder] = useState("Create a new todo...");

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
        ref.current.value = "";
      }}
      className={`search-field ${theme}`}
    >
      <button className={`circle-btn ${theme}`}></button>
      <input
        ref={ref}
        className={`${
          placeholder === "Currently typing" ? "typing" : ""
        }  ${theme}`}
        onChange={handleItem}
        onBlur={() => setPlaceHolder("Create a new todo...")}
        onFocus={() => setPlaceHolder("Currently typing")}
        type="text"
        placeholder={placeholder}
      />
    </form>
  );
}
function List({
  theme,
  items,
  handleDelete,
  handleComplete,
  handleClearCompleted,
  handleSortCompleted,
  handleSortActive,
  handleSortAll,
  active,
  completed,
  activeButton,
}) {
  return (
    <>
      <div className={`list-container ${theme}`}>
        {active &&
          items.map((item) =>
            item.completed ? null : (
              <Item
                handleComplete={handleComplete}
                handleDelete={handleDelete}
                item={item}
                theme={theme}
              />
            )
          )}
        {completed &&
          items.map((item) =>
            !item.completed ? null : (
              <Item
                handleComplete={handleComplete}
                handleDelete={handleDelete}
                item={item}
                theme={theme}
              />
            )
          )}
        {!active &&
          !completed &&
          items.map((item) => (
            <Item
              handleComplete={handleComplete}
              handleDelete={handleDelete}
              item={item}
              theme={theme}
            />
          ))}
      </div>
      <SortButtons
        theme={theme}
        items={items}
        handleClearCompleted={handleClearCompleted}
        handleSortCompleted={handleSortCompleted}
        handleSortActive={handleSortActive}
        handleSortAll={handleSortAll}
        activeButton={activeButton}
      />
    </>
  );
}
function Item({ item, handleDelete, handleComplete, theme }) {
  return (
    <div className={`item ${theme}`}>
      <div className="item-container">
        <button
          className={`circle-btn ${item.completed ? "completed" : ""} ${theme}`}
          onClick={() => handleComplete(item)}
        >
          <img src={checkIcon} alt="check icon" />
        </button>
        <p className="item-description">{item.description}</p>
      </div>
      <button
        onClick={() => handleDelete(item.id)}
        className="remove-btn"
      ></button>
    </div>
  );
}

function SortButtons({
  theme,
  items,
  handleClearCompleted,
  handleSortCompleted,
  handleSortActive,
  handleSortAll,
  activeButton,
}) {
  return (
    <div className="sort-container ">
      <div className={`sort-items ${theme}`}>
        <span className="items-amount">{items.length} items left</span>
        <button className="sort-button clear" onClick={handleClearCompleted}>
          Clear completed
        </button>
      </div>
      <ul>
        <li>
          <button
            data-button="1"
            className={`sort-button ${activeButton === 1 ? "active" : ""}`}
            onClick={handleSortAll}
          >
            All
          </button>
        </li>
        <li>
          <button
            data-button="2"
            className={`sort-button ${activeButton === 2 ? "active" : ""}`}
            onClick={handleSortActive}
          >
            Active
          </button>
        </li>
        <li>
          <button
            data-button="3"
            className={`sort-button ${activeButton === 3 ? "active" : ""}`}
            onClick={handleSortCompleted}
          >
            Completed
          </button>
        </li>
      </ul>
    </div>
  );
}

function Drag() {
  return <div className="drag">Drag and drop to reorder list</div>;
}

function Footer({ theme }) {
  return (
    <footer className={theme}>
      Challenge by <a href="youtube.com">Frontend Mentor</a>.Coded by Boris
      Matenco
    </footer>
  );
}
