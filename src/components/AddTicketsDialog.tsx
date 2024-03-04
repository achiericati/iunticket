import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { DEBUG, Match, Ticket, User } from '../utils/interfaces'
import { Button, DialogContentText, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'
import { Box } from '@mui/material'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import { useState } from 'react'
import axios from 'axios'

interface Props {
    open: boolean;
    setOpen: (isOpen: boolean) => void
    currentMatch?: Match
    tickets: Ticket[]
    setTickets: (tickets: Ticket[]) => void
    loggedUser: User|null
  }

const AddTicketsDialog = ({
    open,
    setOpen,
    currentMatch,
    tickets,
    setTickets,
    loggedUser
  }: Props) => {
    const [anello, setAnello] = useState<number>(1);
    const [settore, setSettore] = useState<string>('');
    const [colore, setColore] = useState<string>('rosso');
    const [fila, setFila] = useState<string>('');
    const [posti, setPosti] = useState<string>('');
    const [prezzo, setPrezzo] = useState<string>('');
    const [necessariaTDT, setNecessariaTDT] = useState<boolean>(false);
    const [errorFila, setErrorFila] = useState<boolean>(true);
    const [errorPosti, setErrorPosti] = useState<boolean>(true);
    const [errorSettore, setErrorSettore] = useState<boolean>(true);

    const handleClose = () => {
      setOpen(false);
    }

    const handleAddNewTickets = async () => {
      try {
        const body = {
          userName: loggedUser?.username,
          partitaID: currentMatch?.ID,
          anello: anello,
          colore: colore,
          settore: settore,
          fila: fila,
          posti: posti,
          necessariaTdt: necessariaTDT,
          prezzo: prezzo
        }
        let response = null
        if (!DEBUG) response = await axios.post('https://www.iunticket.it/api/tickets', body);
        else response = await axios.post('http://localhost:31491/api/tickets', body);
        const newTickets = [...tickets]
        if (response && response.data && response.data.length > 0) newTickets.push(response.data[0])
        setTickets(newTickets)
      }
      catch (e) {}
      setOpen(false);
    }

    const handleChangeAnello = (event: any) => {
      setAnello(event.target.value as number);
    }

    const handleChangeColore = (event: any) => {
      setColore(event.target.value);
    }

    const handleChangeSettore = (settore: string) => {
      setSettore(settore)
      if (settore === '') setErrorSettore(true)
      else setErrorSettore(false)
    }

    const handleChangeFila = (fila: string) => {
      setFila(fila)
      if (!isNumber(fila)) setErrorFila(true)
      else setErrorFila(false)
    }

    function isNumber(str: string): boolean {
      return /^\d+(\d+)?$/.test(str);
    }

    const handleChangePosti = (posti: string) => {
      setPosti(posti)
      if (!isIntegerList(posti)) setErrorPosti(true)
      else setErrorPosti(false)
    }

    function isIntegerList(str: string): boolean {
      return /^(\d+,)*\d+$/.test(str);
  }


    return (
      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" style={{ color: "black" }}>
          <ConfirmationNumberIcon style={{ marginRight: "10px" }} color="primary" />
          {'Aggiungi i tuoi biglietti per ' + currentMatch?.partita}
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{marginBottom:'25px'}}>
          Inserisci qui i biglietti che rendi disponibili per questa partita; non ti resterà che aspettare di essere contattato dalle persone interessate!
        </DialogContentText>

        {loggedUser !== null ? (
          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2}>
            <FormControl variant="standard">
              <InputLabel id="anello-select-label">Anello</InputLabel>
              <Select
                id="anello-select"
                value={anello}
                onChange={handleChangeAnello}
                label="Anello"
                autoFocus
                margin="dense"
                variant="standard"
              >
                <MenuItem value={1}>Primo</MenuItem>
                <MenuItem value={2}>Secondo</MenuItem>
                <MenuItem value={3}>Terzo</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard">
              <InputLabel id="colore-select-label">Colore</InputLabel>
              <Select
                id="colore-select"
                value={colore}
                onChange={handleChangeColore}
                label="Colore"
              >
                <MenuItem value={'rosso'}>Rosso</MenuItem>
                <MenuItem value={'verde'}>Verde</MenuItem>
                <MenuItem value={'arancio'}>Arancio</MenuItem>
                <MenuItem value={'blu'}>Blu</MenuItem>
              </Select>
            </FormControl>

            <TextField
              autoFocus
              margin="dense"
              id="settore"
              error={errorSettore}
              name="settore"
              label={"Settore*"}
              value={settore}
              onChange={(event) => handleChangeSettore(event.target.value)}
              type="text"
              variant="standard"
            />

            <TextField
              autoFocus
              margin="dense"
              id="fila"
              error={errorFila}
              name="fila"
              label={"Fila*"}
              value={fila}
              onChange={(event) => handleChangeFila(event.target.value)}
              
              type="text"
              variant="standard"
            />

            <TextField
              autoFocus
              margin="dense"
              error={errorPosti}
              id="posti"
              name="posti"
              value={posti}
              onChange={(event) => handleChangePosti(event.target.value)}
              label={"Posti* (es. 4,5)"}
              
              type="text"
              variant="standard"
            />

            <TextField
              autoFocus
              margin="dense"
              id="prezzo"
              name="prezzo"
              value={prezzo}
              onChange={(event) => setPrezzo(event.target.value)}
              label={"Prezzo di ciascun biglietto (€)"}
              
              type="number"
              variant="standard"
            />

            <FormControlLabel control={<Switch defaultChecked checked={necessariaTDT} onChange={(event) => setNecessariaTDT(event.target.checked)} />} label="Necessaria TDT" style={{ marginTop: "30px" }} />
          </Box>
        ) : (
          <Box style={{ fontSize: "20px", fontWeight: "bold", marginTop: "25px" }}>Effettua il login o registrati per inserire i tuoi biglietti.</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={loggedUser === null || errorFila || errorPosti || errorSettore} onClick={handleAddNewTickets} type="submit">Aggiungi</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTicketsDialog;