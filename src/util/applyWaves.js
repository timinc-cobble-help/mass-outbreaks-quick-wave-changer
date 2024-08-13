import JSZip from "jszip";

export async function applyWavesToFilesInZip(zipFile, waves) {
  if (!zipFile) return null;

  return new Promise((resolve, reject) => {
    const zip = new JSZip();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;
      const loadedZip = await zip.loadAsync(content);
      const newResults = [];

      for (const filename of Object.keys(loadedZip.files)) {
        if (!filename.endsWith('.json')) continue;

        const fileContent = await loadedZip.file(filename).async('string');
        try {
          const jsonFileContent = JSON.parse(fileContent);
          jsonFileContent.waves = waves;
          newResults.push({ name: filename, content: JSON.stringify(jsonFileContent, null, 2) });
        } catch (error) {
          reject(error);
          return;
        }
      }

      resolve(newResults);
    };

    reader.readAsArrayBuffer(zipFile);
  });
}