use('eventify_db');

// Datos de prueba basados en eventify_data.mongodb.js original.
// Ejecutar después de 01_eventify_colecciones.mongodb.js y solo una vez.
if (["usuarios", "eventos", "ordenes_compra", "resenas_evaluaciones"].some(nombre => db.getCollection(nombre).countDocuments() > 0)) {
	throw new Error("Una colección ya contiene documentos. No se insertó nada para evitar duplicados.");
}

// 1. USUARIOS (50) - Personajes de 31 Minutos
db.usuarios.insertMany([
	{ nombre: "Tulio Triviño", email: "tulio@eventify.cl", tipo_usuario: "administrador", fecha_nacimiento: new Date("1975-05-12T00:00:00.000Z"), fecha_registro: new Date("2025-01-10T09:00:00.000Z"), es_vip: true, activo: true },
	{ nombre: "Juan Carlos Bodoque", email: "bodoque@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1978-03-22T00:00:00.000Z"), fecha_registro: new Date("2025-01-12T10:30:00.000Z"), es_vip: true, activo: true },
	{ nombre: "Juanín Juan Harry", email: "juanin@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1990-07-04T00:00:00.000Z"), fecha_registro: new Date("2025-01-15T11:00:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Policarpo Avendaño", email: "policarpo@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1972-11-30T00:00:00.000Z"), fecha_registro: new Date("2025-01-18T12:00:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Mario Hugo", email: "mariohugo@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1985-02-17T00:00:00.000Z"), fecha_registro: new Date("2025-01-20T13:15:00.000Z"), es_vip: true, activo: true },
	{ nombre: "Patana Tufillo", email: "patana@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1998-09-08T00:00:00.000Z"), fecha_registro: new Date("2025-01-22T14:00:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Calcetín con Rombos Man", email: "calcetin@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1988-12-01T00:00:00.000Z"), fecha_registro: new Date("2025-01-25T15:30:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Guaripolo", email: "guaripolo@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1992-04-19T00:00:00.000Z"), fecha_registro: new Date("2025-02-02T16:00:00.000Z"), es_vip: true, activo: true },
	{ nombre: "Balón Von Bola", email: "balonvonbola@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1965-06-25T00:00:00.000Z"), fecha_registro: new Date("2025-02-05T17:00:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Raúl Guantecillo", email: "raulguantecillo@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1980-01-14T00:00:00.000Z"), fecha_registro: new Date("2025-02-08T10:00:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Mico el Micófono", email: "mico@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1995-03-03T00:00:00.000Z"), fecha_registro: new Date("2025-02-11T11:30:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Ténison Salinas", email: "tenison@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1983-08-27T00:00:00.000Z"), fecha_registro: new Date("2025-02-14T12:45:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Huachimingo", email: "huachimingo@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("2001-10-05T00:00:00.000Z"), fecha_registro: new Date("2025-02-18T13:20:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Cindy Miraflores", email: "cindy@eventify.cl", tipo_usuario: "administrador", fecha_nacimiento: new Date("1987-07-21T00:00:00.000Z"), fecha_registro: new Date("2025-01-11T09:30:00.000Z"), es_vip: true, activo: true },
	{ nombre: "Dante Torobolino", email: "dante@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1991-12-12T00:00:00.000Z"), fecha_registro: new Date("2025-02-22T14:10:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Tramoyas", email: "tramoyas@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1976-05-09T00:00:00.000Z"), fecha_registro: new Date("2025-03-01T15:00:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Eusebio Manguera", email: "manguera@eventify.cl", tipo_usuario: "administrador", fecha_nacimiento: new Date("1960-02-28T00:00:00.000Z"), fecha_registro: new Date("2025-01-09T08:00:00.000Z"), es_vip: true, activo: true },
	{ nombre: "Cossimo Gianni", email: "cossimo@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1984-10-16T00:00:00.000Z"), fecha_registro: new Date("2025-03-05T16:30:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Tío Horacio", email: "horacio@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1970-04-07T00:00:00.000Z"), fecha_registro: new Date("2025-03-09T17:45:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Tío Pelado", email: "pelado@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1968-08-13T00:00:00.000Z"), fecha_registro: new Date("2025-03-14T10:15:00.000Z"), es_vip: false, activo: false },
	{ nombre: "Rosario Central", email: "rosariocentral@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1993-06-30T00:00:00.000Z"), fecha_registro: new Date("2025-03-18T11:45:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Bongo Stingo", email: "bongo@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1989-01-23T00:00:00.000Z"), fecha_registro: new Date("2025-03-22T12:30:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Bombi", email: "bombi@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1996-11-11T00:00:00.000Z"), fecha_registro: new Date("2025-03-27T13:00:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Carla Rubio", email: "carlarubio@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1999-02-06T00:00:00.000Z"), fecha_registro: new Date("2025-04-02T14:20:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Cachirula", email: "cachirula@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1994-05-18T00:00:00.000Z"), fecha_registro: new Date("2025-04-06T15:10:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Amapola Polar", email: "amapola@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1986-09-25T00:00:00.000Z"), fecha_registro: new Date("2025-04-10T16:40:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Carlitos Lechuga", email: "carlitos@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("2000-12-19T00:00:00.000Z"), fecha_registro: new Date("2025-04-15T17:20:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Nancy Cachete", email: "nancy@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1982-03-11T00:00:00.000Z"), fecha_registro: new Date("2025-04-19T10:50:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Jackson Aceituno", email: "jackson@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1979-07-29T00:00:00.000Z"), fecha_registro: new Date("2025-04-24T11:20:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Machi Fresia", email: "machifresia@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1997-04-02T00:00:00.000Z"), fecha_registro: new Date("2025-04-28T12:10:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Rigoberta Manchula", email: "rigoberta@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1974-10-21T00:00:00.000Z"), fecha_registro: new Date("2025-05-03T13:40:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Payaso Clavito", email: "clavito@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1990-06-14T00:00:00.000Z"), fecha_registro: new Date("2025-05-07T14:30:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Chancho Irarrázabal", email: "chancho@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1981-08-08T00:00:00.000Z"), fecha_registro: new Date("2025-05-12T15:20:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Lulo Serrucho", email: "luloserrucho@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1995-01-27T00:00:00.000Z"), fecha_registro: new Date("2025-05-16T16:10:00.000Z"), es_vip: false, activo: false },
	{ nombre: "Sopapiglobo", email: "sopapiglobo@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1998-10-03T00:00:00.000Z"), fecha_registro: new Date("2025-05-21T17:00:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Zorro Buena Onda", email: "zorro@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1988-02-15T00:00:00.000Z"), fecha_registro: new Date("2025-05-26T10:40:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Hielito", email: "hielito@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("2002-05-30T00:00:00.000Z"), fecha_registro: new Date("2025-05-31T11:10:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Otis", email: "otis@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1993-09-17T00:00:00.000Z"), fecha_registro: new Date("2025-06-04T12:50:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Pato Willy", email: "patowilly@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1996-12-24T00:00:00.000Z"), fecha_registro: new Date("2025-06-09T13:30:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Dylan Manguera", email: "dylan@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("2004-03-07T00:00:00.000Z"), fecha_registro: new Date("2025-06-14T14:50:00.000Z"), es_vip: true, activo: true },
	{ nombre: "Matusalem Matute", email: "matute@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1971-11-05T00:00:00.000Z"), fecha_registro: new Date("2025-06-19T15:40:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Bruja González", email: "bruja@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1966-06-21T00:00:00.000Z"), fecha_registro: new Date("2025-06-24T16:20:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Vladimiro Virutilla", email: "vladimiro@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1977-04-26T00:00:00.000Z"), fecha_registro: new Date("2025-06-29T17:10:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Divino Anticristo", email: "divino@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1973-09-02T00:00:00.000Z"), fecha_registro: new Date("2025-07-04T10:20:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Lucía la Sandía", email: "lucia@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("2003-08-16T00:00:00.000Z"), fecha_registro: new Date("2025-07-09T11:50:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Jack Patata", email: "jackpatata@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1992-07-13T00:00:00.000Z"), fecha_registro: new Date("2025-07-14T12:20:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Teniente Puñete", email: "punete@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1970-01-09T00:00:00.000Z"), fecha_registro: new Date("2025-07-19T13:50:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Lolo", email: "lolo@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1991-05-23T00:00:00.000Z"), fecha_registro: new Date("2025-07-24T14:40:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Flor Bovina", email: "florbovina@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1987-02-10T00:00:00.000Z"), fecha_registro: new Date("2025-07-29T15:30:00.000Z"), es_vip: false, activo: true },
	{ nombre: "Freddy Turbina", email: "freddy@eventify.cl", tipo_usuario: "cliente", fecha_nacimiento: new Date("1984-11-18T00:00:00.000Z"), fecha_registro: new Date("2025-08-03T16:50:00.000Z"), es_vip: false, activo: true }
]);

