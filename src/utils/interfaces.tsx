export interface User {
    username: string;
    password: string;
    nome?: string;
    cognome?: string;
    mail?: string
    instagram?: string
    cellulare?: string
    created_date: string
  }

  export interface Ticket {
    ID: number;
    user: string;
    anello: string;
    colore: string;
    settore: string;
    fila: number;
    posti: number[];
    necessariaTdt: boolean;
    prezzo?: number;
  }

  export interface Match {
    ID: number;
    partita: string;
    data: string;
    bigliettiDisponibili: number;
    prezzoMin: number;
  }

  export const MAIN_COLOR = "#03a9f4";
  export const DEBUG = false;