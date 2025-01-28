import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCollectionComponent } from './video-collection.component';

describe('VideoCollectionComponent', () => {
  let component: VideoCollectionComponent;
  let fixture: ComponentFixture<VideoCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
