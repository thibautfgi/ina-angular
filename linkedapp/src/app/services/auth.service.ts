import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = "http://localhost:3000/verify-auth";

  constructor( private http: HttpClient) {}


  // permet d'envoyer une requet api sur l'endpoint http://localhost:3000/verify-auth
  // du server_express_ldapjs.js = afin de test si login et mdp de l'user son correct
  verifyAuth(username: string, password: string): Observable<any> { 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = JSON.stringify({ username, password });

    return this.http.post<any>(this.apiUrl, body, { headers });
  }


}
