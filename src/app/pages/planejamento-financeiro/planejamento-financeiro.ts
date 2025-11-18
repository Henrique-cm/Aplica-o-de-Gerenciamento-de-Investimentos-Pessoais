import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Nossos 3 Services
import { InvestimentoService, Investimento } from '../../services/investimento';
import { ObjetivoService, Objetivo } from '../../services/objetivo';
import { BancoCentralService } from '../../services/banco-central';

// Interface para a Projeção
export interface InvestimentoProjetado extends Investimento {
  valorAportado?: number;
  jurosSimulado?: number;
  resultadoFinal?: number;
}

@Component({
  selector: 'app-planejamento-financeiro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './planejamento-financeiro.html',
  styleUrls: ['./planejamento-financeiro.css']
})
export class PlanejamentoFinanceiro implements OnInit {

  investimentos: InvestimentoProjetado[] = [];
  taxaSelicAtual: number = 0;
  totalAportado: number = 0;
  totalJuros: number = 0;
  totalProjetado: number = 0;

  objetivos: Objetivo[] = [];
  objetivoForm: FormGroup;

  // --- NOVAS VARIÁVEIS PARA O BALANÇO ---
  totalObjetivos: number = 0;
  saldoPlanejamento: number = 0;
  // Mapa para ajudar a ordenar por prioridade
  private mapaPrioridade: { [key: string]: number } = {
    'alta': 1,
    'media': 2,
    'baixa': 3
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private investimentoService: InvestimentoService,
    private objetivoService: ObjetivoService,
    private bcbService: BancoCentralService
  ) {
    this.objetivoForm = this.fb.group({
      nome: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      prazo: ['', [Validators.required, Validators.min(1)]],
      prioridade: ['media', Validators.required]
    });
  }

  ngOnInit(): void {
    this.buscarDadosIniciais();
    this.buscarObjetivos();
  }

  // --- Métodos Principais ---

  buscarDadosIniciais(): void {
    this.bcbService.getTaxaSelic().subscribe({
      next: (taxa: number) => {
        this.taxaSelicAtual = taxa;
        console.log('Taxa Selic (CDI) atual:', this.taxaSelicAtual);
        this.buscarInvestimentos();
      },
      error: (err: any) => {
        console.error('Falha ao buscar Selic:', err);
        this.taxaSelicAtual = 15; // Taxa de fallback
        console.warn(`Usando taxa Selic de fallback: ${this.taxaSelicAtual}%`);
        this.buscarInvestimentos();
      }
    });
  }

  buscarInvestimentos(): void {
    this.investimentoService.getInvestimentos().subscribe((dados: Investimento[]) => {
      this.investimentos = dados;
      this.calcularProjecao();
    });
  }

  buscarObjetivos(): void {
    this.objetivoService.getObjetivos().subscribe((dados: Objetivo[]) => {
      // Ordena os objetivos por prioridade
      this.objetivos = dados.sort((a, b) => {
        return this.mapaPrioridade[a.prioridade] - this.mapaPrioridade[b.prioridade];
      });
      console.log('Objetivos carregados e ordenados:', this.objetivos);
      this.calcularBalanconObjetivos(); // Calcula o balanço após carregar
    });
  }

  cadastrarObjetivo(): void {
    if (this.objetivoForm.valid) {
      this.objetivoService.addObjetivo(this.objetivoForm.value)
        .subscribe({
          next: () => {
            // Não usamos alert, vamos usar console por enquanto
            console.log('Objetivo cadastrado!');
            this.buscarObjetivos(); // Atualiza a lista
            this.objetivoForm.reset({ prioridade: 'media' });
          },
          error: (err: any) => {
            console.error('Erro ao cadastrar objetivo:', err);
          }
        });
    } else {
      this.objetivoForm.markAllAsTouched();
    }
  }

  deletarObjetivo(id: number | undefined): void {
    if (!id) return;
    // Não usamos confirm, vamos deletar direto
    console.log('Deletando objetivo ID:', id);
    this.objetivoService.deleteObjetivo(id).subscribe({
      next: () => {
        console.log('Objetivo deletado!');
        this.buscarObjetivos(); // Atualiza a lista
      },
      error: (err: any) => {
        console.error('Erro ao deletar objetivo:', err);
      }
    });
  }

  // --- O "MOTOR DE CÁLCULO" ---

  calcularProjecao(): void {
    if (this.taxaSelicAtual === 0) {
      console.error('Taxa Selic não carregada. O cálculo não vai rodar.');
      return;
    }

    this.totalAportado = 0;
    this.totalJuros = 0;
    this.totalProjetado = 0;

    this.investimentos.forEach(invest => {
      const valorInicial = invest.valorInicial || 0;
      const valorMensal = invest.valorMensal || 0;
      const tempo = invest.tempo || 0; // em meses
      invest.valorAportado = valorInicial + (valorMensal * tempo);
      let taxaAnual = 0;

      if (invest.rendimento.includes('CDI')) {
        const percCDI = parseFloat(invest.rendimento.replace('% CDI', '')) / 100;
        taxaAnual = (this.taxaSelicAtual * percCDI);
      } else if (invest.rendimento.includes('a.a.')) {
        taxaAnual = parseFloat(invest.rendimento.replace('% a.a.', ''));
      } else if (invest.rendimento.includes('a.m.')) {
        taxaAnual = parseFloat(invest.rendimento.replace('% a.m.', '')) * 12;
      }

      const taxaPeriodo = (taxaAnual / 100) * (tempo / 12);
      invest.jurosSimulado = valorInicial * taxaPeriodo;
      invest.resultadoFinal = invest.valorAportado + invest.jurosSimulado;
      this.totalAportado += invest.valorAportado;
      this.totalJuros += invest.jurosSimulado;
      this.totalProjetado += invest.resultadoFinal;
    });

    console.log('Cálculo de Projeção Concluído!', this.investimentos);
    this.calcularBalanconObjetivos();
  }

  calcularBalanconObjetivos(): void {
    this.totalObjetivos = this.objetivos.reduce((acc, obj) => acc + obj.valor, 0);

    this.saldoPlanejamento = this.totalProjetado - this.totalObjetivos;

    console.log(`Balanço calculado: Projeção (${this.totalProjetado}) - Objetivos (${this.totalObjetivos}) = Saldo (${this.saldoPlanejamento})`);
  }
}
