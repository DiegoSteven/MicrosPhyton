# MicrosPhyton 🚀

Un sistema de gestión empresarial basado en microservicios que maneja clientes, inventario, pedidos, envíos, despachos y cobros de manera eficiente y escalable.

## 📋 Descripción del Proyecto

MicrosPhyton es una aplicación web moderna que implementa una arquitectura de microservicios para gestionar diferentes aspectos de un negocio:

- **Gestión de Clientes**: Administración de información de clientes
- **Inventario**: Control de productos y stock
- **Pedidos**: Procesamiento y seguimiento de órdenes
- **Envíos**: Gestión de envíos y logística
- **Despachos**: Control de despachos y entregas
- **Cobros**: Sistema de facturación y pagos

## 🏗️ Arquitectura

### Backend (Microservicios)
El proyecto utiliza una arquitectura de microservicios construida con **Flask** y **Python**:

- **cliente_service**: Gestión de clientes
- **inventario_service**: Control de inventario y productos
- **orden_service**: Procesamiento de pedidos
- **envios_service**: Gestión de envíos
- **despacho_service**: Control de despachos
- **cobros_service**: Sistema de cobros

### Frontend
Interfaz de usuario moderna construida con **Next.js 15**, **React 18** y **TypeScript**:

- Diseño responsivo con **Tailwind CSS**
- Componentes UI con **Radix UI**
- Gestión de estado con **React Context**
- Formularios con **React Hook Form** y **Zod**

### Comunicación entre Servicios
- **RabbitMQ** para mensajería asíncrona entre microservicios
- Eventos publicados y consumidos para mantener consistencia de datos

## 🚀 Tecnologías Utilizadas

### Backend
- **Python 3.x**
- **Flask** - Framework web
- **SQLAlchemy** - ORM para base de datos
- **Pika** - Cliente RabbitMQ
- **Flask-CORS** - Soporte para CORS

### Frontend
- **Next.js 15** - Framework React
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Componentes accesibles
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas

### Infraestructura
- **Docker** - Contenedores
- **RabbitMQ** - Sistema de mensajería
- **SQLite** - Base de datos (desarrollo)

## 📦 Instalación y Configuración

### Prerrequisitos
- Python 3.8+
- Node.js 18+
- Docker y Docker Compose
- Git

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd MicrosPhyton
```

### 2. Configurar Infraestructura
```bash
# Iniciar RabbitMQ
docker-compose up -d
```

### 3. Configurar Backend
```bash
cd Backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno (crear archivo .env)
# Ejecutar cada servicio individualmente
cd cliente_service
python run.py

cd ../inventario_service
python run.py

# Repetir para otros servicios...
```

### 4. Configurar Frontend
```bash
cd frontend

# Instalar dependencias
npm install
# o
pnpm install

# Ejecutar en modo desarrollo
npm run dev
# o
pnpm dev
```

## 🔧 Configuración de Servicios

### Variables de Entorno
Cada servicio puede requerir un archivo `.env` con configuraciones específicas:

```env
# Ejemplo para inventario_service
DATABASE_URL=sqlite:///inventario.db
RABBITMQ_URL=amqp://admin:admin123@localhost:5672/
FLASK_ENV=development
```

### Puertos por Defecto
- **RabbitMQ**: 5672 (AMQP), 15672 (Management UI)
- **Frontend**: 3000
- **Backend Services**: Puertos específicos por servicio

## 📱 Uso de la Aplicación

### Funcionalidades Principales

1. **Gestión de Clientes**
   - Crear, editar y eliminar clientes
   - Consultar historial de pedidos

2. **Inventario**
   - Gestionar productos y stock
   - Control de categorías y precios

3. **Pedidos**
   - Crear y procesar pedidos
   - Seguimiento del estado de envío
   - Gestión del carrito de compras

4. **Envíos**
   - Crear envíos para pedidos
   - Seguimiento de entregas

5. **Despachos**
   - Gestionar despachos
   - Control de entregas

6. **Cobros**
   - Facturación y pagos
   - Historial de transacciones

## 🧪 Testing

### Backend
```bash
# Ejecutar tests (si están implementados)
python -m pytest
```

### Frontend
```bash
# Ejecutar tests
npm test
# o
pnpm test
```

## 🚀 Despliegue

### Desarrollo
```bash
# Backend - Ejecutar cada servicio en terminales separadas
cd Backend/cliente_service && python run.py
cd Backend/inventario_service && python run.py
# ... otros servicios

# Frontend
cd frontend && npm run dev
```

### Producción
```bash
# Construir frontend
cd frontend
npm run build
npm start

# Backend con Gunicorn (recomendado)
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

## 📁 Estructura del Proyecto

```
MicrosPhyton/
├── Backend/                    # Microservicios Python
│   ├── cliente_service/        # Gestión de clientes
│   ├── inventario_service/     # Control de inventario
│   ├── orden_service/          # Procesamiento de pedidos
│   ├── envios_service/         # Gestión de envíos
│   ├── despacho_service/       # Control de despachos
│   ├── cobros_service/         # Sistema de cobros
│   └── requirements.txt        # Dependencias Python
├── frontend/                   # Aplicación Next.js
│   ├── app/                    # Páginas y componentes
│   ├── components/             # Componentes reutilizables
│   ├── contexts/               # Contextos de React
│   ├── hooks/                  # Hooks personalizados
│   ├── lib/                    # Utilidades
│   └── types/                  # Tipos TypeScript
├── docker-compose.yml          # Configuración de Docker
└── README.md                   # Este archivo
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:

- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

## 🔄 Estado del Proyecto

- **Backend**: ✅ Implementado
- **Frontend**: ✅ Implementado
- **Microservicios**: ✅ Implementados
- **RabbitMQ**: ✅ Configurado
- **Docker**: ✅ Configurado
- **Documentación**: ✅ En progreso

---

**MicrosPhyton** - Sistema de gestión empresarial moderno y escalable 🚀
