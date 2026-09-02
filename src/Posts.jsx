import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import { useState } from "react";



// React Query doesn't look for return error; it looks at whether your queryFn Promise resolves or rejects.
async function getPost(pageNumber){
    const data = await axios.get(`https://jsonplaceholder.typicode.com/posts?_start=${pageNumber}&_limit=3`);
    return data;
}


export function Posts() {
  const [pageNumber, setPageNumber] = useState(0 );

  const { data, isError, isLoading } = useQuery({
    queryKey: ["posts",pageNumber],
    queryFn: () => getPost(pageNumber),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    placeholderData: keepPreviousData, // This option allows React Query to use the previous data as a placeholder while fetching new data, providing a smoother user experience.
  });
f

  if(isLoading) return <p>Loading ...</p>
  if(isError) return <p>Something went wrong</p>

  return (
    <>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px", padding: "16px" }}>

      {data?.data?.map((post) => (

        <Link to={`/${post.id}`} key={post.id} style={{ textDecoration: "none", color: "inherit" }}>  

        <div
          style={{
            padding: "16px", border: "1px solid #ddd",borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >  
          <h2>{post.id}</h2>
          <h2 style={{ margin: "0 0 8px" }}>{post.title}</h2>
          <p style={{ margin: 0, color: "#666" }}>{post.body}</p>
        </div>
        </Link>
      ))} 

    </div>

    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "16px" }}>
    
      <button disabled={pageNumber === 0 ? true : false}
      style={{ padding: "8px 16px", border: "1px solid #ccc", backgroundColor: "transparent", cursor: "pointer" ,borderRadius: "4px" }} onClick={() => setPageNumber(pageNumber - 3)}>Prev</button>

      <h2 style={{textAlign: "center",}}> {pageNumber} </h2>

      <button style={{ padding: "8px 16px", border: "1px solid #ccc", backgroundColor: "transparent", cursor: "pointer" ,borderRadius: "4px" }} onClick={() => setPageNumber(pageNumber + 3)}>Next</button>
    </div>
    </>
  );
}




export function PostComponent() {
    const { id } = useParams();
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["post", id],
        queryFn: () => axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`),
        staleTime: 5 * 60 * 1000  // 5 minutes
    });

    if(isLoading) return <p>Loading ...</p>
    if(isError) return <p>Something went wrong</p>

  return (
    <>
    <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto",boxShadow: "0 2px 6px rgba(0,0,0,0.08)",borderRadius: "8px",border: "1px solid #ddd",display: "flex",flexDirection: "column",alignItems: "center",justifyContent: "center" }}>
      <h1>{data?.data?.title}</h1>
      <p>{data?.data?.body}</p>
    </div>

    <Link to="/" style={{ textDecoration: "none", color: "inherit", display: "block", textAlign: "center", marginTop: "16px" }}>
    <button >Go back</button>
    </Link>
    
    </>
  );
}