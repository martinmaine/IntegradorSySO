# Usar imagen base de Python
FROM python:3.9-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivo de dependencias
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY . .

# Exponer puerto 5000
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["python", "app.py"]