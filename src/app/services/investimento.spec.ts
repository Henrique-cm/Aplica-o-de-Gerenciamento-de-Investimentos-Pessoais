import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// (Opcional, mas boa prática) Define a "forma" de um objeto Investimento
export interface Investimento {
  id: number;
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

  getInvestimentos(): Observable<Investimento[]> {
    return this.http.get<Investimento[]>(this.apiUrl);
  }

}
