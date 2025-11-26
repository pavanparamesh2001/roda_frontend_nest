// src/app/vendor-registration/vendor-registration.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { VendorRegistrationService } from '../../services/vendor-registration.service';


import { CommonModule } from '@angular/common';
import { CreateVendorLocationDto } from '../../models/vendor-location.model';

@Component({
  selector: 'app-vendor-registration',
  standalone: true,
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class VendorRegistrationComponent implements OnInit {
  vendorRegisterForm!: FormGroup;
  switchType: 'details' | 'services' | 'accounts' = 'details';
  vendorId: string | null = null;
  editMode = false;

  states: any[] = [];
  districts: Array<{ id: string; name: string }> = [];
 vendorTypes = ['2W', '4W', 'Both'];

  existingVendorCode = false;
  existingVendorEmail = false;
  existingPrimaryContactNo = false;

  maxDate = new Date().toISOString().slice(0, 10);

  // Location modal & form
  locationModal = false;
  locationForm!: FormGroup;

  // GPS related
  gpsInput: string = '';
  latitude: string = '';
  longitude: string = '';
  gpsCoordinates: { lat: number; lng: number } | null = null;

  

  constructor(
    private fb: FormBuilder,
    private svc: VendorRegistrationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.buildForm();
    this.buildLocationForm();
    this.loadInitialData();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.vendorId = id;
      this.loadVendorData(id);
    }

    // debounce checks
    this.vendorCode.valueChanges.pipe(debounceTime(400)).subscribe(val => {
      if (val) this.validateVendorCode(val);
    });
    this.email.valueChanges.pipe(debounceTime(400)).subscribe(val => {
      if (val) this.validateVendorEmail(val);
    });
    this.mobile1.valueChanges.pipe(debounceTime(400)).subscribe(val => {
      if (val) this.validatePrimaryContactNo(val);
    });
  }

  buildForm() {
    this.vendorRegisterForm = this.fb.group({
      vendorCode: ['', [Validators.required]],
      name: [''],
      email: ['', [Validators.email]],
      contactPerson: ['', Validators.required],
      DOB: [''],
      mobile1: ['', Validators.required],
      mobile2: [''],
      whatsappNo: [''],
      state: [null, Validators.required],
      district: [null, Validators.required],
      location: ['', Validators.required],
      pincode: [''],
      address: [''],
      agentName: ['', Validators.required],
      remarks: [''],
      gst: [false],
      gstNo: [''],
      gstPercentage: [''],
      legalName: [''],
      vendorType: [null],

      // accounts
      accountNo: [''],
      holderName: [''],
      bank: [''],
      branch: [''],
      ifsc: [''],
      panNo: [''],
      gpayNo: ['']
    });

    this.vendorRegisterForm.get('gst')?.valueChanges.subscribe(val => {
      if (val) {
        this.vendorRegisterForm.get('gstNo')?.setValidators([Validators.required]);
        this.vendorRegisterForm.get('gstPercentage')?.setValidators([Validators.required]);
        this.vendorRegisterForm.get('legalName')?.setValidators([Validators.required]);
      } else {
        this.vendorRegisterForm.get('gstNo')?.clearValidators();
        this.vendorRegisterForm.get('gstPercentage')?.clearValidators();
        this.vendorRegisterForm.get('legalName')?.clearValidators();
      }
      this.vendorRegisterForm.get('gstNo')?.updateValueAndValidity();
      this.vendorRegisterForm.get('gstPercentage')?.updateValueAndValidity();
      this.vendorRegisterForm.get('legalName')?.updateValueAndValidity();
    });
  }

  buildLocationForm() {
    this.locationForm = this.fb.group({
      branchName: [''],
      contactNo: [''],
      alternateNo: [''],
      workHours: [''],
      branchState: [''],
      branchDistrict: [''],
      branchLocation: [''],
      address: [''],
      services: [[]],
      description: [''], // kept optional for future
      currentLocation: [false],
        gpsPaste: ['']
    });
  }

  // convenience getters
  get vendorCode(): AbstractControl { return this.vendorRegisterForm.get('vendorCode')!; }
  get email(): AbstractControl { return this.vendorRegisterForm.get('email')!; }
  get mobile1(): AbstractControl { return this.vendorRegisterForm.get('mobile1')!; }
  get state(): AbstractControl { return this.vendorRegisterForm.get('state')!; }
  get district(): AbstractControl { return this.vendorRegisterForm.get('district')!; }
loadInitialData() {
  this.svc.getStates().subscribe((res: any) => {
    this.states = (res?.data?.states || res).map((s: any) => ({
      id: s._id,
      name: s.name
    }));
  });
}


 onChangestate(event: any) {
  const stateId = event.target.value;
  this.districts = [];

  if (!stateId) return;

  this.svc.getDistrictsByState(stateId).subscribe((res: any) => {
    const payload = res?.data?.districts || res?.districts || res;

    this.districts = payload.map((d: any) => ({
      id: d._id,
      name: d.name
    }));

    // If editing vendor, set district value after list loads
    if (this.editMode && this.vendorRegisterForm.value.district) {
      const vDistrict = this.vendorRegisterForm.value.district;
      const match = this.districts.find(d => d.name === vDistrict);
      if (match) {
        this.vendorRegisterForm.patchValue({ district: match.id });
      }
    }
  });
}


  validateVendorCode(value: string) {
    if (!value) return;
    this.svc.searchVendor({ vendorCode: value }).subscribe((res: any) => {
      const found = (res?.data || res || []).length > 0;
      this.existingVendorCode = found && (!this.editMode || (this.editMode && !this.isSameVendor(res)));
    }, () => this.existingVendorCode = false);
  }

  validateVendorEmail(value: string) {
    if (!value) return;
    this.svc.searchVendor({ email: value }).subscribe((res: any) => {
      const found = (res?.data || res || []).length > 0;
      this.existingVendorEmail = found && (!this.editMode || (this.editMode && !this.isSameVendor(res)));
    }, () => this.existingVendorEmail = false);
  }

  validatePrimaryContactNo(value: string) {
    if (!value) return;
    this.svc.searchVendor({ contactNo: value }).subscribe((res: any) => {
      const found = (res?.data || res || []).length > 0;
      this.existingPrimaryContactNo = found && (!this.editMode || (this.editMode && !this.isSameVendor(res)));
    }, () => this.existingPrimaryContactNo = false);
  }

  private isSameVendor(res: any): boolean {
    const list = (res?.data || res || []);
    if (!this.vendorId || !list.length) return false;
    return list.some((v: any) => String(v._id || v.id) === String(this.vendorId));
  }

  // -------------------------
  // Save basic vendor details
  // -------------------------
vendorRegister() {
  this.vendorRegisterForm.markAllAsTouched();
  const f = this.vendorRegisterForm.value;

  const selectedState = this.states.find(s => s.id === f.state)?.name || '';
  const selectedDistrict = this.districts.find(d => d.id === f.district)?.name || '';

  const payload: any = {
    vendorCode: f.vendorCode,
    name: f.name,
    email: f.email,
    contactPerson: f.contactPerson,
    DOB: f.DOB,
    contactNo: {
      primary: f.mobile1,
      secondary: f.mobile2,
      whatsappNo: f.whatsappNo
    },
    state: selectedState,
    district: selectedDistrict,
    location: f.location,
    agentName: f.agentName,
    pincode: f.pincode,
    address: f.address,
    remarks: f.remarks,
    gst: f.gst,
    gstNo: f.gstNo,
    gstPercentage: f.gstPercentage,
    legalName: f.legalName
  };

 if (f.vendorType) payload.vendorType = f.vendorType;

if (this.vendorRegisterForm.invalid) return;

this.svc.createVendor(payload).subscribe({
  next: (res) => {
    console.log("Vendor created:", res);
    alert("Vendor details saved successfully!");

    const vendor = res?.data || res;
    this.vendorId = vendor._id || vendor.id;

    this.switchType = "services";
  },
  error: (err) => {
    console.error("Error creating vendor:", err);
    alert("Failed to save vendor.");
  }
});
}



  loadVendorData(id: string) {
  this.svc.getVendor(id).subscribe((res: any) => {
    const v = res?.data || res;

    // First set NAME-based values
    this.vendorRegisterForm.patchValue({
      vendorCode: v.vendorCode,
      name: v.name,
      email: v.email,
      contactPerson: v.contactPerson,
      DOB: v.DOB ? v.DOB.split('T')[0] : '',
      mobile1: v.contactNo?.primary,
      mobile2: v.contactNo?.secondary,
      whatsappNo: v.contactNo?.whatsappNo,
      location: v.location,
      agentName: v.agentName,
      pincode: v.pincode,
      address: v.address,
      remarks: v.remarks,
      gst: v.gst,
      gstNo: v.gstNo,
      gstPercentage: v.gstPercentage,
      legalName: v.legalName,
      vendorType: v.vendorType
    });

    // ⭐ Convert state NAME → ID
    const stateMatch = this.states.find(s => s.name === v.state);
    if (stateMatch) {
      this.vendorRegisterForm.patchValue({ state: stateMatch.id });

      this.svc.getDistrictsByState(stateMatch.id).subscribe((dres: any) => {
        const payload = dres?.data?.districts || dres?.districts || dres;
        this.districts = payload.map((d: any) => ({
          id: d._id,
          name: d.name
        }));

        // ⭐ Convert district NAME → ID
        const distMatch = this.districts.find(d => d.name === v.district);
        if (distMatch) {
          this.vendorRegisterForm.patchValue({ district: distMatch.id });
        }
      });
    }
  });
}

  // -------------------------
  // New: Add Location (modal)
  // -------------------------
  openLocationModal() {
    if (!this.vendorId) {
      alert('Please save vendor details first.');
      return;
    }
    // reset gps and location form relevant fields
    this.gpsInput = '';
    this.latitude = '';
    this.longitude = '';
    this.gpsCoordinates = null;
    this.locationForm.reset();
    this.locationModal = true;
  }

  closeLocationModal() {
    this.locationModal = false;
  }

  // the user explicitly asked: call backend createVendorLocation when saving location
  
saveLocation() {
  if (!this.vendorId) {
    alert('Vendor id missing — create vendor first.');
    return;
  }

  if (!this.gpsCoordinates) {
    alert('Please paste valid GPS coordinates.');
    return;
  }

  const f = this.locationForm.value;

  const dto: CreateVendorLocationDto = {
    vendor: this.vendorId,

    branchName: f.branchName,
    contactNo: f.contactNo,
    alternateNo: f.alternateNo,
    workHours: f.workHours,
    services: f.services || [],

    // ⭐ CORRECT GEOJSON FORMAT (NO CAST ERROR)
    location: {
      type: 'Point',
      coordinates: [this.gpsCoordinates.lng, this.gpsCoordinates.lat],  // [lng, lat]
      address: f.address,
      description: f.description || '',
      branchState: f.branchState,
      branchDistrict: f.branchDistrict,
      branchLocation: f.branchLocation
    },

    // ⭐ CURRENT LIVE LOCATION — SAME FORMAT
    currentLocation: {
      type: 'Point',
      coordinates: [this.gpsCoordinates.lng, this.gpsCoordinates.lat]   // [lng, lat]
    }
  };

  this.svc.createVendorLocation(this.vendorId, dto).subscribe(
    () => {
      alert('Location added successfully!');
      this.locationModal = false;
    },
    err => {
      console.error('Error creating vendor location:', err);
      alert('Failed to add location.');
    }
  );
}





  // -------------------------
  // GPS logic (exactly as provided)
  // -------------------------
  onGpsInputChange() {
    // Use requestAnimationFrame to ensure the input value is updated in the DOM
    requestAnimationFrame(() => {
      this.tryExtractCoordinates(this.gpsInput);
    });
  }

  /** Extract latitude and longitude safely */
  private tryExtractCoordinates(input: string) {
    if (!input || input.trim() === '') return;

    // Remove any extra spaces and split by common separators
    const cleanInput = input.trim();

    // Try to match patterns like "12.943319, 77.612578" or "12.943319 77.612578"
    const patterns = [
      /(-?\d+\.?\d*)[,\s;]+(-?\d+\.?\d*)/, // comma, space, or semicolon separated
      /(-?\d+\.?\d*)/, // single number (will need two matches)
    ];

    for (const pattern of patterns) {
      const matches = cleanInput.match(pattern);
      if (matches && matches.length >= 3) {
        const lat = parseFloat(matches[1]);
        const lng = parseFloat(matches[2]);

        if (!isNaN(lat) && !isNaN(lng)) {
          this.latitude = lat.toString();
          this.longitude = lng.toString();
          return;
        }
      }
    }

    // Fallback: split by comma, space, or semicolon
    const parts = cleanInput
      .split(/[,;\s]+/)
      .map((p) => p.trim())
      .filter((v) => v !== '');

    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        this.latitude = lat.toString();
        this.longitude = lng.toString();
      }
    }
  }

  saveGpsCoordinates() {
    if (!this.latitude || !this.longitude) {
      alert('Please enter valid coordinates.');
      return;
    }

    const lat = parseFloat(this.latitude);
    const lng = parseFloat(this.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid numeric coordinates.');
      return;
    }

    this.gpsCoordinates = { lat, lng };

    alert('GPS Coordinates saved successfully!');
  }
