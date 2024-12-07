import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router'; 
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RecetaService } from '../../services/receta.service'; // Importar el servicio de recetas
import { FavoritosService } from 'src/app/services/favoritos.service';
import { TabService } from '../../services/tab.service';

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
    private favoritesService: FavoritosService
  ) { 
    this.userName = this.authService.getUserName();
    this.isLoggedIn = !!this.userName;
    this.userId = this.authService.getUserId();
  }

  ngOnInit() {
    this.loadUserData();
    this.subscribeToRouterEvents();
    this.loadReceta(); // Cargar la receta desde el servicio
    this.isFavorite = this.favoritesService.isFavorite(this.receta);
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
  private loadReceta() {
    // Obtener el parámetro id de la URL
    this.activatedRoute.queryParamMap.subscribe((paramMap) => {
      const recetaId = paramMap.get('id');
      if (recetaId) {
        // Usar el id para obtener la receta desde el servicio
        this.receta = this.recetaService.getRecetas().find(r => r.id === +recetaId);
      }
    });
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
