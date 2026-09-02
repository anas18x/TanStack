import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";

const LIMIT = 10;

// Fetch posts from the API.
// `pageParam` is provided by TanStack Query.
// Initially it is 0, then getNextPageParam decides the next value.
// pageParam is used to calculate the `skip` value for the API request.
const getPosts = async ({ pageParam = 0 }) => {
  const response = await axios.get(
    `https://dummyjson.com/posts?limit=${LIMIT}&skip=${pageParam}`
  );

  return response.data;
};

export function FeedComponent() {
  // Reference to the element at the bottom of the feed.
  // IntersectionObserver will watch this element.
  const loadMoreRef = React.useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage,} = useInfiniteQuery({
    queryKey: ["usersPosts"],

    // TanStack Query calls getPosts() and provides the current pageParam.
    queryFn: getPosts,

    // Calculate the pageParam for the next request.
    // Example:
    // First request: skip = 0, limit = 10
    // nextSkip = 0 + 10 = 10
    // So the next request will use skip = 10.
    // lastPage is the result of the last request.
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;

      // If more posts are available, return the next skip value.
      // TanStack Query will use this as the next pageParam.
      if (nextSkip < lastPage.total) {
        return nextSkip;
      }

      // Returning undefined tells TanStack Query:
      // "There is no next page."
      return undefined;
    },
  });

  useEffect(() => {
    // Create an IntersectionObserver to detect when
    // the bottom "load more" element enters the viewport.

    // IntersectionObserver is a browser API that lets us detect when an element enters or leaves the viewport.
    // entries is an array of IntersectionObserverEntry objects, each representing a target element being observed.
    const observer = new IntersectionObserver((entries) => {
      // entries[0] contains information about our sentinel.  
      // entries[0].isIntersecting === true
      // means our loadMoreRef element is currently visible.
      //
      // hasNextPage makes sure another page exists.
      //
      // !isFetchingNextPage prevents multiple requests
      // from being triggered while one request is already running.
      if (
        entries[0].isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        // Fetch the next page.
        // We don't provide the page number here.
        // TanStack Query gets it from getNextPageParam().
        fetchNextPage();
      }
    });

    // Start observing the bottom element.
    observer.observe(loadMoreRef.current);

    // Cleanup:
    // Stop observing when the effect is removed or recreated.
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {/* 
        data.pages contains every page fetched so far.
        Each page contains a `posts` array,
        so we loop through pages first,
        then through the posts inside each page.
      */}
      {data?.pages.map((page) =>
        page.posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))
      )}

      {/*
        This is our "sentinel" element.
        IntersectionObserver watches this element.
        When it becomes visible, fetchNextPage() is triggered.
      */}
      <div ref={loadMoreRef}>
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Scroll for more"
          : "No more posts"}
      </div>
    </>
  );
}