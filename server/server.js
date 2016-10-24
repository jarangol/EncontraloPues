 // Set up

var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var personasSchema = new mongoose.Schema({
  _id : String,
  contraseña : String,
  nombre : String,
  usuario : new mongoose.Schema({
    celular : String,
    objetosPersonales : [
      {
        codigoQR : String,
        tags : [String],
        disponible : Boolean,
        notificaciones : [
          {
            // Notificacion de un Lugar
            _idLugar : String,
            nombrePuntoRecolecion : String,
            objetoCodigoBusqueda : String,

            // Notificacion de un Usuario
            _idUsuario : String,
            fechaRegistro : {
              añoMes : String,
              dia : String
            }
          }
        ]
      }
    ]
  }),
  lugar : new mongoose.Schema({
    trabajadores : {type: [String], index: true},
    puntosRecoleccion : [
      {
        nombre : String,
        telefono : String,
        direccion : String,
        disponible : Boolean,
        objetosPerdidos : [
          {
            codigoBusqueda : String,
            correoTrabajadorRegistro : String,
            fechaRegistro : {
              añoMes : String,
              dia : String
            },
            sinCodigoQR : new mongoose.Schema({
              tags : [String],
              descripcionOculta : String
            }),
            codigoQR : new mongoose.Schema({
              correoUsuario : String,
              objetoPersonalCodigoQR : String,
              codigoRetiro : String
            })
          }
        ],
        objetosRetirados : [
          {
            correoTrabajadorRegistro : String,
            codigoBusqueda : String,
            fechaRegistro : {
              añoMes : String,
              dia : String
            },
            sinCodigoQR : new mongoose.Schema({
              tags : [String],
              descripcionOculta : String
            }),
            codigoQR : new mongoose.Schema({
              correoUsuario : String,
              objetoPersonalCodigoQR : String,
              codigoRetiro : String,
            }),
            retirado : new mongoose.Schema({
              correoTrabajadorRetiro : String,
              fechaRetiro : {
                añoMes : String,
                dia : String
              },
              personaReclamo : new mongoose.Schema({
                numeroId : String,
                nombre : String,
                celular : String
              }),
              donado : new mongoose.Schema({
                fechaDonado : {
                  año : String,
                  mes : String,
                  dia : String
                }
              })
            })
          }
        ]
      }
    ]
  }),
  trabajador : new mongoose.Schema({
    numeroId : String
  })
});

var contadoresSchema = new mongoose.Schema({
  _id : String,
  seq : Number,
  sequence_value : Number
});

personasSchema.index({'usuario.objetosPersonales.codigoQR': 1, 'usuario.objetosPersonales.disponible': -1});
personasSchema.index({'lugar.puntosRecoleccion.nombre': 1, 'lugar.puntosRecoleccion.disponible' : -1});


//Model
var persona = mongoose.model('personas',personasSchema);
var contador = mongoose.model('contadores',contadoresSchema);

//Function
function incrementarValor(sequenceName, callback) {
  contador.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true },
    callback
  );
}

function fechaActual() {
  date = new Date();
  month = '' + (date.getMonth() + 1);
  if (month.length < 2) month = '0' + month;
  return { añoMes: [date.getFullYear(), month].join('-'), dia: date.getDate().toString() }
}


app.post('/api/registrarUsuario', function (req, res) {
  (new persona({
    _id: req.body.correoUsuario,
    contraseña: req.body.contraseña,
    nombre: req.body.nombre,
    usuario: {
      celular: req.body.celular,
      objetosPersonales: []
    }
  })).save(function (err, resu) {
    if (!err) {
      res.json({ correcto: true, mensaje: 'Se ha creado la cuenta exitosamente' });
    } else {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.json({ correcto: false, mensaje: 'Error: El correo Electronico ya esta en uso' });
      }
      res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
    }
  });
});

app.post('/api/registrarLugar', function (req, res) {
  (new persona({
    _id: req.body.correoLugar,
    contraseña: req.body.contraseña,
    nombre: req.body.nombre,
    lugar: {
      trabajadores: [],
      puntosRecoleccion: []
    }
  })).save(function (err, resu) {
    if (!err) {
      res.json({ correcto: true, mensaje: 'Se ha creado la cuenta exitosamente' });
    } else {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.json({ correcto: false, mensaje: 'Error: El correo Electronico ya esta en uso' });
      }
      res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
    }
  });
});

