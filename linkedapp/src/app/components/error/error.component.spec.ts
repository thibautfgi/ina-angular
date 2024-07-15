import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { ErrorService } from '../../services/error.service';
import { BehaviorSubject } from 'rxjs';

describe('ErrorComponent Test Unitaire', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let errorService: ErrorService;
  let errorStateSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorComponent],
      providers: [ErrorService]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    errorService = TestBed.inject(ErrorService);
    errorStateSubject = new BehaviorSubject({
      showErrorChampsEmpty: false,
      showErrorLogin: false,
      showErrorSamePassword: false,
      showErrorSecurityPassword: false,
      showErrorMatchPassword: false,
      showSucces: false
    });
    errorService.errorState$ = errorStateSubject.asObservable();
    fixture.detectChanges();
  });

  it('TEST INITIAL si ErrorComponent est crée', () => {
    expect(component).toBeTruthy();
  });

  it('TEST FONCTION devrais afficher "champs vide" si showErrorChampsEmpty: true ', () => {

    errorStateSubject.next({ showErrorChampsEmpty: true });
    fixture.detectChanges();

 
    const errorMessage = fixture.nativeElement.querySelector('.errorMessage');
    expect(errorMessage).not.toBeNull();
    expect(errorMessage.textContent).toContain('Champs vides.');
  });

  it('TEST FONCTION devrais afficher "Identifiant et/ou mots de passe incorrecte." si showErrorLogin : true', () => {

    errorStateSubject.next({ showErrorLogin: true });
    fixture.detectChanges();


    const errorMessage = fixture.nativeElement.querySelector('.errorMessage');
    expect(errorMessage).not.toBeNull();
    expect(errorMessage.textContent).toContain('Identifiant et/ou mots de passe incorrecte.');
  });

  it('TEST FONCTION devrais afficher "Votre nouveau mot de passe doit différer de l\'ancien." si showErrorSamePassword : true', () => {

    errorStateSubject.next({ showErrorSamePassword: true });
    fixture.detectChanges();


    const errorMessage = fixture.nativeElement.querySelector('.errorMessage');
    expect(errorMessage).not.toBeNull();
    expect(errorMessage.textContent).toContain('Votre nouveau mot de passe doit différer de l\'ancien.');
  });

  it('TEST FONCTION devrais afficher "Votre mot de passe doit respecter les règles de sécurité." si showErrorSecurityPassword : true', () => {

    errorStateSubject.next({ showErrorSecurityPassword: true });
    fixture.detectChanges();


    const errorMessage = fixture.nativeElement.querySelector('.errorMessage');
    expect(errorMessage).not.toBeNull();
    expect(errorMessage.textContent).toContain('Votre mot de passe doit respecter les règles de sécurité.');
  });

  it('TEST FONCTION devrais afficher "Vos nouveaux mots de passe ne correspondent pas." si showErrorMatchPassword : true', () => {

    errorStateSubject.next({ showErrorMatchPassword: true });
    fixture.detectChanges();


    const errorMessage = fixture.nativeElement.querySelector('.errorMessage');
    expect(errorMessage).not.toBeNull();
    expect(errorMessage.textContent).toContain('Vos nouveaux mots de passe ne correspondent pas.');
  });

  it('TEST FONCTION devrais afficher "Mots de passe modifier avec succès !" si showSucces: true', () => {

    errorStateSubject.next({ showSucces: true });
    fixture.detectChanges();


    const successMessage = fixture.nativeElement.querySelector('.succesMessage');
    expect(successMessage).not.toBeNull();
    expect(successMessage.textContent).toContain('Mots de passe modifier avec succès !');
  });
});
