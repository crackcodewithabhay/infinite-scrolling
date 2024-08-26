import React, { useEffect, useState } from "react";
import "./App.css";
import InfiniteScroll from "react-infinite-scroll-component";

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
// const accessKey = undefined;

export default function App() {
  const [galleryImages, updateGalleryImages] = useState([]);
  const [pageIndex, updatePageIndex] = useState(1);
  const [query, setQuery] = useState(null);

  if (!accessKey) {
    return (
      <a href="https://unsplash.com/documentation" className="error">
        Get your API key to run it in your own Environment
      </a>
    );
  }

  useEffect(() => {
    getPhotos();
  }, [pageIndex]);

  function queryPhotos(e) {
    e.preventDefault();
    updatePageIndex(1);
    getPhotos();
  }

  function getPhotos() {
    let apiLink = `https://api.unsplash.com/`;

    console.log(query);
    if (query)
      apiLink += `search/photos?page=${pageIndex}&client_id=${accessKey}&query=${query}`;
    else apiLink += `photos?page=${pageIndex}&client_id=${accessKey}`;

    console.log(apiLink);

    fetch(apiLink)
      .then((res) => res.json())
      .then((data) => {
        if (pageIndex === 1) updateGalleryImages([]);
        console.log(query);
        const APIdata = !query ? data : data.results;
        updateGalleryImages((galleryImages) => [...galleryImages, ...APIdata]);
        console.log(`API Data = ${APIdata}`);
      });
  }

  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>

      <form onSubmit={(event) => queryPhotos(event)}>
        <input
          type="text"
          placeholder="Search Unsplash..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>Search</button>
      </form>

      <InfiniteScroll
        dataLength={galleryImages.length}
        next={() => updatePageIndex((pageIndex) => pageIndex + 1)}
        hasMore={true}
        loader={<h4>Loading More...</h4>}
      >
        <div className="image-grid">
          {galleryImages.map((image, index) => (
            <a
              className="image"
              key={index}
              href={image.links.html}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={image.urls.regular} alt={image.alt_description} />
            </a>
          ))}
        </div>
      </InfiniteScroll>
      <span>{"Loaded " + galleryImages.length + " till now!"}</span>
    </div>
  );
}
