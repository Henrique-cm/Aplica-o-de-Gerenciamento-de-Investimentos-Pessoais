import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. MUDANÇA AQUI: 'id' agora é opcional (id?)
export interface Investimento {
  id?: number; // O '?' torna o ID opcional
  usuarioId: number;
  tipo: string;
  valorInicial: number;
  valorMensal: number;
  rendimento: string;
  tempo: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvestimentoService {

  private apiUrl = 'http://localhost:3000/investimentos';

  constructor(private http: HttpClient) { }

  // Método que você já tem (GET)
  getInvestimentos(): Observable<Investimento[]> {
    return this.http.get<Investimento[]>(this.apiUrl);
  }

  // 2. MUDANÇA AQUI: Adiciona o novo método (POST)
  addInvestimento(investimento: Investimento): Observable<Investimento> {
    return this.http.post<Investimento>(this.apiUrl, investimento);
  }
}
