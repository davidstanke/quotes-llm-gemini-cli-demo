import {Button, Checkbox, Icon, TextField} from "@vaadin/react-components";
import Quote from "Frontend/generated/com/example/quotes/domain/Quote";
import {useState, useEffect} from "react";
import QuoteCard from "Frontend/components/QuoteCard";
import {AutoCrud} from "@vaadin/hilla-react-crud";
import QuoteModel from "Frontend/generated/com/example/quotes/domain/QuoteModel";
import {QuoteEndpoint} from "Frontend/generated/endpoints";
import "@vaadin/icons";

export default function QuotesView() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [author, setAuthor] = useState("");
  const [book, setBook] = useState("");
  const [bookError, setBookError] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [showCrud, setShowCrud] = useState(false);

  useEffect(() => {
    if (bookError) {
      setErrorVisible(true);
      const timer = setTimeout(() => {
        setErrorVisible(false);
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [bookError]);

  return (
      <div className="p-m flex flex-col items-start gap-m h-full box-border">
        <div className="flex flex-col gap-m">
          <div
              className="flex gap-s items-baseline border border-b border-dashed border-contrast-50 p-l rounded-l">
            <Icon icon="vaadin:database"/>
            <TextField
                value={author}
                onChange={e => setAuthor(e.target.value)}
                label="Book Author"
            />
            <Button
                onClick={e => QuoteEndpoint.quoteByAuthor(author).then(setQuotes)}>
              Search by Author in database
            </Button>

            {/*<TextField*/}
            {/*    value={book}*/}
            {/*    onChange={e => setBook(e.target.value)}*/}
            {/*    label="Book Name"*/}
            {/*/>*/}
            {/*<Button*/}
            {/*    onClick={e => QuoteEndpoint.quoteByBook(book).then(setQuotes)}>*/}
            {/*  Search by Book in database*/}
            {/*</Button>*/}

            {/*<Button*/}
            {/*    onClick={e => QuoteEndpoint.randomQuote().then(q => setQuotes([q]))}>*/}
            {/*  Get random quote from database*/}
            {/*</Button>*/}
          </div>
          <div
              className="flex gap-s items-baseline border border-b border-dashed border-contrast-50 p-l rounded-l">
            <Icon icon="vaadin:database"/>

            <TextField
                value={book}
                onChange={e => setBook(e.target.value)}
                label="Book Name"
            />
            <Button
                onClick={async (e) => {
                  try {
                    const result = await QuoteEndpoint.quoteByBook(book);
                    setQuotes(result);
                    setBookError("");
                  } catch (error) {
                    setBookError("Error. Unable to fetch quote.");
                  }
                }}>
              Search by Book in database
            </Button>
            {bookError &&
                <span style={{
                  color: 'red',
                  opacity: errorVisible ? 1 : 0,
                  transition: 'opacity 0.5s ease-out'
                }}
                      onTransitionEnd={() => {
                        if (!errorVisible) {
                          setBookError("");
                        }
                      }}
                >
                    {bookError}
                </span>}
          </div>
          <div
              className="flex gap-s items-baseline border border-b border-dashed border-contrast-50 p-l rounded-l">
            <Icon icon="vaadin:database"/>
            <Button
                onClick={e => QuoteEndpoint.randomQuote().then(q => setQuotes([q]))}>
              Get random quote from database
            </Button>
          </div>
            <div
              className="flex gap-s items-baseline border border-b border-dashed border-contrast-50 p-l rounded-l">
            <Icon icon="vaadin:cloud"/>
            <Button
                onClick={e => QuoteEndpoint.randomLLMQuote().then(q => setQuotes([q]))}>
              Random Quote from Gemini Flash 2.0 Model in VertexAI
            </Button>
            <Button
                onClick={e => QuoteEndpoint.randomLLMInVertexQuote().then(q => setQuotes([q]))}>
              Random quote from LLama3.1 Open-Model LLM in VertexAI
            </Button>
          </div>
          <div>
            <Checkbox
                label="Manage book quotes in DB"
                checked={showCrud}
                onCheckedChanged={e => setShowCrud(e.detail.value)}/>
          </div>
        </div>
        <div className="built-with">UI built in Java with <a href="https://vaadin.com/" target="_blank">Vaadin</a></div>
        {(!!quotes.length && !showCrud) && quotes.map(quote => <QuoteCard
            key={quote.id} quote={quote}/>)}
        {showCrud && <AutoCrud service={QuoteEndpoint} model={QuoteModel}
                               className="flex-grow self-stretch"/>}
      </div>
  );
};
