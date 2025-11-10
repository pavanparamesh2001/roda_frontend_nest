



import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css'],
})
export class StateComponent implements OnInit {
  // ===== Data Arrays =====
  Math = Math;
  states: any[] = [];
  districts: any[] = [];

  // ===== Forms =====
  stateForm!: FormGroup;
  districtForm!: FormGroup;

  // ===== UI Modals & States =====
  popup = false;
  popup2 = false;
  confirmPopup = false;
  editStateFlag = false;
  editDistrictFlag = false;

  stateId: string = '';
  stateName: string = '';

  // ===== Pagination =====
  statePage = 1;
  districtPage = 1;
  itemsPerPage = 5;

  // ===== Search =====
  stateSearch = '';
  districtSearch = '';

  constructor(private fb: FormBuilder, private stateService: StateService) {}

  ngOnInit(): void {
    this.stateForm = this.fb.group({
      name: ['', Validators.required],
      country: ['India', Validators.required],
    });

    this.districtForm = this.fb.group({
      name: ['', Validators.required],
      state: ['', Validators.required],
    });

    this.getStates();
  }

  // ===== STATE CRUD =====
  getStates() {
    this.stateService.getAllStates().subscribe((res: any) => {
      this.states = Array.isArray(res) ? res : res.data || [];
    });
  }

  createState() {
    this.popup = true;
    this.editStateFlag = false;
    this.stateForm.reset({ country: 'India' });
  }

  addState() {
    this.stateService.createState(this.stateForm.value).subscribe(() => {
      this.getStates();
      this.popup = false;
    });
  }

  editState(state: any) {
    this.popup = true;
    this.editStateFlag = true;
    this.stateId = state._id;
    this.stateForm.patchValue(state);
  }

  updateState() {
    this.stateService
      .updateState(this.stateId, this.stateForm.value)
      .subscribe(() => {
        this.getStates();
        this.popup = false;
        this.editStateFlag = false;
      });
  }

  deleteState(id: string) {
    this.stateService.deleteState(id).subscribe(() => {
      this.getStates();
      this.confirmPopup = false;
    });
  }

  // ===== DISTRICT CRUD =====
  getDistricts(stateId: string) {
    this.stateId = stateId;
    this.stateService.getDistrictsByState(stateId).subscribe((res: any) => {
      this.districts = Array.isArray(res) ? res : res.data || [];
      this.districtPage = 1;
    });
  }

  addDistrict(state: any) {
    this.popup2 = true;
    this.editDistrictFlag = false;
    this.districtForm.reset({
      state: state.name,
    });
    this.stateId = state._id;
  }

  saveDistrict() {
    const formData = {
      name: this.districtForm.value.name,
      state: this.stateId,
    };

    this.stateService.createDistrict(formData).subscribe(() => {
      this.popup2 = false;
      this.getDistricts(this.stateId);
    });
  }

  editDistrict(item: any) {
    this.popup2 = true;
    this.editDistrictFlag = true;
    this.districtForm.patchValue({
      name: item.name,
      state: item.state.name,
    });
    this.stateId = item.state._id;
  }

  updateDistrict() {
    const updatedData = {
      name: this.districtForm.value.name,
      state: this.stateId,
    };

    const districtToUpdate = this.districts.find(
      (d) => d.name === this.districtForm.value.name
    );

    if (districtToUpdate?._id) {
      this.stateService
        .updateDistrict(districtToUpdate._id, updatedData)
        .subscribe(() => {
          this.popup2 = false;
          this.editDistrictFlag = false;
          this.getDistricts(this.stateId);
        });
    }
  }

  deleteDistrict(id: string) {
    if (confirm('Are you sure you want to delete this district?')) {
      this.stateService.deleteDistrict(id).subscribe(() => {
        this.getDistricts(this.stateId);
      });
    }
  }

  // ===== Pagination Getters =====
  get filteredStates() {
    return this.states.filter((s) =>
      s.name.toLowerCase().includes(this.stateSearch.toLowerCase())
    );
  }

  get paginatedStates() {
    const start = (this.statePage - 1) * this.itemsPerPage;
    return this.filteredStates.slice(start, start + this.itemsPerPage);
  }

  get filteredDistricts() {
    return this.districts.filter((d) =>
      d.name.toLowerCase().includes(this.districtSearch.toLowerCase())
    );
  }

  get paginatedDistricts() {
    const start = (this.districtPage - 1) * this.itemsPerPage;
    return this.filteredDistricts.slice(start, start + this.itemsPerPage);
  }

  // ===== Pagination Controls =====
  nextStatePage() {
    if (this.statePage * this.itemsPerPage < this.filteredStates.length)
      this.statePage++;
  }

  prevStatePage() {
    if (this.statePage > 1) this.statePage--;
  }

  nextDistrictPage() {
    if (this.districtPage * this.itemsPerPage < this.filteredDistricts.length)
      this.districtPage++;
  }

  prevDistrictPage() {
    if (this.districtPage > 1) this.districtPage--;
  }
}