// 2. EVENTOS (50) - Objeto recinto y tickets embebidos
db.eventos.insertMany([
	{
		codigo: "EVT-001", nombre: "Tuliopalooza 2026", categoria: "concierto", descripcion: "Festival principal de Tulio Triviño", fecha_evento: new Date("2026-08-15T20:00:00.000Z"), activo: false,
		recinto: { nombre: "Estadio Bodoque", calle: "Av. Providencia 1234", ciudad: "Santiago", capacidad: NumberInt(5000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 15000, stock_disponible: NumberInt(800), stock_inicial: NumberInt(804) },
			{ tipo: "Platea", precio: 25000, stock_disponible: NumberInt(300), stock_inicial: NumberInt(305) },
			{ tipo: "Estudiante", precio: 8000, stock_disponible: NumberInt(200), stock_inicial: NumberInt(209) }
		]
	},
	{
		codigo: "EVT-002", nombre: "Gira Mundial 31 Minutos", categoria: "concierto", descripcion: "Parada chilena de la gira mundial", fecha_evento: new Date("2026-08-22T21:00:00.000Z"), activo: false,
		recinto: { nombre: "Movistar Arena", calle: "San Pablo 1750", ciudad: "Santiago", capacidad: NumberInt(15000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 20000, stock_disponible: NumberInt(2000), stock_inicial: NumberInt(2014) },
			{ tipo: "VIP", precio: 45000, stock_disponible: NumberInt(500), stock_inicial: NumberInt(504) }
		]
	},
	{
		codigo: "EVT-003", nombre: "Festival Sopaipilla Fest", categoria: "festival", descripcion: "Festival gastronómico y musical", fecha_evento: new Date("2026-08-29T18:00:00.000Z"), activo: false,
		recinto: { nombre: "Parque de la Familia", calle: "Av. Libertadores 456", ciudad: "Valparaíso", capacidad: NumberInt(3000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 8000, stock_disponible: NumberInt(1200), stock_inicial: NumberInt(1217) },
			{ tipo: "Niños", precio: 5000, stock_disponible: NumberInt(400), stock_inicial: NumberInt(409) }
		]
	},
	{
		codigo: "EVT-004", nombre: "La Venganza del Comparado", categoria: "obra de teatro", descripcion: "Obra teatral estreno nacional", fecha_evento: new Date("2026-09-05T19:30:00.000Z"), activo: false,
		recinto: { nombre: "Teatro Municipal", calle: "Ahumada 560", ciudad: "Santiago", capacidad: NumberInt(1200) },
		tickets_disponibles: [
			{ tipo: "General", precio: 12000, stock_disponible: NumberInt(600), stock_inicial: NumberInt(615) },
			{ tipo: "Platea", precio: 20000, stock_disponible: NumberInt(300), stock_inicial: NumberInt(307) }
		]
	},
	{
		codigo: "EVT-005", nombre: "Concierto Guaripolo en Vivo", categoria: "concierto", descripcion: "Show principal de Guaripolo", fecha_evento: new Date("2026-09-12T22:00:00.000Z"), activo: false,
		recinto: { nombre: "Teatro Biobío", calle: "Barros Arana 750", ciudad: "Concepción", capacidad: NumberInt(2000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 10000, stock_disponible: NumberInt(900), stock_inicial: NumberInt(921) },
			{ tipo: "VIP", precio: 35000, stock_disponible: NumberInt(150), stock_inicial: NumberInt(156) }
		]
	},
	{
		codigo: "EVT-006", nombre: "El Futuro del Streaming", categoria: "conferencia", descripcion: "Conferencia sobre tendencias digitales", fecha_evento: new Date("2026-09-19T10:00:00.000Z"), activo: false,
		recinto: { nombre: "Centro de Convenciones", calle: "San Borja 456", ciudad: "Santiago", capacidad: NumberInt(800) },
		tickets_disponibles: [
			{ tipo: "General", precio: 12000, stock_disponible: NumberInt(500), stock_inicial: NumberInt(517) },
			{ tipo: "Estudiante", precio: 7000, stock_disponible: NumberInt(200), stock_inicial: NumberInt(213) }
		]
	},
	{
		codigo: "EVT-007", nombre: "Festival Ratoncitos", categoria: "festival", descripcion: "Festival infantil de música", fecha_evento: new Date("2026-09-26T17:00:00.000Z"), activo: false,
		recinto: { nombre: "Parque Vergara", calle: "Av. Argentina 1200", ciudad: "Valparaíso", capacidad: NumberInt(4000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 7000, stock_disponible: NumberInt(1500), stock_inicial: NumberInt(1522) },
			{ tipo: "Niños", precio: 5000, stock_disponible: NumberInt(600), stock_inicial: NumberInt(610) }
		]
	},
	{
		codigo: "EVT-008", nombre: "Romeo y Julieta", categoria: "obra de teatro", descripcion: "Clásico con reparto de 31 Minutos", fecha_evento: new Date("2026-10-03T19:00:00.000Z"), activo: false,
		recinto: { nombre: "Teatro Universidad", calle: "Vicuña Mackenna 300", ciudad: "Santiago", capacidad: NumberInt(900) },
		tickets_disponibles: [
			{ tipo: "General", precio: 14000, stock_disponible: NumberInt(500), stock_inicial: NumberInt(515) },
			{ tipo: "Platea", precio: 22000, stock_disponible: NumberInt(250), stock_inicial: NumberInt(252) }
		]
	},
	{
		codigo: "EVT-009", nombre: "Ranking Top Live", categoria: "concierto", descripcion: "Los éxitos del Ranking Top en vivo", fecha_evento: new Date("2026-10-10T21:00:00.000Z"), activo: false,
		recinto: { nombre: "Anfiteatro Cerrillos", calle: "Av. Pedro Aguirre Cerda 5000", ciudad: "Santiago", capacidad: NumberInt(6000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 10000, stock_disponible: NumberInt(2500), stock_inicial: NumberInt(2515) },
			{ tipo: "VIP", precio: 35000, stock_disponible: NumberInt(700), stock_inicial: NumberInt(704) }
		]
	},
	{
		codigo: "EVT-010", nombre: "Periodismo sin Miedo", categoria: "conferencia", descripcion: "Charla de periodismo con Bodoque", fecha_evento: new Date("2026-08-08T11:00:00.000Z"), activo: false,
		recinto: { nombre: "Auditorio Concepción", calle: "Caupolicán 850", ciudad: "Concepción", capacidad: NumberInt(600) },
		tickets_disponibles: [
			{ tipo: "General", precio: 9000, stock_disponible: NumberInt(400), stock_inicial: NumberInt(414) },
			{ tipo: "Estudiante", precio: 6000, stock_disponible: NumberInt(150), stock_inicial: NumberInt(155) }
		]
	},
	{
		codigo: "EVT-011", nombre: "El Mayordomo - Obra", categoria: "obra de teatro", descripcion: "Adaptación teatral del episodio clásico", fecha_evento: new Date("2026-08-16T19:00:00.000Z"), activo: false,
		recinto: { nombre: "Teatro Municipal", calle: "Ahumada 560", ciudad: "Santiago", capacidad: NumberInt(1200) },
		tickets_disponibles: [
			{ tipo: "General", precio: 13000, stock_disponible: NumberInt(700), stock_inicial: NumberInt(710) },
			{ tipo: "Platea", precio: 21000, stock_disponible: NumberInt(300), stock_inicial: NumberInt(302) }
		]
	},
	{
		codigo: "EVT-012", nombre: "Festival Puerto Costero", categoria: "festival", descripcion: "Festival costero de verano", fecha_evento: new Date("2026-08-23T16:00:00.000Z"), activo: false,
		recinto: { nombre: "Plaza Aníbal Pinto", calle: "Av. España 500", ciudad: "Valparaíso", capacidad: NumberInt(3500) },
		tickets_disponibles: [
			{ tipo: "General", precio: 7000, stock_disponible: NumberInt(1400), stock_inicial: NumberInt(1412) },
			{ tipo: "Niños", precio: 4000, stock_disponible: NumberInt(500), stock_inicial: NumberInt(506) }
		]
	},
	{
		codigo: "EVT-013", nombre: "Severlá en Vivo", categoria: "concierto", descripcion: "Gran concierto del éxito Severlá", fecha_evento: new Date("2026-08-30T22:30:00.000Z"), activo: false,
		recinto: { nombre: "Club Chocolate", calle: "Av. Manuel Montt 1200", ciudad: "Santiago", capacidad: NumberInt(1800) },
		tickets_disponibles: [
			{ tipo: "General", precio: 11000, stock_disponible: NumberInt(800), stock_inicial: NumberInt(804) },
			{ tipo: "VIP", precio: 30000, stock_disponible: NumberInt(200), stock_inicial: NumberInt(202) }
		]
	},
	{
		codigo: "EVT-014", nombre: "Datos que Deciden", categoria: "conferencia", descripcion: "Conferencia de datos para negocios", fecha_evento: new Date("2026-09-20T10:30:00.000Z"), activo: false,
		recinto: { nombre: "Campus El Llano", calle: "Las Encinas 340", ciudad: "Concepción", capacidad: NumberInt(500) },
		tickets_disponibles: [
			{ tipo: "General", precio: 9000, stock_disponible: NumberInt(343), stock_inicial: NumberInt(347) },
			{ tipo: "Estudiante", precio: 5000, stock_disponible: NumberInt(150), stock_inicial: NumberInt(153) }
		]
	},
	{
		codigo: "EVT-015", nombre: "Calurosa Navidad en Septiembre", categoria: "obra de teatro", descripcion: "Especial navideño en temporada baja", fecha_evento: new Date("2026-09-27T20:00:00.000Z"), activo: false,
		recinto: { nombre: "Teatro Caupolicán", calle: "Rancagua 480", ciudad: "Santiago", capacidad: NumberInt(3000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 16000, stock_disponible: NumberInt(1000), stock_inicial: NumberInt(1004) },
			{ tipo: "Platea", precio: 26000, stock_disponible: NumberInt(400), stock_inicial: NumberInt(402) }
		]
	},
	{
		codigo: "EVT-016", nombre: "Tangananica Christmas", categoria: "concierto", descripcion: "Cierre de año de los éxitos clásicos", fecha_evento: new Date("2026-11-06T21:00:00.000Z"), activo: true,
		recinto: { nombre: "Estadio Bodoque", calle: "Av. Providencia 1234", ciudad: "Santiago", capacidad: NumberInt(5000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 15000, stock_disponible: NumberInt(900), stock_inicial: NumberInt(900) },
			{ tipo: "Estudiante", precio: 8000, stock_disponible: NumberInt(300), stock_inicial: NumberInt(300) }
		]
	},
	{
		codigo: "EVT-017", nombre: "Festival Otoño Valparaíso", categoria: "festival", descripcion: "Festival de música alternativa", fecha_evento: new Date("2026-11-07T18:00:00.000Z"), activo: true,
		recinto: { nombre: "Quinta Vergara", calle: "Vergara 595", ciudad: "Valparaíso", capacidad: NumberInt(7000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 12000, stock_disponible: NumberInt(2500), stock_inicial: NumberInt(2500) },
			{ tipo: "VIP", precio: 35000, stock_disponible: NumberInt(600), stock_inicial: NumberInt(600) }
		]
	},
	{
		codigo: "EVT-018", nombre: "Mala - Concierto Guaripolo", categoria: "concierto", descripcion: "Gira de la canción Mala", fecha_evento: new Date("2026-11-08T22:00:00.000Z"), activo: true,
		recinto: { nombre: "Teatro Biobío", calle: "Barros Arana 750", ciudad: "Concepción", capacidad: NumberInt(2000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 10000, stock_disponible: NumberInt(1200), stock_inicial: NumberInt(1200) },
			{ tipo: "VIP", precio: 30000, stock_disponible: NumberInt(250), stock_inicial: NumberInt(250) }
		]
	},
	{
		codigo: "EVT-019", nombre: "El Fantasma del Estudio", categoria: "obra de teatro", descripcion: "Obra de terror y comedia", fecha_evento: new Date("2026-11-14T19:30:00.000Z"), activo: true,
		recinto: { nombre: "Teatro Municipal", calle: "Ahumada 560", ciudad: "Santiago", capacidad: NumberInt(1200) },
		tickets_disponibles: [
			{ tipo: "General", precio: 15000, stock_disponible: NumberInt(700), stock_inicial: NumberInt(700) },
			{ tipo: "Estudiante", precio: 9000, stock_disponible: NumberInt(250), stock_inicial: NumberInt(250) }
		]
	},
	{
		codigo: "EVT-020", nombre: "Lala en La Serena", categoria: "concierto", descripcion: "Concierto del clásico Lala", fecha_evento: new Date("2026-11-15T20:00:00.000Z"), activo: true,
		recinto: { nombre: "Teatro Municipal de La Serena", calle: "Cordovez 450", ciudad: "La Serena", capacidad: NumberInt(1000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 9000, stock_disponible: NumberInt(600), stock_inicial: NumberInt(600) },
			{ tipo: "Platea", precio: 18000, stock_disponible: NumberInt(200), stock_inicial: NumberInt(200) }
		]
	},
	{
		codigo: "EVT-021", nombre: "Ruperto Vinagre Tour", categoria: "concierto", descripcion: "Gira nacional de Ruperto Vinagre", fecha_evento: new Date("2026-11-21T21:00:00.000Z"), activo: true,
		recinto: { nombre: "Parque Industrial", calle: "Av. Nueva Valparaíso 4000", ciudad: "Valparaíso", capacidad: NumberInt(5000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 14000, stock_disponible: NumberInt(1800), stock_inicial: NumberInt(1800) },
			{ tipo: "VIP", precio: 40000, stock_disponible: NumberInt(400), stock_inicial: NumberInt(400) }
		]
	},
	{
		codigo: "EVT-022", nombre: "Escalabilidad NoSQL", categoria: "conferencia", descripcion: "Conferencia de arquitectura de datos", fecha_evento: new Date("2026-11-22T09:30:00.000Z"), activo: true,
		recinto: { nombre: "Centro de Convenciones", calle: "San Borja 456", ciudad: "Santiago", capacidad: NumberInt(800) },
		tickets_disponibles: [
			{ tipo: "General", precio: 18000, stock_disponible: NumberInt(500), stock_inicial: NumberInt(500) },
			{ tipo: "Estudiante", precio: 10000, stock_disponible: NumberInt(200), stock_inicial: NumberInt(200) }
		]
	},
	{
		codigo: "EVT-023", nombre: "El Huerfadrino", categoria: "obra de teatro", descripcion: "Parodia teatral del clásico", fecha_evento: new Date("2026-11-28T19:00:00.000Z"), activo: true,
		recinto: { nombre: "Teatro Universidad", calle: "Vicuña Mackenna 300", ciudad: "Santiago", capacidad: NumberInt(900) },
		tickets_disponibles: [
			{ tipo: "General", precio: 12000, stock_disponible: NumberInt(550), stock_inicial: NumberInt(550) },
			{ tipo: "Platea", precio: 25000, stock_disponible: NumberInt(220), stock_inicial: NumberInt(220) }
		]
	},
	{
		codigo: "EVT-024", nombre: "Boing Boing Boing Tour", categoria: "concierto", descripcion: "Gira familiar de éxitos", fecha_evento: new Date("2026-11-29T18:00:00.000Z"), activo: true,
		recinto: { nombre: "Arena Maipú", calle: "Av. Pajaritos 2000", ciudad: "Santiago", capacidad: NumberInt(4000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 13000, stock_disponible: NumberInt(800), stock_inicial: NumberInt(800) },
			{ tipo: "Niños", precio: 7000, stock_disponible: NumberInt(400), stock_inicial: NumberInt(400) }
		]
	},
	{
		codigo: "EVT-025", nombre: "Rin Raja en Vivo", categoria: "concierto", descripcion: "Gran concierto Rin Raja", fecha_evento: new Date("2026-12-05T21:30:00.000Z"), activo: true,
		recinto: { nombre: "Movistar Arena", calle: "San Pablo 1750", ciudad: "Santiago", capacidad: NumberInt(15000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 20000, stock_disponible: NumberInt(2500), stock_inicial: NumberInt(2500) },
			{ tipo: "Preferencial", precio: 14000, stock_disponible: NumberInt(200), stock_inicial: NumberInt(200) }
		]
	},
	{
		codigo: "EVT-026", nombre: "Marketing de Eventos", categoria: "conferencia", descripcion: "Tendencias de marketing para eventos", fecha_evento: new Date("2026-12-06T10:00:00.000Z"), activo: true,
		recinto: { nombre: "Hotel Savoy", calle: "Esmeralda 650", ciudad: "Valparaíso", capacidad: NumberInt(400) },
		tickets_disponibles: [
			{ tipo: "General", precio: 15000, stock_disponible: NumberInt(280), stock_inicial: NumberInt(280) },
			{ tipo: "Estudiante", precio: 8000, stock_disponible: NumberInt(120), stock_inicial: NumberInt(120) }
		]
	},
	{
		codigo: "EVT-027", nombre: "Primavera Serena", categoria: "festival", descripcion: "Festival de primavera", fecha_evento: new Date("2026-12-12T17:00:00.000Z"), activo: true,
		recinto: { nombre: "Playa El Tierra", calle: "Av. del Mar s/n", ciudad: "La Serena", capacidad: NumberInt(5000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 11000, stock_disponible: NumberInt(2000), stock_inicial: NumberInt(2000) },
			{ tipo: "VIP", precio: 28000, stock_disponible: NumberInt(500), stock_inicial: NumberInt(500) }
		]
	},
	{
		codigo: "EVT-028", nombre: "Diente Blanco no te Vayas", categoria: "obra de teatro", descripcion: "Musical infantil", fecha_evento: new Date("2026-12-13T18:00:00.000Z"), activo: true,
		recinto: { nombre: "Teatro Municipal", calle: "Ahumada 560", ciudad: "Santiago", capacidad: NumberInt(1200) },
		tickets_disponibles: [
			{ tipo: "General", precio: 10000, stock_disponible: NumberInt(750), stock_inicial: NumberInt(750) },
			{ tipo: "Niños", precio: 6000, stock_disponible: NumberInt(350), stock_inicial: NumberInt(350) }
		]
	},
	{
		codigo: "EVT-029", nombre: "Mi Equilibrio Espiritual", categoria: "concierto", descripcion: "Concierto del hit espiritual", fecha_evento: new Date("2026-12-19T22:00:00.000Z"), activo: true,
		recinto: { nombre: "Teatro Biobío", calle: "Barros Arana 750", ciudad: "Concepción", capacidad: NumberInt(2000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 12000, stock_disponible: NumberInt(900), stock_inicial: NumberInt(900) },
			{ tipo: "VIP", precio: 32000, stock_disponible: NumberInt(180), stock_inicial: NumberInt(180) }
		]
	},
	{
		codigo: "EVT-030", nombre: "Bailan sin Cesar", categoria: "concierto", descripcion: "Fiesta bailable con éxitos clásicos", fecha_evento: new Date("2026-12-20T23:00:00.000Z"), activo: true,
		recinto: { nombre: "Club Chico Puma", calle: "Av. Nueva Costanera 3700", ciudad: "Santiago", capacidad: NumberInt(2500) },
		tickets_disponibles: [
			{ tipo: "General", precio: 15000, stock_disponible: NumberInt(1000), stock_inicial: NumberInt(1000) },
			{ tipo: "Estudiante", precio: 8000, stock_disponible: NumberInt(400), stock_inicial: NumberInt(400) }
		]
	},
	{
		codigo: "EVT-031", nombre: "Monstruo del Festival", categoria: "festival", descripcion: "Festival de terror y música", fecha_evento: new Date("2027-01-09T19:00:00.000Z"), activo: true,
		recinto: { nombre: "Parque Cerrillos", calle: "Av. Pedro Aguirre Cerda 5000", ciudad: "Santiago", capacidad: NumberInt(4500) },
		tickets_disponibles: [
			{ tipo: "General", precio: 16000, stock_disponible: NumberInt(1600), stock_inicial: NumberInt(1600) },
			{ tipo: "VIP", precio: 42000, stock_disponible: NumberInt(350), stock_inicial: NumberInt(350) }
		]
	},
	{
		codigo: "EVT-032", nombre: "MongoDB en la Práctica", categoria: "conferencia", descripcion: "Talleres de MongoDB aplicado", fecha_evento: new Date("2027-01-10T09:00:00.000Z"), activo: true,
		recinto: { nombre: "Campus El Llano", calle: "Las Encinas 340", ciudad: "Concepción", capacidad: NumberInt(500) },
		tickets_disponibles: [
			{ tipo: "General", precio: 14000, stock_disponible: NumberInt(330), stock_inicial: NumberInt(330) },
			{ tipo: "Estudiante", precio: 7000, stock_disponible: NumberInt(170), stock_inicial: NumberInt(170) }
		]
	},
	{
		codigo: "EVT-033", nombre: "Ríe Tour", categoria: "concierto", descripcion: "Tour nacional de la canción Ríe", fecha_evento: new Date("2027-01-16T21:00:00.000Z"), activo: true,
		recinto: { nombre: "Quinta Vergara", calle: "Vergara 595", ciudad: "Valparaíso", capacidad: NumberInt(7000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 17000, stock_disponible: NumberInt(2600), stock_inicial: NumberInt(2600) },
			{ tipo: "VIP", precio: 44000, stock_disponible: NumberInt(600), stock_inicial: NumberInt(600) }
		]
	},
	{
		codigo: "EVT-034", nombre: "Yo Nunca vi Televisión", categoria: "obra de teatro", descripcion: "Comedia teatral original", fecha_evento: new Date("2027-01-17T19:00:00.000Z"), activo: true,
		recinto: { nombre: "Teatro Universidad", calle: "Vicuña Mackenna 300", ciudad: "Santiago", capacidad: NumberInt(900) },
		tickets_disponibles: [
			{ tipo: "General", precio: 15000, stock_disponible: NumberInt(650), stock_inicial: NumberInt(650) },
			{ tipo: "Estudiante", precio: 7000, stock_disponible: NumberInt(200), stock_inicial: NumberInt(200) }
		]
	},
	{
		codigo: "EVT-035", nombre: "Guácala Fest", categoria: "festival", descripcion: "Festival de comedia y música", fecha_evento: new Date("2027-01-23T17:00:00.000Z"), activo: true,
		recinto: { nombre: "Parque Bustamante", calle: "Av. República 3400", ciudad: "Santiago", capacidad: NumberInt(5500) },
		tickets_disponibles: [
			{ tipo: "General", precio: 11000, stock_disponible: NumberInt(2200), stock_inicial: NumberInt(2200) },
			{ tipo: "Niños", precio: 6000, stock_disponible: NumberInt(700), stock_inicial: NumberInt(700) }
		]
	},
	{
		codigo: "EVT-036", nombre: "Maguito Explosivo en Concierto", categoria: "concierto", descripcion: "Show familiar Maguito Explosivo", fecha_evento: new Date("2027-01-24T17:00:00.000Z"), activo: true,
		recinto: { nombre: "Teatro Municipal de La Serena", calle: "Cordovez 450", ciudad: "La Serena", capacidad: NumberInt(1000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 9000, stock_disponible: NumberInt(700), stock_inicial: NumberInt(700) },
			{ tipo: "Niños", precio: 5000, stock_disponible: NumberInt(300), stock_inicial: NumberInt(300) }
		]
	},
	{
		codigo: "EVT-037", nombre: "Ventas en Alta Demanda", categoria: "conferencia", descripcion: "Estrategias para cyber days", fecha_evento: new Date("2027-01-30T10:00:00.000Z"), activo: true,
		recinto: { nombre: "Centro de Convenciones", calle: "San Borja 456", ciudad: "Santiago", capacidad: NumberInt(800) },
		tickets_disponibles: [
			{ tipo: "General", precio: 10000, stock_disponible: NumberInt(600), stock_inicial: NumberInt(600) },
			{ tipo: "VIP", precio: 35000, stock_disponible: NumberInt(150), stock_inicial: NumberInt(150) }
		]
	},
	{
		codigo: "EVT-038", nombre: "La Regla Primordial", categoria: "obra de teatro", descripcion: "Obra de suspense", fecha_evento: new Date("2027-01-31T20:00:00.000Z"), activo: true,
		recinto: { nombre: "Teatro Biobío", calle: "Barros Arana 750", ciudad: "Concepción", capacidad: NumberInt(2000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 13000, stock_disponible: NumberInt(850), stock_inicial: NumberInt(850) },
			{ tipo: "Platea", precio: 24000, stock_disponible: NumberInt(300), stock_inicial: NumberInt(300) }
		]
	},
	{
		codigo: "EVT-039", nombre: "Objeción Denegada Live", categoria: "concierto", descripcion: "Concierto del éxito juvenil", fecha_evento: new Date("2027-02-06T21:00:00.000Z"), activo: true,
		recinto: { nombre: "Parque Industrial", calle: "Av. Nueva Valparaíso 4000", ciudad: "Valparaíso", capacidad: NumberInt(5000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 15000, stock_disponible: NumberInt(1900), stock_inicial: NumberInt(1900) },
			{ tipo: "VIP", precio: 38000, stock_disponible: NumberInt(450), stock_inicial: NumberInt(450) }
		]
	},
	{
		codigo: "EVT-040", nombre: "Primavera de Valparaíso", categoria: "festival", descripcion: "Festival de verano portuario", fecha_evento: new Date("2027-02-07T18:00:00.000Z"), activo: true,
		recinto: { nombre: "Plaza Aníbal Pinto", calle: "Av. España 500", ciudad: "Valparaíso", capacidad: NumberInt(3500) },
		tickets_disponibles: [
			{ tipo: "General", precio: 9000, stock_disponible: NumberInt(1700), stock_inicial: NumberInt(1700) },
			{ tipo: "Niños", precio: 5000, stock_disponible: NumberInt(600), stock_inicial: NumberInt(600) }
		]
	},
	{
		codigo: "EVT-041", nombre: "Mundo Interior Live", categoria: "concierto", descripcion: "Estreno del nuevo hit", fecha_evento: new Date("2027-02-13T20:00:00.000Z"), activo: true,
		recinto: { nombre: "Estadio Bodoque", calle: "Av. Providencia 1234", ciudad: "Santiago", capacidad: NumberInt(5000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 15000, stock_disponible: NumberInt(850), stock_inicial: NumberInt(850) },
			{ tipo: "Estudiante", precio: 9000, stock_disponible: NumberInt(300), stock_inicial: NumberInt(300) }
		]
	},
	{
		codigo: "EVT-042", nombre: "Amurrao Tour", categoria: "concierto", descripcion: "Gira del tema Amurrao", fecha_evento: new Date("2027-02-14T22:00:00.000Z"), activo: true,
		recinto: { nombre: "Arena Maipú", calle: "Av. Pajaritos 2000", ciudad: "Santiago", capacidad: NumberInt(4000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 16000, stock_disponible: NumberInt(1500), stock_inicial: NumberInt(1500) },
			{ tipo: "VIP", precio: 41000, stock_disponible: NumberInt(400), stock_inicial: NumberInt(400) }
		]
	},
	{
		codigo: "EVT-043", nombre: "Arquitectura de Datos", categoria: "conferencia", descripcion: "Conferencia de diseño de sistemas", fecha_evento: new Date("2027-02-20T10:00:00.000Z"), activo: true,
		recinto: { nombre: "Hotel Savoy", calle: "Esmeralda 650", ciudad: "Valparaíso", capacidad: NumberInt(400) },
		tickets_disponibles: [
			{ tipo: "General", precio: 17000, stock_disponible: NumberInt(260), stock_inicial: NumberInt(260) },
			{ tipo: "Estudiante", precio: 9000, stock_disponible: NumberInt(140), stock_inicial: NumberInt(140) }
		]
	},
	{
		codigo: "EVT-044", nombre: "Calurosa Navidad 2027", categoria: "festival", descripcion: "Especial navideño en pleno verano", fecha_evento: new Date("2027-02-21T19:00:00.000Z"), activo: true,
		recinto: { nombre: "Playa El Tierra", calle: "Av. del Mar s/n", ciudad: "La Serena", capacidad: NumberInt(5000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 12000, stock_disponible: NumberInt(1800), stock_inicial: NumberInt(1800) },
			{ tipo: "Niños", precio: 7000, stock_disponible: NumberInt(500), stock_inicial: NumberInt(500) }
		]
	},
	{
		codigo: "EVT-045", nombre: "La Nube de Humo", categoria: "obra de teatro", descripcion: "Obra polémica de la temporada", fecha_evento: new Date("2027-02-27T19:30:00.000Z"), activo: true,
		recinto: { nombre: "Teatro Caupolicán", calle: "Rancagua 480", ciudad: "Santiago", capacidad: NumberInt(3000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 15000, stock_disponible: NumberInt(950), stock_inicial: NumberInt(950) },
			{ tipo: "Estudiante", precio: 8000, stock_disponible: NumberInt(200), stock_inicial: NumberInt(200) }
		]
	},
	{
		codigo: "EVT-046", nombre: "Arwrarwrirwrarwro Tour", categoria: "concierto", descripcion: "Show de Bombi y amigos", fecha_evento: new Date("2027-03-06T21:00:00.000Z"), activo: true,
		recinto: { nombre: "Teatro Municipal", calle: "Ahumada 560", ciudad: "Santiago", capacidad: NumberInt(1200) },
		tickets_disponibles: [
			{ tipo: "General", precio: 11000, stock_disponible: NumberInt(700), stock_inicial: NumberInt(700) },
			{ tipo: "Platea", precio: 19000, stock_disponible: NumberInt(280), stock_inicial: NumberInt(280) }
		]
	},
	{
		codigo: "EVT-047", nombre: "Drácula Calígula Tarántula", categoria: "concierto", descripcion: "Concierto teatralizado de terror", fecha_evento: new Date("2027-03-07T22:00:00.000Z"), activo: true,
		recinto: { nombre: "Parque de la Familia", calle: "Av. Libertadores 456", ciudad: "Valparaíso", capacidad: NumberInt(3000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 13000, stock_disponible: NumberInt(1300), stock_inicial: NumberInt(1300) },
			{ tipo: "VIP", precio: 34000, stock_disponible: NumberInt(300), stock_inicial: NumberInt(300) }
		]
	},
	{
		codigo: "EVT-048", nombre: "Eventos Masivos sin Caos", categoria: "conferencia", descripcion: "Operaciones de alto rendimiento", fecha_evento: new Date("2027-03-13T10:00:00.000Z"), activo: true,
		recinto: { nombre: "Centro de Convenciones", calle: "San Borja 456", ciudad: "Santiago", capacidad: NumberInt(800) },
		tickets_disponibles: [
			{ tipo: "General", precio: 12000, stock_disponible: NumberInt(590), stock_inicial: NumberInt(590) },
			{ tipo: "Estudiante", precio: 7000, stock_disponible: NumberInt(210), stock_inicial: NumberInt(210) }
		]
	},
	{
		codigo: "EVT-049", nombre: "Son Pololos Fest", categoria: "festival", descripcion: "Festival de la cuarta temporada", fecha_evento: new Date("2027-03-14T17:00:00.000Z"), activo: true,
		recinto: { nombre: "Parque Bustamante", calle: "Av. República 3400", ciudad: "Santiago", capacidad: NumberInt(5500) },
		tickets_disponibles: [
			{ tipo: "General", precio: 15000, stock_disponible: NumberInt(2400), stock_inicial: NumberInt(2400) },
			{ tipo: "Estudiante", precio: 8000, stock_disponible: NumberInt(800), stock_inicial: NumberInt(800) }
		]
	},
	{
		codigo: "EVT-050", nombre: "Tuki Tour de Clausura", categoria: "concierto", descripcion: "Cierre de temporada de Eventify", fecha_evento: new Date("2027-03-20T21:00:00.000Z"), activo: true,
		recinto: { nombre: "Estadio Bodoque", calle: "Av. Providencia 1234", ciudad: "Santiago", capacidad: NumberInt(5000) },
		tickets_disponibles: [
			{ tipo: "General", precio: 18000, stock_disponible: NumberInt(2100), stock_inicial: NumberInt(2100) },
			{ tipo: "VIP", precio: 45000, stock_disponible: NumberInt(500), stock_inicial: NumberInt(500) }
		]
	}
]);

