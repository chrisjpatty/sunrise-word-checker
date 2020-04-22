import React from "react";
import styled from "@emotion/styled";
import Papa from "papaparse";
import "normalize.css";
import "./App.css";

const SPREADSHEET = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSPqGiGns5c1SVnrvwfuJC3iECaZdsBYyTLCGnM-Ce--do_jDlsKqfO_G1nWjbZKHcT3XrZjVhodUOf/pub?gid=2093979237&single=true&output=csv`;

const App = () => {
  const [wordTable, setWordTable] = React.useState(null);
  const [numbers, setNumbers] = React.useState("");
  const input = React.useRef();

  const onSheetsFetched = result => {
    const table = result.data.reduce((obj, row) => {
      obj[row[0]] = row[1];
      return obj;
    }, {});
    setWordTable(table);
  };

  React.useEffect(() => {
    Papa.parse(SPREADSHEET, {
      download: true,
      header: false,
      complete: onSheetsFetched
    });
  }, []);

  const getWordsByNumbers = () => {
    let parsed = numbers.replace(/[^0-9,-]/g, "").split(",");
    parsed = parsed.reduce((arr, number) => {
      if(number.includes('-')){
        const nums = number.split('-')
        const first = parseInt(nums[0], 10)
        const last = parseInt(nums[1], 10)
        if(!isNaN(first) && !isNaN(last)){
          for(let i = first; i <= last; i++){
            arr.push(i)
          }
        }
      }else{
        arr.push(number)
      }
      return arr
    }, [])
    const words = parsed.map(n => wordTable[n]).filter(x => x);
    return words;
  };

  return (
    <div className="App">
      <Row>
        <iframe
          title="Excel"
          style={{ width: "50vw", height: "100vh" }}
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSPqGiGns5c1SVnrvwfuJC3iECaZdsBYyTLCGnM-Ce--do_jDlsKqfO_G1nWjbZKHcT3XrZjVhodUOf/pubhtml?gid=302395088&amp;single=true&amp;widget=true&amp;headers=false"
        ></iframe>
        <Column style={{ width: "50vw", height: "100vh", overflowY: 'auto', paddingBottom: 30 }}>
          {wordTable ? (
            <Column>
              <Row style={{ paddingTop: 100, marginBottom: 10 }}>
                <label style={{ fontSize: 36, textTransform: "uppercase" }}>
                  Type numbers here
                </label>
              </Row>
              <Row>
                <Input
                  ref={input}
                  value={numbers}
                  onChange={e => setNumbers(e.target.value.trimStart())}
                  onFocus={() => {
                    if (input.current) {
                      input.current.select();
                    }
                  }}
                />
              </Row>
              <Column
                style={{ alignItems: "center", textAlign: "center", marginTop: 30 }}
              >
                {getWordsByNumbers().map((word, i) => (
                  <Word key={word + i}>{word}</Word>
                ))}
              </Column>
            </Column>
          ) : (
            <Loading>Loading...</Loading>
          )}
        </Column>
      </Row>
    </div>
  );
};

export default App;

const Column = styled("div")`
  display: flex;
  flex-direction: column;
`;

const Row = styled("div")`
  display: flex;
  justify-content: center;
`;

const Input = styled("input")`
  width: 100%;
  max-width: 600px;
  height: 60px;
  border-radius: 5px;
  background: #fff;
  border: none;
  box-shadow: inset 0px 3px 15px rgba(0, 0, 0, 0.3);
  font-size: 28px;
  text-align: center;
  padding: 15px;
`;

const Loading = styled("h1")`
  text-align: center;
  margin-top: 48vh;
  margin-bottom: 0px;
`;

const Word = styled("span")`
  font-size: 36px;
`;
