import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  logar(): void {
    if (this.loginForm.valid) {

      // 1. Limpa os dados de entrada (remove espaços)
      const email = this.loginForm.get('email')?.value.trim();
      const senha = this.loginForm.get('senha')?.value.trim();

      // --- DEBUG: Mostra o que estamos comparando ---
      console.log('--- DEBUG LOGIN ---');
      console.log('Tentando logar com:');
      console.log(`Email (do formulário): |${email}|`);
      console.log(`Senha (do formulário): |${senha}|`);
      // --- FIM DO DEBUG ---

      this.usuarioService.getUsuarioByEmail(email).subscribe(usuarios => {

        console.log('Resultado do DB:', usuarios);

        if (usuarios.length > 0) {
          // O email foi encontrado!
          console.log('Usuário encontrado. Comparando senhas:');
          console.log(`Senha (do DB): |${usuarios[0].senha}|`);

          if (usuarios[0].senha === senha) {
            // Senha correta
            console.log('Senhas batem! Login OK.');
            alert('Login bem-sucedido!');
            sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarios[0]));
            this.router.navigate(['/planejamento']);
          } else {
            // Senha errada
            console.log('Senhas NÃO batem.');
            alert('Email ou senha inválidos.');
          }
        } else {
          // Email não encontrado
          console.log('Nenhum usuário encontrado com esse email.');
          alert('Email ou senha inválidos.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
