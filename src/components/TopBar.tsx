import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import EventIcon from '@mui/icons-material/Event';
import Typography from '@mui/material/Typography';
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UserContext } from '../utils/userContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginRegisterUserDialog from './LoginRegisterUserDialog';
import EditUserDataDialog from './EditUserDataDialog';
import { User } from '../utils/interfaces';

interface Props {
  loggedUser: User | null;
  setLoggedUser: (user: User | null) => void;
}

const TopBar = ({
  loggedUser,
  setLoggedUser
}: Props) => {
  const [openLoginRegisterDialog, setOpenLoginRegisterDialog] = React.useState(false);
  const [openEditUserDialog, setOpenEditUserDialog] = React.useState(false);
  const [view, setView] = useState<'LOGGED' | 'NOT_LOGGED'>('NOT_LOGGED');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const userContext = new UserContext();

  useEffect(() => {
    if (loggedUser !== null) setView('LOGGED');
    else setView('NOT_LOGGED');
  }, [loggedUser]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    userContext.logout();
    setLoggedUser(null);
    setView('NOT_LOGGED');
  };

  const editUser = () => {
    setOpenEditUserDialog(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(to right, #38bdf8, #60a5fa)' }}>
        <Toolbar>
          <EventIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white' }}>
            iUnTicket
          </Typography>

          {view === 'NOT_LOGGED' && (
            <Button 
              onClick={() => setOpenLoginRegisterDialog(true)} 
              sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}
            >
              Login
            </Button>
          )}

          {view === 'LOGGED' && (
            <>
              <IconButton onClick={handleClick}>
                <AccountCircleIcon sx={{ color: 'white', fontSize: '34px' }} />
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'profile-button',
                }}
              >
                <MenuItem onClick={editUser}>Modifica i miei dati</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <LoginRegisterUserDialog 
        openDialog={openLoginRegisterDialog} 
        setOpenDialog={setOpenLoginRegisterDialog} 
        setMainView={setView} 
        setLoggedUser={setLoggedUser}
      />

      <EditUserDataDialog 
        openDialog={openEditUserDialog} 
        setOpenDialog={setOpenEditUserDialog} 
        loggedUser={loggedUser} 
        setLoggedUser={setLoggedUser}
      />
    </Box>
  );
};

export default TopBar;