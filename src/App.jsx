import { useState } from "react";
import Page from "./components/structure/Page";
import "./style.scss";
import { useCallback } from "react";
import { useEffect } from "react";
import { applyWavesToFilesInZip } from "./util/applyWaves";
import JSZip from "jszip";
import downloadFile from "downloadfile-js";

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [waves, setWaves] = useState(3);

  const handleFileChange = useCallback((event) => {
    setFile(event.target.files[0]);
    setResults(null);
  }, []);

  useEffect(() => {
    let running = true;
    applyWavesToFilesInZip(file, waves).then((newResults) => {
      if (!running) return;
      setResults(newResults);
    });
    return () => {
      running = false;
    };
  }, [file, waves]);

  const handleDownload = useCallback(async () => {
    const outZip = JSZip();
    for (const { name, content } of results) {
      outZip.file(name, content);
    }
    downloadFile(await outZip.generateAsync({ type: "blob" }), "output.zip");
  }, [results]);

  return <Page name="Mass Outbreaks Quick Wave Changer">
    <h2>How to use</h2>
    <p>Drop a zip file with your Mass Outbreak wave JSONs in here, and enter the number of waves you would like to set each of those JSONs to. I will pull in all the JSONs, and change all of their wave counts to your desired value.</p>
    {!file && <div style={{ display: "flex" }}>
      <input type="file" onChange={handleFileChange} accept=".zip" />
      <input type="number" onChange={(e) => setWaves(e.target.value)} value={waves} />
    </div>}
    {file && !results && <div>Loading...</div>}
    {file && results && <button onClick={handleDownload}>Download</button>}
  </Page>;
}

export default App;
