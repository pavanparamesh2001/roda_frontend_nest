import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms'; // ✅ Import this separately
import { IssueService } from '../../services/issue.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, // ✅ Add this here to fix ngModel error
    HttpClientModule,
  ],
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css'],
})
export class IssuesComponent implements OnInit {
  issues: any[] = [];
  issueForm!: FormGroup;

  // ✅ UI States
  showFormModal = false;
  showPreviewModal = false;
  confirmDelete = false;
  selectedIssue: any = null;
  selectedImage: File | null = null;
  previewImageUrl = '';
  issueIdToDelete = '';

  // ✅ Pagination & Search
  currentPage = 1;
  totalPages = 1;
  limit = 5;
  searchQuery = '';

  // ✅ Notifications
  toastr = false;
  alertMessage = '';

  constructor(private fb: FormBuilder, private issueService: IssueService) {}

  ngOnInit(): void {
    this.issueForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.loadIssues();
  }

  /** ✅ Load Issues with Pagination */
loadIssues() {
  this.issueService
    .getAllIssues(this.currentPage, this.limit, this.searchQuery)
    .subscribe({
      next: (res: any) => {
        const data = res?.data?.issues || [];
        this.issues = Array.isArray(data) ? data : [];
        this.totalPages = Math.ceil((res?.total || this.issues.length) / this.limit);
      },
      error: (err) => console.error('Error loading issues:', err),
    });
}
  /** ✅ Search issues */
  onSearchChange() {
    this.currentPage = 1;
    this.loadIssues();
  }

  /** ✅ Pagination Controls */
  goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.loadIssues();
  }
}


  /** ✅ Open Add/Edit Modal */
  openModal(issue?: any) {
    this.showFormModal = true;
    if (issue) {
      this.selectedIssue = issue;
      this.issueForm.patchValue({
        name: issue.name,
        description: issue.description,
      });
    } else {
      this.selectedIssue = null;
      this.issueForm.reset();
    }
  }

  /** ✅ Image Selection */
  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  /** ✅ Add or Update Issue */
  saveIssue() {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }

    const formData = this.issueForm.value;
    if (this.selectedIssue) {
      this.issueService
        .updateIssue(this.selectedIssue._id, formData, this.selectedImage!)
        .subscribe({
          next: () => {
            this.showToastr('Issue updated successfully!');
            this.closeModal();
            this.loadIssues();
          },
          error: () => this.showToastr('Error updating issue!'),
        });
    } else {
      this.issueService.createIssue(formData, this.selectedImage!).subscribe({
        next: () => {
          this.showToastr('Issue added successfully!');
          this.closeModal();
          this.loadIssues();
        },
        error: () => this.showToastr('Error creating issue!'),
      });
    }
  }

  /** ✅ Preview Image Modal */
  previewImage(url: string) {
    this.previewImageUrl = 'http://localhost:3000' + url;
    this.showPreviewModal = true;
  }

  /** ✅ Delete Confirmation */
  confirmDeleteIssue(id: string) {
    this.confirmDelete = true;
    this.issueIdToDelete = id;
  }

  deleteIssue() {
    this.issueService.deleteIssue(this.issueIdToDelete).subscribe({
      next: () => {
        this.showToastr('Issue deleted successfully!');
        this.confirmDelete = false;
        this.loadIssues();
      },
      error: () => this.showToastr('Error deleting issue!'),
    });
  }

  closeModal() {
    this.showFormModal = false;
    this.issueForm.reset();
    this.selectedImage = null;
  }

  showToastr(message: string) {
    this.alertMessage = message;
    this.toastr = true;
    setTimeout(() => (this.toastr = false), 3000);
  }
}

