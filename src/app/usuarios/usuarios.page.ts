import { ToastController } from '@ionic/angular';
import { Api } from './../../services/api';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  itens : any = [];
  limit : number = 10;
  start : number = 0;
  nome : string = "";

  constructor(    private router:Router,
    private provider:Api,
    private actRouter:ActivatedRoute,
    public toastController: ToastController) { }

  ngOnInit() {
  }

  addUsuarios(){
    this.router.navigate(['add-usuario']);
  }

  ionViewWillEnter(){
    this.itens = [];
    this.start = 0;
    this.carregar();
  }

  async mensagem(mensagem : string, cor: string){
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor
    });
    toast.present();
  }

  carregar(){
    return new Promise(resolve => {
      this.itens = [];
      let dados = {
        nome : this.nome,
        limit : this.limit,
        start : this.start
        }
        this.provider.dadosApi(dados, 'usuarios/listar.php').subscribe((data: any) => {
        if(data['itens'] == '0') {
          this.ionViewWillEnter();
        }else{
          this.itens = [];
          for(let item of data['itens']){
            this.itens.push(item);
          }
        }
         resolve(true);
        });
    });
  }


  editar(id: string, nome: string, cpf: string, email: string, senha: string,
     nivel: string, obs: string){
    this.router.navigate(['add-usuario/' + id + '/' + nome + '/' + cpf + '/' + email + 
        '/' + senha + '/' + nivel + '/'])
  }

  mostrar(id: string, nome: string, cpf: string, email: string, senha: string, 
    nivel: string, obs: string){
    this.router.navigate(['mostrar-usuarios/' + id + '/' + nome + '/' + cpf + '/' 
        + email + '/' + senha + '/' + nivel + '/'])
  }

  excluir(id: string){
    return new Promise(resolve => {
      let dados = {
        id: id,
      }
      this.provider.dadosApi(dados, 'usuarios/excluir.php').subscribe(
        (data: any)=>{
          
          if(data['ok'] == true){
            this.carregar();
            this.mensagem(data['mensagem'], 'success');
          }else{
            this.mensagem(data['mensagem'], 'danger');
          }
        }
      )
    });
  }

 //atualizar o list view

 doRefresh(event: any) {
  setTimeout(() => {
    this.ionViewWillEnter();
    event.target.complete();
  }, 500);
}

//barra de rolagem
loadData(event: any) {
  this.start += this.limit;
  setTimeout(() => {
    this.carregar().then(()=>{ 
      event.target.complete();
     });
  }, 500);
}
}
