import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { MAIN_COLOR, Match } from '../utils/interfaces'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import { IconButton, TableContainer, styled } from '@mui/material'


interface Props {
    matches: Match[]
    handleLoadTickets: (matchID: number) => void
  }

const MatchesTable = ({
    matches,
    handleLoadTickets
  }: Props) => {

    const StyledTable = styled(Table)({
      minWidth: 650,
      border: '1px solid ' + MAIN_COLOR
    });


  return (
    <TableContainer style={{width: "100%", marginTop:"10px"}}>
    <StyledTable>
    
      <TableHead>
        <TableRow>
          <TableCell style={{fontWeight:"bold"}} align="center">Biglietti</TableCell>
          <TableCell style={{fontWeight:"bold"}} >Partita</TableCell>
          <TableCell style={{fontWeight:"bold"}} align="center">Data</TableCell>
          <TableCell style={{fontWeight:"bold"}} align="center">Biglietti disponibili</TableCell>
          <TableCell style={{fontWeight:"bold"}} align="center">A partire da</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
          {matches.map((match) => (
            <TableRow
              key={match.ID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
               <TableCell align="center"><IconButton onClick={() => handleLoadTickets(match.ID)} color="primary" aria-label="Delete">
              <ConfirmationNumberIcon /></IconButton></TableCell>
              <TableCell>{match.partita}</TableCell>
              <TableCell align="center">{match.data}</TableCell>
              <TableCell align="center">{match.bigliettiDisponibili}</TableCell>
              <TableCell align="center">{match.prezzoMin ? match.prezzoMin + '€' : ''}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </StyledTable>
        </TableContainer>
  );
};

export default MatchesTable;