import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';

@Component({
  selector: 'app-landing-page',
  imports: [RouterModule, Header, Footer],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {

}
