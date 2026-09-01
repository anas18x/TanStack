import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function App() {
  return (
    <div className="App">
      <Posts />
    </div>
  );
}


function Posts() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getPost,
  });

  if(isLoading) return <p>Loading ...</p>
  if(isError) return <p>Something went wrong</p>

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px", padding: "16px" }}>

      {data?.data?.map((post) => (
        <div key={post.id}
          style={{
            padding: "16px", border: "1px solid #ddd",borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ margin: "0 0 8px" }}>{post.title}</h2>
          <p style={{ margin: 0, color: "#666" }}>{post.body}</p>
        </div>
      ))}

    </div>
  );
}


// React Query doesn't look for return error; it looks at whether your queryFn Promise resolves or rejects.
async function getPost(){
    const data = await axios.get("https://jsonplaceholder.typicode.com/posts");

    return data;
}


export default App;