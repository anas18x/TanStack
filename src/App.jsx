import React from "react";
import { BrowserRouter, Routes , Route} from "react-router-dom";
import {Posts,PostComponent} from "./Posts.jsx";
import {FeedComponent} from "./Feed.jsx";

function App() {
  return (
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/:id" element={<PostComponent />} />
        <Route path="/feed" element={<FeedComponent />} />
       </Routes>
    </BrowserRouter>
  );
}

export default App;