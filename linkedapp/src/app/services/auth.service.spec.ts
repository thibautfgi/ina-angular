import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Data } from '@angular/router';

describe('AuthService Test Unitaire', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    httpClient = TestBed.inject(HttpClient);
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('TEST INITIAL si Auth Service est crée', () => {
    expect(service).toBeTruthy();
  });


  it('TEST HTTP, veryfy post auth 1, msg', () => {
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


  // j'ai utiliser angular doc pour test http
  it('TEST HTTP, veryfy post auth 2, request', () => {
    const testData: Data = { username: 'username', password: 'password' };
  
    // Make an HTTP GET request
    httpClient.post<Data>('http://localhost:3000/verify-auth', testData)
      .subscribe(data =>
        // When observable resolves, result should match test data
        expect(data).toEqual(testData)
      );
  
    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpMock.expectOne('http://localhost:3000/verify-auth');
  
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('POST');
  
    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(testData);
  
    // Finally, assert that there are no outstanding requests.
    httpMock.verify();
  });

  it('TEST HTTP, veryfy post password 1, msg', () => {
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

  // j'ai utiliser angular doc pour test http
  it('TEST HTTP, veryfy post auth 2, request', () => {
    const testData: Data = { username: 'username', newPassword: 'newPassword' };
  
    // Make an HTTP GET request
    httpClient.post<Data>('http://localhost:3000/change-password', testData)
      .subscribe(data =>
        // When observable resolves, result should match test data
        expect(data).toEqual(testData)
      );
  
    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpMock.expectOne('http://localhost:3000/change-password');
  
    // Assert that the request is a GET.
    expect(req.request.method).toEqual('POST');
  
    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(testData);
  
    // Finally, assert that there are no outstanding requests.
    httpMock.verify();
  });






});
