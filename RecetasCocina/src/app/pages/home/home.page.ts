import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router'; // Importa Router para redireccionar
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Storage } from '@ionic/storage-angular';;

import { TabService } from '../../services/tab.service';

import { RecetaService } from 'src/app/services/receta.service';
import { Receta } from 'src/app/models/receta.model';
//Ejemplo de comentario para Github en la rama Main

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  isProfileMenuOpen: boolean = false; // Controlar si el menú está abierto o cerrado
  isLoggedIn: boolean = false;
  userName: string; // Variable para almacenar el nombre del usuario
  userId: number;
  private routerSubscription!: Subscription; // Suscripción a eventos de navegación
  recetas: Receta[] = [];
  mostrarModalCrearReceta: boolean = false;
  formReceta: FormGroup;
  imagenSeleccionada: string | null = null;

  constructor(
    private recetaService: RecetaService,
    private authService: AuthService, // Servicio de autenticación
    private router: Router, // Router para redireccionar
    public tabService: TabService,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private storage: Storage
  ) {
    // Inicializar el nombre del usuario y el estado de autenticación
    this.userName = this.authService.getUserName(); // Método para obtener el nombre del usuario
    this.isLoggedIn = !!this.userName; // Comprobar si el usuario está autenticado
    this.userId = this.authService.getUserId(); //Obtener el ID del usuario para peticiones en los servicios
    this.recetas = recetaService.getRecetas();
    this.formReceta = this.fb.group({
      nombre: ['', Validators.required],
      ingredientes: ['', Validators.required],
      procedimiento: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.loadUserData(); // Cargar datos del usuario
    this.subscribeToRouterEvents();
    await this.loadRecetas(); // Cargar recetas desde el servicio y almacenamiento
  
    // Crear la instancia de almacenamiento
    await this.storage.create();
  
    // Intentar obtener las recetas guardadas en el almacenamiento
    const recetasGuardadas = await this.storage.get('recetas');
    if (recetasGuardadas) {
      // Si hay recetas guardadas, asignarlas a `this.recetas`
      this.recetas = recetasGuardadas;
    } else {
      // Si no hay recetas guardadas, inicializar un array vacío
      this.recetas = [];
    }
  }  

  // Carga datos del usuario
  private loadUserData() {
    this.userName = this.authService.getUserName();
    this.userId = this.authService.getUserId();
    this.isLoggedIn = !!this.userName;
  }

  // Suscripción a eventos de navegación
  private subscribeToRouterEvents() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeProfileMenu();
        this.loadUserData();
      }
    });
  }

  abrirModalCrearReceta() {
    this.mostrarModalCrearReceta = true;
  }

  cerrarModalCrearReceta() {
    this.mostrarModalCrearReceta = false;
    this.formReceta.reset();
    this.imagenSeleccionada = null;
  }

  async guardarReceta() {
    const nuevaReceta = {
      id: this.recetas.length + 1,
      nombre: this.formReceta.value.nombre,
      imagen: this.imagenSeleccionada || 'assets/images/default.png',
      ingredientes: this.formReceta.value.ingredientes.split('\n'),
      procedimiento: this.formReceta.value.procedimiento,
    };
  
    // Añadir la nueva receta al array en memoria
    this.recetas.push(nuevaReceta);
  
    // Guardar las recetas actualizadas en el almacenamiento
    await this.storage.set('recetas', this.recetas);
  
    // Recargar las recetas desde el almacenamiento y verificar en consola
    const recetasGuardadas = await this.storage.get('recetas');
    this.recetas = recetasGuardadas || [];
    
    console.log('Recetas después de guardar:', this.recetas); // Verifica que las recetas se actualizan
  
    // Cerrar el modal
    this.cerrarModalCrearReceta();
  }  

  seleccionarImagen() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
  
    fileInput.onchange = () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.imagenSeleccionada = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        console.log('No se seleccionó ningún archivo.');
      }
    };
  
    fileInput.click();
  }  

  private loadRecetas() {
    this.recetas = this.recetaService.getRecetas(); // Obtener recetas del servicio
  }

  irADetalleReceta(receta: Receta) {
    this.navCtrl.navigateForward('/recipe-details', {
      queryParams: { id: receta.id }
    });
  }

  ngOnDestroy() {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout(); // Lógica para cerrar sesión
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }

  // Método para iniciar sesión
  login() {
    this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
  }

  // Cerrar el menú de perfil
  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  goToHomePage() {
    this.tabService.selectedTab = 'home';
    this.router.navigate(['/home']);
  }

  goToFavPage() {
    this.tabService.selectedTab = 'fav';
    this.router.navigate(['/favoritos']);
  }

  goToCamPage() {
    this.tabService.selectedTab = 'cam';
    this.router.navigate(['/camara']);
  }
  // Alternar el estado de apertura/cierre del menú de perfil
  toggleProfileMenu() {
    this.tabService.selectedTab = 'profile';
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
}
