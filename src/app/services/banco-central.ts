import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// 1. Interface CORRETA para a nova API
// A API vai retornar um objeto simples: { data: "...", valor: "10.50" }
interface SelicResponse {
  data: string;
  valor: string; // Vem como string, ex: "10.50"
}

@Injectable({
  providedIn: 'root'
})
export class BancoCentralService {

  // 2. URL CORRETA (via proxy) para a "Meta Selic" anualizada
  private selicApiUrl = '/api-bcb/dados/basics/selic';

  constructor(private http: HttpClient) { }

  /**
   * Busca o último valor da "Meta Selic" e retorna como número
   */
  getTaxaSelic(): Observable<number> {
    // 3. A API retorna um objeto simples (não um array)
    return this.http.get<SelicResponse>(this.selicApiUrl).pipe(
      map(response => {
        // 4. Converte o valor (string "10.50") para número (10.50)
        return parseFloat(response.valor);
      })
    );
  }
}
