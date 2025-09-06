import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonChip,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  optionsOutline,
  homeOutline,
  businessOutline,
  keyOutline,
  trendingDownOutline,
  home,
  mailOutline,
  bookmarkOutline,
  personOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonChip,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
  ],
})
export class HomePage {
  categories = [
    { name: 'Real Estate', active: true },
    { name: 'Apartment', active: false },
    { name: 'Houses', active: false },
    { name: 'Villas', active: false }
  ];

  properties = [
    {
      id: 1,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwuVj2I1RK7GLvbNFqfiZLwn3JgQkutBBYLA&s',
      price: '$440,000',
      address: '123 Main St, Suite, OK 74135',
      type: 'house'
    },
    {
      id: 2,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ke6oA12UZpC4E8wvkrLmbgRidViONeHDRw&s',
      price: '$420,000',
      address: '456 Oak Ave',
      type: 'house'
    }
  ];

  quickActions = [
    { title: 'New Listings', icon: 'home-outline', color: 'primary' },
    { title: 'New Project', icon: 'business-outline', color: 'secondary' },
    { title: 'Open House', icon: 'key-outline', color: 'tertiary' },
    { title: 'Price Reduced', icon: 'trending-down-outline', color: 'success' }
  ];

  constructor() {
      addIcons({optionsOutline});}

  onCategorySelect(category: any) {
    this.categories.forEach(cat => cat.active = false);
    category.active = true;
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    console.log('Searching for:', query);
  }
}