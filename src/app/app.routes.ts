import { Routes } from '@angular/router';

// 1. Importa a nova classe Home
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { CadastroUsuario } from './pages/cadastro-usuario/cadastro-usuario';
import { SobreNos } from './pages/sobre-nos/sobre-nos';
import { PlanejamentoFinanceiro } from './pages/planejamento-financeiro/planejamento-financeiro';
import { CadastroInvestimento } from './pages/cadastro-investimento/cadastro-investimento';

export const routes: Routes = [
  // 2. Rota padrão agora aponta para /home
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // 3. Adiciona o novo path
  { path: 'home', component: Home },

  { path: 'login', component: Login },
  { path: 'cadastro-usuario', component: CadastroUsuario },
  { path: 'sobre-nos', component: SobreNos },
  { path: 'planejamento', component: PlanejamentoFinanceiro },
  { path: 'cadastro-investimento', component: CadastroInvestimento },
];
