const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Amanecer Literario API',
    version: '1.0.0',
    description:
      'Backend de Amanecer Literario con autenticacion JWT, inventario por ubicacion, carrito, pedidos y dashboard administrativo.'
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@amanecerliterario.com' },
          password: { type: 'string', example: 'Admin12345' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['nombre', 'email', 'password'],
        properties: {
          nombre: { type: 'string', example: 'Cliente Demo' },
          email: { type: 'string', example: 'cliente@amanecerliterario.com' },
          password: { type: 'string', example: 'Cliente123' }
        }
      },
      CategoriaRequest: {
        type: 'object',
        required: ['nombre'],
        properties: {
          nombre: { type: 'string', example: 'Novela' },
          descripcion: { type: 'string', example: 'Libros de narrativa' }
        }
      },
      LibroRequest: {
        type: 'object',
        required: ['titulo', 'autor', 'isbn', 'precio', 'categoria_id'],
        properties: {
          titulo: { type: 'string', example: 'Cien anos al amanecer' },
          autor: { type: 'string', example: 'Autor Demo' },
          isbn: { type: 'string', example: '9780000000001' },
          precio: { type: 'number', example: 45000 },
          descripcion: { type: 'string', example: 'Libro de prueba' },
          categoria_id: { type: 'integer', example: 1 }
        }
      },
      FeriaRequest: {
        type: 'object',
        required: ['nombre', 'ciudad', 'direccion', 'fecha_inicio', 'fecha_fin'],
        properties: {
          nombre: { type: 'string', example: 'Feria del Libro Bogota' },
          ciudad: { type: 'string', example: 'Bogota' },
          direccion: { type: 'string', example: 'Corferias' },
          fecha_inicio: { type: 'string', format: 'date', example: '2026-05-20' },
          fecha_fin: { type: 'string', format: 'date', example: '2026-05-25' }
        }
      },
      InventarioRequest: {
        type: 'object',
        required: ['libro_id', 'ubicacion_tipo', 'ubicacion_id', 'stock'],
        properties: {
          libro_id: { type: 'integer', example: 1 },
          ubicacion_tipo: { type: 'string', enum: ['almacen', 'feria'] },
          ubicacion_id: { type: 'integer', example: 0 },
          stock: { type: 'integer', example: 12 }
        }
      },
      CarritoAgregarRequest: {
        type: 'object',
        required: ['libro_id', 'cantidad'],
        properties: {
          libro_id: { type: 'integer', example: 1 },
          cantidad: { type: 'integer', example: 2 }
        }
      },
      CarritoActualizarItemRequest: {
        type: 'object',
        required: ['cantidad'],
        properties: {
          cantidad: { type: 'integer', example: 3 }
        }
      }
    }
  },
  paths: {
    '/auth/login': {
      post: {
        summary: 'Iniciar sesion',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Login exitoso' },
          401: { description: 'Credenciales invalidas' }
        }
      }
    },
    '/auth/register': {
      post: {
        summary: 'Registrar cliente',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Usuario registrado' },
          409: { description: 'Email ya registrado' }
        }
      }
    },
    '/auth/me': {
      get: {
        summary: 'Obtener usuario autenticado',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Usuario autenticado' },
          401: { description: 'Token invalido o ausente' }
        }
      }
    },
    '/categorias': {
      get: {
        summary: 'Listar categorias',
        tags: ['Categoria'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Listado de categorias' }
        }
      },
      post: {
        summary: 'Crear categoria',
        tags: ['Categoria'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoriaRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Categoria creada' }
        }
      }
    },
    '/libros': {
      get: {
        summary: 'Listar libros',
        tags: ['Libro'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Listado de libros' }
        }
      },
      post: {
        summary: 'Crear libro',
        tags: ['Libro'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LibroRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Libro creado' }
        }
      }
    },
    '/ferias': {
      get: {
        summary: 'Listar ferias',
        tags: ['Feria'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Listado de ferias' }
        }
      },
      post: {
        summary: 'Crear feria',
        tags: ['Feria'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FeriaRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Feria creada' }
        }
      }
    },
    '/inventarios': {
      get: {
        summary: 'Listar inventarios',
        tags: ['Inventario'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Listado de inventarios' }
        }
      },
      post: {
        summary: 'Crear inventario',
        tags: ['Inventario'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/InventarioRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Inventario creado' }
        }
      }
    },
    '/inventarios/libro/{libroId}/disponibilidad': {
      get: {
        summary: 'Consultar disponibilidad de un libro',
        tags: ['Inventario'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'libroId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Disponibilidad del libro' }
        }
      }
    },
    '/carrito': {
      get: {
        summary: 'Ver carrito activo',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Carrito actual' }
        }
      }
    },
    '/carrito/agregar': {
      post: {
        summary: 'Agregar libro al carrito',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CarritoAgregarRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Carrito actualizado' }
        }
      }
    },
    '/carrito/item/{id}': {
      put: {
        summary: 'Actualizar cantidad de item del carrito',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CarritoActualizarItemRequest'
              }
            }
          }
        },
        responses: {
          200: { description: 'Item actualizado' }
        }
      },
      delete: {
        summary: 'Eliminar item del carrito',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Item eliminado' }
        }
      }
    },
    '/carrito/confirmar': {
      post: {
        summary: 'Confirmar compra del carrito',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Pedido creado' },
          409: { description: 'Stock insuficiente' }
        }
      }
    },
    '/pedidos': {
      get: {
        summary: 'Listar pedidos',
        tags: ['Pedido'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Listado de pedidos' }
        }
      }
    },
    '/pedidos/{id}': {
      get: {
        summary: 'Obtener pedido por id',
        tags: ['Pedido'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Pedido encontrado' }
        }
      }
    },
    '/pedidos/{id}/cancelar': {
      patch: {
        summary: 'Cancelar pedido',
        tags: ['Pedido'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Pedido cancelado' }
        }
      }
    },
    '/admin/dashboard': {
      get: {
        summary: 'Dashboard administrativo',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'topLibros',
            in: 'query',
            schema: { type: 'integer', default: 5 }
          },
          {
            name: 'stockMinimo',
            in: 'query',
            schema: { type: 'integer', default: 5 }
          },
          {
            name: 'stockBajoLimite',
            in: 'query',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          200: { description: 'Metricas del dashboard' },
          403: { description: 'Solo admin' }
        }
      }
    }
  }
};

function setupSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = setupSwagger;
