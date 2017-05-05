import { Component } from '@angular/core';

import { Events } from 'ionic-angular';

import { style, state, animate, transition, trigger } from '@angular/core';

import { NavController } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';

import { Materia } from './materia'

import { AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { FabContainer } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
      trigger('fadeInOut', [

          transition(':enter', [   // :enter is alias to 'void => *'
              style({ height: 0 }),
              animate(150, style({ height: '*' }))
          ]),
          transition(':leave', [   // :leave is alias to '* => void'
              animate(150, style({ height: 100 }))
          ])
      ])
  ]
})
export class HomePage {
    params;
    str;
    id: number = 0;
    voto : number;
    nome = "";
    cfu: number = 1;
    mediaAritmetica : number = 0;
    mediaPesata : number = 0;
    cfuTotali: number = 0;
    votoLaurea: number = 0;
    settings: SettingsPage;
    modifica: boolean = false;
    mostraForm: boolean = false;
    materie = [];



    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public storage : Storage) {



        this.settings = new SettingsPage(navCtrl, this.params, this.storage, this.alertCtrl);
        this.settings.storage.get("primaVolta").then((val) => {

            if (val === null) {

                this.showAlert();
                this.settings.primaVolta = false;
                this.settings.storage.set("primaVolta", false);
            }
        });


      this.settings.storage.get("materie").then((val) => {
          this.materie = val ? val : [];
          console.log(this.materie);
         // if (this.materie)
          this.cfuTotali = this.materie.reduce(function (a, b) {
              console.log(b);
                  return { id: "", nome: "", voto: "", cfu: a.cfu + parseInt(b.cfu) };
          }, {id:"", nome:"", voto:"", cfu: 0 }).cfu;
          //else
            //  this.cfuTotali = 0;
          this.calcolaMediaAritmetica();
          this.calcolaMediaPesata();
      });


    }

    ionViewWillEnter() {

      console.log("prova");
        this.settings = new SettingsPage(this.navCtrl, this.params, this.storage, this.alertCtrl);
        this.calcolaMediaAritmetica();
        this.calcolaMediaPesata();

    }



  aggiungiMateria() {
      var materia;
      if (this.cfu >= 1 && this.voto != null) {
          for (var i = 0; i < this.materie.length; i++) {
              if (this.materie.map(function (materia) {
                  return materia.id;
              }).indexOf(i) == -1) {
                  break;
              }
          }
          this.materie.push(
               materia = new Materia(i, this.nome.toUpperCase(), this.cfu, this.voto
              )
          )
          this.cfuTotali += parseInt(materia.cfu);
          this.calcolaMediaPesata();
          this.calcolaMediaAritmetica();
          this.calcolaVotoLaurea();
          this.nome = "";
          this.cfu = 1;
          this.voto = null;
          this.mostraForm = !this.mostraForm;
      }
      this.settings.storage.set("materie", this.materie);
      console.log(this.materie);

  }

  calcolaMediaPesata() {




      this.settings.storage.get("esami").then((esami) => {
          esami = esami ? esami : [];
          this.mediaPesata = 0;
          var cfuDopoEliminazione = this.cfuTotali;
          var i = 0;
          for (let materia of this.materie) {
              if ((!esami[i] || !this.settings.sceltaEsameManuale) && materia.voto != "Idoneo") {
                  if (materia.voto == "30 e Lode") {
                      if (this.settings.lodeVotoEsame) {
                          this.mediaPesata += parseInt(materia.voto) + this.settings.aggiungiAVotoEsame * materia.cfu;
                      }
                      else
                          this.mediaPesata += parseInt(materia.voto) * materia.cfu;
                  }
                  else
                      this.mediaPesata += parseInt(materia.voto) * materia.cfu;
                  document.getElementById("" + materia.id).classList.remove("red");
              }
              else {
                  cfuDopoEliminazione -= materia.cfu;
                  document.getElementById(""+materia.id).classList.add("red");
              }
              i++;
          }
          console
          this.mediaPesata /= cfuDopoEliminazione;
          this.mediaPesata = parseFloat(this.mediaPesata.toFixed(2));
          this.calcolaVotoLaurea();
      })


  }

  calcolaMediaAritmetica() {
      this.mediaAritmetica = 0;
      var numeroMaterieIdoneo = 0;
      for (let materia of this.materie) {

          if (materia.voto != "Idoneo")
            this.mediaAritmetica += parseInt(materia.voto);
          else
            numeroMaterieIdoneo++;

      }

      this.mediaAritmetica /= (this.materie.length - numeroMaterieIdoneo);
      this.mediaAritmetica = parseFloat(this.mediaAritmetica.toFixed(2));
  }

  toggleAggiuntaMateria(fab: FabContainer) {
      this.mostraForm = !this.mostraForm;
      if (this.mostraForm) {
          fab.close();
      }
      this.modifica = false;
  }

  calcolaVotoLaurea() {
      var i = 0;
      this.votoLaurea = (this.mediaPesata / 30) * 110;
      if (this.settings.lodeVotoFinale) {
          for (let materia of this.materie) {
              if (i < this.settings.massimoLodiFinale && materia.voto == "30 e Lode") {
                  this.votoLaurea = this.votoLaurea + parseFloat(this.settings.aggiungiAVotoFinale+"");
                  i++;
              }
          }
      }
      console.log(this.votoLaurea);
      this.votoLaurea = parseFloat(this.votoLaurea.toFixed(2));
  }

  modificaMateria(materia) {
      this.id = materia.id;
      this.nome = materia.nome;
      this.voto = materia.voto;
      this.cfu = materia.cfu;
      this.modifica = !this.modifica;
      this.mostraForm = !this.mostraForm;
  }

  applicaModificaMateria(id) {
      for (let materia of this.materie) {
          if (materia.id == id) {
              materia.nome = this.nome;
              materia.voto = this.voto;
              materia.cfu = this.cfu;
          }
      }
      this.settings.storage.set("materie", this.materie);
      this.calcolaMediaPesata();
      this.calcolaMediaAritmetica();
      this.calcolaVotoLaurea();
      this.nome = "";
      this.cfu = 1;
      this.voto = null
      this.modifica = !this.modifica;
      this.mostraForm = !this.mostraForm;
      this.modifica = !this.modifica;
  }

  chiediConfermaEliminazione(id) {
      for (var i = 0; i < this.materie.length; i++) {
          if (this.materie[i].id == id) {
              break;
          }
      }
      let conferma = this.alertCtrl.create({
          title: 'Confermare?',
          message: this.materie[i].nome + ' verrà cancellato dagli esami superati.',
          buttons: [
              {
                  text: 'Sì',
                  handler: () => {
                      this.cfuTotali -= parseInt(this.materie[i].cfu);
                      this.materie.splice(i, 1);
                      this.settings.esami[i] = false;

                      this.settings.storage.set("materie", this.materie);
                      this.settings.storage.set("esami", this.settings.esami);
                      this.calcolaMediaPesata();
                      this.calcolaMediaAritmetica();
                      this.calcolaVotoLaurea();


                  }
              },
              {
                  text: 'No',
                  handler: () => {

                  }
              }
          ]
      });
      conferma.present();
  }

  vaiImpostazioni() {
      this.navCtrl.push(SettingsPage, {home: this});
  }

  showAlert() {
      let alert = this.alertCtrl.create({
          title: 'Benvenuto/a',
          subTitle: 'Le materie escluse dal calcolo della media saranno indicate dal colore ROSSO',
          buttons: ['OK']
      });
      alert.present();
  }

  onLink(url: string) {
      this.settings.storage.clear();
  }
}
