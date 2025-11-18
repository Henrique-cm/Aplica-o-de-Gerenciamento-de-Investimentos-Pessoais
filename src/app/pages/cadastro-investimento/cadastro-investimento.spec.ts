import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroInvestimento } from './cadastro-investimento';

describe('CadastroInvestimento', () => {
  let component: CadastroInvestimento;
  let fixture: ComponentFixture<CadastroInvestimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroInvestimento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroInvestimento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
