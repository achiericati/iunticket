import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import Typography from '@mui/material/Typography'
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { UserContext } from '../utils/userContext'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginRegisterUserDialog from './LoginRegisterUserDialog'
import EditUserDataDialog from './EditUserDataDialog'
import { User } from '../utils/interfaces'

interface Props {
  loggedUser: User|null
  setLoggedUser: (user: User|null) => void
}

const TopBar = ({
  loggedUser,
  setLoggedUser
}: Props) => {
  const [openLoginRegisterDialog, setOpenLoginRegisterDialog] = React.useState(false);
  const [openEditUserDialog, setOpenEditUserDialog] = React.useState(false);
  const [view, setView] = useState<'LOGGED'|'NOT_LOGGED'>('NOT_LOGGED');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const userContext = new UserContext();

  useEffect(() => {
    if (loggedUser !== null) setView('LOGGED')
  }, [loggedUser]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    userContext.logout()
    setLoggedUser(null)
    setView('NOT_LOGGED')
  };

  const editUser = () => {
    setOpenEditUserDialog(true)
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <SportsSoccerIcon style={{marginRight:"5px"}}></SportsSoccerIcon>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            iUnTicket?
          </Typography>
          {view === 'NOT_LOGGED' && <Button onClick={() => setOpenLoginRegisterDialog(true)} color="inherit">Login</Button>}
          {view === 'LOGGED' && 
          <div>
          <IconButton onClick={handleClick}>
              <AccountCircleIcon style={{color:'white', fontSize:'32px'}} /></IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={editUser}>Modifica i miei dati</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </div>
        }
        </Toolbar>
      </AppBar>
      <LoginRegisterUserDialog openDialog={openLoginRegisterDialog} setOpenDialog={setOpenLoginRegisterDialog} setMainView={setView} setLoggedUser={setLoggedUser}></LoginRegisterUserDialog>
      <EditUserDataDialog openDialog={openEditUserDialog} setOpenDialog={setOpenEditUserDialog} loggedUser={loggedUser} setLoggedUser={setLoggedUser} ></EditUserDataDialog>
    </Box>
  );
};

export default TopBar;