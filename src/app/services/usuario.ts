import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Define o "molde" do objeto Usuario
// (Baseado no seu PDF )
export interface Usuario {
  id?: number;
  nome: string;
  email: string; // Adicionando email para login
  senha: string; // Adicionando senha para login
  cpf: string;
  perfil: string;
  banco: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) { }

  /**
   * Adiciona um novo usuário (Cadastro)
   */
  addUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  /**
   * Busca um usuário pelo email (para o Login)
   * O json-server entende essa sintaxe de query
   */
  getUsuarioByEmail(email: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}`);
  }
}
