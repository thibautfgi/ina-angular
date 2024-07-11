import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BodyComponent } from './body.component';
import { ValidationService } from '../../services/password.service';
import { ErrorService } from '../../services/error.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('BodyComponent', () => { // cree un bodycomponent
  let component: BodyComponent;
  let fixture: ComponentFixture<BodyComponent>;
  let validationService: ValidationService;
  let errorService: ErrorService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyComponent, FormsModule, FontAwesomeModule, HttpClientTestingModule],
      providers: [ValidationService, ErrorService, AuthService]
    }).compileComponents();

    fixture = TestBed.createComponent(BodyComponent);
    component = fixture.componentInstance;
    validationService = TestBed.inject(ValidationService);
    errorService = TestBed.inject(ErrorService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });


  it('should show error if new password matches old password', () => {
    spyOn(authService, 'verifyAuth').and.returnValue(of({ message: 'Credentials are valid' }));
    spyOn(errorService, 'updateErrorState');
    component.username = 'testuser';
    component.oldPassword = 'oldPassword';
    component.newPassword = 'oldPassword';
    component.confirmPassword = 'oldPassword';
    component.onSubmit();
    expect(errorService.updateErrorState).toHaveBeenCalledWith({ showErrorSamePassword: true });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 

  it('should reset error state on submit', () => {
    spyOn(errorService, 'resetErrorState');
    component.onSubmit();
    expect(errorService.resetErrorState).toHaveBeenCalled();
  });

  it('should show error if any field is empty', () => {
    spyOn(errorService, 'updateErrorState');
    component.username = '';
    component.oldPassword = '';
    component.newPassword = '';
    component.confirmPassword = '';
    component.onSubmit();
    expect(errorService.updateErrorState).toHaveBeenCalledWith({ showErrorChampsEmpty: true });
  });

  it('should call verifyAuth on submit', () => {
    spyOn(authService, 'verifyAuth').and.returnValue(of({ message: 'Credentials are valid' }));
    component.username = 'testuser';
    component.oldPassword = 'oldPassword';
    component.newPassword = 'NewPassword123!';
    component.confirmPassword = 'NewPassword123!';
    component.onSubmit();
    expect(authService.verifyAuth).toHaveBeenCalledWith('testuser', 'oldPassword');
  });

  it('should show error if credentials are invalid', () => {
    spyOn(authService, 'verifyAuth').and.returnValue(throwError('Invalid credentials'));
    spyOn(errorService, 'updateErrorState');
    component.username = 'testuser';
    component.oldPassword = 'oldPassword';
    component.newPassword = 'NewPassword123!';
    component.confirmPassword = 'NewPassword123!';
    component.onSubmit();
    expect(errorService.updateErrorState).toHaveBeenCalledWith({ showErrorLogin: true });
  });



  it('Expects a 6', () => {
    let calc = 2+3;
    expect(calc).toBe(5);
  });

  it('should show error if new password does not meet security criteria', () => {
    spyOn(authService, 'verifyAuth').and.returnValue(of({ message: 'Credentials are valid' }));
    spyOn(errorService, 'updateErrorState');
    component.username = 'testuser';
    component.oldPassword = 'oldPassword';
    component.newPassword = 'short';
    component.confirmPassword = 'short';
    component.onSubmit();
    expect(errorService.updateErrorState).toHaveBeenCalledWith({ showErrorSecurityPassword: true });
  });

  it('should show error if new password and confirm password do not match', () => {
    spyOn(authService, 'verifyAuth').and.returnValue(of({ message: 'Credentials are valid' }));
    spyOn(errorService, 'updateErrorState');
    component.username = 'testuser';
    component.oldPassword = 'oldPassword';
    component.newPassword = 'NewPassword123!';
    component.confirmPassword = 'DifferentPassword!';
    component.onSubmit();
    expect(errorService.updateErrorState).toHaveBeenCalledWith({ showErrorMatchPassword: true });
  });

  it('should call changePassword if all criteria are met', () => {
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