handleGpsPaste() {
  const value = this.locationForm.get('gpsPaste')?.value || '';

  if (!value.trim()) return;

  const match = value.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);

  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);

    if (!isNaN(lat) && !isNaN(lng)) {
      this.latitude = lat.toString();
      this.longitude = lng.toString();

      // Save to gpsCoordinates
      this.gpsCoordinates = { lat, lng };

      // Clear the paste field
      this.locationForm.get('gpsPaste')?.setValue('');
    }
  }
}

  // -------------------------
  // Update accounts & update vendor (retain existing behavior)
  // -------------------------
 

  updateVendor() {
  if (!this.vendorId) return;

  const f = this.vendorRegisterForm.value;

  const payload: any = {
    vendorCode: f.vendorCode,
    name: f.name,
    email: f.email,
    contactPerson: f.contactPerson,
    DOB: f.DOB,
    contactNo: {
      primary: f.mobile1,
      secondary: f.mobile2,
      whatsappNo: f.whatsappNo
    },
    state: f.state,
    district: f.district,
    location: f.location,
    agentName: f.agentName,
    pincode: f.pincode,
    address: f.address,
    remarks: f.remarks,
    gst: f.gst,
    gstNo: f.gstNo,
    gstPercentage: f.gstPercentage,
    legalName: f.legalName,
    bankAccountDetails: {
      accountNo: f.accountNo,
      name: f.holderName,
      bank: f.bank,
      branch: f.branch,
      ifsc: f.ifsc,
      panNo: f.panNo,
      gpayNo: f.gpayNo
    }
  };

  // ⭐ FIX: Add vendorType only if not empty
  if (f.vendorType) {
    payload.vendorType = f.vendorType;
  }

  this.svc.updateVendor(this.vendorId, payload).subscribe(
    () => {
      this.switchType = 'services';
    },
    err => console.error('Error updating vendor:', err)
  );
}

updateAccountsDetails() {

  if (!this.vendorId) return;

  const f = this.vendorRegisterForm.value;

  const accountDetails = {
    accountNo: f.accountNo,
    name: f.holderName,
    bank: f.bank,
    branch: f.branch,
    ifsc: f.ifsc,
    panNo: f.panNo,
    gpayNo: f.gpayNo
  };

  console.log("ACCOUNT DETAILS OBJECT:", accountDetails);

  const payload = { bankAccountDetails: accountDetails };

  this.svc.updateVendor(this.vendorId, payload).subscribe(() => {
    alert("Accounts updated!");
  });
}

}

