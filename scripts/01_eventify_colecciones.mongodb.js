use('eventify_db');

// 1. Crear colección usuarios
// Este archivo se ejecuta una sola vez sobre eventify_db sin colecciones previas.
const nombresColecciones = ["usuarios", "eventos", "ordenes_compra", "resenas_evaluaciones"];
if (nombresColecciones.some(nombre => db.getCollectionNames().includes(nombre))) {
	throw new Error("eventify_db ya tiene colecciones de Eventify. No se modificó ni borró nada. Revisa el README antes de reinicializar.");
}

db.createCollection("usuarios", {
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: ["nombre", "email", "tipo_usuario", "fecha_nacimiento", "fecha_registro", "es_vip", "activo"],
			properties: {
				nombre: { bsonType: "string", minLength: 2 },
				email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
				tipo_usuario: { enum: ["cliente", "administrador"] },
				fecha_nacimiento: { bsonType: "date" },
				fecha_registro: { bsonType: "date" },
				es_vip: { bsonType: "bool" },
				activo: { bsonType: "bool" }
			}
		}
	},
	validationLevel: "strict",
	validationAction: "error"
});

// 2. Crear colección eventos (recinto y tickets embebidos)
db.createCollection("eventos", {
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: ["codigo", "nombre", "categoria", "fecha_evento", "activo", "recinto", "tickets_disponibles"],
			properties: {
				codigo: { bsonType: "string" },
				nombre: { bsonType: "string" },
				categoria: { enum: ["concierto", "festival", "obra de teatro", "conferencia"] },
				descripcion: { bsonType: "string" },
				fecha_evento: { bsonType: "date" },
				activo: { bsonType: "bool" },
				recinto: {
					bsonType: "object",
					required: ["nombre", "calle", "ciudad", "capacidad"],
					properties: {
						nombre: { bsonType: "string" },
						calle: { bsonType: "string" },
						ciudad: { bsonType: "string" },
						capacidad: { bsonType: "int", minimum: 1 }
					}
				},
				tickets_disponibles: {
					bsonType: "array",
					minItems: 1,
					items: {
						bsonType: "object",
						required: ["tipo", "precio", "stock_inicial", "stock_disponible"],
						properties: {
							tipo: { bsonType: "string" },
							precio: { bsonType: "number", minimum: 0 },
							stock_inicial: { bsonType: "int", minimum: 0 },
							stock_disponible: { bsonType: "int", minimum: 0 }
						}
					}
				}
			}
		}
	},
	validationLevel: "strict",
	validationAction: "error"
});

// 3. Crear colección ordenes_compra (referencias ObjectId)
db.createCollection("ordenes_compra", {
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: ["usuario_id", "evento_id", "items", "total", "fecha_compra", "estado", "confirmado"],
			properties: {
				usuario_id: { bsonType: "objectId" },
				evento_id: { bsonType: "objectId" },
				items: {
					bsonType: "array",
					minItems: 1,
					items: {
						bsonType: "object",
						required: ["tipo", "precio_unitario", "cantidad", "subtotal"],
						properties: {
							tipo: { bsonType: "string" },
							precio_unitario: { bsonType: "number", minimum: 0 },
							cantidad: { bsonType: "int", minimum: 1 },
							subtotal: { bsonType: "number", minimum: 0 }
						}
					}
				},
				total: { bsonType: "number", minimum: 0 },
				fecha_compra: { bsonType: "date" },
				estado: { enum: ["confirmada", "pendiente", "cancelada"] },
				confirmado: { bsonType: "bool" }
			}
		}
	},
	validationLevel: "strict",
	validationAction: "error"
});

// 4. Crear colección resenas_evaluaciones (referencias ObjectId)
db.createCollection("resenas_evaluaciones", {
	validator: {
		$jsonSchema: {
			bsonType: "object",
			required: ["usuario_id", "evento_id", "puntuacion", "comentario", "fecha_resena", "recomendado"],
			properties: {
				usuario_id: { bsonType: "objectId" },
				evento_id: { bsonType: "objectId" },
				puntuacion: { bsonType: "int", minimum: 1, maximum: 5 },
				comentario: { bsonType: "string", minLength: 1 },
				fecha_resena: { bsonType: "date" },
				recomendado: { bsonType: "bool" }
			}
		}
	},
	validationLevel: "strict",
	validationAction: "error"
});


// 5. Crear índices para búsquedas y evitar duplicados

db.usuarios.createIndex({ email: 1 }, { unique: true });
db.eventos.createIndex({ codigo: 1 }, { unique: true });
db.eventos.createIndex({ "recinto.ciudad": 1, fecha_evento: 1 });
db.ordenes_compra.createIndex({ usuario_id: 1, evento_id: 1 });
db.resenas_evaluaciones.createIndex({ usuario_id: 1, evento_id: 1 }, { unique: true });

print("Colecciones creadas correctamente:");
printjson(db.getCollectionNames());
