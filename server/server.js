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


var usuariosSchema = new mongoose.Schema({
  _id: String,
  contraseña: String,
  nombre: String,
  celular: String,
  objetosPersonales: [
    {
      codigoQR: String,
      tags: [String],
      disponible: Boolean,
      notificaciones: [
        {
          _id: String,
          correoElectronico: String,
          usuario: new mongoose.Schema({
            fechaRegistro: {
              anoMes: String,
              dia: String
            }
          }),
          lugar: new mongoose.Schema({
            nombrePuntoRecolecion: String,
            objetoCodigoBusqueda: String,
          })
        }
      ]
    }
  ]
})

var lugaresSchema = new mongoose.Schema({
  _id: String,
  contraseña: String,
  nombre: String,
  trabajadores: [
    {
      _id: { type: String, index: true },
      contraseña: String,
      nombre: String,
      disponible: Boolean
    }
  ],
  puntosRecoleccion: [
    {
      nombre: String,
      telefono: String,
      direccion: String,
      disponible: Boolean,
      objetosPerdidos: [
        {
          codigoBusqueda: String,
          correoTrabajadorRegistro: String,
          fechaRegistro: {
            anoMes: String,
            dia: String
          },
          sinCodigoQR: new mongoose.Schema({
            tags: [String],
            descripcionOculta: String
          }),
          codigoQR: new mongoose.Schema({
            correoUsuario: String,
            objetoPersonalCodigoQR: String,
            codigoRetiro: String
          })
        }
      ],
      objetosRetirados: [
        {
          correoTrabajadorRegistro: String,
          codigoBusqueda: String,
          fechaRegistro: {
            anoMes: String,
            dia: String
          },
          sinCodigoQR: new mongoose.Schema({
            tags: [String],
            descripcionOculta: String
          }),
          codigoQR: new mongoose.Schema({
            correoUsuario: String,
            objetoPersonalCodigoQR: String,
            codigoRetiro: String,
          }),
          retirado: new mongoose.Schema({
            correoTrabajadorRetiro: String,
            fechaRetiro: {
              anoMes: String,
              dia: String
            },
            personaReclamo: new mongoose.Schema({
              numeroId: String,
              nombre: String,
              celular: String
            })
          })
        }
      ]
    }
  ]
});

var contadoresSchema = new mongoose.Schema({
  _id : String,
  seq : Number,
  sequence_value : Number
});

//Index Usuario
usuariosSchema.index({'objetosPersonales.codigoQR': 1});
usuariosSchema.index({'objetosPersonales.notifiaciones._id': 1});

//Index Lugar
lugaresSchema.index({'puntosRecoleccion.nombre': 1, 'puntosRecoleccion.disponible' : -1});
lugaresSchema.index({'trabajadores._id': 1});
lugaresSchema.index({'puntosRecoleccion.objetosPerdidos.codigoBusqueda': 1});
lugaresSchema.index({'puntosRecoleccion.objetosPerdidos.fechaRegistro.anoMes': 1});
lugaresSchema.index({'puntosRecoleccion.objetosRetirados.codigoBusqueda': 1});
lugaresSchema.index({'puntosRecoleccion.objetosRetirados.fechaRegistro.anoMes': 1});

//Model
var usuario = mongoose.model('usuarios',usuariosSchema);
var lugar = mongoose.model('lugares',lugaresSchema);
var contador = mongoose.model('contadores',contadoresSchema);


//Functions
function incrementarValor(sequenceName, callback) {
  contador.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true },
    callback
  );
}

function insertarObjetoPerdido(correoLugar, nombrePunto, objetoPerdido, callback) {
  lugar.findOneAndUpdate({
    _id: correoLugar,
    "puntosRecoleccion.nombre": nombrePunto
  },
    {
      $push: { "puntosRecoleccion.$.objetosPerdidos": objetoPerdido }
    },
    callback
  )
}

function fechaActual() {
  date = new Date();
  month = '' + (date.getMonth() + 1);
  day = '' + date.getDate();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return { anoMes: [date.getFullYear(), month].join('-'), dia: day }
}


// Quitar variables no utiles en consultas de objetos Per y Ret

