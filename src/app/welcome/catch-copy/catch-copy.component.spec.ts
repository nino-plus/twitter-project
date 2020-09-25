import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchCopyComponent } from './catch-copy.component';

describe('CatchCopyComponent', () => {
  let component: CatchCopyComponent;
  let fixture: ComponentFixture<CatchCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatchCopyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
