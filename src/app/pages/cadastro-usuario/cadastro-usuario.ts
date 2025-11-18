import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-usuario.html',
  styleUrls: ['./cadastro-usuario.css']
})
export class CadastroUsuario {

  cadastroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Valida email
      senha: ['', [Validators.required, Validators.minLength(6)]], // Valida senha
      cpf: ['', Validators.required],
      perfil: ['', Validators.required],
      banco: ['', Validators.required]
    });
  }

  cadastrar(): void {
    if (this.cadastroForm.valid) {
      this.usuarioService.addUsuario(this.cadastroForm.value)
        .subscribe({
          next: () => {
            alert('Usuário cadastrado com sucesso!');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Erro ao cadastrar:', err);
            alert('Erro ao cadastrar. Tente novamente.');
          }
        });
    } else {
      this.cadastroForm.markAllAsTouched();
    }
  }
}
