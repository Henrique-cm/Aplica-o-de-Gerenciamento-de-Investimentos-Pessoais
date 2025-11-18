import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { InvestimentoService, Investimento } from '../../services/investimento';
import { ObjetivoService, Objetivo } from '../../services/objetivo';

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


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private investimentoService: InvestimentoService,
    private objetivoService: ObjetivoService
  ) {
    this.objetivoForm = this.fb.group({
      nome: ['', Validators.required],
      valor: ['', Validators.required],
      prazo: ['', Validators.required],
      prioridade: ['media', Validators.required]
    });
  }

  ngOnInit(): void {
    this.taxaSelicAtual = 15.0;
    console.log(`Usando taxa Selic fixa (simulada): ${this.taxaSelicAtual}%`);

    this.buscarInvestimentos();
    this.buscarObjetivos();
  }

  buscarInvestimentos(): void {
    this.investimentoService.getInvestimentos().subscribe((dados: Investimento[]) => {
      this.investimentos = dados;
      this.calcularProjecao();
    });
  }

  buscarObjetivos(): void {
    this.objetivoService.getObjetivos().subscribe((dados: Objetivo[]) => {
      this.objetivos = dados;
      console.log('Objetivos carregados:', this.objetivos);
    });
  }

  cadastrarObjetivo(): void {
    if (this.objetivoForm.valid) {
      this.objetivoService.addObjetivo(this.objetivoForm.value)
        .subscribe({
          next: () => {
            alert('Objetivo cadastrado!');
            this.buscarObjetivos();
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
    if (confirm('Tem certeza que deseja deletar este objetivo?')) {
      this.objetivoService.deleteObjetivo(id).subscribe({
        next: () => {
          alert('Objetivo deletado!');
          this.buscarObjetivos();
        },
        error: (err: any) => {
          console.error('Erro ao deletar objetivo:', err);
        }
      });
    }
  }

  calcularProjecao(): void {
    if (this.taxaSelicAtual === 0) {
      console.error('Taxa Selic não carregada.');
      return;
    }

    this.totalAportado = 0;
    this.totalJuros = 0;
    this.totalProjetado = 0;

    this.investimentos.forEach(invest => {

      const valorInicial = invest.valorInicial || 0;
      const valorMensal = invest.valorMensal || 0;
      const tempo = invest.tempo || 0;

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

      // Juros Simples sobre o valor inicial para o período
      const taxaPeriodo = (taxaAnual / 100) * (tempo / 12);
      invest.jurosSimulado = valorInicial * taxaPeriodo;

      invest.resultadoFinal = invest.valorAportado + invest.jurosSimulado;

      this.totalAportado += invest.valorAportado;
      this.totalJuros += invest.jurosSimulado;
      this.totalProjetado += invest.resultadoFinal;
    });

    console.log('Cálculo de Projeção Concluído!', this.investimentos);

  }
}
