import React from 'react';
import { TextField } from '@mui/material'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import { Box } from '@mui/material'
import InstagramIcon from '@mui/icons-material/Instagram'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import PhoneIcon from '@mui/icons-material/Phone'

interface Props {
    showPassword?: boolean
    disableUsername?: boolean
    username: string
    setUsername: (value: string) => void
    password: string
    setPassword: (value: string) => void
    nome: string
    setNome: (value: string) => void
    cognome: string
    setCognome: (value: string) => void
    instagram: string
    setInstagram: (value: string) => void
    cellulare: string
    setCellulare: (value: string) => void
    email: string
    setEmail: (value: string) => void
  }

const UserInfoInputComponents = ({
    showPassword,
    disableUsername,
    username,
    setUsername,
    password,
    setPassword,
    nome,
    setNome,
    cognome,
    setCognome,
    instagram,
    setInstagram,
    cellulare,
    setCellulare,
    email,
    setEmail
  }: Props) => {
    
  return (
    
      <Box>
        <TextField
        margin="dense"
        id="username"
        name="username"
        label={<Box display="flex" alignItems="center"> <PermIdentityIcon color="primary" style={{marginRight:"5px"}}></PermIdentityIcon>{"Username*"}</Box>}
        type="text"
        value={username}
        disabled={disableUsername}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUsername(event.target.value);
          }}
        variant="standard"
        style={{marginRight:"40px"}}
      />
      {showPassword &&
       <TextField
       margin="dense"
       id="password"
       name="password"
       label={<Box display="flex" alignItems="center"> <PermIdentityIcon color="primary" style={{marginRight:"5px"}}></PermIdentityIcon>{"Password*"}</Box>}
       value={password}
       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
          }}
       type="password"
       variant="standard"
        />}
      <TextField
        margin="dense"
        id="name"
        name="name"
        label={<Box display="flex" alignItems="center"> <PermIdentityIcon color="primary" style={{marginRight:"5px"}}></PermIdentityIcon>{"Nome"}</Box>}
        type="text"
        value={nome}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNome(event.target.value);
          }}
        variant="standard"
        style={{marginRight:"40px"}}
      />
      <TextField
        margin="dense"
        id="surname"
        name="surname"
        style={{marginRight:"40px"}}
        label={<Box display="flex" alignItems="center"> <PermIdentityIcon color="primary" style={{marginRight:"5px"}}></PermIdentityIcon>{"Cognome"}</Box>}
        value={cognome}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCognome(event.target.value);
          }}
        type="text"
        variant="standard"
      />
      <TextField
        margin="dense"
        id="instagram"
        name="instagram"
        label={<Box display="flex" alignItems="center"> <InstagramIcon color="primary" style={{marginRight:"5px"}}></InstagramIcon>{"Instagram"}</Box>}
        type="text"
        value={instagram}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setInstagram(event.target.value);
          }}
        variant="standard"
        style={{marginRight:"40px"}}
      />
      <TextField
        margin="dense"
        id="cellulare"
        name="cellulare"
        style={{marginRight:"40px"}}
        label={<Box display="flex" alignItems="center"> <PhoneIcon color="primary" style={{marginRight:"5px"}}></PhoneIcon>{"Cellulare"}</Box>}
        value={cellulare}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCellulare(event.target.value);
          }}
        type="number"
        variant="standard"
      />
      <TextField
        margin="dense"
        id="email"
        name="email"
        label={<Box display="flex" alignItems="center"> <AlternateEmailIcon color="primary" style={{marginRight:"5px"}}></AlternateEmailIcon>{"Email"}</Box>}
        value={email}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
          }}
        type="email"
        variant="standard"
      />
      </Box>
  );
};

export default UserInfoInputComponents;