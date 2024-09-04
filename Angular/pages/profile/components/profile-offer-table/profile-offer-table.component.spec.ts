import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOfferTableComponent } from './profile-offer-table.component';

describe('ProfileTableComponent', () => {
  let component: ProfileOfferTableComponent;
  let fixture: ComponentFixture<ProfileOfferTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileOfferTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileOfferTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
