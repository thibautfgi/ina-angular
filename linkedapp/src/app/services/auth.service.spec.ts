import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService Test Unitaire', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('TEST INITIAL si Auth Service est crée', () => {
    expect(service).toBeTruthy();
  });


  it('should send a post request to verify auth', () => {
    // la requete test, la dummy reponse est la reponse attendue
    const dummyResponse = { message: 'success' };
    service.verifyAuth('username', 'password').subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });
    // verifie le liens, la methode, et le body
    const req = httpMock.expectOne('http://localhost:3000/verify-auth');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'username', password: 'password' });
    req.flush(dummyResponse);
  });

  it('should send a post request to change password', () => {
    // la requete test 
    const dummyResponse = { message: 'password changed' };
    service.changePassword('username', 'newPassword').subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });
    // verifie le liens, la methode, et le body
    const req = httpMock.expectOne('http://localhost:3000/change-password');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'username', newPassword: 'newPassword' });
    req.flush(dummyResponse);
  });
});
