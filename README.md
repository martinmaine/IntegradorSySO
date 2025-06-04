Trabajo Integrador - Arquitectura y Sistemas Operativos
"Virtualización y Contenedores: Solucionando 'En mi computadora funciona' con Docker"




Alumnos: 
•	Martín Maine (martin.maine85@gmail.com)
•	Valeria Arellano (valearellano14@gmail.com)
Materia: Arquitectura y Sistemas Operativos
Profesor: Osvaldo Falabella
Tutor: Gustavo Sturtz
Fecha de Entrega: 05/06/2025.


Guión video:
ESCENA 1: El Problema
M: Hola Vale, ahí te pasé el link de Github con el código para el trabajo final de Arquitectura.

V: Listo Tincho! Ya lo tengo en mi Visual Studio. 
M: Genial! Funciona todo perfectamente! 
V: A ver, espera…. (frustración)… mmmmm no, en mi computadora no funciona :/ 
Me dice: Puerto 3000 ocupado, no se puede conectar a la base de datos…
M: Que raro! En mi máquina si funciona!  (Meme de homero)

M: Qué versión de Python estás usando?  (Respondemos juntos)
M: 3.12.3
V: 3.11

Que versión de Node estás usando?  (Respondemos juntos)
M: 20.15.1
V:
V: ¿Qué hacemos, instalamos las mismas versiones los dos para que funcione? 

ESCENA 3: La Solución - Docker al Rescate (2 minutos)
"Docker empaqueta todo: código, dependencias, configuración"
V: El Dockerfile del frontend define cómo construir la imagen Docker para la aplicación React. Comienza desde una imagen base de Node.js 18 Alpine (una versión ligera de Linux), establece el directorio de trabajo como /app, copia primero el package.json para aprovechar el cache de Docker al instalar dependencias, ejecuta npm install para descargar todas las librerías necesarias, luego copia todo el código fuente, expone el puerto 5173 (puerto por defecto de Vite), y finalmente define el comando npm run dev que inicia el servidor de desarrollo de Vite, creando así un contenedor que puede ejecutar la aplicación React de forma aislada y reproducible.

M: Dockerfile del Backend
El Dockerfile del backend crea la imagen para la API de Python con Flask, utilizando como base Python 3.11 slim (una versión optimizada), establece /app como directorio de trabajo, copia el archivo requirements.txt que contiene la lista de dependencias de Python, ejecuta pip install para instalar Flask, MySQL Connector, CORS y otras librerías necesarias, luego copia todo el código de la API, expone el puerto 5000 donde Flask ejecutará el servidor, y define como comando principal python app.py que arranca la API REST, permitiendo que el backend funcione de manera independiente y con todas sus dependencias encapsuladas dentro del contenedor.

V: requirements.txt
El archivo requirements.txt es el equivalente de package.json pero para Python, conteniendo una lista de todas las librerías y sus versiones específicas que necesita el backend para funcionar correctamente. Incluye Flask como framework web, mysql-connector-python para conectarse a la base de datos MySQL, flask-cors para manejar las peticiones desde el frontend sin problemas de CORS (Cross-Origin Resource Sharing), python-dotenv para manejar variables de entorno, y otras dependencias necesarias.

M: docker-compose.yml
Docker Compose es la herramienta que orquesta y conecta los tres servicios (frontend, backend y base de datos) como si fueran una sola aplicación, definiendo cada servicio con su respectiva imagen, puertos, variables de entorno y dependencias.

ESCENA 3: La Magia Sucede (1.5 minutos)
Split screen: Computadora de Martín vs Computadora de Vale
Ambos ejecutamos: docker-compose up --build
Ambos: "¡FUNCIONA!"
Muestras ambas pantallas con la aplicación corriendo idéntica
Ambos: "MISMO CÓDIGO, MISMO RESULTADO, SIEMPRE"

Lo que hicimos fue empaquetar toda nuestra aplicación (React + Python + MySQL) en contenedores separados pero conectados, de manera que cualquier persona pueda ejecutar exactamente la misma aplicación con un solo comando, sin importar si tiene Windows, Mac o Linux, sin necesidad de instalar Node.js, Python, MySQL o configurar nada manualmente. 
