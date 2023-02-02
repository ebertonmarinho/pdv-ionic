import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { promises } from 'dns';
import {Api} from './../../services/api';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.page.html',
  styleUrls: ['./add-usuario.page.scss'],
})
export class AddUsuarioPage implements OnInit {

  nome: string = ""
  email: string = ""
  cpf: string = ""
  senha: string = ""
  nivel: string = ""
  id: string = ""
  antigo: string = "";
  antigo2: string = "";

  constructor(private router:Router, 
    private provider: Api, 
    private actRouter:ActivatedRoute,
    public toast: ToastController) { }

  ngOnInit() {
     // Act Router para receber e passar parâmetros entre páginas
     this.actRouter.params.subscribe((data:any)=>{
      this.id = data.id;
      this.nome = data.nome;
      this.cpf = data.cpf;
      this.email = data.email;
      this.senha = data.senha;
      this.nivel = data.nivel;

      this.antigo = data.email;
      this.antigo2 = data.cpf;
    });
  }

  Usuarios(){
    this.router.navigate(['usuarios']);
  }

  async mensagemSucesso(mensagem: string){
    const toast = await this.toast.create({
      message: mensagem,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

 async mensagemErro(mensagem: string){
    const toast = await this.toast.create({
      message: mensagem,
      duration: 2000,
      color: 'danger',
    });
    toast.present();   
  }

  salvar(){
    return new Promise(resolve => {
      let dados = {
        nome : this.nome,
        email : this.email,
        cpf : this.cpf,
        senha : this.senha,
        nivel : this.nivel,
        id : this.id,
        antigo: this.antigo,
        antigo2: this.antigo2,

      }
      this.provider.dadosApi(dados, 'usuarios/inserir.php').subscribe(
        (data : any) => {
          //console.log(data['mensagem']);
          if(data['erro'] == 0){
            this.mensagemSucesso(data['mensagem']);
            this.router.navigate(['usuarios']);
            this.limparCampos();
          }
          if(data['erro'] == 1){
            this.mensagemErro(data['mensagem']);
          }
        }
      );
    });
  }

  limparCampos(){
    this.nome = "";
    this.email = "";
    this.cpf = "";
    this.senha = "";
    this.nivel = "";
    this.id = "";
  }

}
