import { Injectable } from '@angular/core';
import { VendorRegistrationService } from './vendor-registration.service';

@Injectable({
  providedIn: 'root'
})
export class VendorListService {

  constructor(private svc: VendorRegistrationService) {}

  getVendors() {
    return this.svc.getAllVendors();
  }
}
