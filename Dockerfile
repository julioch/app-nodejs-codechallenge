# Usa la imagen oficial de Node.js
FROM node:18-alpine

# Directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Compila la aplicación (si usas TypeScript)
RUN npm run build

# Puerto expuesto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:dev"]