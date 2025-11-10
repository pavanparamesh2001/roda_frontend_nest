import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CaseService } from '../../services/case.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createcase',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './createcase.component.html',
  styleUrls: ['./createcase.component.css'],
})
export class CreatecaseComponent implements OnInit {
  caseForm!: FormGroup;
  vehicleTypes = ['2W', '3W', '4W'];
  states: any[] = [];
  districts: Array<{ id: string; name: string }> = [];
  companies: any[] = [];
  issues: any[] = [];

  // GPS modal fields
  showGpsModal = false;
  gpsInput = '';
  latitude: string = '';
  longitude: string = '';
  gpsCoordinates: { lat: number; lng: number } | null = null;

  constructor(private fb: FormBuilder, private caseService: CaseService,private router:Router) {}

  ngOnInit(): void {
    this.caseForm = this.fb.group({
      name: ['', Validators.required],
      vehicleRegistrationNo: ['', Validators.required],
      vehicleType: ['', Validators.required],
      odometer: ['', Validators.required],
      mobile: ['', Validators.required],
      whatsappNo: [''],
      state: ['', Validators.required],
      district: ['', Validators.required],
      location: ['', Validators.required],
      incidentDescription: ['', Validators.required],
      locationType: ['', Validators.required],
      company: ['', Validators.required],
      issue: ['', Validators.required],
      referenceNo: [''],
      vehicleModel: [''],
      whatsappCommunication: [false],
    });

    this.loadInitialData();
  }

  loadInitialData() {
    this.caseService.getStates().subscribe(
      (res: any) => (this.states = res?.data?.states || res || []),
      (err) => console.error('Error loading states:', err)
    );

    this.caseService.getCompanies().subscribe(
      (res: any) => (this.companies = res?.data?.companies || res || []),
      (err) => console.error('Error loading companies:', err)
    );

    this.caseService.getIssues().subscribe(
      (res: any) => (this.issues = res?.data?.issues || res || []),
      (err) => console.error('Error loading issues:', err)
    );
  }

  onStateChange(event: any) {
    const stateId = event.target.value;
    this.caseForm.get('district')?.setValue('');
    this.districts = [];
    if (!stateId) return;

    this.caseService.getDistrictsByState(stateId).subscribe(
      (res: any) => {
        let payload = res?.data || res;
        let normalized: Array<{ id: string; name: string }> = [];
        if (Array.isArray(payload)) {
          normalized = payload.map((d: any) => ({
            id: d._id || d.id || d.name,
            name: d.name || String(d),
          }));
        } else if (payload?.districts) {
          normalized = payload.districts.map((d: any) => ({
            id: d._id || d.id || d.name,
            name: d.name || String(d),
          }));
        }
        this.districts = normalized;
      },
      (err) => console.error('Error fetching districts:', err)
    );
  }

  /** ---------------- GPS MODAL METHODS ---------------- **/

  openGpsModal() {
    this.showGpsModal = true;
    this.gpsInput = '';
    this.latitude = '';
    this.longitude = '';
  }

  closeGpsModal() {
    this.showGpsModal = false;
  }

  /**
   * Works for both typing and pasting.
   * Handles input and paste events properly.
   */
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

    this.closeGpsModal();
    alert('GPS Coordinates saved successfully!');
  }

  /** ---------------- FORM SUBMIT ---------------- **/
  onSubmit() {
  if (this.caseForm.invalid) {
    this.caseForm.markAllAsTouched();
    return;
  }

  const f = this.caseForm.value;

  // Extract readable names for State and District
  const selectedState = this.states.find((s) => String(s._id) === String(f.state));
  const stateName = selectedState ? selectedState.name : f.state;

  const selectedDistrict = this.districts.find((d) => String(d.id) === String(f.district));
  const districtName = selectedDistrict ? selectedDistrict.name : f.district;

  // ✅ Prepare the payload for backend
  const payload: any = {
    primaryContactNumber: String(f.mobile),
    secondaryContactNumber: f.whatsappNo ? String(f.whatsappNo) : undefined,
    vehicleDetails: {
      registrationNo: f.vehicleRegistrationNo,
      odometerReading: Number(f.odometer),
      vehicleType: f.vehicleType,
      model: f.vehicleModel,
    },
    customerName: f.name,
    incidentDescription: f.incidentDescription,
    reference_no: f.referenceNo,
    state: stateName,
    district: districtName,
    company: f.company,
    issue: f.issue,
    locationType: f.locationType,
    whatsappCommunication: !!f.whatsappCommunication,
    location: [
      {
        type: 'Point',
        coordinates: this.gpsCoordinates
          ? { lat: this.gpsCoordinates.lat, lng: this.gpsCoordinates.lng }
          : { lat: 0, lng: 0 },
        address: f.location,
        description: f.incidentDescription?.slice(0, 120) || '',
        gmapLink: this.gpsCoordinates
          ? `https://www.google.com/maps?q=${this.gpsCoordinates.lat},${this.gpsCoordinates.lng}`
          : '',
      },
    ],
  };

  // ✅ Create case and handle response
  this.caseService.createCase(payload).subscribe(
    (res: any) => {
      // The backend response structure: { status: 'success', data: createdCase }
      const createdCase = res?.data;

      alert('Case Registered Successfully!');

      // Reset the form after success
      this.caseForm.reset();
      this.districts = [];
      this.gpsCoordinates = null;

      // ✅ Navigate to case dashboard page using the returned _id
      if (createdCase && createdCase._id) {
        this.router.navigate(['/agent/case-dashboard', createdCase._id]);
      } else {
        console.warn('Created case did not return a valid _id.');
      }
    },
    (err) => {
      console.error('Error registering case:', err);
      alert('Error registering case — check console for details.');
    }
  );
}

}