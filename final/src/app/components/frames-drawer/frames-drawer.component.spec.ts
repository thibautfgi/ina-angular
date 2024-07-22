import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FramesDrawerComponent } from './frames-drawer.component';

describe('FramesDrawerComponent', () => {
  let component: FramesDrawerComponent;
  let fixture: ComponentFixture<FramesDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FramesDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FramesDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
