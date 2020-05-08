import React from "react";
import styled from "@emotion/styled";
import Papa from "papaparse";
import "normalize.css";
import "./App.css";

const SPREADSHEET = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSPqGiGns5c1SVnrvwfuJC3iECaZdsBYyTLCGnM-Ce--do_jDlsKqfO_G1nWjbZKHcT3XrZjVhodUOf/pub?gid=2093979237&single=true&output=csv`;

const App = () => {
  const [wordTable, setWordTable] = React.useState(null);
  const [numbers, setNumbers] = React.useState("");
  const [compareNumbers, setCompareNumbers] = React.useState("");
  const input = React.useRef();
  const input2 = React.useRef();

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

  const getParsedNumbers = text => {
    let parsed = text.replace(/[^0-9,-]/g, "").split(",");
    parsed = parsed.reduce((arr, number) => {
      if (number.includes("-")) {
        const nums = number.split("-");
        const first = parseInt(nums[0], 10);
        const last = parseInt(nums[1], 10);
        if (!isNaN(first) && !isNaN(last)) {
          for (let i = first; i <= last; i++) {
            arr.push(i);
          }
        }
      } else {
        arr.push(parseInt(number, 10));
      }
      return arr;
    }, []);
    return parsed;
  }

  const getWordsByNumbers = () => {
    const parsedNumbers = getParsedNumbers(numbers)
    const parsedCompare = getParsedNumbers(compareNumbers)

    if(compareNumbers){
      const words = parsedNumbers
        .map(n => ({ number: n, word: wordTable[n] }))
        .filter(x => x.word);

      const compareWords = parsedCompare
        .map(n => ({ number: n, word: wordTable[n] }))
        .filter(x => x.word);

      let leftoverWords = []
      let sharedWords = []

      words.forEach(word => {
        if(compareWords.find(w => w.number === word.number)){
          sharedWords.push(word);
        }else{
          word.unique = true;
          leftoverWords.push(word);
        }
      })

      compareWords.forEach(word => {
        if(!words.find(w => w.number === word.number)){
          word.unique = true;
          leftoverWords.push(word);
        }
      })

      return [
        ...sharedWords,
        ...leftoverWords
      ]
    }else{
      const words = parsedNumbers
        .map(n => ({ number: n, word: wordTable[n] }))
        .filter(x => x.word);
      return words;
    }
  };

  return (
    <div className="App">
      <Row>
        <iframe
          title="Excel"
          style={{ width: "50vw", height: "100vh" }}
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSPqGiGns5c1SVnrvwfuJC3iECaZdsBYyTLCGnM-Ce--do_jDlsKqfO_G1nWjbZKHcT3XrZjVhodUOf/pubhtml?gid=302395088&amp;single=true&amp;widget=true&amp;headers=false"
        ></iframe>
        <Column
          style={{
            width: "50vw",
            height: "100vh",
            overflowY: "auto",
            paddingBottom: 30
          }}
        >
          {wordTable ? (
            <Column>
              <Row style={{ paddingTop: 100, marginBottom: 10 }}>
                <label style={{ fontSize: 36, textTransform: "uppercase" }}>
                  Type numbers here
                </label>
              </Row>
              <Row style={{paddingLeft: 10, paddingRight: 10}}>
                <Input
                  style={{marginRight: 7}}
                  ref={input}
                  value={numbers}
                  onChange={e => setNumbers(e.target.value.trimStart())}
                  onFocus={() => {
                    if (input.current) {
                      input.current.select();
                    }
                  }}
                />
                <Input
                  style={{marginLeft: 7}}
                  ref={input2}
                  value={compareNumbers}
                  onChange={e => setCompareNumbers(e.target.value.trimStart())}
                  onFocus={() => {
                    if (input2.current) {
                      input2.current.select();
                    }
                  }}
                />
              </Row>
              <Column
                style={{
                  alignItems: "center",
                  textAlign: "left",
                  marginTop: 30
                }}
              >
                {
                  !!compareNumbers &&
                  <CompareHint>Shared words are in white</CompareHint>
                }
                <Table>
                  <tbody>
                    {getWordsByNumbers().map((word, i) => (
                      <Word key={word + i} isUnique={word.unique}>
                        <td style={{ fontSize: 28, textAlign: 'right' }}>{word.number}:</td>
                        <td style={{paddingLeft: 20}}>{word.word}</td>
                      </Word>
                    ))}
                  </tbody>
                </Table>
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
  max-width: 500px;
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

const Table = styled("table")`
  border: none;
  border-collapse: collapse;
`;

const Word = styled("tr")`
  font-size: 36px;
  opacity: ${({isUnique}) => isUnique ? .45 : 1}
`;

const CompareHint = styled('p')`
  font-size: 24px;
  margin: 0px 25px;
  margin-bottom: 30px;
  padding-bottom: 8px;
  border-bottom: 2px solid white;
`