// Obtener los _id reales de usuarios y eventos, como en los ejemplos de la profesora.
const u1 = db.usuarios.findOne({ email: "tulio@eventify.cl" })._id;
const u2 = db.usuarios.findOne({ email: "bodoque@eventify.cl" })._id;
const u3 = db.usuarios.findOne({ email: "juanin@eventify.cl" })._id;
const u4 = db.usuarios.findOne({ email: "policarpo@eventify.cl" })._id;
const u5 = db.usuarios.findOne({ email: "mariohugo@eventify.cl" })._id;
const u6 = db.usuarios.findOne({ email: "patana@eventify.cl" })._id;
const u7 = db.usuarios.findOne({ email: "calcetin@eventify.cl" })._id;
const u8 = db.usuarios.findOne({ email: "guaripolo@eventify.cl" })._id;
const u9 = db.usuarios.findOne({ email: "balonvonbola@eventify.cl" })._id;
const u10 = db.usuarios.findOne({ email: "raulguantecillo@eventify.cl" })._id;
const u11 = db.usuarios.findOne({ email: "mico@eventify.cl" })._id;
const u12 = db.usuarios.findOne({ email: "tenison@eventify.cl" })._id;
const u13 = db.usuarios.findOne({ email: "huachimingo@eventify.cl" })._id;
const u14 = db.usuarios.findOne({ email: "cindy@eventify.cl" })._id;
const u15 = db.usuarios.findOne({ email: "dante@eventify.cl" })._id;

