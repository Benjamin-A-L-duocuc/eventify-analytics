// CONSULTA 1: Detalle de las compras confirmadas de Juanín en Santiago y gasto total.
use('eventify_db');
{
  const usuario = db.usuarios.findOne({ email: "juanin@eventify.cl" });

  if (!usuario) {
    print("No se encontró el usuario indicado.");
  } else {
    db.ordenes_compra.aggregate([
      { $match: { usuario_id: usuario._id, estado: "confirmada" } },
      {
        $lookup: {
          from: "eventos",
          localField: "evento_id",
          foreignField: "_id",
          as: "detalle_evento"
        }
      },
      { $unwind: "$detalle_evento" },
      { $match: { "detalle_evento.recinto.ciudad": "Santiago" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$usuario_id",
          gasto_total: { $sum: "$items.subtotal" },
          compras: {
            $push: {
              evento: "$detalle_evento.nombre",
              tipo_ticket: "$items.tipo",
              cantidad: "$items.cantidad",
              subtotal: "$items.subtotal"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          gasto_total: 1,
          compras: { $slice: ["$compras", 5] }
        }
      }
    ]).forEach(doc => printjson(doc));
  }
}


// CONSULTA 2: Ventas confirmadas por evento, porcentaje vendido y rendimiento.
use('eventify_db');
{
  db.ordenes_compra.aggregate([
    { $match: { estado: "confirmada", confirmado: true } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$evento_id",
        total_recaudado: { $sum: "$items.subtotal" },
        tickets_vendidos: { $sum: "$items.cantidad" }
      }
    },
    {
      $lookup: {
        from: "eventos",
        localField: "_id",
        foreignField: "_id",
        as: "evento"
      }
    },
    { $unwind: "$evento" },
    {
      $addFields: {
        stock_inicial: { $sum: "$evento.tickets_disponibles.stock_inicial" }
      }
    },
    {
      $addFields: {
        porcentaje_venta: {
          $cond: [
            { $gt: ["$stock_inicial", 0] },
            { $multiply: [{ $divide: ["$tickets_vendidos", "$stock_inicial"] }, 100] },
            0
          ]
        }
      }
    },
    {
      $project: {
        _id: 0,
        nombre_evento: "$evento.nombre",
        ciudad: "$evento.recinto.ciudad",
        total_recaudado: 1,
        tickets_vendidos: 1,
        stock_inicial: 1,
        porcentaje_venta: { $round: ["$porcentaje_venta", 2] },
        etiqueta: {
          $cond: [
            { $gte: ["$porcentaje_venta", 70] },
            "Exitoso",
            "Por Mejorar"
          ]
        }
      }
    },
    { $sort: { total_recaudado: -1 } },
    { $limit: 5 }
  ]).forEach(doc => printjson(doc));
}


// CONSULTA 3: Eventos futuros en Santiago con tickets bajo $15.000 y stock disponible.
use('eventify_db');
{
  db.eventos.aggregate([
    {
      $match: {
        activo: true,
        fecha_evento: { $gt: new Date() },
        "recinto.ciudad": "Santiago",
        tickets_disponibles: {
          $elemMatch: {
            precio: { $lt: 15000 },
            stock_disponible: { $gt: 0 }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        codigo: 1,
        nombre: 1,
        categoria: 1,
        fecha_evento: 1,
        ciudad: "$recinto.ciudad",
        tickets: {
          $filter: {
            input: "$tickets_disponibles",
            as: "ticket",
            cond: {
              $and: [
                { $lt: ["$$ticket.precio", 15000] },
                { $gt: ["$$ticket.stock_disponible", 0] }
              ]
            }
          }
        }
      }
    },
    { $sort: { fecha_evento: 1 } },
    { $limit: 5 }
  ]).forEach(doc => printjson(doc));
}


// CONSULTA 4: Analizar el stock de eventos futuros e identificar tickets con riesgo de agotarse.
use('eventify_db');
{
  db.eventos.aggregate([
    { $match: { activo: true, fecha_evento: { $gt: new Date() } } },
    {
      $addFields: {
        tickets_analizados: {
          $map: {
            input: "$tickets_disponibles",
            as: "t",
            in: {
              tipo: "$$t.tipo",
              precio: "$$t.precio",
              stock_disponible: "$$t.stock_disponible",
              bajo_stock: { $lt: ["$$t.stock_disponible", 200] }
            }
          }
        }
      }
    },
    {
      $addFields: {
        stock_total: { $sum: "$tickets_analizados.stock_disponible" },
        hay_bajo_stock: { $in: [true, "$tickets_analizados.bajo_stock"] }
      }
    },
    {
      $addFields: {
        estado_stock: {
          $cond: ["$hay_bajo_stock", "Revisar disponibilidad", "Stock suficiente"]
        }
      }
    },
    {
      $project: {
        _id: 0,
        codigo: 1,
        nombre: 1,
        ciudad: "$recinto.ciudad",
        fecha_evento: 1,
        stock_total: 1,
        estado_stock: 1,
        tickets_analizados: 1
      }
    },
    { $sort: { stock_total: 1 } },
    { $limit: 5 }
  ]).forEach(doc => printjson(doc));
}
