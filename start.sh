#!/bin/bash

# 🚀 Script de inicio rápido para Currency Converter App

echo "=================================="
echo "💱 Currency Converter App"
echo "=================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js instalado:${NC} $(node -v)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm instalado:${NC} $(npm -v)"
echo ""

# Instalar dependencias
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias instaladas correctamente${NC}"
else
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 ¡Todo listo!${NC}"
echo ""
echo "Comandos disponibles:"
echo "  npm run dev      - Iniciar en modo desarrollo"
echo "  npm run build    - Build de producción"
echo "  npm run preview  - Preview del build"
echo ""
echo -e "${YELLOW}Iniciando en modo desarrollo...${NC}"
echo ""

# Iniciar en desarrollo
npm run dev
