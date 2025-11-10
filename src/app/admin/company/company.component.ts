import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Company, CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company',
  standalone: true,
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CompanyComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  paginatedCompanies: Company[] = [];
  companyForm: FormGroup;

  popup = false;
  confirmPopup = false;
  editMode = false;
  selectedCompanyId: string | null = null;
  toastr = false;
  alertMessage = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  startIndex = 0;
  endIndex = 0;

  // Search
  searchTerm = '';

  constructor(private fb: FormBuilder, private companyService: CompanyService) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe({
      next: (res) => {
        this.companies = res.data.companies;
        this.filteredCompanies = [...this.companies];
        this.updatePagination();
      },
      error: (err) => console.error(err),
    });
  }

  // 🔍 Filter companies by search
  filterCompanies() {
    const search = this.searchTerm.toLowerCase();
    this.filteredCompanies = this.companies.filter((c) =>
      c.name.toLowerCase().includes(search)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // 🧮 Pagination logic
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCompanies.length / this.itemsPerPage);
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.filteredCompanies.length);
    this.paginatedCompanies = this.filteredCompanies.slice(this.startIndex, this.endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // 📋 CRUD
  openModal() {
    this.editMode = false;
    this.popup = true;
    this.companyForm.reset();
  }

  addCompany() {
    if (this.companyForm.valid) {
      this.companyService.addCompany(this.companyForm.value).subscribe({
        next: () => {
          this.showToast('Company added successfully!');
          this.popup = false;
          this.loadCompanies();
        },
        error: (err) => console.error(err),
      });
    }
  }

  editCompany(company: Company) {
    this.editMode = true;
    this.popup = true;
    this.selectedCompanyId = company._id!;
    this.companyForm.patchValue(company);
  }

  updateCompany() {
    if (this.companyForm.valid && this.selectedCompanyId) {
      this.companyService
        .updateCompany(this.selectedCompanyId, this.companyForm.value)
        .subscribe({
          next: () => {
            this.showToast('Company updated successfully!');
            this.popup = false;
            this.loadCompanies();
          },
          error: (err) => console.error(err),
        });
    }
  }

  confirmDelete(id: string) {
    this.selectedCompanyId = id;
    this.confirmPopup = true;
  }

  deleteCompany() {
    if (this.selectedCompanyId) {
      this.companyService.deleteCompany(this.selectedCompanyId).subscribe({
        next: () => {
          this.showToast('Company deleted successfully!');
          this.confirmPopup = false;
          this.loadCompanies();
        },
        error: (err) => console.error(err),
      });
    }
  }

  showToast(message: string) {
    this.alertMessage = message;
    this.toastr = true;
    setTimeout(() => (this.toastr = false), 2500);
  }
}
