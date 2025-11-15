import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormsModule } from '@angular/forms'; 
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], 
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  userForm: FormGroup;
  popup = false;
  editMode = false;
  confirmPopup = false;
  confirmDeletePopup = false;
  userId: string = '';
  active = true;

  searchTerm: string = '';
  searchRole: string = '';

  roles = [
    { name: 'Admin', key: 'admin' },
    { name: 'Agent', key: 'agent' },
    { name: 'Quality Assurance', key: 'qa' },
    { name: 'Teamleader', key: 'teamleader' },
    { name: 'Accountant', key: 'accountant' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.userForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      roles: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  // 📋 Get users
  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data.users;
        this.filteredUsers = [...this.users];
      },
      error: () => {
        this.toastr.error('Failed to load users', 'Error');
      },
    });
  }

  // 🔍 Search Functionality
  filterUsers() {
    this.filteredUsers = this.users.filter((user) => {
      const matchesName = user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole =
        this.searchRole === '' || user.roles[0].toLowerCase() === this.searchRole.toLowerCase();
      return matchesName && matchesRole;
    });
  }

  // ➕ Create user
  addUser() {
    const newUser = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      roles: [this.userForm.value.roles],
    };

    this.userService.createUser(newUser).subscribe({
      next: () => {
        this.toastr.success('User created successfully', 'Success');
        this.popup = false;
        this.getAllUsers();
      },
      error: () => {
        this.toastr.error('Failed to create user', 'Error');
      },
    });
  }

  // ✏️ Update user
  updateUser() {
    const updateUser = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
    };

    this.userService.updateUser(this.userId, updateUser).subscribe({
      next: () => {
        this.toastr.success('User updated successfully', 'Success');
        this.popup = false;
        this.getAllUsers();
      },
      error: () => {
        this.toastr.error('Failed to update user', 'Error');
      },
    });
  }

  // 🚫 Enable / Disable user
  enableOrDisableUser() {
    this.userService.toggleUserStatus(this.userId, !this.active).subscribe({
      next: () => {
        const message = this.active ? 'User disabled' : 'User enabled';
        this.toastr.success(message, 'Success');
        this.confirmPopup = false;

        // ✅ Update immediately in UI
        const updatedUser = this.users.find((u) => u._id === this.userId);
        if (updatedUser) updatedUser.active = !this.active;

        this.filterUsers();
      },
      error: () => {
        this.toastr.error('Action failed', 'Error');
      },
    });
  }

  // 🗑️ Delete user
  deleteUser() {
    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
        this.toastr.success('User deleted successfully', 'Success');
        this.confirmDeletePopup = false;
        this.getAllUsers();
      },
      error: () => {
        this.toastr.error('Failed to delete user', 'Error');
      },
    });
  }

  // 🧱 Modal controls
  createUser() {
    this.popup = true;
    this.editMode = false;
    this.userForm.reset();
  }

  buildForm(user: any) {
    this.editMode = true;
    this.popup = true;
    this.userId = user._id;
    this.active = user.active;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      roles: user.roles[0],
    });
  }
}




