import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private favoritos: any[] = [];

  constructor() { }

  // Obtener todos los favoritos
  getFavorites() {
    return this.favoritos;
  }

  // Añadir una receta a los favoritos
  addFavorite(recipe: any) {
    if (!this.isFavorite(recipe)) {
      this.favoritos.push(recipe);
    }
  }

  // Eliminar una receta de los favoritos
  removeFavorite(recipe: any) {
    const index = this.favoritos.findIndex(fav => fav.id === recipe.id);
    if (index !== -1) {
      this.favoritos.splice(index, 1);
    }
  }

  // Verificar si una receta ya está en favoritos
  isFavorite(recipe: any): boolean {
    return this.favoritos.some(fav => fav.id === recipe.id);
  }
}
