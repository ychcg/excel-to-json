import "./App.css";
import xlsx from "xlsx";
function App() {
  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = JSON.stringify(xlsx.utils.sheet_to_json(worksheet));

        const a = document.createElement("a");
        const blob1 = new Blob([json], {
          type: "application/json",
        });
        a.href = URL.createObjectURL(blob1);
        a.download = "excel.json";
        a.click();
      };

      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Upload Excel File!</p>
        <input type="file" onChange={readUploadFile} />
      </header>
    </div>
  );
}

export default App;
