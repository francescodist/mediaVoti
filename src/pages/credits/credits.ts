import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';



@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html'
})
export class CreditsPage {

    constructor(public navCtrl: NavController) {









    }

    goToDonation() {
      window.open("https://paypal.me/FrancescoDiStefano");
    }

    goToRepo() {
      window.open("https://github.com/francescodist/mediaVoti");
    }

}