//Pendiente
app.post('/api/registrarTrabajador', function (req, res) {
  (new persona({
    _id: req.body.correoTrabajador,
    contraseña: req.body.contraseña,
    nombre: req.body.nombre,
    trabajador: {
      numeroId: req.body.numeroId,
    }
  })).save(function (err, resu) {
    if (err) res.send(false);
    persona.findOneAndUpdate({ _id: req.body.correoLugar },
      { $push: { "lugar.trabajadores": req.body.correoTrabajador } },
      function (err, doc) {
        if (err) res.send(false);
        res.send(true);
      });
  });
});

app.post('/api/registrarObjetoPersonal', function (req, res) {
  persona.findOneAndUpdate(
    { _id: req.body.correoUsuario },
    {
      $push: {
        "usuario.objetosPersonales": {
          codigoQR: mongoose.Types.ObjectId(),
          tags: req.body.arregloTags,
          disponible: true,
          notificaciones: []
        }
      }
    },
    function (err, doc) {
      if (!err) {
        res.json({ correcto: true, mensaje: 'Se ha añadido tu objeto' });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    });
});

app.post('/api/registrarPuntoRecoleccion', function (req, res) {

  persona.findOne({
    _id: req.body.correoLugar,
    'lugar.puntosRecoleccion.nombre': req.body.nombre
  },
    function (err, puntoRecoleccion) {
      if (!err) {
        if (!puntoRecoleccion) {
          persona.findOneAndUpdate(
            { _id: req.body.correoLugar },
            {
              $push: {
                "lugar.puntosRecoleccion": {
                  nombre: req.body.nombre,
                  telefono: req.body.telefono,
                  direccion: req.body.direccion,
                  disponible: true,
                  objetosPerdidos: [],
                  objetosRetirados: []
                }
              }
            },
            function (err, doc) {
              if (!err) {
                res.json({ correcto: true, mensaje: 'Se registro el punto de recoleccion exitosamente' });
              } else {
                res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
              }
            })
        } else {
          res.json({ correcto: false, mensaje: 'Error: Ya existe un punto de Recoleccion con este nombre' });
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/consultarLugares', function (req, res) {

  persona.aggregate(
    { $match: { lugar: { $exists: true } } },
    { $project: { nombre: 1 } },
    { $sort: { nombre: 1 } },
    function (err, lugares) {
      if (!err) {
        res.json(lugares)
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/registrarObjetoPerdido', function (req, res) {

  fecha = fechaActual();

  incrementarValor('codigoBusqueda', function (err, codigoBusqueda) {
    if (!err) {
      persona.findOneAndUpdate(
        {
          _id: req.body.correoLugar,
          'lugar.puntosRecoleccion.nombre': req.body.nombrePunto
        },
        {
          $push: {
            'lugar.puntosRecoleccion.$.objetosPerdidos': {
              codigoBusqueda: codigoBusqueda.sequence_value.toString(),
              correoTrabajadorRegistro: req.body.correoTrabajador,
              fechaRegistro: {
                añoMes: fecha.añoMes,
                dia: fecha.dia
              },
              sinCodigoQR: {
                tags: req.body.tags,
                descripcionOculta: req.body.descripcionOculta
              }
            }
          }
        },
        function (err, doc) {
          if (!err) {
            res.json({
              correcto: true, mensaje: "Registro Exitoso \n" +
                "Codigo de Busqueda del objeto: " + codigoBusqueda.sequence_value
            });
          } else {
            res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
          }
        });
    } else {
      res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
    }
  })
});

app.post('/api/registrarObjetoPerdidoQR', function (req, res) {

  persona.findOne({
    usuario: { $exists: true },
    'usuario.objetosPersonales.codigoQR': req.body.codigoQR
  },
    function (err, cuenta) {
      if (!err) {
        if (cuenta) {
          persona.aggregate(
            { $match: { lugar: { $exists: true } } },
            { $unwind: '$lugar.puntosRecoleccion' },
            { $unwind: '$lugar.puntosRecoleccion.objetosPerdidos' },
            { $match: { 'lugar.puntosRecoleccion.objetosPerdidos.codigoQR.objetoPersonalCodigoQR': req.body.codigoQR } },
            { $project: { 'nombre': 1, "lugar.puntosRecoleccion.nombre": 1 } },
            function (err, lugarObjetoPerdido) {
              if (!err) {
                if (!lugarObjetoPerdido.length) {
                  incrementarValor('codigoBusqueda', function (err1, codigoBusqueda) {
                    incrementarValor('codigoRetiro', function (err2, codigoRetiro) {
                      if (!err1 && !err2) {
                        fecha = fechaActual();
                        persona.findOneAndUpdate(
                          {
                            _id: req.body.correoLugar,
                            'lugar.puntosRecoleccion.nombre': req.body.nombrePunto
                          },
                          {
                            $push: {
                              'lugar.puntosRecoleccion.$.objetosPerdidos': {
                                codigoBusqueda: codigoBusqueda.sequence_value.toString(),
                                correoTrabajadorRegistro: req.body.correoTrabajador,
                                fechaRegistro: {
                                  añoMes: fecha.añoMes,
                                  dia: fecha.dia
                                },
                                codigoQR: {
                                  correoUsuario: cuenta._id,
                                  objetoPersonalCodigoQR: req.body.codigoQR,
                                  codigoRetiro: codigoRetiro.sequence_value.toString()
                                }
                              }
                            }
                          },
                          function (err, doc) {
                            if (!err) {
                              persona.findOneAndUpdate(
                                {
                                  _id: cuenta._id,
                                  'usuario.objetosPersonales.codigoQR': req.body.codigoQR
                                },
                                {
                                  $push: {
                                    'usuario.objetosPersonales.$.notificaciones': {
                                      _idLugar: req.body.correoLugar,
                                      nombrePuntoRecolecion: req.body.nombrePunto,
                                      objetoCodigoBusqueda: codigoBusqueda.sequence_value.toString(),
                                    }
                                  }
                                },
                                function (err, doc) {
                                  if (!err) {
                                    res.json({
                                      correcto: true,
                                      mensaje: "Registro Exitoso \n" + "Codigo de Busqueda del objeto: " + codigoBusqueda.sequence_value
                                    });
                                  } else {
                                    res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                                  }
                                })
                            } else {
                              res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                            }
                          });
                      } else {
                        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                      }
                    })
                  })
                } else {
                  lugarObjetoPerdido = lugarObjetoPerdido[0];
                  res.json({
                    correcto: false,
                    mensaje: "Error: El Objeto ya esta registrado como perdido" +
                    "\n Nombre del Lugar: " + lugarObjetoPerdido.nombre +
                    "\n Nombre del Punto de Recoleccion: " + lugarObjetoPerdido.lugar.puntosRecoleccion.nombre
                  });
                }
              } else {
                res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
              }
            });
        } else {
          res.json({ correcto: false, mensaje: "Error: No se encuentra el codigo QR" });
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});
//Pendiente valor del res.json();
app.post('/api/consultarObjetosPerdidosUsuario',function(req,res){
  consultaNombreLugar = {};
  consultaCodigoBusqueda = {};
  consultaTags = {};
  if(req.body.nombreLugar) consultaNombreLugar = {nombre : req.body.nombreLugar};
  if(req.body.codigoBusqueda) consultaCodigoBusqueda = {'lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda' : req.body.codigoBusqueda};
  if(req.body.tags) consultaTags = {'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags' : {$in : req.body.tags}};

  persona.aggregate(
    {$match : {lugar : {$exists: true }}},
    {$unwind : "$lugar.puntosRecoleccion" },
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos"},
    {$match : {$and : [{"lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.añoMes" : req.body.añoMesRegistro},{
      "lugar.puntosRecoleccion.objetosPerdidos.codigoQR":{$exists:false}},
      consultaNombreLugar,
      consultaCodigoBusqueda,
      consultaTags]}},
    {$project: {nombre:1,
        'lugar.puntosRecoleccion.nombre':1,
        'lugar.puntosRecoleccion.telefono':1,
        'lugar.puntosRecoleccion.direccion':1,
        'lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda':1,
        'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags':1,
        'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.añoMes':1}},
      function(err,objetosPerdidos){
        res.json(objetosPerdidos);
      })
});
//Pendiente valor del res.json();
app.post('/api/consultarObjetosPerdidosTrabajador', function (req, res) {
  consultaCodigoBusqueda = {};
  consultaTags = {};
  if (req.body.codigoBusqueda) consultaCodigoBusqueda = { 'lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda': req.body.codigoBusqueda };
  if (req.body.tags) consultaTags = { 'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags': { $in: req.body.tags } };

  persona.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$lugar.puntosRecoleccion" },
    { $unwind: "$lugar.puntosRecoleccion.objetosPerdidos" },
    {
      $match: {
        $and: [{ "lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.añoMes": req.body.añoMesRegistro }, {
          "lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR": { $exists: true }
        },
          consultaCodigoBusqueda,
          consultaTags]
      }
    },
    {
      $project: {
        'lugar.puntosRecoleccion.nombre': 1,
        'lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda': 1,
        'lugar.puntosRecoleccion.objetosPerdidos.codigoQR': 1,
        'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags': 1,
        'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.descripcionOculta': 1,
        'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.añoMes': 1,
        'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.dia': 1,
        'lugar.puntosRecoleccion.actual': {
          "$cond": [{ "$eq": ["$lugar.puntosRecoleccion.nombre", req.body.nombrePunto] }, true, false]
        }
      }
    },
    { $sort: { 'lugar.puntosRecoleccion.actual': -1, 'lugar.puntosRecoleccion.nombre': 1 } },
    function (err, objetosPerdidos) {
      res.json(objetosPerdidos);
    })
});
//Pendiente valor del res.json();
app.post('/api/consultarObjetosPerdidosLugar',function(req,res){
  consultaNombrePuntoRecoleccion = {};
  consultaCodigoBusqueda = {};
  consultaTags = {};
  if(req.body.nombrePuntoRecoleccion) consultaNombrePuntoRecoleccion = {'lugar.puntoRecoleccion.nombre' : req.body.nombrePuntoRecoleccion};
  if(req.body.codigoBusqueda) consultaCodigoBusqueda = {'lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda' : req.body.codigoBusqueda};
  if(req.body.tags) consultaTags = {'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags' : {$in : req.body.tags}};

  persona.aggregate(
    {$match : {_id : req.body.correoLugar}},
    {$unwind : "$lugar.puntosRecoleccion"},
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos"},
    {$match : {$and : [{"lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.añoMes":req.body.añoMesRegistro},
      consultaNombrePuntoRecoleccion,
      consultaCodigoBusqueda,
      consultaTags]}},
    {$lookup: { "from": "personas",
                 "localField": "lugar.puntosRecoleccion.objetosPerdidos.correoTrabajadorRegistro",
                 "foreignField": "_id",
                 "as": "lugar.puntosRecoleccion.objetosPerdidos.trabajadorRegistro"}},
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos.trabajadorRegistro"},
    {$lookup: {
               "from": "personas",
               "localField": "lugar.puntosRecoleccion.objetosPerdidos.codigoQR.correoUsuario",
               "foreignField": "_id",
               "as":  "lugar.puntosRecoleccion.objetosPerdidos.usuario"
             }},
    {$unwind : { path:'$lugar.puntosRecoleccion.objetosPerdidos.usuario',
                 preserveNullAndEmptyArrays: true}},
    {$unwind : { path:'$lugar.puntosRecoleccion.objetosPerdidos.usuario.usuario.objetosPersonales',
                 preserveNullAndEmptyArrays: true}},
    {$project: { nombre : 1,
          'lugar.puntosRecoleccion.nombre':1,
          'lugar.puntosRecoleccion.telefono':1,
          'lugar.puntosRecoleccion.direccion':1,
          'lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda':1,
          'lugar.puntosRecoleccion.objetosPerdidos.trabajadorRegistro.nombre':1,
          'lugar.puntosRecoleccion.objetosPerdidos.trabajadorRegistro.trabajador.numeroId':1,
          'lugar.puntosRecoleccion.objetosPerdidos.codigoQR.objetoPersonalCodigoQR' : 1,
          'lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR' : 1,
          'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.añoMes':1,
          'lugar.puntosRecoleccion.objetosPerdidos.fechaRegistro.dia':1,
          'lugar.puntosRecoleccion.objetosPerdidos.usuario.usuario.objetosPersonales.codigoQR' : 1,
          'lugar.puntosRecoleccion.objetosPerdidos.usuario._id' : 1,
          'lugar.puntosRecoleccion.objetosPerdidos.usuario.nombre' : 1,
          'lugar.puntosRecoleccion.objetosPerdidos.usuario.usuario.celular' : 1,
          'lugar.puntosRecoleccion.objetosPerdidos.usuario.usuario.objetosPersonales.tags' : 1,
          isMatch: {$eq: ['$lugar.puntosRecoleccion.objetosPerdidos.usuario.usuario.objetosPersonales.codigoQR', '$lugar.puntosRecoleccion.objetosPerdidos.codigoQR.objetoPersonalCodigoQR']}
    }},
    {$match : {isMatch : true}},
        function(err,objetosPerdidos){
          res.json(objetosPerdidos);
    })

});

app.post('/api/retirarObjetoPerdido',function(req,res){

  persona.aggregate(
    {$match : {_id : req.body.correoLugar}},
    {$unwind : "$lugar.puntosRecoleccion"},
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos"},
    {$match : {$and : [{"lugar.puntosRecoleccion.objetosPerdidos.codigoBusqueda" : req.body.codigoBusqueda},{
      "lugar.puntosRecoleccion.objetosPerdidos.sinCodigoQR":{$exists:true}}]}},
      {$project: {
        'lugar.puntosRecoleccion.nombre' : 1,
        'lugar.puntosRecoleccion.objetosPerdidos' : 1}},
        function(err,objetoPerdido){
          if (!err) {
            if (objetoPerdido.length) {
              objetoPerdido = objetoPerdido[0].lugar.puntosRecoleccion;
              fecha = new fechaActual();
              objetoPerdido.objetosPerdidos.retirado = {
                correoTrabajadorRetiro : req.body.correoTrabajador,
                fechaRetiro : {
                  añoMes: fecha.añoMes,
                  dia: fecha.dia
                },
                personaReclamo : {
                  numeroId : req.body.numeroIdPersona,
                  nombre : req.body.nombrePersona,
                  celular : req.body.celularPersona
                }
              };
              persona.findOneAndUpdate({_id : req.body.correoLugar,
                "lugar.puntosRecoleccion.nombre":objetoPerdido.nombre},
                {$push:{"lugar.puntosRecoleccion.$.objetosRetirados" : objetoPerdido.objetosPerdidos},
                $pull:{"lugar.puntosRecoleccion.$.objetosPerdidos" :{codigoBusqueda:req.body.codigoBusqueda}}},
                function (err, doc) {
                  if (!err) {
                    res.json({ correcto: true, mensaje: "El objeto fue retirado Exitosamente" });
                  } else {
                    res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                  }
                });
            } else {
              res.json({ correcto: false, mensaje: 'Error: El objeto ya fue retirado' });
            }
          } else {
            res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
          }
      })
});

app.post('/api/retirarObjetoPerdidoQR',function(req,res){

  persona.aggregate(
    {$match : {_id : req.body.correoLugar}},
    {$unwind : "$lugar.puntosRecoleccion"},
    {$unwind : "$lugar.puntosRecoleccion.objetosPerdidos"},
    {$match : {"lugar.puntosRecoleccion.objetosPerdidos.codigoQR.objetoPersonalCodigoQR" : req.body.codigoQR}},
    {$project: {
      'lugar.puntosRecoleccion.nombre' : 1,
      'lugar.puntosRecoleccion.objetosPerdidos' : 1}},
    function(err,objetoPerdido){
      if(!err){
        if (objetoPerdido.length) {
          objetoPerdido = objetoPerdido[0].lugar.puntosRecoleccion;
          if (objetoPerdido.nombre == req.body.nombrePunto) {
            objetoPerdido = objetoPerdido.objetosPerdidos;
            if (objetoPerdido.codigoQR.codigoRetiro == req.body.codigoRetiro){
              fecha = new Date();
              objetoPerdido.retirado = {
                correoTrabajadorRetiro : req.body.correoTrabajador,
                fechaRetiro : {
                  añoMes: fecha.añoMes,
                  dia: fecha.dia
                }
              };
              persona.findOneAndUpdate({_id : req.body.correoLugar,
                "lugar.puntosRecoleccion.nombre":req.body.nombrePunto},
                {$push:{"lugar.puntosRecoleccion.$.objetosRetirados" : objetoPerdido},
                $pull:{"lugar.puntosRecoleccion.$.objetosPerdidos" :{codigoBusqueda : objetoPerdido.codigoBusqueda}}},
                function(err,doc){
                  if(!err){
                    persona.findOneAndUpdate({
                      _id: objetoPerdido.codigoQR.correoUsuario,
                      "usuario.objetosPersonales.codigoQR": objetoPerdido.codigoQR.objetoPersonalCodigoQR},
                      { $pull: { "usuario.objetosPersonales.$.notificaciones": { objetoCodigoBusqueda: objetoPerdido.codigoBusqueda } } },
                       function (err, doc) {
                         if (!err) {
                           res.json({ correcto: true, mensaje: "El objeto fue retirado Exitosamente" });
                         } else {
                           res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                         }
                      })
                  } else {
                    res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                  }
                })
            } else {
              res.json({ correcto: false, mensaje: "Error: El codigo de retiro es incorrecto"});
            }
          } else {
            res.json({ correcto: false, mensaje: "Error: El objeto no se encuentra en este punto de Recoleccion \n Dirijase al punto de Recoleccion: " + objetoPerdido.nombre});
          }
        } else {
          res.json({ correcto: false, mensaje: "Error: No se encontro el registro del objeto como perdido, por favor registrelo"});
        }
      } else {
         res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
})

app.post('/api/consultarObjetosRetiradosTrabajador', function (req, res) {
  consultaCodigoBusqueda = {};
  consultaTags = {};
  if (req.body.codigoBusqueda) consultaCodigoBusqueda = { 'lugar.puntosRecoleccion.objetosRetirados.codigoBusqueda': req.body.codigoBusqueda };
  if (req.body.tags) consultaTags = { 'lugar.puntosRecoleccion.objetosRetirados.sinCodigoQR.tags': { $in: req.body.tags } };

  persona.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$lugar.puntosRecoleccion" },
    { $unwind: "$lugar.puntosRecoleccion.objetosRetirados" },
    {
      $match: {
        $and: [{ "lugar.puntosRecoleccion.objetosRetirados.fechaRegistro.añoMes": req.body.añoMesRegistro },
          consultaCodigoBusqueda,
          consultaTags]
      }
    },
    {
      $lookup: {
        "from": "personas",
        "localField": "lugar.puntosRecoleccion.objetosRetirados.codigoQR.correoUsuario",
        "foreignField": "_id",
        "as": "lugar.puntosRecoleccion.objetosRetirados.usuario"
      }
    },
    {
      $unwind: {
        path: '$lugar.puntosRecoleccion.objetosRetirados.usuario',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$lugar.puntosRecoleccion.objetosRetirados.usuario.usuario.objetosPersonales',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        nombre: 1,
        'lugar.puntosRecoleccion.nombre': 1,
        'lugar.puntosRecoleccion.telefono': 1,
        'lugar.puntosRecoleccion.direccion': 1,
        'lugar.puntosRecoleccion.objetosRetirados.codigoBusqueda': 1,
        'lugar.puntosRecoleccion.objetosRetirados.usuario.usuario.objetosPersonales.tags': 1,
        'lugar.puntosRecoleccion.objetosRetirados.sinCodigoQR': 1,
        'lugar.puntosRecoleccion.objetosRetirados.fechaRegistro': 1,
        'lugar.puntosRecoleccion.objetosRetirados.retirado.fechaRetiro': 1,
        'lugar.puntosRecoleccion.objetosRetirados.retirado.personaReclamo': 1,
        'lugar.puntosRecoleccion.objetosRetirados.usuario.usuario.objetosPersonales.codigoQR': 1,
        'lugar.puntosRecoleccion.objetosRetirados.codigoQR.objetoPersonalCodigoQR': 1,
        isMatch: { $eq: ['$lugar.puntosRecoleccion.objetosRetirados.usuario.usuario.objetosPersonales.codigoQR', '$lugar.puntosRecoleccion.objetosRetirados.codigoQR.objetoPersonalCodigoQR'] }
      }
    },
    { $match: { isMatch: true } },
    function (err, objetosRetirados) {
      res.json(objetosRetirados);
    })

})



var mongodbUri = 'mongodb://user:user@ds035776.mlab.com:35776/encontralopues';
mongoose.connect(mongodbUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(8080);
console.log("App listening on port 8080");
