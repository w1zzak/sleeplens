---
name: create-endpoint
description: Crea endpoints Express + TypeScript siguiendo la arquitectura route → controller → service → Prisma
---

# Create Endpoint Skill

Esta skill genera la lógica de backend para nuevos endpoints, manteniendo una separación estricta de responsabilidades y tipado fuerte.

## Arquitectura
1.  **Route** (`/backend/src/routes/`): Define el endpoint y vincula el controlador.
2.  **Controller** (`/backend/src/controllers/`): Gestiona la entrada/salida (req, res), valida datos básicos y llama al servicio.
3.  **Service** (`/backend/src/services/`): Contiene la lógica de negocio y llamadas a **Prisma**.
4.  **Types** (`/backend/src/types/`): Define interfaces para las peticiones y respuestas.

## Instrucciones
- **Idioma**: Comentarios en **español**. Código en **inglés**.
- **Asincronía**: Uso obligatorio de `async/await`.
- **Base de Datos**: Interactuar con SQLite exclusivamente a través de Prisma.
- **Errores**: Envolver la lógica en bloques `try/catch` y devolver códigos de estado HTTP apropiados (200, 201, 400, 404, 500).

## Ejemplo de Estructura de Servicio
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Crea un nuevo registro de gasto en la base de datos.
 */
export const createExpenseService = async (data: ExpenseInput) => {
  try {
    return await prisma.expense.create({
      data: {
        description: data.description,
        amount: data.amount,
        category: data.category,
      },
    });
  } catch (error) {
    throw new Error('Error al crear el gasto en la BD');
  }
};
```
