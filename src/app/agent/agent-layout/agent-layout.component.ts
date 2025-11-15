import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgentSidebarComponent } from '../agent-sidebar/agent-sidebar.component';

@Component({
  selector: 'app-agent-layout',
  standalone: true,
  imports: [RouterModule, AgentSidebarComponent],
  templateUrl: './agent-layout.component.html',
  styleUrls: ['./agent-layout.component.css']
})
export class AgentLayoutComponent {}

