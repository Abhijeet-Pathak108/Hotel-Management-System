import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftMenu } from './left-menu';

describe('LeftMenu', () => {
  let component: LeftMenu;
  let fixture: ComponentFixture<LeftMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(LeftMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
