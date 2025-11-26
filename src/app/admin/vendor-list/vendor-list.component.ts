import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VendorSearchWidgetComponent } from '../vendor-search-widget/vendor-search-widget.component';
import { VendorlistwidgetComponent } from '../vendorlistwidget/vendorlistwidget.component';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css'],
  imports: [
    CommonModule,
    VendorSearchWidgetComponent,
    VendorlistwidgetComponent
  ]
})
export class VendorListComponent {

  constructor(private router: Router) {}

  navigateToVendorRegistration() {
    this.router.navigate(['/admin/vendors/create']);
  }

  // Search from search widget

filters: any = null;

handleSearch(filters: any) {
  this.filters = filters;
}

  // Clear filters
  handleClear() {
    console.log('Filters cleared');
  }
  goBack() {
  this.router.navigateByUrl('/admin', { skipLocationChange: true }).then(() => {
    this.router.navigate(['/admin/vendors']);
  });
}

 
}






