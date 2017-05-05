import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { AlertController } from 'ionic-angular';

import { CreditsPage } from '../credits/credits';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
    votoLaureaMassimo: number = 110;
    cfuMassimi = 180;
    lodeVotoFinale: boolean = false;
    aggiungiAVotoFinale = 0;
    massimoLodiFinale = 0;
    lodeVotoEsame: boolean = false;
    aggiungiAVotoEsame = 0;
    massimoLodiEsame = 0;
    eliminazioneVotoBasso = false;
    esamiVotoBasso = 0;
    eliminazioneVotoAlto = false;
    esamiVotoAlto = 0;
    sceltaEsameManuale: boolean = true;
    esami = [];
    materie = [];
    primaVolta: boolean = true;

    constructor(public navCtrl: NavController, public params: NavParams, public storage : Storage, public alertCtrl: AlertController) {

        this.storage.get("cfuMassimi").then((val) => {
            this.cfuMassimi = val ? val : 180;
        });
        this.storage.get("lodeVotoFinale").then((val) => {
            this.lodeVotoFinale = val;
        });
        this.storage.get("aggiungiAVotoFinale").then((val) => {
            this.aggiungiAVotoFinale = val;
        });
        this.storage.get("massimoLodiFinale").then((val) => {
            this.massimoLodiFinale = val;
        });
        this.storage.get("lodeVotoEsame").then((val) => {
            this.lodeVotoEsame = val;
        });
        this.storage.get("aggiungiAVotoEsame").then((val) => {
            this.aggiungiAVotoEsame = val;
        });
        this.storage.get("massimoLodiEsame").then((val) => {
            this.massimoLodiEsame = val;
        });
        this.storage.get("eliminazioneVotoBasso").then((val) => {
            this.eliminazioneVotoBasso = val;
        });
        this.storage.get("esamiVotoBasso").then((val) => {
            this.esamiVotoBasso = val;
        });
        this.storage.get("sceltaEsameManuale").then((val) => {
            this.sceltaEsameManuale = val;
        });
        this.storage.get("esami").then((val) => {
            this.esami = val ? val : [];
        });
        this.storage.get("materie").then((val) => {
            this.materie = val ? val : [];
        });
        this.storage.get("primaVolta").then((val) => {

        });







    }


  save() {
      this.storage.set("cfuMassimi", this.cfuMassimi);
      this.storage.set("lodeVotoFinale", this.lodeVotoFinale);
      this.storage.set("massimoLodiFinale", this.massimoLodiFinale);
      this.storage.set("aggiungiAVotoFinale", this.aggiungiAVotoFinale);
      this.storage.set("lodeVotoEsame", this.lodeVotoEsame);
      this.storage.set("massimoLodiEsame", this.massimoLodiEsame);
      this.storage.set("aggiungiAVotoEsame", this.aggiungiAVotoEsame);
      this.storage.set("eliminazioneVotoBasso", this.eliminazioneVotoBasso);
      this.storage.set("esamiVotoBasso", this.esamiVotoBasso);
      this.storage.set("eliminazioneVotoAlto", this.eliminazioneVotoAlto);
      this.storage.set("esamiVotoAlto", this.esamiVotoAlto);
      this.storage.set("sceltaEsameManuale", this.sceltaEsameManuale);
      this.storage.set("esami", this.esami);
      this.showAlert();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
        title: 'Perfetto!',
        subTitle: 'Le impostazioni sono state salvate!',
        buttons: ['OK']
    });
    alert.present();
  }

  goToCredits(){
    this.navCtrl.push(CreditsPage);
  }
}
