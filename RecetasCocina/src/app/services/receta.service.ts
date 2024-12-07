import { Injectable } from '@angular/core';
import { Receta } from '../models/receta.model';  // Se importa la interfaz Receta

@Injectable({
  providedIn: 'root',
})
export class RecetaService {

  private recetas: Receta[] = [
    {
      id: 1,
      nombre: 'Espaguetis a la Carbonara',
      imagen: 'assets/images/carbonara.jpeg',
      ingredientes: ['Espaguetis', 'Huevos', 'Queso', 'Bacon'],
      procedimiento: 'Cocinar los espaguetis, mezclar con huevos y queso, y agregar bacon.',
    },
    {
      id: 2,
      nombre: 'Pollo al Curry',
      imagen: 'assets/images/curry.jpeg',
      ingredientes: ['Pollo', 'Curry en polvo', 'Leche de coco', 'Cebollas'],
      procedimiento: 'Cocinar el pollo, añadir curry en polvo y leche de coco.',
    },
    {
      id: 3,
      nombre: 'Tacos de Carne',
      imagen: 'assets/images/tacos.jpeg',
      ingredientes: ['Carne molida', 'Tortillas', 'Lechuga', 'Salsa', 'Queso'],
      procedimiento: 'Cocinar la carne, montar los tacos con los ingredientes y añadir salsa.',
    },
    {
      id: 4,
      nombre: 'Ensalada César',
      imagen: 'assets/images/cesar.jpeg',
      ingredientes: ['Lechuga', 'Pollo', 'Queso parmesano', 'Aderezo César'],
      procedimiento: 'Mezclar todos los ingredientes y añadir el aderezo César.',
    },
    {
      id: 5,
      nombre: 'Sopa de Tomate',
      imagen: 'assets/images/sopa_tomate.jpeg',
      ingredientes: ['Tomates', 'Cebolla', 'Ajo', 'Crema'],
      procedimiento: 'Cocinar los tomates con cebolla y ajo, agregar crema y licuar.',
    },
    {
      id: 6,
      nombre: 'Pizza Margherita',
      imagen: 'assets/images/pizza_margherita.jpeg',
      ingredientes: ['Masa de pizza', 'Tomates', 'Queso mozzarella', 'Albahaca'],
      procedimiento: 'Hornear la masa de pizza, añadir tomates, queso y albahaca.',
    },
    {
      id: 7,
      nombre: 'Pasta Alfredo',
      imagen: 'assets/images/pasta_alfredo.jpeg',
      ingredientes: ['Pasta', 'Crema', 'Queso parmesano', 'Ajo'],
      procedimiento: 'Cocinar la pasta, mezclar con crema, ajo y queso parmesano.',
    },
    {
      id: 8,
      nombre: 'Paella Valenciana',
      imagen: 'assets/images/paella_valenciana.jpeg',
      ingredientes: ['Arroz', 'Mariscos', 'Verduras', 'Caldo'],
      procedimiento: 'Cocinar el arroz con mariscos, verduras y caldo.',
    },
    {
      id: 9,
      nombre: 'Tortilla Española',
      imagen: 'assets/images/tortilla_espanola.jpeg',
      ingredientes: ['Huevos', 'Papas', 'Cebolla'],
      procedimiento: 'Freír las papas y cebolla, añadir los huevos y cocinar.',
    },
    {
      id: 10,
      nombre: 'Hamburguesa Clásica',
      imagen: 'assets/images/hamburguesa.jpeg',
      ingredientes: ['Carne molida', 'Pan de hamburguesa', 'Lechuga', 'Tomate'],
      procedimiento: 'Formar la carne en forma de hamburguesa, cocinarla y montarla con pan y vegetales.',
    }
  ];

  constructor() {}

  getRecetas(): Receta[] {
    return this.recetas;
  }
}