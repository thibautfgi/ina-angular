import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { By } from '@angular/platform-browser';

describe('FooterComponent Test Unitaire', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: []
    }).compileComponents();
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('TEST INITIAL si FooterComponent est crée', () => {
    expect(component).toBeTruthy();
  });

  it("TEST VISUEL si footerContainer est visible", () => {

    const footerContainer = fixture.nativeElement.querySelector('.footerContainer');
    expect(footerContainer).not.toBeNull();

  });


  it("TEST VISUEL si iconContainer est visible", () => {

    const iconContainer = fixture.nativeElement.querySelector('.iconContainer');
    expect(iconContainer).not.toBeNull();

  });

  it('TEST LINK mdp security si les liens s\'ouvrent bien', () => {
    // Query the first link
    const standardLink = fixture.debugElement.query(By.css('.footerLink[href="http://ssi.ina.fr/standard-et-bonnes-pratiques/"]'));
    expect(standardLink).not.toBeNull();
    expect(standardLink.nativeElement.getAttribute('href')).toBe('http://ssi.ina.fr/standard-et-bonnes-pratiques/');

  });

  it('TEST LINK MAIL si les liens s\'ouvrent bien', () => {

    const mailtoLink = fixture.debugElement.query(By.css('.footerLink[href="mailto:3333@ina.fr"]'));
    expect(mailtoLink).not.toBeNull();
    expect(mailtoLink.nativeElement.getAttribute('href')).toBe('mailto:3333@ina.fr');
  });

});
