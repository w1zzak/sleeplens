---
name: create-component
description: Crea componentes React + TypeScript + Tailwind siguiendo las convenciones del CLAUDE.md
---

# Create Component Skill

Esta skill se encarga de generar componentes React funcionales utilizando TypeScript y TailwindCSS, asegurando consistencia visual y técnica.

## Instrucciones
- **Ubicación**: Los componentes deben crearse en `/frontend/src/components/` o subcarpetas relevantes.
- **TypeScript**: Definir interfaces o tipos para las `Props`. Usar `React.FC` o tipos de función explícitos.
- **Estilos**: Utilizar TailwindCSS. Priorizar diseños premium (gradientes, sombras suaves, bordes redondeados).
- **Idioma**: Comentarios técnicos en **español**. Nombres de variables, funciones y componentes en **inglés**.
- **Asincronía**: Si el componente realiza peticiones, usar `async/await` dentro de `useEffect` o manejadores de eventos.

## Ejemplo de Referencia
```typescript
import React from 'react';

interface ExpenseCardProps {
  amount: number;
  category: string;
  date: string;
}

/**
 * Tarjeta para mostrar un gasto individual.
 * Implementa diseño con Tailwind y tipado estricto.
 */
export const ExpenseCard: React.FC<ExpenseCardProps> = ({ amount, category, date }) => {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{category}</span>
        <span className="text-lg font-bold text-slate-900">${amount}</span>
      </div>
      <p className="mt-2 text-xs text-slate-400">{date}</p>
    </div>
  );
};
```
