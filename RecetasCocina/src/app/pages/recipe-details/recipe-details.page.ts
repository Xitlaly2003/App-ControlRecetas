import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router'; 
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RecetaService } from '../../services/receta.service'; // Importar el servicio de recetas
import { FavoritosService } from 'src/app/services/favoritos.service';
import { TabService } from '../../services/tab.service';
import { Storage } from '@ionic/storage-angular';
import { Receta } from 'src/app/models/receta.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
})
export class RecipeDetailsPage implements OnInit, OnDestroy {

  isProfileMenuOpen: boolean = false; 
  isLoggedIn: boolean = false;
  userName: string;
  userId: number;
  receta: any;
  favoritos: any[] = [];
  isFavorite: boolean = false;
  private routerSubscription!: Subscription;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private recetaService: RecetaService, // Inyectamos el servicio de recetas
    public tabService: TabService,
    private activatedRoute: ActivatedRoute,
    private favoritesService: FavoritosService,
    private storage: Storage,
    private navController: NavController
  ) { 
    this.userName = this.authService.getUserName();
    this.isLoggedIn = !!this.userName;
    this.userId = this.authService.getUserId();
    this.storage.create();
  }

  ngOnInit() {
    this.loadUserData();
    this.subscribeToRouterEvents();
    this.loadReceta(); // Cargar la receta desde el servicio
    this.isFavorite = this.favoritesService.isFavorite(this.receta);

    if (this.receta) {
      this.isFavorite = this.favoritesService.isFavorite(this.receta);
    }
  }

  // Cargar datos del usuario
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

  // Cargar la receta desde el servicio
  private async loadReceta() {
    // Obtener el parámetro id de la URL
    this.activatedRoute.queryParamMap.subscribe(async (paramMap) => {
      const recetaId = paramMap.get('id');
      if (recetaId) {
        // Intentar obtener las recetas guardadas en el almacenamiento
        const recetasGuardadas = await this.storage.get('recetas');
  
        // Si hay recetas guardadas, buscamos la receta en ellas
        if (recetasGuardadas) {
          this.receta = recetasGuardadas.find((r: Receta) => r.id === +recetaId);
        }
  
        // Si no encontramos la receta en el almacenamiento, buscamos en el servicio
        if (!this.receta) {
          this.receta = this.recetaService.getRecetas().find(r => r.id === +recetaId);
        }
  
        // Si no encontramos la receta, puede ser útil manejar este caso
        if (!this.receta) {
          console.error('Receta no encontrada');
          // Podrías redirigir a una página de error o hacer alguna acción alternativa
        } else {
          // Si se encontró la receta, comprobamos si es favorita
          this.isFavorite = this.favoritesService.isFavorite(this.receta);
        }
      }
    });
  }  

  eliminarReceta(receta: any) {
    if (confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      // Aquí eliminamos la receta del almacenamiento local
      this.removeRecipeFromStorage(receta);

      // Aquí puedes agregar la lógica para eliminar la receta de otros lugares si es necesario
      console.log('Receta eliminada:', receta.nombre);

      // Recargar las recetas (actualizar la vista)
      this.loadReceta();

      // Redirige al usuario a la pantalla principal o a donde desees
      this.router.navigate(['/home']).then(() => {
        window.location.reload();  // Esto recargará la página
      });
    }
  }

  // Método auxiliar para eliminar la receta del almacenamiento local
  private async removeRecipeFromStorage(receta: any) {
    // Obtener las recetas guardadas en el almacenamiento
    const recetasGuardadas = await this.storage.get('recetas');

    if (recetasGuardadas) {
      // Filtrar las recetas que no sean la que queremos eliminar
      const updatedRecetas = recetasGuardadas.filter((r: Receta) => r.id !== receta.id);

      // Guardar las recetas actualizadas en el almacenamiento
      await this.storage.set('recetas', updatedRecetas);
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  addToFavorites(recipe: any) {
    this.favoritesService.addFavorite(recipe);
    this.isFavorite = true;
    console.log('Receta añadida a favoritos:', recipe);
  }

  removeFromFavorites(recipe: any) {
    this.favoritesService.removeFavorite(recipe);
    this.isFavorite = false;
    console.log('Receta eliminada de favoritos:', recipe);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  goToHomePage() {
    this.tabService.selectedTab = 'home';
    this.router.navigate(['/home']);
  }

  goToFavPage() {
    this.tabService.selectedTab = 'map';
    this.router.navigate(['/favoritos']);
  }

  goToCamPage() {
    this.tabService.selectedTab = 'cam';
    this.router.navigate(['/camara']);
  }

  toggleProfileMenu() {
    this.tabService.selectedTab = 'profile';
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
}
