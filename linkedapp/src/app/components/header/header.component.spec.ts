import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { BodyComponent } from '../body/body.component';
import { NodeService } from '../../services/nodes.service';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { NodeComponent } from '../node/node.component';

describe('HeaderComponent Test Unitaire', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let nodeService: NodeService;
  let nodeStateSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        FontAwesomeModule,
        HttpClientTestingModule,
      ],
      providers: [
        NodeService,
        AuthService,
        ErrorService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    nodeService = TestBed.inject(NodeService);

    nodeStateSubject = new BehaviorSubject({
      isMinLengthValid: false,
      isLowerCaseValid: false,
      isUpperCaseValid: false,
      isDigitValid: false,
      isSpecialCharValid: false,
    });
    nodeService.nodeState$ = nodeStateSubject.asObservable();
    fixture.detectChanges();
  });

  it('TEST INITIAL si HeaderComponent est crée', () => {
    expect(component).toBeTruthy();
  });

  it('TEST VISUEL si le logo ina apparait', () => {
    const imgElement = fixture.debugElement.query(By.css('.imgLogo'));
    expect(imgElement).not.toBeNull();
    const src = imgElement.nativeElement.getAttribute('src');
    expect(src).toBe('assets/Logo_INA.png');
  });

  it('TEST VISUEL si txtTitleContainer apparait', () => {
    const txtTitleContainer = fixture.nativeElement.querySelector('.txtTitleContainer');
    expect(txtTitleContainer).not.toBeNull();
  });

  it('TEST VISUEL si nodesContainer apparait', () => {
    const nodesContainer = fixture.nativeElement.querySelector('.nodesContainer');
    expect(nodesContainer).not.toBeNull();
  });

  it('TEST VISUEL si les nodes sont bien charger en rouge : false initialement', () => {
    const nodes = fixture.debugElement.queryAll(By.css('app-node'));
    expect(nodes.length).toBe(5);

    nodes.forEach(node => {
      const iconElement = node.query(By.css('fa-icon')).nativeElement;
      expect(iconElement).not.toBeNull();
      const color = getComputedStyle(iconElement).color;
      expect(color).toBe('rgb(255, 0, 0)');
    });
  });


   // TODO: FIX ME 
   it('AAAAAA', () => {
    // node initial en bleu
  
    nodeService.resetNodeState();
    fixture.detectChanges();

    const nodes = fixture.debugElement.queryAll(By.css('app-node'));

  
    expect(nodes.length).toBe(5);
    nodes.forEach(node => {
      const iconElement = node.nativeElement;
      expect(iconElement).not.toBeNull();
      const color = getComputedStyle(iconElement).color;
      expect(color).toBe('rgb(0, 171, 202)'); // Blue color
    });

    //reset manuel (pb avec les fct calls de service node)

    fixture.detectChanges();

    // verify si les booleans on bien placer les nodes en rouges
    nodes.forEach(node => {
      const iconElement = node.nativeElement;
      expect(iconElement).not.toBeNull();
      const color = getComputedStyle(iconElement).color;
      expect(color).toBe('rgb(255, 0, 0))'); // Blue color
    });

  });
  


   // TODO: FIX ME 
   it('TEST FONCTION change de couleur / all false si les nodes sont remise a zero', () => {
    // node initial en bleu
  
    nodeStateSubject.next({
      isMinLengthValid: true,
      isLowerCaseValid: true,
      isUpperCaseValid: true,
      isDigitValid: true,
      isSpecialCharValid: true,
    });
    fixture.detectChanges();

    let nodes = fixture.debugElement.queryAll(By.css('app-node fa-icon'));
  
    expect(nodes.length).toBe(5);
    nodes.forEach(node => {
      const iconElement = node.nativeElement;
      expect(iconElement).not.toBeNull();
      const color = getComputedStyle(iconElement).color;
      expect(color).toBe('rgb(0, 171, 202)'); // Blue color
    });

    //reset manuel (pb avec les fct calls de service node)
    nodeStateSubject.next({
      isMinLengthValid: false,
      isLowerCaseValid: false,
      isUpperCaseValid: false,
      isDigitValid: false,
      isSpecialCharValid: false,
    });
    fixture.detectChanges();

    // verify si les booleans on bien placer les nodes en rouges
    nodes = fixture.debugElement.queryAll(By.css('app-node fa-icon'));
    nodes.forEach(node => {
      const iconElement = node.nativeElement;
      const color = getComputedStyle(iconElement).color;
      expect(color).toBe('rgb(255, 0, 0)'); // Red color
    });
  });
  
  
  
  
  
  
  

  it('TEST FUNCTION si la node "8 caract " deviens bien bleu quand isMinLengthValid : true', () => {
    nodeStateSubject.next({
      isMinLengthValid: true,
      isLowerCaseValid: false,
      isUpperCaseValid: false,
      isDigitValid: false,
      isSpecialCharValid: false,
    });
    fixture.detectChanges();

    const node = fixture.debugElement.query(By.css('app-node:first-child fa-icon')).nativeElement;
    const color = getComputedStyle(node).color;
    expect(color).toBe('rgb(0, 171, 202)');
  });

  it('TEST FUNCTION si la node "1 minuscule " deviens bien bleu quand isLowerCaseValid : true', () => {
    nodeStateSubject.next({
      isMinLengthValid: false,
      isLowerCaseValid: true,
      isUpperCaseValid: false,
      isDigitValid: false,
      isSpecialCharValid: false,
    });
    fixture.detectChanges();

    const node = fixture.debugElement.queryAll(By.css('app-node fa-icon'))[1].nativeElement;
    const color = getComputedStyle(node).color;
    expect(color).toBe('rgb(0, 171, 202)');
  });

  it('TEST FUNCTION si la node "1 MAJ " deviens bien bleu quand isUpperCaseValid : true', () => {
    nodeStateSubject.next({
      isMinLengthValid: false,
      isLowerCaseValid: false,
      isUpperCaseValid: true,
      isDigitValid: false,
      isSpecialCharValid: false,
    });
    fixture.detectChanges();

    const node = fixture.debugElement.queryAll(By.css('app-node fa-icon'))[2].nativeElement;
    const color = getComputedStyle(node).color;
    expect(color).toBe('rgb(0, 171, 202)');
  });

  it('TEST FUNCTION si la node "1 Chiffre " deviens bien bleu quand isDigitValid : true', () => {
    nodeStateSubject.next({
      isMinLengthValid: false,
      isLowerCaseValid: false,
      isUpperCaseValid: false,
      isDigitValid: true,
      isSpecialCharValid: false,
    });
    fixture.detectChanges();

    const node = fixture.debugElement.queryAll(By.css('app-node fa-icon'))[3].nativeElement;
    const color = getComputedStyle(node).color;
    expect(color).toBe('rgb(0, 171, 202)');
  });

  it('TEST FUNCTION si la node "1 caract spécial " deviens bien bleu quand isSpecialCharValid : true', () => {
    nodeStateSubject.next({
      isMinLengthValid: false,
      isLowerCaseValid: false,
      isUpperCaseValid: false,
      isDigitValid: false,
      isSpecialCharValid: true,
    });
    fixture.detectChanges();

    const node = fixture.debugElement.queryAll(By.css('app-node fa-icon'))[4].nativeElement;
    const color = getComputedStyle(node).color;
    expect(color).toBe('rgb(0, 171, 202)');
  });
});
