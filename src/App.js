import "./App.css";
import { useState } from "react";
import xlsx from "xlsx";
import cryptoJs from "crypto-js";

function App() {
  const [data, setData] = useState(null);
  const [key, setKey] = useState("");
  const [wantEncrypt, setWantEncrypt] = useState(false);

  const readUploadFile = (e) => {
    e.preventDefault();

    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = JSON.stringify(xlsx.utils.sheet_to_json(worksheet));

        setData(json);
      };

      reader.readAsArrayBuffer(e.target.files[0]);
    } else {
      setData(null);
    }
  };

  const encryptJS = (data, key) => {
    if (!key.trim()) {
      window.alert("there is no key");
      return null;
    }
    const stringifyData =
      typeof data === "string" ? data : JSON.stringify(data);

    return cryptoJs.AES.encrypt(stringifyData, key).toString();
  };

  const downloadExcel = () => {
    generateBlob(data);
  };

  const downloadChCsm = () => {
    const parsedData = JSON.parse(data);
    const convertedData = {};

    parsedData.forEach((d, i) => {
      const { email, firstHalf, secondHalf, selfGrade, processType } = d;
      const FIRST = "상반기만";
      const SECOND = "하반기만";

      let type = {};

      if (processType.includes(FIRST)) {
        type.useOnlyFirstHalf = true;
      } else if (processType.includes(SECOND)) {
        type.useOnlySecondHalf = true;
      }

      convertedData[email] = {
        id: i + 1,
        firstHalf,
        secondHalf,
        selfGrade,
        ...type,
      };
    });

    generateBlob(JSON.stringify(convertedData));
  };

  const generateBlob = (d) => {
    const jsonD = wantEncrypt ? encryptJS(d, key) : d;

    const a = document.createElement("a");
    const blob = new Blob([jsonD], {
      type: "application/json",
    });
    a.href = URL.createObjectURL(blob);
    a.download = "excel.json";
    a.click();
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Upload Excel File</p>
        <div>
          <input type="file" onChange={readUploadFile} />
        </div>
        <div style={{ marginTop: 20 }}>
          <div>
            <label style={{ fontSize: 16, cursor: "pointer" }}>
              Do you want to encrypt the data?
              <input
                type="checkbox"
                checked={wantEncrypt}
                onChange={(e) => {
                  setWantEncrypt(!wantEncrypt);
                }}
              />
            </label>
          </div>
          {wantEncrypt && (
            <input
              type="text"
              placeholder="encrypt-key"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
              }}
            />
          )}
        </div>
        {data && (
          <>
            <div style={{ marginTop: 20 }}>
              <button onClick={downloadExcel}>Download Converted Excel</button>
            </div>
            <div style={{ marginTop: 20 }}>
              <p>Click if you have permission !</p>
              <button onClick={downloadChCsm}>FOR CH-CSM BUTTON</button>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
