import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BodyComponent } from './components/body/body.component';
import { NodeComponent } from './components/node/node.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent Test Unitaire', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        HeaderComponent,
        BodyComponent,
        FooterComponent,
        NodeComponent,
        AppComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('TEST INITIAL app crée', () => {
    expect(component).toBeTruthy();
  });

  it('TEST VISUEL headercomponent apparait', () => {
    const headerElement = fixture.debugElement.query(By.css('app-header'));
    expect(headerElement).not.toBeNull();
  });

  it('TEST VISUEL bodycomponent apparait', () => {
    const bodyElement = fixture.debugElement.query(By.css('app-body'));
    expect(bodyElement).not.toBeNull();
  });

  it('TEST VISUEL footercomponent apparait', () => {
    const footerElement = fixture.debugElement.query(By.css('app-footer'));
    expect(footerElement).not.toBeNull();
  });

  it('TEST VISUEL nodecomponent apparait', () => {
    const nodeElement = fixture.debugElement.query(By.css('app-node'));
    expect(nodeElement).not.toBeNull();
  });
});
