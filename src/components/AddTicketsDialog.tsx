import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Match, Ticket, User } from '../utils/interfaces'
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
    const [settore, setSettore] = useState<string>('rosso');
    const [fila, setFila] = useState<string>('');
    const [posti, setPosti] = useState<string>('');
    const [prezzo, setPrezzo] = useState<string>('');
    const [necessariaTDT, setNecessariaTDT] = useState<boolean>(false);
    const [errorFila, setErrorFila] = useState<boolean>(true);
    const [errorPosti, setErrorPosti] = useState<boolean>(true);

    const handleClose = () => {
      setOpen(false);
    }

    const handleAddNewTickets = async () => {
      try {
        const body = {
          userName: loggedUser?.username,
          partitaID: currentMatch?.ID,
          anello: anello,
          settore: settore,
          fila: fila,
          posti: posti,
          necessariaTdt: necessariaTDT,
          prezzo: prezzo
        }
        const response = await axios.post('http://localhost:3001/api/tickets', body);
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

    const handleChangeSettore = (event: any) => {
      setSettore(event.target.value);
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
      <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
    >
    <DialogTitle>
      <Box display="flex" alignItems={"center"} style={{color: "black"}}>
        <ConfirmationNumberIcon style={{marginRight:"10px"}} color="primary"></ConfirmationNumberIcon>
        {'Aggiungi i tuoi biglietti per ' + currentMatch?.partita}
      </Box>
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        Inserisci qui i biglietti che rendi disponibili per questa partita; non ti resterà che aspettare di essere contattato dalle persone interessate! 
      </DialogContentText>
      

      {loggedUser !== null ? <Box>
        <FormControl variant="standard" sx={{ m: 1, width:190, marginRight:"17px", marginLeft:"-0px", marginTop: "30px" }}>
        <InputLabel id="demo-simple-select-standard-label">Anello</InputLabel>
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

      <FormControl variant="standard" sx={{ m: 1, width:190, marginTop: "30px" }}>
        <InputLabel id="demo-simple-select-standard-label">Settore</InputLabel>
        <Select
          id="anello-select"
          value={settore}
          onChange={handleChangeSettore}
          label="Settore"
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
        id="fila"
        error={errorFila}
        name="fila"
        label={"Fila*"}
        value={fila}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChangeFila(event.target.value);
          }}
        style={{marginRight:"40px"}}
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChangePosti(event.target.value);
          }}
        label={"Posti* (es. 4,5)"}
        type="text"
        variant="standard"
      />

      <TextField
        autoFocus
        margin="dense"
        id="prezzo"
        style={{marginRight:"40px"}}
        name="prezzo"
        value={prezzo}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPrezzo(event.target.value);
          }}
        label={"Prezzo di ciascun biglietto (€)"}
        type="number"
        variant="standard"
      />

      <FormControlLabel style={{marginTop:"30px"}} control={<Switch defaultChecked checked={necessariaTDT} onChange={(event) => setNecessariaTDT(event.target.checked)} />} label="Necessaria TDT" />
      </Box> : <Box style={{fontSize:"20px", fontWeight:"bold"}} marginTop={"25px"}>{'Effettua il login o registrati per inserire i tuoi biglietti.'}</Box>}
    {/* nota sulla privacy TODO --> specifica che i dati non verranno usati in alcun modo --> chiedi a chatGPT di creare un testo adatto. */}
    </DialogContent>

    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button disabled={loggedUser === null || errorFila || errorPosti} onClick={handleAddNewTickets} type="submit">Aggiungi</Button>
    </DialogActions>
  </Dialog>
  );
};

export default AddTicketsDialog;