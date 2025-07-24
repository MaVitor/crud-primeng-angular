import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-debug-auth",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="position: fixed; top: 10px; right: 10px; background: yellow; padding: 10px; z-index: 9999; border: 2px solid red;">
      <h4>DEBUG AUTH</h4>
      <p>Is Authenticated: {{ authService.isAuthenticated() }}</p>
      <p>Current User: {{ (authService.currentUser | async)?.username || 'null' }}</p>
      <p>Token exists: {{ !!authService.getToken() }}</p>
    </div>
  `,
})
export class DebugAuthComponent {
  constructor(public authService: AuthService) {}
}
