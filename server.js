const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- MOCK DE DATOS ----------
const propiedades = [
  { id:1, titulo:'Moderna Casa Familiar', operacion:'alquiler', precio:1200, moneda:'$', periodo:'mes', ubicacion:'Caracas, Distrito Capital', habitaciones:3, banos:2, area:150, imagen:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80', destacada:true, agenciaId:1 },
  { id:2, titulo:'Apartamento Vista al Mar', operacion:'venta', precio:85000, moneda:'$', ubicacion:'Lechería, Anzoátegui', habitaciones:2, banos:2, area:95, imagen:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80', destacada:true, agenciaId:2 },
  { id:3, titulo:'Townhouse Minimalista', operacion:'venta', precio:140000, moneda:'$', ubicacion:'Maracay, Aragua', habitaciones:4, banos:3, area:210, imagen:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=500&q=80', destacada:true, agenciaId:1 }
];

const agencias = [
  { id:1, nombre:'Inmobiliaria Prime', logo:'https://randomuser.me/api/portraits/men/32.jpg', ubicacion:'Caracas, Distrito Capital', telefono:'+58 212 555 1234', email:'contacto@primeinmobiliaria.com', propiedadIds:[1,3], añosExperiencia:10, especialidad:'Viviendas familiares' },
  { id:2, nombre:'Grupo Inmobiliario Marítimo', logo:'https://randomuser.me/api/portraits/women/68.jpg', ubicacion:'Lechería, Anzoátegui', telefono:'+58 281 555 5678', email:'info@grupomaritimo.com', propiedadIds:[2], añosExperiencia:15, especialidad:'Propiedades frente al mar' },
  { id:3, nombre:'Aragua Real Estate', logo:'https://randomuser.me/api/portraits/men/75.jpg', ubicacion:'Maracay, Aragua', telefono:'+58 243 555 9012', email:'ventas@aragua-realestate.com', propiedadIds:[], añosExperiencia:5, especialidad:'Casas y apartamentos modernos' }
];

// ---------- ENDPOINTS API ----------
app.get('/api/properties', (req, res) => {
  const { destacada } = req.query;
  let resultados = [...propiedades];
  if (destacada === 'true') resultados = resultados.filter(p => p.destacada);
  res.json(resultados);
});

app.get('/api/agencies', (req, res) => {
  const agenciasConConteo = agencias.map(ag => ({ ...ag, propiedadesCount: ag.propiedadIds.length }));
  res.json(agenciasConConteo);
});

// ---------- RUTAS DE VISTAS ----------
const viewsPath = path.join(__dirname, 'public', 'views');

app.get('/', (req, res) => res.sendFile(path.join(viewsPath, 'index.html')));
app.get('/propiedades', (req, res) => res.sendFile(path.join(viewsPath, 'propiedades.html')));
app.get('/agencias', (req, res) => res.sendFile(path.join(viewsPath, 'agencias.html')));
app.get('/nosotros', (req, res) => res.sendFile(path.join(viewsPath, 'nosotros.html')));
app.get('/contacto', (req, res) => res.sendFile(path.join(viewsPath, 'contacto.html')));
app.get('/ingresar', (req, res) => res.sendFile(path.join(viewsPath, 'ingresar.html')));

// Redirecciones de URLs antiguas con .html
app.get('/index.html', (req, res) => res.redirect('/'));
app.get('/propiedades.html', (req, res) => res.redirect('/propiedades'));
app.get('/agencias.html', (req, res) => res.redirect('/agencias'));
app.get('/nosotros.html', (req, res) => res.redirect('/nosotros'));
app.get('/contacto.html', (req, res) => res.redirect('/contacto'));
app.get('/ingresar.html', (req, res) => res.redirect('/ingresar'));

// Manejo de favicon.ico para evitar errores repetitivos
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Página 404 personalizada (AHORA APUNTA A LA CARPETA views)
app.use((req, res) => {
  res.status(404).sendFile(path.join(viewsPath, '404.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`📦 API de propiedades: http://localhost:${PORT}/api/properties`);
  console.log(`🏢 API de agencias: http://localhost:${PORT}/api/agencies`);
});