import { useState } from "react";
import "./App.css";

function App() {
  const [progess,setProgress] = useState<number>()
  const [f, setF] = useState<HTMLInputElement>();
  const readAndUpload = () => {
    // console.log(f)
    const fileReader = new FileReader();
    const theFile = f?.files ? f.files[0] : null;
    fileReader.readAsArrayBuffer(theFile!);
    fileReader.onload = async (ev) => {
      const CHUNK_SIZE = 5000;
      const chunkCount =
        ev.target?.result instanceof ArrayBuffer
          ? ev.target.result.byteLength / CHUNK_SIZE
          : 0;
      console.log(chunkCount);
      const fileName = Math.random() * 100 + theFile?.name!;
      for (let chunkId = 0; chunkId < chunkCount + 1; chunkId++) {
        const chunk = ev.target?.result?.slice(
          chunkId * CHUNK_SIZE,
          chunkId * CHUNK_SIZE + CHUNK_SIZE
        );
        await fetch("http://localhost:3001/upload", {
          method: "POST",
          headers: {
            "content-type": "application/octet-stream",
            "content-length":
              chunk instanceof ArrayBuffer ? chunk.byteLength.toString() : "",
            "file-name": fileName,
          },
          body:chunk
        });
        setProgress(Math.round(chunkId*100/chunkCount))
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
        <div>Progress : {progess}%</div>
      </div>
    </>
  );
}

export default App;
