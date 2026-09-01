import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {Link, useParams} from "react-router-dom";


// React Query doesn't look for return error; it looks at whether your queryFn Promise resolves or rejects.
async function getPost(){
    const data = await axios.get("https://jsonplaceholder.typicode.com/posts");
    return data;
}


export function Posts() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getPost,
    staleTime: 5 * 60 * 1000  // 5 minutes
  });

  if(isLoading) return <p>Loading ...</p>
  if(isError) return <p>Something went wrong</p>

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px", padding: "16px" }}>

      {data?.data?.map((post) => (

        <Link to={`/${post.id}`} key={post.id} style={{ textDecoration: "none", color: "inherit" }}>  

        <div
          style={{
            padding: "16px", border: "1px solid #ddd",borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ margin: "0 0 8px" }}>{post.title}</h2>
          <p style={{ margin: 0, color: "#666" }}>{post.body}</p>
        </div>
        </Link>
      ))}

    </div>
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