//Inicio de Sesion
app.post('/api/iniciarSesionUsuario', function (req, res) {
  usuario.aggregate(
    {
      $match: {
        $and: [
          { _id: req.body.correoElectronico },
          { contraseña: { $exists: true } },
          { contraseña: req.body.contrasena }
        ]
      }
    },
    {
      $project: {
        _id : 1
      }
    },
    function (err, cuentaUsuario) {
      if (!err) {
        if (cuentaUsuario.length) {
          res.json({ correcto: true, mensaje: cuentaUsuario[0]});
        } else {
          res.json({ correcto: false, mensaje: "El correo y/o la contraseña son invalidos" });
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/iniciarSesionLugarTrabajador', function (req, res) {
 lugar.aggregate(
    {
      $match: {
        $and: [
          { _id: req.body.correoElectronico },
          { contraseña: req.body.contrasena }
        ]
      }
    },
    {
      $project: {
        _id : 1,
      }
    },
    function (err, cuentaLugar) {
      if (!err) {
        if (cuentaLugar.length) {
          cuentaLugar = cuentaLugar[0];
          cuentaLugar.lugar = true;
          res.json({ correcto: true, mensaje: cuentaLugar });
        } else {
          lugar.aggregate(
            { $unwind: "$trabajadores" },
            {
              $match: {
                $and: [
                  { 'trabajadores._id': req.body.correoElectronico },
                  { 'trabajadores.contraseña': req.body.contrasena },
                  { 'trabajadores.disponible': true },
                ]
              }
            },
            {
              $project: {
                _id : 1,
                'trabajadores._id': 1
              }
            },
            function (err, cuentaTrabajador) {
              if (!err) {
                if (cuentaTrabajador.length) {
                  cuentaTrabajador = cuentaTrabajador[0];
                  cuentaTrabajador.lugar = false;
                  res.json({ correcto: true, mensaje: cuentaTrabajador});
                } else {
                  res.json({ correcto: false, mensaje: "El correo y/o la contraseña son invalidos" });
                }
              } else {
                res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
              }
            })
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

//Usuario
app.post('/api/registrarUsuario', function (req, res) {
  (new usuario({
    _id: req.body.correoUsuario,
    contraseña: req.body.contraseña,
    nombre: req.body.nombre,
    celular: req.body.celular,
    objetosPersonales: []
  })).save(function (err, cuentaUsuario) {
    if (!err) {
      res.json({ correcto: true, mensaje: 'Se ha creado la cuenta exitosamente' });
    } else {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.json({ correcto: false, mensaje: 'Error: El correo Electronico ya esta en uso' });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    }
  });
});

app.post('/api/registrarUsuarioAuth0', function (req, res) {
  (new usuario({
    _id: req.body.correoUsuario,
    nombre: req.body.nombre,
    celular: "",
    objetosPersonales: []
  })).save(function (err, cuentaUsuario) {
    if (!err) {
      res.json({correcto: true});
    } else {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.json({ correcto: true });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    }
  });
});

app.post('/api/consultarDatosUsuario', function (req, res) {
  usuario.aggregate(
    {$match: { _id: req.body.correoUsuario }},
    {
      $project: {
        nombre: 1,
        celular: 1,
        _id: 0
      }
    }, function (err, cuentaUsuario) {
      if (!err) {
        res.json({ correcto: true, mensaje: cuentaUsuario[0] });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/modificarDatosUsuario', function (req, res) {
  usuario.findOneAndUpdate({ _id: req.body.correoUsuario },
    {
      $set: {
        nombre: req.body.nombre,
        celular: req.body.celular
      }
    }, function (err, cuentaUsuario) {
      if (!err) {
        res.json({ correcto: true, mensaje: 'Se han realizado los cambios exitosamente' });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/modificarContraseñaUsuario', function (req, res) {
  usuario.findOneAndUpdate({
    _id: req.body.correoUsuario,
    contrasena: req.body.contrasenaActual
  },
    {
      $set: {
        contraseña: req.body.contrasenaNueva,
      }
    }, function (err, cuentaUsuario) {
      if (!err) {
        if (cuentaUsuario) {
          res.json({ correcto: true, mensaje: 'Se ha cambiado la contraseña exitosamente' });
        } else {
          res.json({ correcto: false, mensaje: 'Error: La contraseña actual es incorrecta' });
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});


//Lugar
app.post('/api/registrarLugar', function (req, res) {
  lugar.aggregate(
    { $unwind: "$trabajadores" },
    {
      $match: {
        $and: [
          { 'trabajadores._id': req.body.correoLugar},
          { 'trabajadores.disponible': true },
        ]
      }
    },
    function (err, cuentaTrabajador) {
      if (!err) {
        if (!cuentaTrabajador.length) {
          (new lugar({
            _id: req.body.correoLugar,
            contraseña: req.body.contraseña,
            nombre: req.body.nombre,
            trabajadores: [],
            puntosRecoleccion: []
          })).save(function (err, resu) {
            if (!err) {
              res.json({ correcto: true, mensaje: 'Se ha creado la cuenta exitosamente' });
            } else {
              if (err.name === 'MongoError' && err.code === 11000) {
                res.json({ correcto: false, mensaje: 'Error: El correo Electronico ya esta en uso' });
              } else {
                res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
              }
            }
          });
        } else {
          res.json({ correcto: false, mensaje: 'Error: El correo Electronico ya esta en uso' });
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })

});

app.post('/api/consultarLugares', function (req, res) {

  lugar.aggregate(
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

app.post('/api/modificarContraseñaLugar', function (req, res) {
  lugar.findOneAndUpdate({
    _id: req.body.correoLugar,
    contrasena: req.body.contrasenaActual
  },
    {
      $set: {
        contraseña: req.body.contrasenaNueva,
      }
    }, function (err, cuentaLugar) {
      if (!err) {
        if (cuentaLugar) {
          res.json({ correcto: true, mensaje: 'Se ha cambiado la contraseña exitosamente' });
        } else {
          res.json({ correcto: false, mensaje: 'Error: La contraseña actual es incorrecta' });
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});


//Trabajador
app.post('/api/registrarTrabajador', function (req, res) {

  lugar.aggregate(
    {
      $match: { _id: req.body.correoTrabajador }
    },
    function (err, cuentaLugar) {
      if (!err) {
        if (!cuentaLugar.length) {
          lugar.aggregate(
            { $unwind: "$trabajadores" },
            {
              $match: {
                $and: [
                  { 'trabajadores._id': req.body.correoTrabajador },
                  { 'trabajadores.disponible': true }
                ]
              }
            },
            function (err, cuentaTrabajador) {
              if (!err) {
                if (!cuentaTrabajador.length) {
                  lugar.findOneAndUpdate({
                    _id: req.body.correoLugar,
                    'trabajadores._id': req.body.correoTrabajador
                  },
                    {
                      $set: { 'trabajadores.$.disponible': true }
                    },
                    function (err, cuentaTrabajador2) {
                      if (!err) {
                        if (cuentaTrabajador2) {
                          res.json({ correcto: true, existio: true , mensaje: 'Se ha vuelto a crear la cuenta de:' +  req.body.correoTrabajador});
                        } else {
                          res.json({ correcto: true, existio: false });
                        }
                      } else {
                        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                      }
                    })
                } else {
                  res.json({ correcto: false, mensaje: 'Error: El correo Electronico ya esta en uso' });
                }
              } else {
                res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
              }
            })
        } else {
          res.json({ correcto: false, mensaje: 'Error: El correo Electronico ya esta en uso' });
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/registrarNuevoTrabajador', function (req, res) {
  lugar.findOneAndUpdate({ _id: req.body.correoLugar },
    {
      $push: {
        "trabajadores": {
          _id: req.body.correoTrabajador,
          contraseña: req.body.contraseña,
          nombre: req.body.nombre,
          disponible: true
        }
      }
    },
    function (err, cuentaTrabajador) {
      if (!err) {
        res.json({ correcto: true, mensaje: 'Se ha creado la cuenta exitosamente' });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/consultarTrabajadoresDisponibles', function (req, res) {

  lugar.aggregate(
    { $match: { _id : req.body.correoLugar}}, 
    { $unwind: "$trabajadores" },
    { $match: { 'trabajadores.disponible' : true}},
    {
      $project: {
        'trabajadores._id' : 1,
        'trabajadores.contrasena' : 1,
        'trabajadores.nombre' : 1
      }
    },
    { $sort: {
        'trabajadores.nombre': 1
      }
    },
    function (err, trabajadores) {
      if (trabajadores.length) {
        res.json({ correcto: true, mensaje: trabajadores });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro trabajadores" });
      }
    })

});

app.post('/api/modificarDatosTrabajador', function (req, res) {
  lugar.findOneAndUpdate({
    _id: req.body.correoLugar,
    'trabajadores._id': req.body.correoTrabajador
  },
    {
      $set: {
        'trabajadores.$.contraseña': req.body.contraseña,
        'trabajadores.$.nombre': req.body.nombre
      }
    }, function (err, cuentaUsuario) {
      if (!err) {
        res.json({ correcto: true, mensaje: 'Se han realizado los cambios exitosamente' });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/eliminarTrabajador', function (req, res) {
  lugar.findOneAndUpdate({
    _id: req.body.correoLugar,
    'trabajadores._id': req.body.correoTrabajador
  },
    {
      $set: {
        'trabajadores.$.disponible': false,
      }
    }, function (err, cuentaTrabajador) {
      if (!err) {
        res.json({ correcto: true, mensaje: 'Se elimino el trabajador exitosamente' });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/registrarObjetoPersonal', function (req, res) {

  tags = req.body.tags
  for (var i = 0; i < tags.length; i++) tags[i] = tags[i].toLowerCase();
  

  usuario.findOneAndUpdate(
    { _id: req.body.correoUsuario },
    {
      $push: {
        "objetosPersonales": {
          codigoQR: mongoose.Types.ObjectId(),
          tags: tags,
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


//Objetos Personales
app.post('/api/consultarObjetosPersonales', function (req, res) {

  usuario.aggregate(
    { $match: { _id : req.body.correoUsuario}}, 
    { $unwind: "$objetosPersonales" },
    { $match: { 'objetosPersonales.disponible' : true}},
    {
      $project: {
        'objetosPersonales.codigoQR': 1,
        'objetosPersonales.tags': 1,
      }
    },
    function (err, objetosPersonales) {
      if (objetosPersonales.length) {
        res.json({ correcto: true, mensaje: objetosPersonales });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro objetos" });
      }
    })

});

app.post('/api/modificarDatosObjetoPersonal', function (req, res) {

  tags = req.body.tags
  for (var i = 0; i < tags.length; i++) tags[i] = tags[i].toLowerCase();

  usuario.findOneAndUpdate({
    _id: req.body.correoUsuario,
    'objetosPersonales.codigoQR': req.body.codigoQR
  },
    {
      $set: {
        'objetosPersonales.$.tags' : tags
      }
    }, function (err, cuentaUsuario) {
      if (!err) {
        res.json({ correcto: true, mensaje: 'Se han realizado los cambios exitosamente' });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/eliminarObjetoPersonal', function (req, res) {
  usuario.findOneAndUpdate({
    _id: req.body.correoUsuario
  },
    {
      $pull: { "objetosPersonales": { codigoQR: req.body.codigoQR } }
    },
    function (err, objetoPersonal) {
      if (!err) {
        res.json({ correcto: true, mensaje: 'Se ha eliminado el objeto exitosamente' });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});


//Puntos de Recoleccion
app.post('/api/registrarPuntoRecoleccion', function (req, res) {

  lugar.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$puntosRecoleccion" },
    {
      $match: {
        $and: [
          { 'puntosRecoleccion.nombre': req.body.nombre },
          { 'puntosRecoleccion.disponible': true }
        ]
      }
    },
    function (err, puntoRecoleccion) {
      if (!err) {
        if (!puntoRecoleccion.length) {
          lugar.findOneAndUpdate({
            _id: req.body.correoLugar,
            'puntosRecoleccion.nombre': req.body.nombre
          },
            {
              $set: { 'puntosRecoleccion.$.disponible': true }
            },
            function (err, puntoRecoleccion2) {
              if (!err) {
                if (puntoRecoleccion2) {
                  res.json({ correcto: true, existio: true, mensaje: 'Se ha vuelto a crear el punto de recoleccion: ' + req.body.nombre});
                } else {
                  res.json({ correcto: true, existio: false });
                }
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

app.post('/api/registrarNuevoPuntoRecoleccion', function (req, res) {
  lugar.findOneAndUpdate({ _id: req.body.correoLugar },
    {
      $push: {
        "puntosRecoleccion": {
          nombre: req.body.nombre,
          telefono: req.body.telefono,
          direccion: req.body.direccion,
          disponible: true,
          objetosPerdidos: [],
          objetosRetirados: []
        }
      }
    },
    function (err, puntoRecoleccion) {
      if (!err) {
        res.json({ correcto: true, mensaje: 'Se registro el punto de recoleccion exitosamente' });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/consultarNombrePuntosRecoleccion', function (req, res) {

  lugar.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: '$puntosRecoleccion' },
    { $project: { 'puntosRecoleccion.nombre': 1 } },
    { $sort: { 'puntosRecoleccion.nombre': 1 } },
    function (err, puntosRecoleccion) {
      if (!err) {
        res.json({ correcto: true, mensaje:puntosRecoleccion})
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/consultarNombrePuntosRecoleccionDisponibles', function (req, res) {

  lugar.aggregate(
    { $match: { _id: req.body.correoLugar }},
    { $unwind: '$puntosRecoleccion' },
    { $match: {'puntosRecoleccion.disponible' : true }},
    { $project: { 'puntosRecoleccion.nombre': 1 } },
    { $sort: { 'puntosRecoleccion.nombre': 1 } },
    function (err, puntosRecoleccion) {
      if (!err) {
        res.json({ correcto: true, mensaje:puntosRecoleccion})
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/consultarPuntosRecoleccionDisponibles', function (req, res) {
      
  lugar.aggregate(
    { $match: { _id: req.body.correoLugar }},
    { $unwind: '$puntosRecoleccion' },
    { $match: {'puntosRecoleccion.disponible' : true }},
    {
      $project: {
        'puntosRecoleccion.nombre': 1,
        'puntosRecoleccion.telefono': 1,
        'puntosRecoleccion.direccion': 1
      }
    },
    { $sort: { 'puntosRecoleccion.nombre': 1 } },
    function (err, puntosRecoleccion) {
      if (!err) {
        res.json({ correcto: true, mensaje:puntosRecoleccion})
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/modificarDatosPuntoRecoleccion', function (req, res) {
  lugar.findOneAndUpdate({
    _id: req.body.correoLugar,
    'puntosRecoleccion.nombre': req.body.nombrePuntoRecoleccion
  },
    {
      $set: {
        'puntosRecoleccion.$.telefono': req.body.telefono,
        'puntosRecoleccion.$.direccion': req.body.direccion
      }
    }, function (err, puntoRecoleccion) {
      if (!err) {
        res.json({ correcto: true, mensaje: 'Se han realizado los cambios exitosamente' });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/eliminarPuntoRecoleccion', function (req, res) {

  lugar.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$puntosRecoleccion" },
    { $match: { 'puntosRecoleccion.nombre': req.body.nombrePuntoRecoleccion } },
    function (err, puntoRecoleccion) {
      if (!err) {
        if (!puntoRecoleccion.length) {
          res.json({ correcto: true });
        } else {
          puntoRecoleccion = puntoRecoleccion[0].puntosRecoleccion;
          if (!puntoRecoleccion.objetosPerdidos.length) {
            if (!puntoRecoleccion.objetosRetirados.length) {
              lugar.findOneAndUpdate({
                _id: req.body.correoLugar,
              },
                {
                  $pull: { "puntosRecoleccion": { nombre: req.body.nombrePuntoRecoleccion } }
                }, function (err, puntoRecoleccion) {
                  if (!err) {
                    res.json({ correcto: true, mensaje: 'Se elimino el punto de recoleccion exitosamente' });
                  } else {
                    res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                  }
                })
            } else {
              lugar.findOneAndUpdate({
                _id: req.body.correoLugar,
                'puntosRecoleccion.nombre': req.body.nombrePuntoRecoleccion
              },
                {
                  $set: {
                    'puntosRecoleccion.$.disponible': false
                  }
                }, function (err, puntoRecoleccion) {
                  if (!err) {
                    res.json({
                      correcto: true, mensaje: 'Se elimino el punto de recoleccion exitosamente \n'
                      + 'Sus datos se pueden recuperar registrando nuevamente el punto de recoleccion con el mismo nombre'
                    });
                  } else {
                    res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                  }
                })
            }
          } else {
            res.json({ correcto: false, mensaje: 'Error: Retirar o eliminar los objetos perdidos de este punto de recoleccion' });
          }
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })

});


//Objetos Perdidos
app.post('/api/registrarObjetoPerdido', function (req, res) {

  tags = req.body.tags
  for (var i = 0; i < tags.length; i++) tags[i] = tags[i].toLowerCase();
  

  fecha = fechaActual();

  incrementarValor('codigoBusqueda', function (err, codigoBusqueda) {
    if (!err) {
      lugar.findOneAndUpdate(
        {
          _id: req.body.correoLugar,
          'puntosRecoleccion.nombre': req.body.nombrePunto
        },
        {
          $push: {
            'puntosRecoleccion.$.objetosPerdidos': {
              codigoBusqueda: codigoBusqueda.sequence_value.toString(),
              correoTrabajadorRegistro: req.body.correoTrabajador,
              fechaRegistro: {
                anoMes: fecha.anoMes,
                dia: fecha.dia
              },
              sinCodigoQR: {
                tags: tags,
                descripcionOculta: req.body.descripcionOculta
              }
            }
          }
        },
        function (err, doc) {
          if (!err) {
            res.json({
              correcto: true, mensaje: "Registro exitoso \n" +
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
 usuario.aggregate(
    { $unwind: "$objetosPersonales" },
    {
      $match: {
        $and: [
          { 'objetosPersonales.codigoQR': req.body.codigoQR},
          { 'objetosPersonales.disponible': true}
        ]
      }
    },
    function (err, cuenta) {
      if (!err) {
        if (cuenta.length) {
          lugar.aggregate(
            { $unwind: '$puntosRecoleccion' },
            { $unwind: '$puntosRecoleccion.objetosPerdidos' },
            { $match: { 'puntosRecoleccion.objetosPerdidos.codigoQR.objetoPersonalCodigoQR': req.body.codigoQR } },
            { $project: { 'nombre': 1, "puntosRecoleccion.nombre": 1 } },
            function (err, lugarObjetoPerdido) {
              if (!err) {
                if (!lugarObjetoPerdido.length) {
                  incrementarValor('codigoBusqueda', function (err1, codigoBusqueda) {
                    incrementarValor('codigoRetiro', function (err2, codigoRetiro) {
                      if (!err1 && !err2) {
                        fecha = fechaActual();
                        cuenta = cuenta[0];
                        insertarObjetoPerdido(
                          req.body.correoLugar,
                          req.body.nombrePunto,
                          {
                            codigoBusqueda: codigoBusqueda.sequence_value.toString(),
                            correoTrabajadorRegistro: req.body.correoTrabajador,
                            fechaRegistro: {
                              anoMes: fecha.anoMes,
                              dia: fecha.dia
                            },
                            codigoQR: {
                              correoUsuario: cuenta._id,
                              objetoPersonalCodigoQR: req.body.codigoQR,
                              codigoRetiro: codigoRetiro.sequence_value.toString()
                            }
                          },

                          function (err, doc) {
                            if (!err) {
                              usuario.findOneAndUpdate(
                                {
                                  _id: cuenta._id,
                                  'objetosPersonales.codigoQR': req.body.codigoQR
                                },
                                {
                                  $push: {
                                    'objetosPersonales.$.notificaciones': {
                                      _id: mongoose.Types.ObjectId(),
                                      correoElectronico: req.body.correoLugar,
                                      lugar: {
                                        nombrePuntoRecolecion: req.body.nombrePunto,
                                        objetoCodigoBusqueda: codigoBusqueda.sequence_value.toString(),
                                      }
                                    }
                                  }
                                },
                                function (err, doc) {
                                  if (!err) {
                                    res.json({
                                      correcto: true,
                                      mensaje: "Registro exitoso \n" + "Codigo de Busqueda del objeto: " + codigoBusqueda.sequence_value
                                    });
                                  } else {
                                    res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                                  }
                                })
                            } else {
                              res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                            }
                          })
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
                    "\n Nombre del Punto de Recoleccion: " + lugarObjetoPerdido.puntosRecoleccion.nombre
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


app.post('/api/modificarDatosObjetoPerdido', function (req, res) {
  
  lugar.aggregate(
    { $match : {_id : req.body.correoLugar}},
    { $unwind: "$puntosRecoleccion" },
    { $match : {"puntosRecoleccion.nombre": req.body.nombrePunto}},
    { $unwind: "$puntosRecoleccion.objetosPerdidos" },
    { $match: { "puntosRecoleccion.objetosPerdidos.codigoBusqueda" : req.body.codigoBusqueda }},
    { $project : {
      'puntosRecoleccion.objetosPerdidos':1,
    }},
    function (err, objetoPerdido) {
      if (!err) {

        if(!objetoPerdido.length){
          res.json({ correcto: true });
        } else {

          objetoPerdido = objetoPerdido[0].puntosRecoleccion.objetosPerdidos;

          tags = req.body.tags
          for (var i = 0; i < tags.length; i++) tags[i] = tags[i].toLowerCase();
          objetoPerdido.sinCodigoQR.tags = tags
          objetoPerdido.sinCodigoQR.descripcionOculta = req.body.descripcionOculta

          lugar.findOneAndUpdate({
            _id: req.body.correoLugar,
            "puntosRecoleccion.nombre": req.body.nombrePunto
          },
            {
              $pull: { "puntosRecoleccion.$.objetosPerdidos": { codigoBusqueda: req.body.codigoBusqueda } },
            },
            function (err, doc) {
              if (!err) {
                insertarObjetoPerdido(
                  req.body.correoLugar,
                  req.body.nombrePuntoInsertar,
                  objetoPerdido,
                  function (err, doc) {
                    if (!err) {
                      res.json({ correcto: true, mensaje: 'Se han realizado los cambios exitosamente' });
                    } else {
                      res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                    }
                  }
                )
              } else {
                res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
              }
            })
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});


app.post('/api/eliminarObjetoPerdido', function (req, res) {

  lugar.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$puntosRecoleccion" },
    { $match: { "puntosRecoleccion.nombre": req.body.nombrePunto } },
    { $unwind: "$puntosRecoleccion.objetosPerdidos" },
    { $match: { "puntosRecoleccion.objetosPerdidos.codigoBusqueda": req.body.codigoBusqueda } },
    {
      $project: {
        'puntosRecoleccion.objetosPerdidos': 1,
      }
    },

    function (err, objetoPerdido) {
      if (!err) {

        if (!objetoPerdido.length) {
          res.json({ correcto: true });
        } else {

          objetoPerdido = objetoPerdido[0].puntosRecoleccion.objetosPerdidos;

          lugar.findOneAndUpdate({
            _id: req.body.correoLugar,
            "puntosRecoleccion.nombre": req.body.nombrePunto
          },
            {
              $pull: { "puntosRecoleccion.$.objetosPerdidos": { codigoBusqueda: req.body.codigoBusqueda } },
            },
            function (err, doc) {
              if (!err) {
                if (!objetoPerdido.codigoQR) {
                  res.json({ correcto: true, mensaje: 'Se elimino el objeto exitosamente' });

                } else {
                  usuario.findOneAndUpdate({
                    _id: objetoPerdido.codigoQR.correoUsuario,
                    "objetosPersonales.codigoQR": objetoPerdido.codigoQR.objetoPersonalCodigoQR
                  },
                    {
                      $pull: { "objetosPersonales.$.notificaciones": { lugar: { $exists: true } } },
                    },
                    function (err, doc) {
                      if (!err) {
                        res.json({ correcto: true, mensaje: 'Se elimino el objeto exitosamente' });
                      } else {
                        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                      }
                    })
                }
              } else {
                res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
              }
            })
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/consultarObjetosPerdidosUsuario', function (req, res) {
  consultaNombreLugar = {};
  consultaTags = {};
  if (req.body.nombreLugar != "Todos") consultaNombreLugar = { nombre: req.body.nombreLugar };
  if (req.body.tags.length) {
    tags = req.body.tags
    for (var i = 0; i < tags.length; i++) tags[i] = tags[i].toLowerCase();
    consultaTags = { 'puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags': { $in: tags } };
  }

  lugar.aggregate(
    { $unwind: "$puntosRecoleccion" },
    { $unwind: "$puntosRecoleccion.objetosPerdidos" },
    {
      $match: {
        $and: [{ "puntosRecoleccion.objetosPerdidos.fechaRegistro.anoMes": req.body.anoMesRegistro }, {
          "puntosRecoleccion.objetosPerdidos.sinCodigoQR": { $exists: true }
        },
          consultaNombreLugar,
          consultaTags]
      }
    },
    {
      $project: {
        nombre: 1,
        'puntosRecoleccion.nombre': 1,
        'puntosRecoleccion.telefono': 1,
        'puntosRecoleccion.direccion': 1,
        'puntosRecoleccion.objetosPerdidos.codigoBusqueda': 1,
        'puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags': 1,
        'puntosRecoleccion.objetosPerdidos.fechaRegistro.anoMes': 1
      }
    },
    {
      $sort: {
        'puntosRecoleccion.objetosPerdidos.fechaRegistro.dia': -1
      }
    },
    function (err, objetosPerdidos) {
      if (objetosPerdidos.length) {
        res.json({ correcto: true, mensaje: objetosPerdidos });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro objetos" });
      }
    })
});

app.post('/api/consultarObjetosPerdidosUsuarioCodigo', function (req, res) {

  lugar.aggregate(
    { $unwind: "$puntosRecoleccion" },
    { $unwind: "$puntosRecoleccion.objetosPerdidos" },
    {
      $match: {
        $and: [{ 'puntosRecoleccion.objetosPerdidos.codigoBusqueda': req.body.codigoBusqueda }, {
          "puntosRecoleccion.objetosPerdidos.codigoQR": { $exists: false }
        }
        ]
      }
    },
    {
      $project: {
        nombre: 1,
        'puntosRecoleccion.nombre': 1,
        'puntosRecoleccion.telefono': 1,
        'puntosRecoleccion.direccion': 1,
        'puntosRecoleccion.objetosPerdidos.codigoBusqueda': 1,
        'puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags': 1,
        'puntosRecoleccion.objetosPerdidos.fechaRegistro.anoMes': 1
      }
    },
    function (err, objetosPerdidos) {
      if (objetosPerdidos.length) {
        res.json({ correcto: true, mensaje: objetosPerdidos[0] });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro el objeto" });
      }
    })
});

app.post('/api/consultarObjetosPerdidosTrabajador', function (req, res) {
  consultaTags = {};
  if (req.body.tags.length) {
    tags = req.body.tags
    for (var i = 0; i < tags.length; i++) tags[i] = tags[i].toLowerCase();
    consultaTags = { 'puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags': { $in: tags } };
  }
  lugar.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$puntosRecoleccion" },
    { $unwind: "$puntosRecoleccion.objetosPerdidos" },
    {
      $match: {
        $and: [{ "puntosRecoleccion.objetosPerdidos.fechaRegistro.anoMes": req.body.anoMesRegistro }, {
          "puntosRecoleccion.objetosPerdidos.sinCodigoQR": { $exists: true }
        },
          consultaTags]
      }
    },
    {
      $project: {
        'puntosRecoleccion.nombre': 1,
        'puntosRecoleccion.objetosPerdidos.codigoBusqueda': 1,
        'puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags': 1,
        'puntosRecoleccion.objetosPerdidos.sinCodigoQR.descripcionOculta': 1,
        'puntosRecoleccion.objetosPerdidos.fechaRegistro.anoMes': 1,
        'puntosRecoleccion.objetosPerdidos.fechaRegistro.dia': 1,
        'puntosRecoleccion.actual': {
          "$cond": [{ "$eq": ["$puntosRecoleccion.nombre", req.body.nombrePunto] }, true, false]
        }
      }
    },
    {
      $sort: {
        'puntosRecoleccion.actual': -1,
        'puntosRecoleccion.objetosPerdidos.fechaRegistro.dia': -1
      }
    },
    function (err, objetosPerdidos) {
      if (objetosPerdidos.length) {
        res.json({ correcto: true, mensaje: objetosPerdidos });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro objetos" });
      }
    })
});

app.post('/api/consultarObjetosPerdidosTrabajadorCodigo', function (req, res) {
  
  lugar.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$puntosRecoleccion" },
    { $unwind: "$puntosRecoleccion.objetosPerdidos" },
    {
      $match: {
        $and: [{
        'puntosRecoleccion.objetosPerdidos.codigoBusqueda': req.body.codigoBusqueda},
        {"puntosRecoleccion.objetosPerdidos.sinCodigoQR": { $exists: true }}]
      }
    },
    {
      $project: {
        'puntosRecoleccion.nombre': 1,
        'puntosRecoleccion.objetosPerdidos.codigoBusqueda': 1,
        'puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags': 1,
        'puntosRecoleccion.objetosPerdidos.sinCodigoQR.descripcionOculta': 1,
        'puntosRecoleccion.objetosPerdidos.fechaRegistro.anoMes': 1,
        'puntosRecoleccion.objetosPerdidos.fechaRegistro.dia': 1,
        'puntosRecoleccion.actual': {
          "$cond": [{ "$eq": ["$puntosRecoleccion.nombre", req.body.nombrePunto] }, true, false]
        }
      }
    },
    function (err, objetosPerdidos) {
      if (objetosPerdidos.length) {
        res.json({ correcto: true, mensaje: objetosPerdidos[0] });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro el objeto o se registro con codigo QR" });
      }
    })
});

app.post('/api/consultarObjetosPerdidosLugar',function(req,res){
  consultaNombrePuntoRecoleccion = {};
  consultaTags = {};
  if(req.body.nombrePuntoRecoleccion != "Todos") consultaNombrePuntoRecoleccion = {'puntosRecoleccion.nombre' : req.body.nombrePuntoRecoleccion};
  if(req.body.tags.length) {
    tags = req.body.tags
    for (var i = 0; i < tags.length; i++) tags[i] = tags[i].toLowerCase();
    consultaTags = { 'puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags': { $in: tags } };
  }


  lugar.aggregate(
    {$match : {_id : req.body.correoLugar}},
    {$unwind : "$puntosRecoleccion"},
    {$unwind : "$puntosRecoleccion.objetosPerdidos"},
    {$match : {$and : [{"puntosRecoleccion.objetosPerdidos.fechaRegistro.anoMes":req.body.anoMesRegistro},
      consultaNombrePuntoRecoleccion,
      consultaTags]}},
    {$lookup: {
               "from": "usuarios",
               "localField": "puntosRecoleccion.objetosPerdidos.codigoQR.correoUsuario",
               "foreignField": "_id",
               "as":  "puntosRecoleccion.objetosPerdidos.usuario"
             }},
    {$unwind : { path:'$puntosRecoleccion.objetosPerdidos.usuario',
                 preserveNullAndEmptyArrays: true}},
    {$unwind : { path:'$puntosRecoleccion.objetosPerdidos.usuario.objetosPersonales',
                 preserveNullAndEmptyArrays: true}},
    {$project: { 
          'puntosRecoleccion.nombre':1,
          'puntosRecoleccion.telefono':1,
          'puntosRecoleccion.direccion':1,
          'puntosRecoleccion.objetosPerdidos.codigoBusqueda':1,
          'puntosRecoleccion.objetosPerdidos.trabajadorRegistro': {
            "$filter": {
              "input": "$trabajadores",
              "as": "trabajadorRegistro",
              "cond": { "$eq": ["$$trabajadorRegistro._id", "$puntosRecoleccion.objetosPerdidos.correoTrabajadorRegistro"] }
            }
          },
          'puntosRecoleccion.objetosPerdidos.tags': {
            $ifNull: ["$puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags", '$puntosRecoleccion.objetosPerdidos.usuario.objetosPersonales.tags']
          },
          'puntosRecoleccion.objetosPerdidos.sinCodigoQR.descripcionOculta' : 1,
          'puntosRecoleccion.objetosPerdidos.fechaRegistro.anoMes':1,
          'puntosRecoleccion.objetosPerdidos.fechaRegistro.dia':1,
          'puntosRecoleccion.objetosPerdidos.usuario._id' : 1,
          'puntosRecoleccion.objetosPerdidos.usuario.nombre' : 1,
          'puntosRecoleccion.objetosPerdidos.usuario.celular' : 1,
          isMatch: {$eq: ['$puntosRecoleccion.objetosPerdidos.usuario.objetosPersonales.codigoQR', '$puntosRecoleccion.objetosPerdidos.codigoQR.objetoPersonalCodigoQR']}
    }},
    {$match : {isMatch : true}},
    {$unwind : '$puntosRecoleccion.objetosPerdidos.trabajadorRegistro'},
    {
      $sort: {
        'puntosRecoleccion.objetosPerdidos.fechaRegistro.dia': -1
      }
    },
    function (err, objetosPerdidos) {
      if (objetosPerdidos.length) {
        res.json({ correcto: true, mensaje: objetosPerdidos });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro objetos" });
      }
    })

});


app.post('/api/consultarObjetosPerdidosLugarCodigo', function (req, res) {

  lugar.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$puntosRecoleccion" },
    { $unwind: "$puntosRecoleccion.objetosPerdidos" },
    { $match: { 'puntosRecoleccion.objetosPerdidos.codigoBusqueda': req.body.codigoBusqueda } },
    {
      $lookup: {
        "from": "usuarios",
        "localField": "puntosRecoleccion.objetosPerdidos.codigoQR.correoUsuario",
        "foreignField": "_id",
        "as": "puntosRecoleccion.objetosPerdidos.usuario"
      }
    },
    {
      $unwind: {
        path: '$puntosRecoleccion.objetosPerdidos.usuario',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$puntosRecoleccion.objetosPerdidos.usuario.objetosPersonales',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        nombre: 1,
        'puntosRecoleccion.nombre': 1,
        'puntosRecoleccion.telefono': 1,
        'puntosRecoleccion.direccion': 1,
        'puntosRecoleccion.objetosPerdidos.codigoBusqueda': 1,
        'puntosRecoleccion.objetosPerdidos.trabajadorRegistro': {
          "$filter": {
            "input": "$trabajadores",
            "as": "trabajadorRegistro",
            "cond": { "$eq": ["$$trabajadorRegistro._id", "$puntosRecoleccion.objetosPerdidos.correoTrabajadorRegistro"] }
          }
        },
        'puntosRecoleccion.objetosPerdidos.tags': {
          $ifNull: ["$puntosRecoleccion.objetosPerdidos.sinCodigoQR.tags", '$puntosRecoleccion.objetosPerdidos.usuario.objetosPersonales.tags']
        },
        'puntosRecoleccion.objetosPerdidos.sinCodigoQR.descripcionOculta': 1,
        'puntosRecoleccion.objetosPerdidos.fechaRegistro.anoMes': 1,
        'puntosRecoleccion.objetosPerdidos.fechaRegistro.dia': 1,
        'puntosRecoleccion.objetosPerdidos.usuario._id': 1,
        'puntosRecoleccion.objetosPerdidos.usuario.nombre': 1,
        'puntosRecoleccion.objetosPerdidos.usuario.celular': 1,
        isMatch: { $eq: ['$puntosRecoleccion.objetosPerdidos.usuario.objetosPersonales.codigoQR', '$puntosRecoleccion.objetosPerdidos.codigoQR.objetoPersonalCodigoQR'] }
      }
    },
    { $match: { isMatch: true } },
    { $unwind: '$puntosRecoleccion.objetosPerdidos.trabajadorRegistro' },
    function (err, objetosPerdidos) {
      if (objetosPerdidos.length) {
        res.json({ correcto: true, mensaje: objetosPerdidos[0] });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro el objeto" });
      }
    })

});

app.post('/api/retirarObjetoPerdido',function(req,res){

  lugar.aggregate(
    {$match : {_id : req.body.correoLugar}},
    {$unwind : "$puntosRecoleccion"},
    {$match : {'puntosRecoleccion.nombre' : req.body.nombrePunto}},
    {$unwind : "$puntosRecoleccion.objetosPerdidos"},
    {$match : {$and : [{"puntosRecoleccion.objetosPerdidos.codigoBusqueda" : req.body.codigoBusqueda},{
      "puntosRecoleccion.objetosPerdidos.sinCodigoQR":{$exists:true}}]}},
      {$project: {
        'puntosRecoleccion.nombre' : 1,
        'puntosRecoleccion.objetosPerdidos' : 1}},
        function(err,objetoPerdido){
          if (!err) {
            if (objetoPerdido.length) {
              objetoPerdido = objetoPerdido[0].puntosRecoleccion;
              fecha = new fechaActual();
              objetoPerdido.objetosPerdidos.retirado = {
                correoTrabajadorRetiro : req.body.correoTrabajador,
                fechaRetiro : {
                  anoMes: fecha.anoMes,
                  dia: fecha.dia
                },
                personaReclamo : {
                  numeroId : req.body.numeroIdPersona,
                  nombre : req.body.nombrePersona,
                  celular : req.body.celularPersona
                }
              };
              lugar.findOneAndUpdate({_id : req.body.correoLugar,
                "puntosRecoleccion.nombre":objetoPerdido.nombre},
                {$push:{"puntosRecoleccion.$.objetosRetirados" : objetoPerdido.objetosPerdidos},
                $pull:{"puntosRecoleccion.$.objetosPerdidos" :{codigoBusqueda:req.body.codigoBusqueda}}},
                function (err, doc) {
                  if (!err) {
                    res.json({ correcto: true, mensaje: "El objeto fue retirado exitosamente" });
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

  lugar.aggregate(
    {$match : {_id : req.body.correoLugar}},
    {$unwind : "$puntosRecoleccion"},
    {$unwind : "$puntosRecoleccion.objetosPerdidos"},
    {$match : {"puntosRecoleccion.objetosPerdidos.codigoQR.objetoPersonalCodigoQR" : req.body.codigoQR}},
    {$project: {
      'puntosRecoleccion.nombre' : 1,
      'puntosRecoleccion.objetosPerdidos' : 1}},
    function(err,objetoPerdido){
      if(!err){
        if (objetoPerdido.length) {
          objetoPerdido = objetoPerdido[0].puntosRecoleccion;
          if (objetoPerdido.nombre == req.body.nombrePunto) {
            objetoPerdido = objetoPerdido.objetosPerdidos;
            if (objetoPerdido.codigoQR.codigoRetiro == req.body.codigoRetiro){
              fecha = new Date();
              objetoPerdido.retirado = {
                correoTrabajadorRetiro : req.body.correoTrabajador,
                fechaRetiro : {
                  anoMes: fecha.anoMes,
                  dia: fecha.dia
                }
              };
              lugar.findOneAndUpdate({_id : req.body.correoLugar,
                "puntosRecoleccion.nombre":req.body.nombrePunto},
                {$push:{"puntosRecoleccion.$.objetosRetirados" : objetoPerdido},
                $pull:{"puntosRecoleccion.$.objetosPerdidos" :{codigoBusqueda : objetoPerdido.codigoBusqueda}}},
                function(err,doc){
                  if(!err){
                    usuario.findOneAndUpdate({
                      _id: objetoPerdido.codigoQR.correoUsuario,
                      "objetosPersonales.codigoQR": objetoPerdido.codigoQR.objetoPersonalCodigoQR},
                      { $pull: { "objetosPersonales.$.notificaciones.lugar": { objetoCodigoBusqueda : objetoPerdido.codigoBusqueda}}},
                       function (err, doc) {
                         if (!err) {
                           res.json({ correcto: true, mensaje: "El objeto fue retirado exitosamente" });
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
          res.json({ correcto: false, mensaje: "Error: No se encontro el registro del objeto como perdido"});
        }
      } else {
         res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
})


//Objetos Retirados
app.post('/api/consultarObjetosRetiradosTrabajador', function (req, res) {
  consultaTags = {};

  if (req.body.tags.length) {
    tags = req.body.tags
    for (var i = 0; i < tags.length; i++) tags[i] = tags[i].toLowerCase();
    consultaTags = { 'puntosRecoleccion.objetosRetirados.sinCodigoQR.tags': { $in: tags } };
  }

  lugar.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$puntosRecoleccion" },
    { $unwind: "$puntosRecoleccion.objetosRetirados" },
    {
      $match: {
        $and: [{ "puntosRecoleccion.objetosRetirados.fechaRegistro.anoMes": req.body.anoMesRegistro },
          consultaTags]
      }
    },
    {
      $lookup: {
        "from": "usuarios",
        "localField": "puntosRecoleccion.objetosRetirados.codigoQR.correoUsuario",
        "foreignField": "_id",
        "as": "puntosRecoleccion.objetosRetirados.usuario"
      }
    },
    {
      $unwind: {
        path: '$puntosRecoleccion.objetosRetirados.usuario',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$puntosRecoleccion.objetosRetirados.usuario.objetosPersonales',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        nombre: 1,
        'puntosRecoleccion.nombre': 1,
        'puntosRecoleccion.telefono': 1,
        'puntosRecoleccion.direccion': 1,
        'puntosRecoleccion.objetosRetirados.codigoBusqueda': 1,
        'puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.tags': 1,
        'puntosRecoleccion.objetosRetirados.sinCodigoQR': 1,
        'puntosRecoleccion.objetosRetirados.fechaRegistro': 1,
        'puntosRecoleccion.objetosRetirados.retirado.fechaRetiro': 1,
        'puntosRecoleccion.objetosRetirados.retirado.personaReclamo': 1,
        'puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.codigoQR': 1,
        'puntosRecoleccion.objetosRetirados.codigoQR.objetoPersonalCodigoQR': 1,
        'puntosRecoleccion.actual': {
          "$cond": [{ "$eq": ["$puntosRecoleccion.nombre", req.body.nombrePunto] }, true, false]
        },
        isMatch: { $eq: ['$puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.codigoQR', '$puntosRecoleccion.objetosRetirados.codigoQR.objetoPersonalCodigoQR'] }
      }
    },
    { $match: { isMatch: true } },
    {
      $sort: {
        'puntosRecoleccion.objetosRetirados.fechaRegistro.dia': -1
      }
    },
    function (err, objetosRetirados) {
      if (objetosRetirados.length) {
        res.json({ correcto: true, mensaje: objetosRetirados });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro objetos" });
      }
    })

})

app.post('/api/consultarObjetosRetiradosTrabajadorCodigo', function (req, res) {
  
  lugar.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$puntosRecoleccion" },
    { $unwind: "$puntosRecoleccion.objetosRetirados" },
    {
      $match: { 'puntosRecoleccion.objetosRetirados.codigoBusqueda': req.body.codigoBusqueda }
    },
    {
      $lookup: {
        "from": "usuarios",
        "localField": "puntosRecoleccion.objetosRetirados.codigoQR.correoUsuario",
        "foreignField": "_id",
        "as": "puntosRecoleccion.objetosRetirados.usuario"
      }
    },
    {
      $unwind: {
        path: '$puntosRecoleccion.objetosRetirados.usuario',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$puntosRecoleccion.objetosRetirados.usuario.objetosPersonales',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        nombre: 1,
        'puntosRecoleccion.nombre': 1,
        'puntosRecoleccion.telefono': 1,
        'puntosRecoleccion.direccion': 1,
        'puntosRecoleccion.objetosRetirados.codigoBusqueda': 1,
        'puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.tags': 1,
        'puntosRecoleccion.objetosRetirados.sinCodigoQR': 1,
        'puntosRecoleccion.objetosRetirados.fechaRegistro': 1,
        'puntosRecoleccion.objetosRetirados.retirado.fechaRetiro': 1,
        'puntosRecoleccion.objetosRetirados.retirado.personaReclamo': 1,
        'puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.codigoQR': 1,
        'puntosRecoleccion.objetosRetirados.codigoQR.objetoPersonalCodigoQR': 1,
        isMatch: { $eq: ['$puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.codigoQR', '$puntosRecoleccion.objetosRetirados.codigoQR.objetoPersonalCodigoQR'] }
      }
    },
    { $match: { isMatch: true } },
    function (err, objetosRetirados) {
      if (objetosRetirados.length) {
        res.json({ correcto: true, mensaje: objetosRetirados[0] });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro el objeto" });
      }
    })
})

app.post('/api/consultarObjetosRetiradosLugar', function (req, res) {
  consultaTags = {};
  consultaNombrePuntoRecoleccion = {};
  if (req.body.nombrePuntoRecoleccion != "Todos") consultaNombrePuntoRecoleccion = { 'puntosRecoleccion.nombre': req.body.nombrePuntoRecoleccion };
  if (req.body.tags.length) {
    tags = req.body.tags
    for (var i = 0; i < tags.length; i++) tags[i] = tags[i].toLowerCase();
    consultaTags = { 'puntosRecoleccion.objetosRetirados.sinCodigoQR.tags': { $in: tags } };
  }

  lugar.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$puntosRecoleccion" },
    { $unwind: "$puntosRecoleccion.objetosRetirados" },
    {
      $match: {
        $and: [{ "puntosRecoleccion.objetosRetirados.fechaRegistro.anoMes": req.body.anoMesRegistro },
          consultaTags,
          consultaNombrePuntoRecoleccion]
      }
    },
    {
      $lookup: {
        "from": "usuarios",
        "localField": "puntosRecoleccion.objetosRetirados.codigoQR.correoUsuario",
        "foreignField": "_id",
        "as": "puntosRecoleccion.objetosRetirados.usuario"
      }
    },
    {
      $unwind: {
        path: '$puntosRecoleccion.objetosRetirados.usuario',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$puntosRecoleccion.objetosRetirados.usuario.objetosPersonales',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        nombre: 1,
        'puntosRecoleccion.nombre': 1,
        'puntosRecoleccion.telefono': 1,
        'puntosRecoleccion.direccion': 1,
        'puntosRecoleccion.objetosRetirados.codigoBusqueda': 1,
        'puntosRecoleccion.objetosRetirados.trabajadorRegistro': {
          "$filter": {
            "input": "$trabajadores",
            "as": "trabajadorRegistro",
            "cond": { "$eq": ["$$trabajadorRegistro._id", "$puntosRecoleccion.objetosRetirados.correoTrabajadorRegistro"] }
          }
        },
        'puntosRecoleccion.objetosRetirados.retirado.trabajadorRetiro': {
          "$filter": {
            "input": "$trabajadores",
            "as": "trabajadorRetiro",
            "cond": { "$eq": ["$$trabajadorRetiro._id", "$puntosRecoleccion.objetosRetirados.retirado.correoTrabajadorRetiro"] }
          }
        },
        'puntosRecoleccion.objetosRetirados.tags': {
          $ifNull: ["$puntosRecoleccion.objetosRetirados.sinCodigoQR.tags", '$puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.tags']
        },
        'puntosRecoleccion.objetosRetirados.codigoQR.objetoPersonalCodigoQR': 1,
        'puntosRecoleccion.objetosRetirados.sinCodigoQR.descripcionOculta': 1,
        'puntosRecoleccion.objetosRetirados.retirado.fechaRetiro': 1,
        'puntosRecoleccion.objetosRetirados.retirado.personaReclamo': 1,
        'puntosRecoleccion.objetosRetirados.fechaRegistro.anoMes': 1,
        'puntosRecoleccion.objetosRetirados.fechaRegistro.dia': 1,
        'puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.codigoQR': 1,
        'puntosRecoleccion.objetosRetirados.usuario._id': 1,
        'puntosRecoleccion.objetosRetirados.usuario.nombre': 1,
        'puntosRecoleccion.objetosRetirados.usuario.celular': 1,
        isMatch: { $eq: ['$puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.codigoQR', '$puntosRecoleccion.objetosRetirados.codigoQR.objetoPersonalCodigoQR'] }
      }
    },
    { $match: { isMatch: true } },
    { $unwind: '$puntosRecoleccion.objetosRetirados.trabajadorRegistro' },
    { $unwind: '$puntosRecoleccion.objetosRetirados.retirado.trabajadorRetiro' },
    {
      $sort: {
        'puntosRecoleccion.objetosRetirados.fechaRegistro.dia': -1
      }
    },
    function (err, objetosRetirados) {
      if (objetosRetirados.length) {
        res.json({ correcto: true, mensaje: objetosRetirados });
      } else {
        res.json({ correcto: false, mensaje: "No se encontraron objetos" });
      }
    })

})

app.post('/api/consultarObjetosRetiradosLugarCodigo', function (req, res) {
  
  lugar.aggregate(
    { $match: { _id: req.body.correoLugar } },
    { $unwind: "$puntosRecoleccion" },
    { $unwind: "$puntosRecoleccion.objetosRetirados" },
    {
      $match: { 'puntosRecoleccion.objetosRetirados.codigoBusqueda': req.body.codigoBusqueda }
    },
    {
      $lookup: {
        "from": "usuarios",
        "localField": "puntosRecoleccion.objetosRetirados.codigoQR.correoUsuario",
        "foreignField": "_id",
        "as": "puntosRecoleccion.objetosRetirados.usuario"
      }
    },
    {
      $unwind: {
        path: '$puntosRecoleccion.objetosRetirados.usuario',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$puntosRecoleccion.objetosRetirados.usuario.objetosPersonales',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        nombre: 1,
        'puntosRecoleccion.nombre': 1,
        'puntosRecoleccion.telefono': 1,
        'puntosRecoleccion.direccion': 1,
        'puntosRecoleccion.objetosRetirados.codigoBusqueda': 1,
        'puntosRecoleccion.objetosRetirados.trabajadorRegistro': {
          "$filter": {
            "input": "$trabajadores",
            "as": "trabajadorRegistro",
            "cond": { "$eq": ["$$trabajadorRegistro._id", "$puntosRecoleccion.objetosRetirados.correoTrabajadorRegistro"] }
          }
        },
        'puntosRecoleccion.objetosRetirados.retirado.trabajadorRetiro': {
          "$filter": {
            "input": "$trabajadores",
            "as": "trabajadorRetiro",
            "cond": { "$eq": ["$$trabajadorRetiro._id", "$puntosRecoleccion.objetosRetirados.retirado.correoTrabajadorRetiro"] }
          }
        },
        'puntosRecoleccion.objetosRetirados.tags': {
          $ifNull: ["$puntosRecoleccion.objetosRetirados.sinCodigoQR.tags", '$puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.tags']
        },
        'puntosRecoleccion.objetosRetirados.codigoQR.objetoPersonalCodigoQR': 1,
        'puntosRecoleccion.objetosRetirados.sinCodigoQR.descripcionOculta': 1,
        'puntosRecoleccion.objetosRetirados.fechaRegistro.anoMes': 1,
        'puntosRecoleccion.objetosRetirados.fechaRegistro.dia': 1,
        'puntosRecoleccion.objetosRetirados.retirado.fechaRetiro': 1,
        'puntosRecoleccion.objetosRetirados.retirado.personaReclamo': 1,
        'puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.codigoQR': 1,
        'puntosRecoleccion.objetosRetirados.usuario._id': 1,
        'puntosRecoleccion.objetosRetirados.usuario.nombre': 1,
        'puntosRecoleccion.objetosRetirados.usuario.celular': 1,
        isMatch: { $eq: ['$puntosRecoleccion.objetosRetirados.usuario.objetosPersonales.codigoQR', '$puntosRecoleccion.objetosRetirados.codigoQR.objetoPersonalCodigoQR'] }
      }
    },
    { $match: { isMatch: true } },
    { $unwind: '$puntosRecoleccion.objetosRetirados.trabajadorRegistro' },
    { $unwind: '$puntosRecoleccion.objetosRetirados.retirado.trabajadorRetiro' },
    function (err, objetosRetirados) {
      if (objetosRetirados.length) {
        res.json({ correcto: true, mensaje: objetosRetirados[0] });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro el objeto" });
      }
    })

})


//Notificaciones

app.post('/api/notificacionUsuario_Usuario', function (req, res) {

  fecha = fechaActual();
  usuario.aggregate(
    { $unwind: "$objetosPersonales" },
    { $match: { 'objetosPersonales.codigoQR': req.body.codigoQR } },
    {
      $project: {
        _id : 1
      }
    },
    function (err, cuentaUsuario) {
      if (!err) {
        if (cuentaUsuario.length) {
          cuentaUsuario = cuentaUsuario[0];
          if (cuentaUsuario._id != req.body.correoUsuario) {
            usuario.findOneAndUpdate(
              {
                _id: cuentaUsuario._id,
                'objetosPersonales.codigoQR': req.body.codigoQR
              },
              {
                $push: {
                  'objetosPersonales.$.notificaciones': {
                    _id: mongoose.Types.ObjectId(),
                    correoElectronico: req.body.correoUsuario,
                    usuario: {
                      fechaRegistro: {
                        anoMes: fecha.anoMes,
                        dia: fecha.dia
                      }
                    }
                  }
                }
              }, function (err, usuarioDueño) {
                if (!err) {
                  res.json({ correcto: true, mensaje: 'Se notifico al dueño exitosamente' });
                } else {
                  res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
                }
              })
          } else {
            res.json({ correcto: false, mensaje: "Error: Esta cuenta registro este objeto" });
          }
        } else {
          res.json({ correcto: false, mensaje: "Error: No se encuentra el registro de este objeto" });
        }
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/eliminarNotificacion', function (req, res) {
  usuario.findOneAndUpdate({
    _id: req.body.correoUsuario,
    "objetosPersonales.codigoQR" : req.body.codigoQR
  },
    {
      $pull: { "objetosPersonales.$.notificaciones": { _id: req.body.idNotificacion } }
    },
    function (err, notificacion) {
      if (!err) {
        res.json({ correcto: true, mensaje: 'Se ha eliminado la notificacion exitosamente' });
      } else {
        res.json({ correcto: false, mensaje: 'Error: Ha ocurrido un error' });
      }
    })
});

app.post('/api/consultarNotificacionesUsuario', function (req, res) {

  usuario.aggregate(
    { $match: { _id: req.body.correoUsuario } },
    { $unwind: "$objetosPersonales" },
    { $match: { 'objetosPersonales.disponible': true } },
    { $unwind: "$objetosPersonales.notificaciones" },
    { $match: { 'objetosPersonales.notificaciones.usuario': { $exists: true } } },
    {
      $lookup: {
        "from": "usuarios",
        "localField": "objetosPersonales.notificaciones.correoElectronico",
        "foreignField": "_id",
        "as": "objetosPersonales.notificaciones.usuario.cuenta"
      }
    },
    { $unwind: "$objetosPersonales.notificaciones.usuario.cuenta" },
    {
      $project: {
        "objetosPersonales.tags": 1,
        "objetosPersonales.notificaciones._id": 1,
        "objetosPersonales.notificaciones.usuario.cuenta._id": 1,
        "objetosPersonales.notificaciones.usuario.cuenta.nombre": 1,
        "objetosPersonales.notificaciones.usuario.cuenta.celular": 1,
        "objetosPersonales.notificaciones.usuario.fechaRegistro": 1
      }
    },
    {
      $sort: {
        "objetosPersonales.notificaciones.usuario.fechaRegistro": -1
      }
    },
    function (err, notificacionesUsuario) {
      if (notificacionesUsuario.length) {
        res.json({ correcto: true, mensaje: notificacionesUsuario });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro notificaciones" });
      }
    })

});

app.post('/api/consultarNotificacionesLugar', function (req, res) {

  usuario.aggregate(
    { $match: { _id: req.body.correoUsuario } },
    { $unwind: "$objetosPersonales" },
    { $match: { 'objetosPersonales.disponible': true } },
    { $unwind: "$objetosPersonales.notificaciones" },
    { $match: { 'objetosPersonales.notificaciones.lugar': { $exists: true } } },
    {
      $lookup: {
        "from": "lugares",
        "localField": "objetosPersonales.notificaciones.correoElectronico",
        "foreignField": "_id",
        "as": "objetosPersonales.notificaciones.lugar.cuenta"
      }
    },
    { $unwind: "$objetosPersonales.notificaciones.lugar.cuenta" },
    { $unwind: '$objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion' },
    {
      $project: {
        "objetosPersonales.tags": 1,
        "objetosPersonales.notificaciones._id": 1,
        "objetosPersonales.notificaciones.lugar.objetoCodigoBusqueda": 1,
        "objetosPersonales.notificaciones.lugar.cuenta._id": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.nombre": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.nombre": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.direccion": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.telefono": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.objetosPerdidos.codigoBusqueda": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.objetosPerdidos.fechaRegistro": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.objetosPerdidos.codigoQR.codigoRetiro": 1,
        isMatchPuntoRecoleccion: { $eq: ['$objetosPersonales.notificaciones.lugar.nombrePuntoRecolecion', '$objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.nombre'] }
      }
    },
    { $match: { isMatchPuntoRecoleccion: true } },
    { $unwind: '$objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.objetosPerdidos' },
    {
      $project: {
        "objetosPersonales.tags": 1,
        "objetosPersonales.notificaciones._id": 1,
        "objetosPersonales.notificaciones.lugar.cuenta._id": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.nombre": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.nombre": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.direccion": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.telefono": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.objetosPerdidos.codigoBusqueda": 1,
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.objetosPerdidos.fechaRegistro": 1,
         "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.objetosPerdidos.codigoQR.codigoRetiro": 1,
        isMatchObjetoPerdido: { $eq: ['$objetosPersonales.notificaciones.lugar.objetoCodigoBusqueda', '$objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.objetosPerdidos.codigoBusqueda'] }
      }
    },
    { $match: { isMatchObjetoPerdido: true } },
    {
      $sort: {
        "objetosPersonales.notificaciones.lugar.cuenta.puntosRecoleccion.objetosPerdidos.fechaRegistro": -1
      }
    },
    function (err, notificacionesLugar) {
      if (notificacionesLugar.length) {
        res.json({ correcto: true, mensaje: notificacionesLugar });
      } else {
        res.json({ correcto: false, mensaje: "No se encontro notificaciones" });
      }
    })

});


var mongodbUri = 'mongodb://user:user@ds035776.mlab.com:35776/encontralopues';
mongoose.connect(mongodbUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(8080);
console.log("App listening on port 8080");
