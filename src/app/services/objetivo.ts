import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Define o "molde" de um Objetivo (com Prioridade)
export interface Objetivo {
  id?: number;
  nome: string;
  valor: number;
  prazo: number; // Em meses
  prioridade: 'alta' | 'media' | 'baixa'; // Prioridade
}

@Injectable({
  providedIn: 'root'
})
export class ObjetivoService {

  private apiUrl = 'http://localhost:3000/objetivos';

  constructor(private http: HttpClient) { }

  /**
   * Busca todos os objetivos
   */
  getObjetivos(): Observable<Objetivo[]> {
    return this.http.get<Objetivo[]>(this.apiUrl);
  }

  /**
   * Adiciona um novo objetivo
   */
  addObjetivo(objetivo: Objetivo): Observable<Objetivo> {
    return this.http.post<Objetivo>(this.apiUrl, objetivo);
  }

  /**
   * Deleta um objetivo pelo ID
   */
  deleteObjetivo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
