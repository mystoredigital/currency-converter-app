# 💱 Conversor de Divisas

Aplicación web moderna de conversión de divisas con tasas de cambio en tiempo real.

![Conversor de Divisas](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss)

## ✨ Características

- 🌍 **20+ divisas disponibles** incluyendo COP, USD, EUR, HNL, MXN y más
- 📊 **Tasas en tiempo real** desde API confiable
- 🧮 **Calculadora integrada** para operaciones rápidas
- ➕ **Panel de selección** para elegir tus divisas favoritas
- 🎨 **Diseño moderno** con paleta teal/turquesa
- 📱 **Responsive** - funciona en móvil, tablet y desktop
- ⚡ **Conversión instantánea** entre todas las divisas
- 🔄 **Actualización manual** de tasas de cambio

## 🚀 Instalación Local

### Requisitos previos
- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/TU_USUARIO/currency-converter-app.git
cd currency-converter-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

4. **Build de producción**
```bash
npm run build
```

## 🐳 Deployment con Docker

### Build manual
```bash
docker build -t currency-converter .
docker run -p 80:80 currency-converter
```

### Docker Compose
```bash
docker-compose up -d
```

## 📦 Deployment en Dokploy

### Opción 1: Desde GitHub (Recomendado)

1. **Subir código a GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/currency-converter-app.git
git push -u origin main
```

2. **En Dokploy:**
   - Ir a "Create New Application"
   - Seleccionar "GitHub"
   - Conectar tu repositorio
   - Dokploy detectará automáticamente el Dockerfile
   - Click en "Deploy"

### Opción 2: Docker Registry

1. **Build y push a Docker Hub**
```bash
docker build -t tuusuario/currency-converter:latest .
docker push tuusuario/currency-converter:latest
```

2. **En Dokploy:**
   - Crear nueva aplicación
   - Seleccionar "Docker Registry"
   - Ingresar: `tuusuario/currency-converter:latest`
   - Configurar puerto: 80
   - Deploy

## 🛠️ Tecnologías

- **React 18** - Library UI
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework CSS
- **Lucide React** - Iconos
- **Exchange Rate API** - Tasas de cambio en tiempo real

## 📝 Estructura del Proyecto

```
currency-converter-app/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globales
├── public/              # Archivos estáticos
├── Dockerfile           # Docker config
├── nginx.conf           # Nginx config para producción
├── package.json         # Dependencias
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
└── README.md
```

## 🎯 Uso

1. **Seleccionar moneda base** desde el dropdown superior
2. **Ingresar cantidad** en cualquier divisa
3. **Ver conversión automática** en todas las demás
4. **Usar calculadora** haciendo click en el icono 🧮
5. **Agregar más divisas** con el botón ➕
6. **Actualizar tasas** con el botón 🔄

## 🌐 API

La aplicación utiliza [ExchangeRate-API](https://www.exchangerate-api.com/) para obtener tasas de cambio actualizadas.

## 📱 Divisas Soportadas

🇺🇸 USD • 🇨🇴 COP • 🇪🇺 EUR • 🇭🇳 HNL • 🇲🇽 MXN • 🇬🇧 GBP • 🇯🇵 JPY • 🇨🇳 CNY • 🇨🇦 CAD • 🇦🇺 AUD • 🇨🇭 CHF • 🇧🇷 BRL • 🇦🇷 ARS • 🇨🇱 CLP • 🇵🇪 PEN • 🇮🇳 INR • 🇰🇷 KRW • 🇹🇷 TRY • 🇷🇺 RUB • 🇸🇪 SEK

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Creado con ❤️ por Yoany Andrés

---

⭐ Si te gusta el proyecto, dame una estrella en GitHub!
