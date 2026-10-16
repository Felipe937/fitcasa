import React from 'react';
import { PageRoute } from './Header';

interface FooterProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <h2 className="sr-only">Navegación del pie de página y aviso legal</h2>
      <nav aria-label="Navegación secundaria">
        <ul>
          <li>
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('inicio', 'inicio');
              }}
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              href="#beneficios"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('inicio', 'beneficios');
              }}
            >
              Beneficios
            </a>
          </li>
          <li>
            <a
              href="#programas"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('inicio', 'programas');
              }}
            >
              Programas
            </a>
          </li>
          <li>
            <a
              href="#escoliosis"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('escoliosis');
              }}
            >
              Escoliosis
            </a>
          </li>
          <li>
            <a
              href="#como-funciona"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('inicio', 'como-funciona');
              }}
            >
              Cómo funciona
            </a>
          </li>
          <li>
            <a
              href="#privacidad"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('privacidad');
              }}
            >
              Política de privacidad
            </a>
          </li>
          <li>
            <a
              href="#terminos"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('terminos');
              }}
            >
              Términos y condiciones
            </a>
          </li>
        </ul>
      </nav>
      <p>
        <strong>Aviso de salud y responsabilidad:</strong> FitCasa ofrece recursos informativos sobre ejercicio físico general y ergonomía cotidiana. Este material no reemplaza el criterio médico, el diagnóstico ni la rehabilitación clínica. Dado que ninguna rutina es universalmente adecuada para todas las personas, consulta a tu médico o profesional sanitario cualificado antes de adoptar cualquier programa, especialmente ante condiciones de columna o molestias crónicas.
      </p>
      <p>© FitCasa. Todos los derechos reservados.</p>
    </footer>
  );
};
