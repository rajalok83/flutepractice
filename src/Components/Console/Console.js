const { Paper,
  Table, TableContainer, TableHead, TableRow, TableCell,
  FormControl, InputLabel, Select, MenuItem, TextField, Button,
  Icon,
  PlayArrowIcon, StopIcon, Looks5Icon, Looks4Icon, Looks3Icon, Looks2Icon, Looks1Icon } = MaterialUI;
const { useState, useEffect } = React;

const Console = () => {
  const [taal, setTaal] = useState('');
  const [taalDict, setTaalDict] = useState({});
  const [variation, setVariation] = useState('');
  const [variationBolSet, setVariationBolSet] = useState([]);
  const [variationBolSetCount, setVariationBolSetCount] = useState(0);
  const [variationDict, setVariationDict] = useState({});
  const [variationSecondHeader, setVariationSecondHeader] = useState([]);
  const [showBolSet, setShowBolSet] = useState(false);
  const [showComposition, setShowComposition] = useState(false);
  const [bpm, setBpm] = useState(110);
  const [play, setPlay] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [start, setStart] = useState(false);
  const [counter, setCounter] = useState(5);
  const [allComposition, setAllComposition] = useState({});
  const [allTaalComposition, setAllTaalComposition] = useState({});
  const [compositionDict, setCompositionDict] = useState({});
  const [composition, setComposition] = useState('');
  const [compositionNotes, setCompositionNotes] = useState([]);
  const [compositionNotesCount, setCompositionNotesCount] = useState(0);
  const [compositionStartAt, setCompositionStartAt] = useState(1);
  // let interrupt = false;

  useEffect(() => {
    axios.get("../src/data/taal.json").then((res) => {
      setTaalDict(res.data);
    });
    axios.get("../src/data/taal_composition_mapping.json").then((res) => {
      setAllComposition(res.data);
      // console.log(res.data);
      let inTaalComposition = {};
      let compositions = Object.keys(res.data);
      compositions.forEach((i, idx) => {
        // console.log(i, i);
        // console.log(res.data[i]);
        let taalsForComp = Object.keys(res.data[i]["taals"]);
        taalsForComp.forEach((j, jdx) => {
          // console.log(i, j);
          let comp =
          {
            "label": res.data[i]["label"],
            "description": res.data[i]["description"],
            "startAt": res.data[i]["taals"][j]["startAt"]
          }
          if (!inTaalComposition.hasOwnProperty(j))
            inTaalComposition[j] = {};
          inTaalComposition[j][i] = comp;
        });
      });
      // console.log(inTaalComposition);
      setAllTaalComposition(inTaalComposition);
    });
  }, []);

  const handleTaalChange = (event) => {
    setPlay(false);
    setStart(false);
    setVariation('');
    setComposition('');
    // setTaalComposition('');
    setShowBolSet(false);
    // console.log(event.target.value);
    setTaal(event.target.value);
    axios.get("../src/data/" + event.target.value + "/variations.json").then((res) => {
      // console.log(res.data);
      setVariationDict(res.data);
    }).catch(() => {
      setVariationDict({});
      setVariation('');
      // setPlay(false);
    });
    setCompositionDict(allTaalComposition.hasOwnProperty(event.target.value) ? allTaalComposition[event.target.value] : {});
  };

  const handleVariationChange = (event) => {
    setPlay(false);
    setStart(false);
    setVariationBolSet([]);
    // console.log(event.target.value, event.target.value.length);
    let secondHeader = [];
    if (event.target.value !== '') {
      setVariationBolSet(variationDict[event.target.value]['bolset']);
      setVariationBolSetCount(variationDict[event.target.value]['bolset'].reduce((prev, curr) => { console.log(curr); return prev + curr["bolsubset"].length; }, 0));
      variationDict[event.target.value]['bolset'].forEach((column) => {
        // console.log(column);
        column.bolsubset.forEach(element => {
          secondHeader.push(element.label2);
        });
      });
      setShowBolSet(true);
    } else {
      setShowBolSet(false);
    }
    setVariationSecondHeader(
      secondHeader
    );
    setVariation(event.target.value);
    // console.log(variation);
  };

  useEffect(() => {
    setRefresh(!refresh);
  }, [start, compositionNotes, variation]);

  useEffect(() => {
    setStart(false);
    setPlay(false);
    if (composition !== '') {
      setCompositionStartAt(compositionDict[composition]["startAt"]);
      axios.get("../src/data/compositions/" + composition + ".json").then((res) => {
        console.log("bolSetCount", variationBolSetCount);
        let inCompositioNotes = Array(compositionDict[composition]["startAt"] - 1).fill("").concat(res.data["compositionNotes"]);
        let compositionLength = inCompositioNotes.length;
        let additionalNotes = Array(variationBolSetCount - (compositionLength % variationBolSetCount)).fill("");
        inCompositioNotes = [...inCompositioNotes, ...additionalNotes];
        inCompositioNotes.forEach((val, idx) => { inCompositioNotes[idx] = { "label": val, "hilight": "" } });
        let outCompositioNotes = []
        for (let i = 0; i < inCompositioNotes.length; i += variationBolSetCount)
          outCompositioNotes.push(inCompositioNotes.slice(i, i + variationBolSetCount));
        console.log(outCompositioNotes);
        setCompositionNotes(outCompositioNotes);
        setCompositionNotesCount(inCompositioNotes.length);
      }).catch(() => {
        setCompositionNotes([]);
        setCompositionNotesCount(0);
      });
    } else {
      setCompositionNotes([]);
      setCompositionNotesCount(0);
    }
  }, [composition]);

  const handleCompositionChange = (event) => {
    setPlay(false);
    setStart(false);
    setComposition(event.target.value);
  };

  const handleBPMChange = (event) => {
    setPlay(false);
    setStart(false);
    // console.log(event.target.value);
    setBpm(event.target.value);
  };

  let timer = null;

  const setWaitTimer = (in_counter) => {
    timer = setInterval(() => {
      // console.log(new Date().getTime());
      // console.log(interrupt);
      setCounter(in_counter);
      in_counter--;
      if (in_counter == -1) {
        // if (!interrupt) {
        setStart(!start);
        setPlay(!play);
        // }
        // else {
        //   setPlay(false);
        //   setStart(false);
        // }
        resetWaitTimer();
        // setVariationBolSet(variationBolSet);
        // setShowBolSet(!showBolSet);
      }
    }, 1000);
  };

  const resetWaitTimer = () => {
    if (timer !== null) {
      clearTimeout(timer);
      // setCounter(4);
    }
  };

  const handleClickPlayButton = (event) => {
    console.log(event.currentTarget.value);
    console.log(play, start, event.currentTarget.value, counter);
    setPlay(!play);
    if (play) {
      setStart(!start);
      if (typeof timer !== 'undefined') {
        console.log("Interrupt Play");
        resetWaitTimer();
      }
    } else {
      setWaitTimer(4);
    }
    console.log(play);
  };

  return <>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="select-taal-label">Taal</InputLabel>
                <Select
                  labelId="select-taal-label"
                  id="select-taal"
                  value={taal}
                  label="Taal"
                  onChange={handleTaalChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {
                    Object.entries(taalDict).map(([key, value]) =>
                      <MenuItem key={key} value={key}>{value.label}</MenuItem>
                    )
                  }
                </Select>
              </FormControl>
              {
                Object.keys(variationDict).length != 0 &&
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="select-variation-label">Variation</InputLabel>
                  <Select
                    labelId="select-variation-label"
                    id="select-variation"
                    value={variation}
                    label="Variation"
                    onChange={handleVariationChange}
                  >
                    <MenuItem value="" selected>
                      <em>None</em>
                    </MenuItem>
                    {Object.entries(variationDict).map(([key, value]) =>
                      <MenuItem key={key} value={key}>{value.label}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              }
              {
                Object.keys(compositionDict).length != 0 &&
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="select-composition-label">Composition</InputLabel>
                  <Select
                    labelId="select-composition-label"
                    id="select-composition"
                    value={composition}
                    label="Composition"
                    onChange={handleCompositionChange}
                  >
                    <MenuItem value="" selected>
                      <em>None</em>
                    </MenuItem>
                    {Object.entries(compositionDict).map(([key, value]) =>
                      <MenuItem key={key} value={key}>{value.label}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              }
              {variation !== '' && <FormControl sx={{ m: 1, width: '10ch' }} size="small">
                <TextField id="outlined-basic" variant="outlined"
                  // labelId="demo-select-small-label"
                  value={bpm}
                  label="BPM"
                  type="number"
                  InputProps={{ inputProps: { min: 30, max: 240, step: 5 } }}
                  onChange={handleBPMChange}
                  size="small"
                />
              </FormControl>}
              {variation != '' && bpm != '' && parseInt(bpm) >= 30 &&
                <FormControl sx={{ m: 1, width: '10ch' }} size="small">
                  <Button variant="contained" value={play} onClick={handleClickPlayButton}>
                    {/* {play && typeof counter === 'undefined' && <Icon>stop</Icon>} */}
                    {!play && <Icon>play_arrow</Icon>}
                    {/* {play && (counter == 5 && <Icon>looks_5</Icon>)} */}
                    {play && ((counter == 4 && <Icon >looks_4</Icon>)
                      || (counter == 3 && <Icon>looks_3</Icon>)
                      || (counter == 2 && <Icon>looks_two</Icon>)
                      || (counter == 1 && <Icon>looks_one</Icon>)
                      || (counter == 0 && <Icon>stop</Icon>)
                      || <Icon>looks_5</Icon>)}
                  </Button>
                </FormControl>
              }
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
    {showBolSet && !refresh && <Taal start={start} showComposition={showComposition} compositionNotesCount={compositionNotesCount} composition={compositionNotes} compositionStartAt={compositionStartAt} variationBols={variationBolSet} variationSecondHeader={variationSecondHeader} variationBolSetCount={variationBolSetCount} bpm={bpm} />}
    {showBolSet && refresh && <Taal start={start} showComposition={showComposition} compositionNotesCount={compositionNotesCount} composition={compositionNotes} compositionStartAt={compositionStartAt} variationBols={variationBolSet} variationSecondHeader={variationSecondHeader} variationBolSetCount={variationBolSetCount} bpm={bpm} />}
  </>
};