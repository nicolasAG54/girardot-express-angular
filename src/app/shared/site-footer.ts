import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTENT } from '../core/site-content';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly site = SITE_CONTENT;
  protected readonly year = new Date().getFullYear();
}
