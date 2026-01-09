import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectDetail } from './prospect-detail';

describe('ProspectDetail', () => {
  let component: ProspectDetail;
  let fixture: ComponentFixture<ProspectDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProspectDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProspectDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
