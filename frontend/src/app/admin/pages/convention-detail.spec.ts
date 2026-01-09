import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConventionDetail } from './convention-detail';

describe('ConventionDetail', () => {
  let component: ConventionDetail;
  let fixture: ComponentFixture<ConventionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConventionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConventionDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
