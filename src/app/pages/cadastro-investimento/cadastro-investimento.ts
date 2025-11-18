import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { InvestimentoService, Investimento } from '../../services/investimento';

@Component({
  selector: 'app-cadastro-investimento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-investimento.html',
  styleUrls: ['./cadastro-investimento.css']
})
export class CadastroInvestimento implements OnInit {

  investimentoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private investimentoService: InvestimentoService,
    private router: Router
  ) {
    this.investimentoForm = this.fb.group({
      tipo: ['', Validators.required],
      valorInicial: ['', Validators.required],
      valorMensal: [''],

      // --- MUDANÇA AQUI ---
      // Removemos o 'rendimento' e adicionamos estes dois:
      tipoRendimento: ['cdi', Validators.required], // 'cdi' como valor padrão
      valorRendimento: ['', Validators.required], // O número (ex: 110)
      // --- FIM DA MUDANÇA ---

      tempo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  cadastrar(): void {
    if (this.investimentoForm.valid) {
      console.log('Formulário válido! Enviando...');

      // --- MUDANÇA AQUI: Montar a string de rendimento ---
      let rendimentoString = '';
      const tipo = this.investimentoForm.get('tipoRendimento')?.value;
      const valor = this.investimentoForm.get('valorRendimento')?.value;

      if (tipo === 'cdi') {
        rendimentoString = `${valor}% CDI`;
      } else if (tipo === 'aa') {
        rendimentoString = `${valor}% a.a.`; // (a.a. = ao ano)
      } else if (tipo === 'am') {
        rendimentoString = `${valor}% a.m.`; // (a.m. = ao mês)
      }
      // --- FIM DA MUDANÇA ---

      // Monta o objeto para enviar
      const novoInvestimento: Investimento = {
        tipo: this.investimentoForm.get('tipo')?.value,
        valorInicial: this.investimentoForm.get('valorInicial')?.value,
        valorMensal: this.investimentoForm.get('valorMensal')?.value,
        rendimento: rendimentoString, // <-- Usa a nova string montada
        tempo: this.investimentoForm.get('tempo')?.value,
        usuarioId: 1 // "Chumbado" o ID do usuário 1
      };

      // Chama o service (esta parte não muda)
      this.investimentoService.addInvestimento(novoInvestimento)
        .subscribe({
          next: (investimentoCriado) => {
            console.log('Investimento salvo!', investimentoCriado);
            alert('Investimento cadastrado com sucesso!');
            this.router.navigate(['/planejamento']);
          },
          error: (err) => {
            console.error('Erro ao salvar:', err);
            alert('Erro ao cadastrar. Tente novamente.');
          }
        });

    } else {
      console.log('Formulário inválido!');
      this.investimentoForm.markAllAsTouched();
    }
  }
}
