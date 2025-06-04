from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Para que podamos hacer peticiones desde React

# Configuración de la base de datos
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'mysql'),
    'database': os.getenv('DB_NAME', 'estudiantes_app'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'password123'),
    'port': os.getenv('DB_PORT', 3306)
}

def get_db_connection():
    """Crear conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error conectando a MySQL: {e}")
        return None

def init_db():
    """Inicializar la base de datos y crear tabla si no existe"""
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            
            # Crear tabla de formularios
            create_table_query = """
            CREATE TABLE IF NOT EXISTS formularios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                materia ENUM('SySO', 'Programación 1', 'Matemática', 'Organización Empresarial') NOT NULL,
                comision VARCHAR(50) NOT NULL,
                tema_elegido TEXT NOT NULL,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
            
            cursor.execute(create_table_query)
            connection.commit()
            print("Perfecto! La base de datos fue inicializada correctamente")
            
        except Error as e:
            print(f"Ups! Hay un error inicializando base de datos: {e}")
        finally:
            cursor.close()
            connection.close()

# Rutas de la API

@app.route('/', methods=['GET'])
def home():
    """Ruta de prueba"""
    return jsonify({
        'mensaje': '🎉 Backend funcionando correctamente',
        'version': '1.0',
        'endpoints': [
            'GET / - Esta página',
            'GET /formularios - Obtener todos los formularios',
            'POST /formularios - Crear nuevo formulario',
            'GET /materias - Obtener lista de materias'
        ]
    })

@app.route('/materias', methods=['GET'])
def get_materias():
    """Obtener lista de materias disponibles"""
    materias = [
        'SySO',
        'Programación 1', 
        'Matemática',
        'Organización Empresarial'
    ]
    return jsonify({'materias': materias})

@app.route('/formularios', methods=['GET'])
def get_formularios():
    """Obtener todos los formularios"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Error de conexión a la base de datos'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM formularios ORDER BY fecha_creacion DESC")
        formularios = cursor.fetchall()
        
        # Convertir datetime a string para JSON
        for formulario in formularios:
            if formulario['fecha_creacion']:
                formulario['fecha_creacion'] = formulario['fecha_creacion'].isoformat()
        
        return jsonify({'formularios': formularios})
        
    except Error as e:
        return jsonify({'error': f'Error al obtener formularios: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/formularios', methods=['POST'])
def crear_formulario():
    """Crear un nuevo formulario"""
    data = request.get_json()
    
    # Validamos los datos requeridos
    campos_requeridos = ['nombre', 'apellido', 'materia', 'comision', 'tema_elegido']
    for campo in campos_requeridos:
        if campo not in data or not data[campo].strip():
            return jsonify({'error': f'El campo {campo} es requerido'}), 400
    
    # Validamos que la materia sea válida (Ahora no lo utilizamos porque en React vamos a usar un select, así que no importa mucho esto)
    materias_validas = ['SySO', 'Programación 1', 'Matemática', 'Organización Empresarial']
    if data['materia'] not in materias_validas:
        return jsonify({'error': 'Materia no válida'}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Oh! Hay un error de conexión a la base de datos'}), 500
    
    try:
        cursor = connection.cursor()
        
        insert_query = """
        INSERT INTO formularios (nombre, apellido, materia, comision, tema_elegido)
        VALUES (%s, %s, %s, %s, %s)
        """
        
        valores = (
            data['nombre'].strip(),
            data['apellido'].strip(),
            data['materia'],
            data['comision'].strip(),
            data['tema_elegido'].strip()
        )
        
        cursor.execute(insert_query, valores)
        connection.commit()
        
        # Obtener el ID del registro creado
        formulario_id = cursor.lastrowid
        
        return jsonify({
            'mensaje': 'Formulario creado exitosamente',
            'id': formulario_id
        }), 201
        
    except Error as e:
        return jsonify({'error': f'Error al crear formulario: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/formularios/<int:formulario_id>', methods=['GET'])
def get_formulario_por_id(formulario_id):
    """Obtener un formulario específico por ID"""
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Error de conexión a la base de datos'}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM formularios WHERE id = %s", (formulario_id,))
        formulario = cursor.fetchone()
        
        if not formulario:
            return jsonify({'error': 'Formulario no encontrado'}), 404
        
        # Convertir datetime a string para JSON
        if formulario['fecha_creacion']:
            formulario['fecha_creacion'] = formulario['fecha_creacion'].isoformat()
        
        return jsonify({'formulario': formulario})
        
    except Error as e:
        return jsonify({'error': f'Error al obtener formulario: {str(e)}'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/health', methods=['GET'])
def health_check():
    """Verificar estado del servidor y base de datos"""
    # Verificar conexión a la base de datos
    connection = get_db_connection()
    db_status = "✅ Conectada" if connection else "❌ Desconectada"
    
    if connection:
        connection.close()
    
    return jsonify({
        'servidor': '✅ Funcionando',
        'base_datos': db_status,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 Iniciando servidor backend...")
    print("🔗 Servidor disponible en: http://localhost:5000")
    
    # Inicializar base de datos
    init_db()
    
    # Ejecutar servidor
    app.run(host='0.0.0.0', port=5000, debug=True)