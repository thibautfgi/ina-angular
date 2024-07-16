import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // Ce service fais le liens entre le server et body.component.ts


  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}
  
    // permet d'envoyer une requet api sur l'endpoint http://localhost:3000/verify-auth
  // du server_express_ldapjs.js = afin de test si login et mdp de l'user son correct
  verifyAuth(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/verify-auth`, { username, password }, { headers });
  }


  // change le password via une api request sur /change-password, envoie les données entrer par l'user
  changePassword(username: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/change-password`, { username, newPassword }, { headers });
  }
}