const e1 = db.eventos.findOne({ codigo: "EVT-001" })._id;
const e2 = db.eventos.findOne({ codigo: "EVT-002" })._id;
const e3 = db.eventos.findOne({ codigo: "EVT-003" })._id;
const e4 = db.eventos.findOne({ codigo: "EVT-004" })._id;
const e5 = db.eventos.findOne({ codigo: "EVT-005" })._id;
const e6 = db.eventos.findOne({ codigo: "EVT-006" })._id;
const e7 = db.eventos.findOne({ codigo: "EVT-007" })._id;
const e8 = db.eventos.findOne({ codigo: "EVT-008" })._id;
const e9 = db.eventos.findOne({ codigo: "EVT-009" })._id;
const e10 = db.eventos.findOne({ codigo: "EVT-010" })._id;
const e11 = db.eventos.findOne({ codigo: "EVT-011" })._id;
const e12 = db.eventos.findOne({ codigo: "EVT-012" })._id;
const e13 = db.eventos.findOne({ codigo: "EVT-013" })._id;
const e14 = db.eventos.findOne({ codigo: "EVT-014" })._id;
const e15 = db.eventos.findOne({ codigo: "EVT-015" })._id;

// 3. ÓRDENES DE COMPRA (59) - ObjectId de usuarios y eventos
db.ordenes_compra.insertMany([
	{ usuario_id: u1, evento_id: e1, items: [{ tipo: "General", precio_unitario: 15000, cantidad: NumberInt(2), subtotal: 30000 }], total: 30000, fecha_compra: new Date("2026-07-20T15:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u1, evento_id: e2, items: [{ tipo: "General", precio_unitario: 20000, cantidad: NumberInt(2), subtotal: 40000 }, { tipo: "VIP", precio_unitario: 45000, cantidad: NumberInt(1), subtotal: 45000 }], total: 85000, fecha_compra: new Date("2026-07-22T10:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u1, evento_id: e3, items: [{ tipo: "General", precio_unitario: 8000, cantidad: NumberInt(3), subtotal: 24000 }, { tipo: "Niños", precio_unitario: 5000, cantidad: NumberInt(2), subtotal: 10000 }], total: 34000, fecha_compra: new Date("2026-08-01T12:45:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u1, evento_id: e4, items: [{ tipo: "General", precio_unitario: 12000, cantidad: NumberInt(2), subtotal: 24000 }, { tipo: "Platea", precio_unitario: 20000, cantidad: NumberInt(2), subtotal: 40000 }], total: 64000, fecha_compra: new Date("2026-08-10T09:15:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u1, evento_id: e5, items: [{ tipo: "General", precio_unitario: 10000, cantidad: NumberInt(4), subtotal: 40000 }, { tipo: "VIP", precio_unitario: 35000, cantidad: NumberInt(1), subtotal: 35000 }], total: 75000, fecha_compra: new Date("2026-08-25T17:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u2, evento_id: e1, items: [{ tipo: "Platea", precio_unitario: 25000, cantidad: NumberInt(2), subtotal: 50000 }], total: 50000, fecha_compra: new Date("2026-07-21T11:20:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u2, evento_id: e2, items: [{ tipo: "General", precio_unitario: 20000, cantidad: NumberInt(2), subtotal: 40000 }, { tipo: "VIP", precio_unitario: 45000, cantidad: NumberInt(1), subtotal: 45000 }], total: 85000, fecha_compra: new Date("2026-07-25T14:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u2, evento_id: e6, items: [{ tipo: "General", precio_unitario: 12000, cantidad: NumberInt(3), subtotal: 36000 }, { tipo: "Estudiante", precio_unitario: 7000, cantidad: NumberInt(2), subtotal: 14000 }], total: 50000, fecha_compra: new Date("2026-09-01T16:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u2, evento_id: e7, items: [{ tipo: "General", precio_unitario: 7000, cantidad: NumberInt(6), subtotal: 42000 }, { tipo: "Niños", precio_unitario: 5000, cantidad: NumberInt(2), subtotal: 10000 }], total: 52000, fecha_compra: new Date("2026-09-05T10:45:00.000Z"), estado: "pendiente", confirmado: false },
	{ usuario_id: u2, evento_id: e8, items: [{ tipo: "General", precio_unitario: 14000, cantidad: NumberInt(4), subtotal: 56000 }], total: 56000, fecha_compra: new Date("2026-09-10T13:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u3, evento_id: e1, items: [{ tipo: "General", precio_unitario: 15000, cantidad: NumberInt(2), subtotal: 30000 }, { tipo: "Platea", precio_unitario: 25000, cantidad: NumberInt(3), subtotal: 75000 }], total: 105000, fecha_compra: new Date("2026-07-25T18:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u3, evento_id: e3, items: [{ tipo: "General", precio_unitario: 8000, cantidad: NumberInt(3), subtotal: 24000 }, { tipo: "Niños", precio_unitario: 5000, cantidad: NumberInt(3), subtotal: 15000 }], total: 39000, fecha_compra: new Date("2026-08-03T12:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u3, evento_id: e5, items: [{ tipo: "General", precio_unitario: 10000, cantidad: NumberInt(3), subtotal: 30000 }, { tipo: "VIP", precio_unitario: 35000, cantidad: NumberInt(1), subtotal: 35000 }], total: 65000, fecha_compra: new Date("2026-08-18T15:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u3, evento_id: e7, items: [{ tipo: "General", precio_unitario: 7000, cantidad: NumberInt(5), subtotal: 35000 }, { tipo: "Niños", precio_unitario: 5000, cantidad: NumberInt(4), subtotal: 20000 }], total: 55000, fecha_compra: new Date("2026-09-02T19:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u3, evento_id: e9, items: [{ tipo: "General", precio_unitario: 10000, cantidad: NumberInt(4), subtotal: 40000 }, { tipo: "VIP", precio_unitario: 35000, cantidad: NumberInt(1), subtotal: 35000 }], total: 75000, fecha_compra: new Date("2026-09-15T11:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u4, evento_id: e2, items: [{ tipo: "General", precio_unitario: 20000, cantidad: NumberInt(3), subtotal: 60000 }, { tipo: "VIP", precio_unitario: 45000, cantidad: NumberInt(1), subtotal: 45000 }], total: 105000, fecha_compra: new Date("2026-07-28T09:45:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u4, evento_id: e4, items: [{ tipo: "General", precio_unitario: 12000, cantidad: NumberInt(4), subtotal: 48000 }, { tipo: "Platea", precio_unitario: 20000, cantidad: NumberInt(2), subtotal: 40000 }], total: 88000, fecha_compra: new Date("2026-08-12T14:15:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u4, evento_id: e6, items: [{ tipo: "General", precio_unitario: 12000, cantidad: NumberInt(5), subtotal: 60000 }], total: 60000, fecha_compra: new Date("2026-09-08T10:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u4, evento_id: e8, items: [{ tipo: "General", precio_unitario: 14000, cantidad: NumberInt(4), subtotal: 56000 }, { tipo: "Platea", precio_unitario: 22000, cantidad: NumberInt(2), subtotal: 44000 }], total: 100000, fecha_compra: new Date("2026-09-18T16:45:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u4, evento_id: e10, items: [{ tipo: "General", precio_unitario: 9000, cantidad: NumberInt(5), subtotal: 45000 }, { tipo: "Estudiante", precio_unitario: 6000, cantidad: NumberInt(3), subtotal: 18000 }], total: 63000, fecha_compra: new Date("2026-07-30T13:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u5, evento_id: e3, items: [{ tipo: "General", precio_unitario: 8000, cantidad: NumberInt(4), subtotal: 32000 }, { tipo: "Niños", precio_unitario: 5000, cantidad: NumberInt(4), subtotal: 20000 }], total: 52000, fecha_compra: new Date("2026-08-05T11:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u5, evento_id: e5, items: [{ tipo: "General", precio_unitario: 10000, cantidad: NumberInt(4), subtotal: 40000 }, { tipo: "VIP", precio_unitario: 35000, cantidad: NumberInt(2), subtotal: 70000 }], total: 110000, fecha_compra: new Date("2026-08-20T18:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u5, evento_id: e7, items: [{ tipo: "General", precio_unitario: 7000, cantidad: NumberInt(6), subtotal: 42000 }], total: 42000, fecha_compra: new Date("2026-09-12T12:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u5, evento_id: e9, items: [{ tipo: "General", precio_unitario: 10000, cantidad: NumberInt(6), subtotal: 60000 }, { tipo: "VIP", precio_unitario: 35000, cantidad: NumberInt(1), subtotal: 35000 }], total: 95000, fecha_compra: new Date("2026-09-25T15:15:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u5, evento_id: e11, items: [{ tipo: "General", precio_unitario: 13000, cantidad: NumberInt(5), subtotal: 65000 }], total: 65000, fecha_compra: new Date("2026-07-15T17:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u6, evento_id: e1, items: [{ tipo: "Estudiante", precio_unitario: 8000, cantidad: NumberInt(4), subtotal: 32000 }], total: 32000, fecha_compra: new Date("2026-07-26T10:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u6, evento_id: e2, items: [{ tipo: "General", precio_unitario: 20000, cantidad: NumberInt(2), subtotal: 40000 }, { tipo: "VIP", precio_unitario: 45000, cantidad: NumberInt(1), subtotal: 45000 }], total: 85000, fecha_compra: new Date("2026-07-29T14:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u6, evento_id: e4, items: [{ tipo: "General", precio_unitario: 12000, cantidad: NumberInt(5), subtotal: 60000 }], total: 60000, fecha_compra: new Date("2026-08-14T16:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u6, evento_id: e6, items: [{ tipo: "Estudiante", precio_unitario: 7000, cantidad: NumberInt(6), subtotal: 42000 }], total: 42000, fecha_compra: new Date("2026-09-11T09:45:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u6, evento_id: e9, items: [{ tipo: "General", precio_unitario: 10000, cantidad: NumberInt(4), subtotal: 40000 }, { tipo: "VIP", precio_unitario: 35000, cantidad: NumberInt(2), subtotal: 70000 }], total: 110000, fecha_compra: new Date("2026-10-01T11:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u6, evento_id: e12, items: [{ tipo: "General", precio_unitario: 7000, cantidad: NumberInt(6), subtotal: 42000 }, { tipo: "Niños", precio_unitario: 4000, cantidad: NumberInt(3), subtotal: 12000 }], total: 54000, fecha_compra: new Date("2026-07-18T15:45:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u7, evento_id: e3, items: [{ tipo: "General", precio_unitario: 8000, cantidad: NumberInt(6), subtotal: 48000 }], total: 48000, fecha_compra: new Date("2026-08-06T13:15:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u7, evento_id: e5, items: [{ tipo: "General", precio_unitario: 10000, cantidad: NumberInt(5), subtotal: 50000 }], total: 50000, fecha_compra: new Date("2026-08-22T11:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u7, evento_id: e7, items: [{ tipo: "General", precio_unitario: 7000, cantidad: NumberInt(5), subtotal: 35000 }, { tipo: "Niños", precio_unitario: 5000, cantidad: NumberInt(3), subtotal: 15000 }], total: 50000, fecha_compra: new Date("2026-09-14T10:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u7, evento_id: e10, items: [{ tipo: "General", precio_unitario: 9000, cantidad: NumberInt(4), subtotal: 36000 }, { tipo: "Estudiante", precio_unitario: 6000, cantidad: NumberInt(2), subtotal: 12000 }], total: 48000, fecha_compra: new Date("2026-07-31T12:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u7, evento_id: e13, items: [{ tipo: "General", precio_unitario: 11000, cantidad: NumberInt(4), subtotal: 44000 }, { tipo: "VIP", precio_unitario: 30000, cantidad: NumberInt(2), subtotal: 60000 }], total: 104000, fecha_compra: new Date("2026-07-24T18:15:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u8, evento_id: e2, items: [{ tipo: "General", precio_unitario: 20000, cantidad: NumberInt(3), subtotal: 60000 }], total: 60000, fecha_compra: new Date("2026-07-27T15:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u8, evento_id: e4, items: [{ tipo: "Platea", precio_unitario: 20000, cantidad: NumberInt(3), subtotal: 60000 }], total: 60000, fecha_compra: new Date("2026-08-16T10:45:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u8, evento_id: e6, items: [{ tipo: "General", precio_unitario: 12000, cantidad: NumberInt(4), subtotal: 48000 }, { tipo: "Estudiante", precio_unitario: 7000, cantidad: NumberInt(2), subtotal: 14000 }], total: 62000, fecha_compra: new Date("2026-09-03T14:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u8, evento_id: e8, items: [{ tipo: "General", precio_unitario: 14000, cantidad: NumberInt(5), subtotal: 70000 }], total: 70000, fecha_compra: new Date("2026-09-20T16:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u8, evento_id: e11, items: [{ tipo: "General", precio_unitario: 13000, cantidad: NumberInt(5), subtotal: 65000 }, { tipo: "Platea", precio_unitario: 21000, cantidad: NumberInt(2), subtotal: 42000 }], total: 107000, fecha_compra: new Date("2026-07-16T11:15:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u11, evento_id: e1, items: [{ tipo: "Estudiante", precio_unitario: 8000, cantidad: NumberInt(5), subtotal: 40000 }], total: 40000, fecha_compra: new Date("2026-07-23T17:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u11, evento_id: e5, items: [{ tipo: "General", precio_unitario: 10000, cantidad: NumberInt(5), subtotal: 50000 }, { tipo: "VIP", precio_unitario: 35000, cantidad: NumberInt(2), subtotal: 70000 }], total: 120000, fecha_compra: new Date("2026-08-28T13:45:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u11, evento_id: e7, items: [{ tipo: "General", precio_unitario: 7000, cantidad: NumberInt(5), subtotal: 35000 }, { tipo: "Niños", precio_unitario: 5000, cantidad: NumberInt(3), subtotal: 15000 }], total: 50000, fecha_compra: new Date("2026-09-16T18:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u11, evento_id: e10, items: [{ tipo: "General", precio_unitario: 9000, cantidad: NumberInt(5), subtotal: 45000 }], total: 45000, fecha_compra: new Date("2026-08-01T10:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u11, evento_id: e14, items: [{ tipo: "General", precio_unitario: 9000, cantidad: NumberInt(4), subtotal: 36000 }, { tipo: "Estudiante", precio_unitario: 5000, cantidad: NumberInt(3), subtotal: 15000 }], total: 51000, fecha_compra: new Date("2026-09-10T12:00:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u14, evento_id: e4, items: [{ tipo: "General", precio_unitario: 12000, cantidad: NumberInt(4), subtotal: 48000 }], total: 48000, fecha_compra: new Date("2026-08-18T09:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u14, evento_id: e6, items: [{ tipo: "General", precio_unitario: 12000, cantidad: NumberInt(5), subtotal: 60000 }, { tipo: "Estudiante", precio_unitario: 7000, cantidad: NumberInt(3), subtotal: 21000 }], total: 81000, fecha_compra: new Date("2026-09-06T15:30:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u14, evento_id: e9, items: [{ tipo: "General", precio_unitario: 10000, cantidad: NumberInt(5), subtotal: 50000 }, { tipo: "VIP", precio_unitario: 35000, cantidad: NumberInt(2), subtotal: 70000 }], total: 120000, fecha_compra: new Date("2026-09-30T14:45:00.000Z"), estado: "cancelada", confirmado: false },
	{ usuario_id: u14, evento_id: e12, items: [{ tipo: "General", precio_unitario: 7000, cantidad: NumberInt(5), subtotal: 35000 }, { tipo: "Niños", precio_unitario: 4000, cantidad: NumberInt(3), subtotal: 12000 }], total: 47000, fecha_compra: new Date("2026-07-19T16:20:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u14, evento_id: e15, items: [{ tipo: "General", precio_unitario: 16000, cantidad: NumberInt(4), subtotal: 64000 }, { tipo: "Platea", precio_unitario: 26000, cantidad: NumberInt(2), subtotal: 52000 }], total: 116000, fecha_compra: new Date("2026-09-08T17:45:00.000Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u7, evento_id: e2, items: [{ tipo: "General", precio_unitario: 20000, cantidad: NumberInt(1), subtotal: 20000 }], total: 20000, fecha_compra: new Date("2026-08-10T21:00:00Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u14, evento_id: e2, items: [{ tipo: "General", precio_unitario: 20000, cantidad: NumberInt(1), subtotal: 20000 }], total: 20000, fecha_compra: new Date("2026-08-10T21:00:00Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u11, evento_id: e3, items: [{ tipo: "General", precio_unitario: 8000, cantidad: NumberInt(1), subtotal: 8000 }], total: 8000, fecha_compra: new Date("2026-08-17T18:00:00Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u2, evento_id: e7, items: [{ tipo: "General", precio_unitario: 7000, cantidad: NumberInt(1), subtotal: 7000 }], total: 7000, fecha_compra: new Date("2026-09-14T17:00:00Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u14, evento_id: e8, items: [{ tipo: "General", precio_unitario: 14000, cantidad: NumberInt(1), subtotal: 14000 }], total: 14000, fecha_compra: new Date("2026-09-21T19:00:00Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u1, evento_id: e8, items: [{ tipo: "General", precio_unitario: 14000, cantidad: NumberInt(1), subtotal: 14000 }], total: 14000, fecha_compra: new Date("2026-09-21T19:00:00Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u14, evento_id: e9, items: [{ tipo: "General", precio_unitario: 10000, cantidad: NumberInt(1), subtotal: 10000 }], total: 10000, fecha_compra: new Date("2026-09-28T21:00:00Z"), estado: "confirmada", confirmado: true },
	{ usuario_id: u2, evento_id: e12, items: [{ tipo: "General", precio_unitario: 7000, cantidad: NumberInt(1), subtotal: 7000 }], total: 7000, fecha_compra: new Date("2026-08-11T16:00:00Z"), estado: "confirmada", confirmado: true }
]);

// 4. RESEÑAS (51) - Reseñas de personas con compra confirmada
db.resenas_evaluaciones.insertMany([
	{ usuario_id: u2, evento_id: e1, puntuacion: NumberInt(5), comentario: "Espectáculo increíble, mejor que el programa", fecha_resena: new Date("2026-08-16T23:00:00.000Z"), recomendado: true },
	{ usuario_id: u3, evento_id: e1, puntuacion: NumberInt(4), comentario: "Muy bueno pero la fila para el baño fue eterna", fecha_resena: new Date("2026-08-17T10:00:00.000Z"), recomendado: true },
	{ usuario_id: u6, evento_id: e1, puntuacion: NumberInt(5), comentario: "Volvería una y otra vez", fecha_resena: new Date("2026-08-17T12:30:00.000Z"), recomendado: true },
	{ usuario_id: u11, evento_id: e1, puntuacion: NumberInt(4), comentario: "Buena música, malos precios de la comida", fecha_resena: new Date("2026-08-18T09:00:00.000Z"), recomendado: true },
	{ usuario_id: u1, evento_id: e1, puntuacion: NumberInt(5), comentario: "Lo organizé y quedó perfecto", fecha_resena: new Date("2026-08-18T14:00:00.000Z"), recomendado: true },
	{ usuario_id: u4, evento_id: e2, puntuacion: NumberInt(5), comentario: "La gira mundial no decepcionó", fecha_resena: new Date("2026-08-23T11:00:00.000Z"), recomendado: true },
	{ usuario_id: u7, evento_id: e2, puntuacion: NumberInt(4), comentario: "Excelente sonido en la Arena", fecha_resena: new Date("2026-08-24T15:30:00.000Z"), recomendado: true },
	{ usuario_id: u8, evento_id: e2, puntuacion: NumberInt(3), comentario: "Caro para lo que dura el show", fecha_resena: new Date("2026-08-24T18:00:00.000Z"), recomendado: false },
	{ usuario_id: u14, evento_id: e2, puntuacion: NumberInt(5), comentario: "Asiento VIP valió cada peso", fecha_resena: new Date("2026-08-25T10:00:00.000Z"), recomendado: true },
	{ usuario_id: u2, evento_id: e2, puntuacion: NumberInt(4), comentario: "Muy organizado, acceso rápido", fecha_resena: new Date("2026-08-25T16:00:00.000Z"), recomendado: true },
	{ usuario_id: u1, evento_id: e3, puntuacion: NumberInt(4), comentario: "Perfecto para ir con los cabros chicos", fecha_resena: new Date("2026-08-30T19:00:00.000Z"), recomendado: true },
	{ usuario_id: u5, evento_id: e3, puntuacion: NumberInt(5), comentario: "Las sopaipillas eran gratis, 10 de 10", fecha_resena: new Date("2026-08-31T11:00:00.000Z"), recomendado: true },
	{ usuario_id: u7, evento_id: e3, puntuacion: NumberInt(3), comentario: "Mucha gente, poco espacio", fecha_resena: new Date("2026-08-31T14:30:00.000Z"), recomendado: false },
	{ usuario_id: u11, evento_id: e3, puntuacion: NumberInt(4), comentario: "Buen ambiente familiar", fecha_resena: new Date("2026-09-01T10:00:00.000Z"), recomendado: true },
	{ usuario_id: u3, evento_id: e3, puntuacion: NumberInt(5), comentario: "Se vendía todo, se comió todo", fecha_resena: new Date("2026-09-01T17:00:00.000Z"), recomendado: true },
	{ usuario_id: u4, evento_id: e4, puntuacion: NumberInt(5), comentario: "Actuación memorable del Comparado", fecha_resena: new Date("2026-09-06T12:00:00.000Z"), recomendado: true },
	{ usuario_id: u6, evento_id: e4, puntuacion: NumberInt(4), comentario: "Obra corta pero muy bien hecha", fecha_resena: new Date("2026-09-06T18:00:00.000Z"), recomendado: true },
	{ usuario_id: u8, evento_id: e4, puntuacion: NumberInt(5), comentario: "Me reí hasta llorar", fecha_resena: new Date("2026-09-07T09:30:00.000Z"), recomendado: true },
	{ usuario_id: u14, evento_id: e4, puntuacion: NumberInt(4), comentario: "Teatro impecable y buena acústica", fecha_resena: new Date("2026-09-07T15:00:00.000Z"), recomendado: true },
	{ usuario_id: u1, evento_id: e4, puntuacion: NumberInt(3), comentario: "Esperaba más efectos especiales", fecha_resena: new Date("2026-09-08T11:00:00.000Z"), recomendado: false },
	{ usuario_id: u3, evento_id: e5, puntuacion: NumberInt(4), comentario: "Guaripolo subió a bailar con el público", fecha_resena: new Date("2026-09-13T13:00:00.000Z"), recomendado: true },
	{ usuario_id: u5, evento_id: e5, puntuacion: NumberInt(5), comentario: "El mejor concierto del año", fecha_resena: new Date("2026-09-13T20:00:00.000Z"), recomendado: true },
	{ usuario_id: u11, evento_id: e5, puntuacion: NumberInt(3), comentario: "Demasiado ruido para el teatro", fecha_resena: new Date("2026-09-14T10:30:00.000Z"), recomendado: false },
	{ usuario_id: u1, evento_id: e5, puntuacion: NumberInt(4), comentario: "Buena energía del público", fecha_resena: new Date("2026-09-14T16:00:00.000Z"), recomendado: true },
	{ usuario_id: u2, evento_id: e6, puntuacion: NumberInt(5), comentario: "Charla útil hasta para periodistas", fecha_resena: new Date("2026-09-20T14:00:00.000Z"), recomendado: true },
	{ usuario_id: u4, evento_id: e6, puntuacion: NumberInt(4), comentario: "Buen contenido, café mediocre", fecha_resena: new Date("2026-09-21T16:00:00.000Z"), recomendado: true },
	{ usuario_id: u6, evento_id: e6, puntuacion: NumberInt(5), comentario: "Me llevo ideas para el trabajo", fecha_resena: new Date("2026-09-21T18:00:00.000Z"), recomendado: true },
	{ usuario_id: u8, evento_id: e6, puntuacion: NumberInt(4), comentario: "Conferencia clara y entretenida", fecha_resena: new Date("2026-09-22T11:00:00.000Z"), recomendado: true },
	{ usuario_id: u14, evento_id: e6, puntuacion: NumberInt(5), comentario: "Los datos siempre ganan", fecha_resena: new Date("2026-09-22T15:30:00.000Z"), recomendado: true },
	{ usuario_id: u2, evento_id: e7, puntuacion: NumberInt(4), comentario: "Los niños bailaron todo el show", fecha_resena: new Date("2026-09-27T19:00:00.000Z"), recomendado: true },
	{ usuario_id: u5, evento_id: e7, puntuacion: NumberInt(5), comentario: "Festival mágico para las familias", fecha_resena: new Date("2026-09-28T10:00:00.000Z"), recomendado: true },
	{ usuario_id: u7, evento_id: e7, puntuacion: NumberInt(4), comentario: "Excelente línea de productos", fecha_resena: new Date("2026-09-28T14:00:00.000Z"), recomendado: true },
	{ usuario_id: u11, evento_id: e7, puntuacion: NumberInt(3), comentario: "Muy largo para los más pequeños", fecha_resena: new Date("2026-09-29T11:30:00.000Z"), recomendado: false },
	{ usuario_id: u3, evento_id: e7, puntuacion: NumberInt(5), comentario: "Diversión garantizada", fecha_resena: new Date("2026-09-29T17:00:00.000Z"), recomendado: true },
	{ usuario_id: u4, evento_id: e8, puntuacion: NumberInt(5), comentario: "Romeo y Julieta versión 31 Minutos, genial", fecha_resena: new Date("2026-10-04T12:00:00.000Z"), recomendado: true },
	{ usuario_id: u8, evento_id: e8, puntuacion: NumberInt(4), comentario: "Reparto carismático", fecha_resena: new Date("2026-10-04T18:00:00.000Z"), recomendado: true },
	{ usuario_id: u14, evento_id: e8, puntuacion: NumberInt(4), comentario: "Vestuario espectacular", fecha_resena: new Date("2026-10-05T10:00:00.000Z"), recomendado: true },
	{ usuario_id: u2, evento_id: e8, puntuacion: NumberInt(3), comentario: "El final cambió mucho del original", fecha_resena: new Date("2026-10-05T16:30:00.000Z"), recomendado: false },
	{ usuario_id: u1, evento_id: e8, puntuacion: NumberInt(5), comentario: "Una puesta en escena impecable", fecha_resena: new Date("2026-10-06T11:00:00.000Z"), recomendado: true },
	{ usuario_id: u3, evento_id: e9, puntuacion: NumberInt(5), comentario: "El Ranking Top en vivo es otra cosa", fecha_resena: new Date("2026-10-11T13:00:00.000Z"), recomendado: true },
	{ usuario_id: u5, evento_id: e9, puntuacion: NumberInt(4), comentario: "Policarpo se trabó de nuevo y fue épico", fecha_resena: new Date("2026-10-11T19:00:00.000Z"), recomendado: true },
	{ usuario_id: u6, evento_id: e9, puntuacion: NumberInt(5), comentario: "Cantamos todos hasta quedarnos sin voz", fecha_resena: new Date("2026-10-12T10:00:00.000Z"), recomendado: true },
	{ usuario_id: u14, evento_id: e9, puntuacion: NumberInt(4), comentario: "Buen organización de salidas", fecha_resena: new Date("2026-10-12T15:00:00.000Z"), recomendado: true },
	{ usuario_id: u4, evento_id: e10, puntuacion: NumberInt(5), comentario: "Bodoque habló con el corazón", fecha_resena: new Date("2026-08-09T14:00:00.000Z"), recomendado: true },
	{ usuario_id: u7, evento_id: e10, puntuacion: NumberInt(4), comentario: "Charla inspiradora", fecha_resena: new Date("2026-08-10T11:00:00.000Z"), recomendado: true },
	{ usuario_id: u11, evento_id: e10, puntuacion: NumberInt(5), comentario: "Mejoró mi forma de entrevistar", fecha_resena: new Date("2026-08-10T17:30:00.000Z"), recomendado: true },
	{ usuario_id: u5, evento_id: e11, puntuacion: NumberInt(4), comentario: "Obra tierna y bien actuada", fecha_resena: new Date("2026-08-17T12:00:00.000Z"), recomendado: true },
	{ usuario_id: u8, evento_id: e11, puntuacion: NumberInt(5), comentario: "Bombi es una leyenda", fecha_resena: new Date("2026-08-18T16:00:00.000Z"), recomendado: true },
	{ usuario_id: u2, evento_id: e12, puntuacion: NumberInt(3), comentario: "Bonito festival pero muy concurrido", fecha_resena: new Date("2026-08-24T13:00:00.000Z"), recomendado: false },
	{ usuario_id: u6, evento_id: e12, puntuacion: NumberInt(4), comentario: "Comida rica y música en vivo", fecha_resena: new Date("2026-08-25T11:00:00.000Z"), recomendado: true },
	{ usuario_id: u14, evento_id: e12, puntuacion: NumberInt(4), comentario: "Buena ubicación junto al puerto", fecha_resena: new Date("2026-08-26T15:00:00.000Z"), recomendado: true }
]);

// Verificar cuántos documentos quedaron guardados
print("Usuarios: " + db.usuarios.countDocuments());
print("Eventos: " + db.eventos.countDocuments());
print("Órdenes: " + db.ordenes_compra.countDocuments());
print("Reseñas: " + db.resenas_evaluaciones.countDocuments());
