import { useState } from "react";
import "./App.css";
import { useQuery } from "@tanstack/react-query";

function App() {
  // const info = useQuery({ queryKey:["getCall"] , queryFn:getData})
  // // console.log(info.fetchStatus , info.isSuccess , info.status)
  // if(info.status === "success"){
  //   console.log(info.data.data[0])
  // }else{
  //   console.log("pending")
  // }
  // async function getData() {
  //   const res = await fetch("https://reqres.in/api/users?page=2");
  //   const data = res.json();

  //   return data;
  // }
  // tanstack example

  const [progess, setProgress] = useState<number>(0);
  const [f, setF] = useState<HTMLInputElement>();
  const readAndUpload = () => {
    const fileReader = new FileReader();
    const theFile = f?.files ? f.files[0] : null;
    fileReader.readAsArrayBuffer(theFile!);
    fileReader.onload = async (ev) => {
      const CHUNK_SIZE = 500000;
      const chunkCount =
        ev.target?.result instanceof ArrayBuffer
          ? ev.target.result.byteLength / CHUNK_SIZE
          : 0;
      console.log(chunkCount);
      const fileName = theFile?.name!;
      for (let chunkId = 0; chunkId < chunkCount + 1; chunkId++) {
        const chunk = ev.target?.result?.slice(
          chunkId * CHUNK_SIZE,
          chunkId * CHUNK_SIZE + CHUNK_SIZE
        );
        await fetch("http://192.168.29.3:3001/upload", {
          method: "POST",
          headers: {
            "content-type": "application/octet-stream",
            "content-length":
              chunk instanceof ArrayBuffer ? chunk.byteLength.toString() : "",
            "file-name": fileName,
          },
          body: chunk,
        });
        setProgress(Math.round((chunkId * 100) / chunkCount));
      }
      if (progess >= 100) {
        await fetch("http://192.168.29.3:3001/complete", {
          method: "GET",
        });
      }
    };
  };


  return (
    <>
      <div>
        <h1>File Uploader</h1>
        <input
          type="file"
          value={f?.value}
          onChange={(e) => {
            setF(e.target);
          }}
          id="f"
        />
        <button onClick={readAndUpload}>Read & Upload</button>
        <div>Progress : {progess >= 100 ? 100 : progess}%</div>
      </div>
      {/* <Pagination no_pages={10} active_page={1} limit={5} /> */}
    </>
  );
}

export default App;

// const Pagination = ({
//   no_pages,
//   active_page,
//   limit,
// }: {
//   no_pages: number;
//   active_page:number
//   limit:number
// }) => {
//   const [activePg, setActivePg] = useState(active_page);

//   const goBack = () => {
//     setActivePg((prev) => Math.max(prev - 1, 1));
//   };

//   const goForward = () => {
//     setActivePg((prev) => Math.min(prev + 1, no_pages));
//   };

//   // Calculate the start and end of the page range
//   let start = Math.max(0, activePg - Math.ceil(limit / 2));
//   let end = start + limit;

//   // Adjust start if end exceeds the total number of pages
//   if (end > no_pages) {
//     end = no_pages;
//     start = Math.max(0, end - limit);
//   }

//   const displayedPages = [...Array(no_pages).keys()].slice(start, end);

//   return (
//     <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
//       <button onClick={goBack} disabled={activePg === 1}>
//         {"<<"}
//       </button>
//       {displayedPages.map((pageNum) => (
//         <div
//           key={pageNum}
//           onClick={() => {
//             setActivePg(pageNum + 1);
//           }}
//           style={{
//             fontSize: "20px",
//             cursor: "pointer",
//             background: activePg === pageNum + 1 ? "green" : "gray",
//             width: "40px",
//             height: "40px",
//             borderRadius: "20px",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           {pageNum + 1}
//         </div>
//       ))}
//       <button onClick={goForward} disabled={activePg === no_pages}>
//         {">"}
//       </button>
//     </div>
//   );
// };
