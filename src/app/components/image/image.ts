import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'image',
  templateUrl: 'image.html',
})
export class ImageComponent {
  @Input() src: string;
  public defaultImage;
  public resourceUrl;
  constructor() {
    if (
      environment.hasOwnProperty('DEFAULT_IMAGE') &&
      environment.DEFAULT_IMAGE.trim() !== ''
    ) {
      this.defaultImage = environment.DEFAULT_IMAGE;
    }
    if (
      environment.hasOwnProperty('RESOURCE_URL') &&
      environment.RESOURCE_URL.trim() !== ''
    ) {
      this.resourceUrl = environment.RESOURCE_URL;
    }
  }

  getDefaultImage(event) {
    event.target.src = this.defaultImage;
  }
}
