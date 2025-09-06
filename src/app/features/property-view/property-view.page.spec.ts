import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyViewPage } from './property-view.page';

describe('PropertyViewPage', () => {
  let component: PropertyViewPage;
  let fixture: ComponentFixture<PropertyViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
