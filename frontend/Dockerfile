# Usar imagen base de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto 5173 (puerto por defecto de Vite)
EXPOSE 5173

# Comando para ejecutar en desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]