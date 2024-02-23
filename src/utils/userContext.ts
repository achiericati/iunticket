import { User } from "./interfaces";

  export class UserContext {
    private currentUser: User | null = null;

    public setCurrentUser(user: User | null) {
      this.currentUser = user;
      localStorage.setItem('currentUserCookie_iUnTicket', JSON.stringify(user));
    }
  
    public getCurrentUser(): User | null {
      if (this.currentUser) return this.currentUser;
      const currUser = localStorage.getItem('currentUserCookie_iUnTicket');
      if (currUser &&  currUser !== "") {
        const jsonUser = JSON.parse(currUser);
        this.currentUser = jsonUser
        return jsonUser
      } 
      else return null
    }
  
    public logout() {
      this.currentUser = null;
      localStorage.setItem('currentUserCookie_iUnTicket', "");
    }
  }