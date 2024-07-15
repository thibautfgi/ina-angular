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


  //  // TODO: FIX ME 
  //  it('TEST FUNCTION si les nodes sont bien renitialiser en rouge : false lors de resetNodeState()', async () => {
  //   // Arrange: Initially set one node to valid (blue)
  //   nodeStateSubject.next({
  //     isMinLengthValid: true,
  //     isLowerCaseValid: false,
  //     isUpperCaseValid: false,
  //     isDigitValid: false,
  //     isSpecialCharValid: false,
  //   });
  //   fixture.detectChanges();
  
  //   // Ensure initial state
  //   let node = fixture.debugElement.query(By.css('app-node:first-child fa-icon')).nativeElement;
  //   let color = getComputedStyle(node).color;
  //   console.log('Initial Color:', color);
  //   expect(color).toBe('rgb(0, 171, 202)'); // Blue
  
  //   // Act: Call resetNodeState to reset the nodes
  //   nodeService.resetNodeState();
  //   fixture.detectChanges();
  
  //   // Wait for the DOM to update
  //   await fixture.whenStable();
  //   fixture.detectChanges();
  
  //   // Assert: Check if all nodes are reset to red
  //   const nodes = fixture.debugElement.queryAll(By.css('app-node'));
  //   expect(nodes.length).toBe(5);
  
  //   nodes.forEach(nodeDebugEl => {
  //     const nodeComponent = nodeDebugEl.componentInstance as NodeComponent;
  //     expect(nodeComponent.isTrue).toBeFalse(); // Ensure the isTrue property is false
  
  //     const iconElement = nodeDebugEl.query(By.css('fa-icon')).nativeElement;
  //     expect(iconElement).not.toBeNull();
  //     const color = getComputedStyle(iconElement).color;
  //     console.log('Node Color after resetNodeState:', color); // Debugging line
  //     expect(color).toBe('rgb(255, 0, 0)');
  //   });
  // });
  
  
  
  
  
  
  

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
