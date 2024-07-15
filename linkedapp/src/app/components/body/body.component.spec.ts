import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BodyComponent } from './body.component';
import { NodeService } from '../../services/nodes.service';
import { ErrorService } from '../../services/error.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('BodyComponent Test Unitaire', () => { // cree un bodycomponent test
  let component: BodyComponent;
  let fixture: ComponentFixture<BodyComponent>;
  let nodeService: NodeService; 
  let errorService: ErrorService;
  let authService: AuthService;

  // fixture permet d'interagir avec la template et son componenet pour test
  //fixture permet donc une interaction avec tt le visuel : exemple si un button change bien de couleur, ect...

  // run avant chaque test pour setup le test local et injecter les autres components/services
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyComponent, FormsModule, FontAwesomeModule, HttpClientTestingModule],
      providers: [NodeService, ErrorService, AuthService]
    }).compileComponents();

    // test bed est une func angular pour setup un environnement de test
    fixture = TestBed.createComponent(BodyComponent);
    component = fixture.componentInstance;
    nodeService = TestBed.inject(NodeService);
    errorService = TestBed.inject(ErrorService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('TEST INITIAL si BodyComponent est crée', () => {
    expect(component).toBeTruthy();
  }); 

  it("TEST BUTTON si le button valide lance bien la function onSubmit() ", () => {
    spyOn(component, 'onSubmit')
    const button = fixture.nativeElement.querySelector('.confirmButton');
    button.click();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it("TEST VISUEL si error message est vide/invisible a l'initialisation", () => {
    
    const errorPlace = fixture.nativeElement.querySelector('.errorPlace');
    
    expect(errorPlace).not.toBeNull();

    // regarde les deux classes de errorComponent template et verifie qu'elle sont vide
    const errorMessages = errorPlace.querySelectorAll('.errorMessage');
    const successMessages = errorPlace.querySelectorAll('.succesMessage');

    expect(errorMessages.length).toBe(0);
    expect(successMessages.length).toBe(0);
  });

  it("TEST VISUEL si formBodyContaineur est présent", () => {
    const formBodyContaineur = fixture.nativeElement.querySelector('.formBodyContaineur');
    expect(formBodyContaineur).not.toBeNull();
  })

  it("TEST VISUEL si 4 formContaineur sont présent", () => {
    const formContaineur = fixture.nativeElement.querySelectorAll('.formContaineur');
    expect(formContaineur.length).toBe(4);
  })

  it("TEST VISUEL si 4 inputGroupContaineurs sont présent", () => {
    const inputGroupContaineurs = fixture.nativeElement.querySelectorAll('.inputGroupContaineur');
    expect(inputGroupContaineurs.length).toBe(4);
  });

  it("TEST VISUEL si 4 inputIconContaineurs sont présent", () => {
    const inputIconContaineurs = fixture.nativeElement.querySelectorAll('.inputIconContaineur');
    expect(inputIconContaineurs.length).toBe(4); 
  });

  it("TEST VISUEL si 4 confirmButton sont présent", () => {
    const confirmButton = fixture.nativeElement.querySelector('.confirmButton');
    expect(confirmButton).not.toBeNull();
  });

  it("TEST VISUEL si 4 form-control sont présent", () => {
    const formControls = fixture.nativeElement.querySelectorAll('.form-control');
    expect(formControls.length).toBe(4); 
  });


  it('TEST FONCTION verifyAuth() devrais avoir ete appeler quand onSubmit() appeller', () => {

    spyOn(authService, 'verifyAuth').and.returnValue(of({}));

    component.username = 'testuser';
    component.oldPassword = 'oldpassword';
    component.newPassword = 'newpassword';
    component.confirmPassword = 'newpassword';
 
    component.onSubmit();
    expect(authService.verifyAuth).toHaveBeenCalledWith('testuser', 'oldpassword');

  });
  

  it('TEST FONCTION montre un error Message onSubmit() si lancien et le nouveau password match ', () => {

    spyOn(authService, 'verifyAuth').and.returnValue(of({ message: 'Credentials are valid' }));
    spyOn(errorService, 'updateErrorState');
    component.username = 'testuser';
    component.oldPassword = 'oldPassword';
    component.newPassword = 'oldPassword';
    component.confirmPassword = 'oldPassword';
    component.onSubmit();
    expect(errorService.updateErrorState).toHaveBeenCalledWith({ showErrorSamePassword: true });
  });



  it('TEST FONCTION devrais resset le error Message onSubmit()', () => {
    spyOn(errorService, 'resetErrorState');
    component.onSubmit();
    expect(errorService.resetErrorState).toHaveBeenCalled();
  });

  it('TEST FONCTION montre un error Message onSubmit() si champs vide ', () => {
    spyOn(errorService, 'updateErrorState');
    component.username = '';
    component.oldPassword = '';
    component.newPassword = '';
    component.confirmPassword = '';
    component.onSubmit();
    expect(errorService.updateErrorState).toHaveBeenCalledWith({ showErrorChampsEmpty: true });
  });


  it('TEST FONCTION montre un error Message onSubmit() si les login sont incorrect', () => {
    spyOn(authService, 'verifyAuth').and.returnValue(throwError('Invalid credentials'));
    spyOn(errorService, 'updateErrorState');
    component.username = 'testuser';
    component.oldPassword = 'oldPassword';
    component.newPassword = 'NewPassword123!';
    component.confirmPassword = 'NewPassword123!';
    component.onSubmit();
    expect(errorService.updateErrorState).toHaveBeenCalledWith({ showErrorLogin: true });
  });



  it('TEST FONCTION montre un error Message onSubmit() si le nouveaux mdp est pas assez securiser', () => {
    spyOn(authService, 'verifyAuth').and.returnValue(of({ message: 'Credentials are valid' }));
    spyOn(errorService, 'updateErrorState');
    component.username = 'testuser';
    component.oldPassword = 'oldPassword';
    component.newPassword = 'Azerty1';
    component.confirmPassword = 'Azerty1';
    component.onSubmit();
    expect(errorService.updateErrorState).toHaveBeenCalledWith({ showErrorSecurityPassword: true });
  });

  it('TEST FONCTION montre un error Message onSubmit() si le nouveaux et le confirm password ne match pas', () => {
    spyOn(authService, 'verifyAuth').and.returnValue(of({ message: 'Credentials are valid' }));
    spyOn(errorService, 'updateErrorState');
    component.username = 'testuser';
    component.oldPassword = 'oldPassword';
    component.newPassword = 'NewPassword123!';
    component.confirmPassword = 'DifferentPassword!';
    component.onSubmit();
    expect(errorService.updateErrorState).toHaveBeenCalledWith({ showErrorMatchPassword: true });
  });

  it('TEST FONCTION montre un succes Message onSubmit() si tout les critères sont remplis', () => {
    spyOn(authService, 'verifyAuth').and.returnValue(of({ message: 'Credentials are valid' }));
    spyOn(authService, 'changePassword').and.returnValue(of({ message: 'Password changed successfully' }));
    component.username = 'testuser';
    component.oldPassword = 'oldPassword';
    component.newPassword = 'NewPassword123!';
    component.confirmPassword = 'NewPassword123!';
    component.onSubmit();
    expect(authService.changePassword).toHaveBeenCalledWith('testuser', 'NewPassword123!');
  });
});
