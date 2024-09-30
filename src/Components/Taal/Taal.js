const { Paper, Grid, Box, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } = MaterialUI;
const { useState, useEffect } = React;


const Taal = (props) => {
  const [start, setStart] = useState(props.start);
  const [bolSet, setBolSet] = useState(props.variationBols);
  const [totalBeats, setTotalBeats] = useState(props.variationBolSetCount);
  const [secondHeader, setSecondHeader] = useState(props.variationSecondHeader);
  const [bpm, setBpm] = useState(props.bpm);
  const [composition, setComposition] = useState(props.composition);
  const [compositionNotesCount, setCompositionNotesCount] = useState(props.compositionNotesCount);

  // console.log(composition);
  let index = 0;
  let noteIndex = 0;
  useEffect(() => {
    console.log(bolSet);
    console.log(start);
    if (typeof (bolSet) != "undefined") {
      const timer = setInterval(() => {
        // console.log((new Date()).valueOf(), bpm);
        setBolSet(bolSet.map((column, i) => {
          column.bolsubset.map((beat, j) => {
            beat.hilight = (start && index == (i * column.bolsubset.length + j) % totalBeats ? true : false);
            return beat;
          });
          return column;
        }));
        setComposition(composition.map((row, i) => {
          row.map((column, j) => {
            column.hilight = (start && noteIndex == ((i * totalBeats) + j) ? true : false)
          });
          return row;
        }));
        index = index + 1;
        noteIndex = noteIndex + 1;
        if (index % totalBeats == 0) {
          index = 0;
        }
        if (noteIndex % compositionNotesCount == 0) {
          noteIndex = 0;
        }
        // console.log(index)
      }, (60 * 1000) / bpm);
      return () => {
        console.log("Clearing Interval");
        clearInterval(timer);
      };
    }
  }, []);

  return typeof (bolSet) !== 'undefined' &&
    // <Paper sx={{ width: '100%', overflow: 'hidden', flex: 1 }}>
    <Box sx={{ flexGrow: 1 }}>
      <TableContainer >
        <Table stickyheader aria-label="sticky table" size="small" flex="1">
          <TableHead sx={{ backgroundColor: 'pink' }}>
            <TableRow sx={{}}>
              {bolSet.map((column) => (
                column.bolsubset.map((beat, i) => (
                  <TableCell sx={{ borderLeft: (beat.hilight ? 2 : (i == 0 ? 1 : 0)), borderRight: (beat.hilight ? 2 : (i == column.bolsubset.length - 1 ? 1 : 0)), borderTop: (beat.hilight ? 2 : 0), borderBottom: (beat.hilight ? 2 : 0), backgroundColor: (beat.hilight ? '#77dd77' : '') }}
                    key={beat.label + i}
                    align="center"
                    style={{}}
                  >
                    {beat.label}
                  </TableCell>
                ))
              ))}
            </TableRow>
          </TableHead>
          <TableHead sx={{ border: 1 }}>
            <TableRow sx={{ backgroundColor: "#fff44f", border: 1 }}>
              {secondHeader.map((column, i) => (
                <TableCell
                  key={column + i}
                  align="left"
                  style={{}}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {composition.length != 0 &&
              composition.map((row, i) => (
                <TableRow key={"compnote_" + i}>
                  {row.map((column, j) => (
                    <TableCell sx={{ borderLeft: (column.hilight ? 2 : 1), borderRight: (column.hilight ? 2 : 1), borderTop: (column.hilight ? 2 : 1), borderBottom: (column.hilight ? 2 : 1), backgroundColor: (column.hilight ? '#77dd77' : '') }}
                      key={"compnote_" + (i * totalBeats + j)}
                      align="center"
                      style={{}}
                      
                    >
                      {column.label}
                    </TableCell>
                    // <TableCell
                    //   key={"compnote_" + (i * totalBeats + j)}
                    //   align="left"
                    //   style={{}}
                    // >
                    //   {column.label}
                    // </TableCell>
                  ))}
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    // </Paper >
    ;
};