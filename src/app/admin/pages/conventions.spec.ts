import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Conventions } from './conventions';

describe('Conventions', () => {
  let component: Conventions;
  let fixture: ComponentFixture<Conventions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Conventions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Conventions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
