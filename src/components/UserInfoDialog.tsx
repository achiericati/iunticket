import React from 'react';
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { User } from '../utils/interfaces'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import { Box } from '@mui/material'
import InstagramIcon from '@mui/icons-material/Instagram'
import InfoIcon from '@mui/icons-material/Info'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import PhoneIcon from '@mui/icons-material/Phone'

interface Props {
    open: boolean;
    setOpen: (isOpen: boolean) => void
    infoUtente?: User
  }

const UserInfoDialog = ({
    open,
    setOpen,
    infoUtente
  }: Props) => {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Box justifyContent="center" display="flex" alignItems="center">
          <InfoIcon style={{marginRight:"10px", fontSize:"35px"}} color="primary"></InfoIcon>
          <Box style={{fontSize:"25px"}}>Informazioni utente {infoUtente?.username}</Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        {infoUtente?.nome && 
          <Box display="flex" alignItems="center"> 
            <PermIdentityIcon color="primary" style={{marginRight:"2px", fontSize:"25px"}}></PermIdentityIcon>
              <Box style={{fontWeight:"bold", marginRight:"10px", width:"85px"}}>
                {'Nome:'}
              </Box> {infoUtente?.nome}
          </Box>
        }
        {infoUtente?.cognome && 
          <Box display="flex" alignItems="center" marginTop="7px"> 
            <PermIdentityIcon color="primary" style={{marginRight:"2px", fontSize:"25px"}}></PermIdentityIcon>
              <Box style={{fontWeight:"bold", marginRight:"10px", width:"85px"}}>
                {'Cognome:'}
              </Box> {infoUtente?.cognome}
          </Box>
        }
        {infoUtente?.instagram && 
          <Box display="flex" alignItems="center" marginTop="7px"> 
            <InstagramIcon color="primary" style={{marginRight:"2px", fontSize:"25px"}}></InstagramIcon>
              <Box style={{fontWeight:"bold", marginRight:"10px", width:"85px"}}>
                {'Instagram:'}
              </Box> {infoUtente?.instagram}
          </Box>
        }
        {infoUtente?.mail && 
          <Box display="flex" alignItems="center" marginTop="7px"> 
            <AlternateEmailIcon color="primary" style={{marginRight:"2px", fontSize:"25px"}}></AlternateEmailIcon>
              <Box style={{fontWeight:"bold", marginRight:"10px", width:"85px"}}>
                {'e-Mail:'}
              </Box> {infoUtente?.mail}
          </Box>
        }
        {infoUtente?.cellulare && 
          <Box display="flex" alignItems="center" marginTop="7px"> 
            <PhoneIcon color="primary" style={{marginRight:"2px", fontSize:"25px"}}></PhoneIcon>
              <Box style={{fontWeight:"bold", marginRight:"10px", width:"85px"}}>
                {'Cellulare:'}
              </Box> {infoUtente?.cellulare}
          </Box>
        }
        {infoUtente?.created_date && 
          <Box justifyContent="center" display="flex" alignItems="center" marginTop="25px"> 
              <Box style={{ marginRight:"10px", fontSize:"12px"}}>
                {'Utente creato il ' + infoUtente?.created_date}
              </Box> 
          </Box>
        }
         <Box justifyContent="center" display="flex" alignItems="center" marginTop="5px"> 
              <Box style={{ marginRight:"10px", fontSize:"18px", fontWeight:"bold"}}>
                {'ATTENZIONE ALLE TRUFFE!'}
              </Box> 
        </Box>
        <Box justifyContent="center" display="flex" alignItems="center" marginTop="5px"> 
          <Box style={{ marginRight: "10px", fontSize: "12px", textAlign: "center" }}>
            {'Prendi le giuste precauzioni ogni volta che acquisti un biglietto: verifica i profili social del venditore e per essere sicuro di un eventuale rimborso accetta di pagare solo tramite Paypal - beni e servizi.'}
          </Box> 
        </Box>
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};

export default UserInfoDialog;