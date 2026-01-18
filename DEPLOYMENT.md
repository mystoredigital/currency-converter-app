# 🚀 Guía de Deployment: GitHub + Dokploy

## Paso 1: Preparar el repositorio en GitHub

### 1.1 Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre: `currency-converter-app`
3. Descripción: "Conversor de divisas con tasas en tiempo real"
4. Público o Privado (según prefieras)
5. NO inicializar con README (ya lo tenemos)
6. Click en "Create repository"

### 1.2 Subir código desde tu terminal

```bash
# Navegar a la carpeta del proyecto
cd /ruta/al/proyecto/currency-converter-app

# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Currency converter app"

# Configurar rama principal
git branch -M main

# Agregar remote (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/currency-converter-app.git

# Push inicial
git push -u origin main
```

### 1.3 Verificar
- Ve a tu repositorio en GitHub
- Deberías ver todos los archivos subidos

---

## Paso 2: Deployment en Dokploy

### Opción A: Deploy directo desde GitHub (Recomendado)

#### 2.1 Conectar GitHub con Dokploy
1. Accede a tu panel de Dokploy
2. Ve a "Settings" → "Git Providers"
3. Click en "Connect GitHub"
4. Autoriza el acceso a Dokploy

#### 2.2 Crear nueva aplicación
1. En Dokploy, click en "Create"
2. Selecciona "Application"
3. Elige "Git Provider" → "GitHub"

#### 2.3 Configurar el deployment
- **Repository**: Selecciona `currency-converter-app`
- **Branch**: `main`
- **Build Type**: `Dockerfile` (Dokploy lo detectará automáticamente)
- **Port**: `80` (el puerto que expone Nginx en el contenedor)
- **Domain**: Configura tu dominio o usa el subdominio de Dokploy

#### 2.4 Variables de entorno (Opcional)
No requiere variables de entorno por ahora

#### 2.5 Deploy
- Click en "Deploy"
- Dokploy hará:
  1. Clone del repositorio
  2. Build de la imagen Docker
  3. Deploy del contenedor
  4. Configuración del proxy

#### 2.6 Verificar
- Accede a la URL proporcionada
- La app debería estar funcionando

---

### Opción B: Deploy desde Docker Hub

#### 2.1 Build y push a Docker Hub
```bash
# Login en Docker Hub
docker login

# Build de la imagen
docker build -t tuusuario/currency-converter:latest .

# Push a Docker Hub
docker push tuusuario/currency-converter:latest
```

#### 2.2 Crear aplicación en Dokploy
1. Click en "Create" → "Application"
2. Selecciona "Docker Registry"
3. Imagen: `tuusuario/currency-converter:latest`
4. Port: `80`
5. Domain: Configura tu dominio

#### 2.3 Deploy
- Click en "Deploy"
- Dokploy descargará y deployará la imagen

---

## Paso 3: Configuración de dominio (Opcional)

### 3.1 En Dokploy
1. Ve a tu aplicación
2. Click en "Domains"
3. Agregar dominio: `conversor.tudominio.com`

### 3.2 En tu DNS
Agrega un registro:
- **Tipo**: A o CNAME
- **Name**: conversor (o @)
- **Value**: IP de tu servidor Dokploy

### 3.3 SSL automático
- Dokploy generará certificado SSL automáticamente con Let's Encrypt
- Espera 1-2 minutos para que se active

---

## Paso 4: Actualizaciones futuras

### 4.1 Hacer cambios en el código
```bash
# Editar archivos
nano src/App.jsx

# Commit
git add .
git commit -m "Descripción del cambio"
git push
```

### 4.2 Re-deploy en Dokploy
**Automático**: Si configuraste webhooks
- Dokploy detecta el push y re-deploya automáticamente

**Manual**:
- Ve a tu app en Dokploy
- Click en "Redeploy"

---

## Paso 5: Comandos útiles

### Ver logs
En Dokploy:
- Ve a tu aplicación
- Click en "Logs"
- Ver logs en tiempo real

### Rollback
Si algo sale mal:
1. En Dokploy, ve a "Deployments"
2. Selecciona un deployment anterior
3. Click en "Rollback"

### Variables de entorno
Si necesitas agregar APIs keys:
1. En Dokploy → Tu app → "Environment"
2. Agregar variables
3. Redeploy

---

## 🔧 Troubleshooting

### Error: Puerto ocupado
- Verifica que el puerto 80 esté libre en el contenedor
- En Dokploy, asigna un puerto diferente si es necesario

### Error: Build fallido
- Revisa los logs de build en Dokploy
- Verifica que el Dockerfile sea correcto
- Asegúrate que todas las dependencias estén en package.json

### Error: Aplicación no carga
- Verifica que el puerto en Dokploy coincida con el del Dockerfile (80)
- Revisa los logs del contenedor
- Verifica que nginx esté corriendo

### DNS no resuelve
- Espera 5-10 minutos para propagación DNS
- Verifica que el registro DNS apunte a la IP correcta
- Limpia caché DNS: `ipconfig /flushdns` (Windows) o `sudo dscacheutil -flushcache` (Mac)

---

## 📊 Monitoreo

### Health checks
Dokploy automáticamente:
- Verifica que la app esté respondiendo
- Reinicia el contenedor si falla
- Envía notificaciones de estado

### Métricas
En Dokploy puedes ver:
- Uso de CPU
- Uso de memoria
- Tráfico de red
- Tiempo de respuesta

---

## ✅ Checklist final

- [ ] Código subido a GitHub
- [ ] Repositorio conectado en Dokploy
- [ ] Aplicación deployada exitosamente
- [ ] Dominio configurado (opcional)
- [ ] SSL activado (opcional)
- [ ] Prueba de funcionalidad
- [ ] Logs sin errores

---

¡Listo! Tu conversor de divisas está en producción 🎉
