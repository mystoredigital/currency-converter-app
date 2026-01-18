# 📝 Comandos Git para subir a GitHub

## 1. Crear repositorio en GitHub
Ve a: https://github.com/new
- Nombre: currency-converter-app
- No inicialices con README
- Copia la URL del repositorio

## 2. Comandos para ejecutar en terminal

# Navegar al proyecto
cd currency-converter-app

# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Currency converter with real-time rates"

# Renombrar rama a main
git branch -M main

# Agregar remote (REEMPLAZA con tu URL)
git remote add origin https://github.com/TU_USUARIO/currency-converter-app.git

# Subir a GitHub
git push -u origin main

## 3. Para actualizaciones futuras

# Ver estado
git status

# Agregar cambios
git add .

# Commit con mensaje
git commit -m "Descripción de los cambios"

# Push
git push

## 4. Comandos útiles

# Ver historial
git log --oneline

# Ver ramas
git branch

# Crear nueva rama
git checkout -b nombre-rama

# Cambiar de rama
git checkout main

# Ver remotes
git remote -v

# Actualizar desde GitHub
git pull

## 5. Si necesitas cambiar la URL del repositorio

git remote set-url origin https://github.com/NUEVO_USUARIO/currency-converter-app.git

## 6. Clonar en otro lugar

git clone https://github.com/TU_USUARIO/currency-converter-app.git

---

## ⚠️ Importante

Antes de hacer push, asegúrate de:
- [ ] Tener cuenta de GitHub
- [ ] Haber creado el repositorio en GitHub
- [ ] Reemplazar TU_USUARIO con tu usuario real
- [ ] Estar autenticado (puede pedirte usuario/token)

## 🔐 Autenticación

Si GitHub pide contraseña, necesitas un Personal Access Token:
1. Ve a GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Selecciona scopes: repo
4. Copia el token
5. Úsalo como contraseña al hacer push

## 🎯 URL del repositorio típica

https://github.com/yoanyandres/currency-converter-app.git

Reemplaza "yoanyandres" con tu usuario de GitHub.
