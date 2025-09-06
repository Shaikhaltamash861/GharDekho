
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ActionSheetController, AlertController,IonicModule } from '@ionic/angular';
import { IonInput, IonButton, IonIcon, IonSpinner, IonContent, IonChip, IonLabel } from '@ionic/angular/standalone';
interface Address {
  buildingName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

interface PropertyImage {
  url: string;
}

interface Property {
  title: string;
  description: string;
  propertyType: string;
  bhkType: string;
  rent: number;
  deposit: number;
  furnishing: string;
  availableFrom: string;
  address: Address;
  amenities: string[];
  images: PropertyImage[];
  contactPreference: string;
}

@Component({
  selector: 'app-property-view',
  templateUrl: './property-view.page.html',
  styleUrls: ['./property-view.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonChip, IonLabel]
})
export class PropertyViewPage implements OnInit {
 property: Property = {
    title: "2BHK Flat in Andheri",
    description: "Spacious flat with parking and all modern amenities. Perfect for small families or working professionals.",
    propertyType: "Flat",
    bhkType: "2BHK",
    rent: 25000,
    deposit: 75000,
    furnishing: "Semi-Furnished",
    availableFrom: "2025-09-01",
    address: {
      buildingName: "Sai Residency",
      street: "Link Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400053",
      landmark: "Near Metro Station"
    },
    amenities: ["Parking", "Lift", "Water Supply", "Security", "Power Backup", "Garden"],
    images: [
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1560185009-5bf9f2849488?w=800&q=80" }
    ],
    contactPreference: "Phone"
  };

  currentImageIndex = 0;
  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // In real app, fetch property data based on route params
    const propertyId = this.route.snapshot.paramMap.get('id');
    // this.loadPropertyData(propertyId);
  }

  goBack() {
    this.navCtrl.back();
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.property.images.length;
  }

  previousImage() {
    this.currentImageIndex = this.currentImageIndex === 0 
      ? this.property.images.length - 1 
      : this.currentImageIndex - 1;
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  async shareProperty() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share Property',
      buttons: [
        {
          text: 'WhatsApp',
          icon: 'logo-whatsapp',
          handler: () => {
            this.shareViaWhatsApp();
          }
        },
        {
          text: 'Copy Link',
          icon: 'copy-outline',
          handler: () => {
            this.copyLink();
          }
        },
        {
          text: 'More Options',
          icon: 'share-outline',
          handler: () => {
            this.shareNative();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  shareViaWhatsApp() {
    const text = `Check out this property: ${this.property.title} - ₹${this.property.rent.toLocaleString('en-IN')}/month`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.showToast('Link copied to clipboard');
    } catch (err) {
      console.error('Could not copy link', err);
    }
  }

  shareNative() {
    if (navigator.share) {
      navigator.share({
        title: this.property.title,
        text: `Check out this property: ${this.property.title}`,
        url: window.location.href
      });
    }
  }

  async showToast(message: string) {
    const alert = await this.alertCtrl.create({
      message,
    });
    await alert.present();
  }

  async contactOwner() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Contact Owner',
      buttons: [
        {
          text: 'Call Now',
          icon: 'call-outline',
          handler: () => {
            window.open('tel:+919876543210', '_system');
          }
        },
        {
          text: 'WhatsApp',
          icon: 'logo-whatsapp',
          handler: () => {
            const message = `Hi, I'm interested in your property: ${this.property.title}`;
            window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
          }
        },
        {
          text: 'Send Message',
          icon: 'chatbubble-outline',
          handler: () => {
            this.sendMessage();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async sendMessage() {
    const alert = await this.alertCtrl.create({
      header: 'Send Message',
      inputs: [
        {
          name: 'message',
          type: 'textarea',
          placeholder: 'Type your message here...',
          value: `Hi, I'm interested in your property: ${this.property.title}. Can we schedule a visit?`
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send',
          handler: (data) => {
            console.log('Message sent:', data.message);
            this.showToast('Message sent successfully!');
          }
        }
      ]
    });
    await alert.present();
  }

  scheduleVisit() {
    // Navigate to visit scheduling page or show modal
    console.log('Schedule visit clicked');
    this.showToast('Visit scheduling feature coming soon!');
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  getFullAddress(): string {
    const addr = this.property.address;
    return `${addr.buildingName}, ${addr.street}, ${addr.city}, ${addr.state} ${addr.pincode}`;
  }
}