import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prospects } from './prospects';

describe('Prospects', () => {
  let component: Prospects;
  let fixture: ComponentFixture<Prospects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prospects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prospects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
