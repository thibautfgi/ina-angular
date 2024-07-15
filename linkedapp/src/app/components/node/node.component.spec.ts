import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NodeComponent } from './node.component';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

describe('NodeComponent Test Unitaire', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, NodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;
  });

  it('TEST INITIAL si NodeComponent est crée', () => {
    expect(component).toBeTruthy();
  });

  it('TEST VISUEL display le correct txt', () => {
    component.text = 'test hehehe';
    fixture.detectChanges();

    const textElement = fixture.debugElement.query(By.css('.textnode')).nativeElement;
    expect(textElement.textContent).toContain('test hehehe');
  });

  it('TEST VISUEL display le font awesome', () => {
    component.text = 'test hehehe';
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('.fa-circle')).nativeElement;
    expect(iconElement).toBeTruthy();
  });

  it('TEST VISUEL display un icon bleu si true', () => {
    component.isTrue = true;
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('fa-icon')).nativeElement;
    const color = getComputedStyle(iconElement).color;
    expect(color).toBe('rgb(0, 171, 202)'); 
  });

  it('TEST VISUEL display un icon rouge si false', () => {
    component.isTrue = false;
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('fa-icon')).nativeElement;
    const color = getComputedStyle(iconElement).color;
    expect(color).toBe('rgb(255, 0, 0)'); 
  });
});
