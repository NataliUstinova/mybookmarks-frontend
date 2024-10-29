import './App.css';
import api from "./Api";
import {quotes} from "./api-draft"
import {useEffect, useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import BookCalendar from "./Bookcalendar";


function BookTitleGrid({ quotes, handleBookClick, selectedBook, showAll }) {
  // Extract unique book titles and their thumbnails
  const uniqueBookTitles = [...new Set(quotes.map((quote) => quote.book_title))];
  
  useEffect(() => {
    
  }, [selectedBook, showAll]);
  
  const [data, setData] = useState([]);

  return (
    <div className="px-5 sm:px-0 w-[100vw] sm:w-full overflow-scroll hidden-scrollbar flex justify-start sm:grid sm:grid-cols-3 md:grid-cols-4 place-content-evenly gap-3">
      {uniqueBookTitles.map((title, index) => {
        // Find the first matching quote for the thumbnail
        const matchingQuote = quotes.find((quote) => quote.book_title === title);
        const thumbnailUrl = matchingQuote ? matchingQuote.thumbnail : '';

        return (
          <div key={title} className="cursor-pointer relative flex flex-col items-start justify-start sm:justify-end gap-1" onClick={() => handleBookClick({title})}>
            <input type="radio" name="books" value={title} id="book" className="absolute 
            top-0 left-0 w-full h-full peer/book z-10 opacity-0"/>
            {/*<h3 className={`peer-checked/book:opacity-100 ${showAll ? "opacity-100" : "opacity-70"} order-last sm:order-first*/}
            {/*truncate whitespace-normal`}>{title}</h3>*/}
            <img src={thumbnailUrl} alt={`${title} Thumbnail`} className={`rounded-sm peer-checked/book:opacity-100 peer-checked/book:filter-none ${showAll ? "opacity-100 filter-none" : "opacity-70 grayscale"} w-full min-w-[120px] aspect-[10/14] object-cover`}/>
          </div>
        );
      })}
    </div>
  );
}

function Quote({ quote, random, handleRandomClick, index }) {
  return (
    <div key={index} className={`flex flex-col w-full gap-2 items-start justify-start 
      ${random ? "bg-blue-50" : "bg-gray-50"} p-6 rounded-xl`}>
      <div>
        <p className="text-[18px] serif">{quote.content}</p>
        <p className="text-[16px] text-gray-600">{quote.comment}</p>
      </div>
      <div className="flex flex-row items-end justify-between w-full">
        <div className="flex flex-row gap-3">
          {random && <img src={quote.thumbnail} className="h-[80px] w-[50px] object-cover rounded-sm"/>}
          <div className="flex flex-col items-start justify-end">
            <p className="text-sm max-w-[200px] text-gray-600">{quote.book_title}</p>
            <p className="text-sm max-w-[200px] text-gray-500">{quote.book_authors}</p>
          </div>
        </div>
        {random &&
          <div className="hidden sm:flex flex-row items-center justify-end gap-4">
            <button className="bg-[#3456f3] hover:opacity-90 text-white p-2 px-4 rounded-[10px]" onClick={handleRandomClick}>
              Randomize
            </button>
          </div>
        }
      </div>
      {random &&
        <div className="flex sm:hidden flex-row items-center justify-end gap-4 w-full">
          <button className="bg-[#3456f3] hover:opacity-90 text-white p-2 rounded-[10px] w-full mt-4 sm:mt-0" onClick={handleRandomClick}>
            Randomize
          </button>
        </div>
      }
    </div>
  );
}

function App() {
  function sortQuotesByCreatedAt(quotes) {
    return quotes.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      // Compare the dates
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
      return 0;
    });
  }

  const sortedQuotes = sortQuotesByCreatedAt(quotes);
  
  function getRandomQuote(quotes) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }
  const [randomQuote, setRandomQuote] = useState({})
  
  useEffect(() => {
    setRandomQuote(getRandomQuote(quotes))
  },  [])
  
  function handleRandomClick() {
    setRandomQuote(getRandomQuote(quotes))
  }
  
  const [selectedBook, setSelectedBook] = useState('')
  const [shownQuotes, setShowQuotes] = useState([])
  const [showAll, setShowAll] = useState(false)
  
  useEffect(() => {
    setShowAll(true);
    setShowQuotes(sortedQuotes);
  }, [])
  
  function handleBookClick({title}) {
    setShowAll(false);
    setSelectedBook(title);
  }
  
  function handleAllBooksClick() {
    setShowAll(true);
    setShowQuotes(sortedQuotes);
  }
  
  useEffect(() => {
    if (selectedBook === '') return;
    setShowQuotes(sortedQuotes.filter((quote) => quote.book_title === selectedBook))
  }, [sortedQuotes, selectedBook])
  
  return (
    <div className="w-full grid place-items-center sm:h-screen sm:overflow-hidden">
      {/*<BookCalendar books={sortedQuotes} />*/}
      <div className="grid place-items-start grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-20  max-w-[1200px]">
        
        <div className="grid max-w-[700px] items-start justify-start sm:h-screen hidden-scrollbar overflow-scroll gap-4 sm:pb-10">
          <h1 className="text-[24px] sm:text-[32px] font-semibold sm:font-black px-5 sm:hidden">Filter by book</h1>
          
          <div className="order-last sm:order-first hidden sm:flex flex-row items-center sm:items-end justify-between w-full px-5 pt-2 sm:pt-10 sm:px-0">
              <h1 className="text-[24px] sm:text-[32px] font-semibold">Filter by book</h1>
            {!showAll && <button
              className={`${showAll ? "pointer-events-none bg-transparent text-gray-500" : "bg-[#3456f3] text-white"}
              hover:opacity-90 p-2 px-4 rounded-[8px] w-[150px]`} onClick={handleAllBooksClick}>
              {showAll ? "" : "Show all quotes"}</button>}
            </div>
            <div className="w-full h-[100%] min-h-[200px] overflow-scroll hidden-scrollbar justify-self-start self-start
            ">
              <BookTitleGrid showAll={showAll} handleBookClick={handleBookClick} quotes={quotes} />
              
              <div className="w-full px-5 pt-5 sm:hidden">
                {!showAll && <button className={`${showAll ? "pointer-events-none bg-transparent text-gray-500" : "bg-[#3456f3] text-white"}
              hover:opacity-90 p-2 px-4 rounded-[8px] w-full`} onClick={handleAllBooksClick}>
                  {showAll ? "" : "Show all quotes"}</button>}
              </div>
            </div>
          
          
          <div className="order-first sm:order-2 relative flex flex-col w-full gap-4 items-start justify-start mt-10 mb-10 sm:mt-4 justify-self-end 
          self-end px-5 sm:px-0">
            <p className="text-[24px] sm:text-[32px] font-semibold sm:font-black sm:hidden flex">My Bookmarks</p>
            {/*<div className="bg-gradient-to-t from-white to-transparent h-[80px] w-full hidden sm:flex absolute -top-[85px] left-0 z-30"></div>*/}
            <Quote quote={randomQuote} random={true} handleRandomClick={handleRandomClick} />
          </div>
          
        </div>

        <div className="flex flex-col items-center max-w-[650px] sm:h-screen sm:overflow-scroll sm:hidden-scrollbar hidden-scrollbar gap-4 py-10 px-5 sm:px-0">
          {shownQuotes.map((quote, index) => <Quote quote={quote} index={index} handleRandomClick={handleRandomClick} />)}
        </div>
      </div>
    </div>
  );
}

export default App;