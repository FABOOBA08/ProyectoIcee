const express = require('express');
const mysql = require("mysql");
const app = express();

/*  */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public")); // Ruta correcta para archivos estáticos
/*  */
/* conexión a la base de datos */
let conexion = mysql.createConnection({
  host: "localhost",
  database: "proyecto_icee",
  user: "root",
  password: "123456",
  port: 8085
});
/* Se manejan datos desde otras páginas o ubicación */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/* NUEVO */
app.use(express.static("public"));
/*  */


// Configura Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/usuarios.html");
});
/* Se direcciona a la ruta validar que es el formulario de registro para pasar los datos por el servidor antes de a la b */
app.post("/validar", function (req, res) {
  /*Variables donde se guardan los datos que se capturan desde el formulario */
  const datosU = req.body;
  let id = datosU.id;
  let nombre = datosU.nombre;
  let contrasena = datosU.contrasena;
  let nombreUsuario = datosU.nombreUsuario;
  let rol = datosU.rol;
  /* Query para insertar los datos */
  let registroU =
    "INSERT INTO usuarios (id,nombre,contrasena,rol,nombreUsuario) VALUES ('" +
    id +
    "', '" +
    nombre +
    "', '" +
    contrasena +
    "', '" +
    rol +
    "', '" +
    nombreUsuario +
    "')";
  conexion.query(registroU, function (error) {
    if (error) {
      throw error;
    } else {
      res.send(
        '<script>alert("Usuario agregado con éxito"); window.location="/";</script>'
      );
      console.log("Vamos por el camino del bien si se puede");
    }
  });
});
app.get("/consultar", function (req, res) {
  conexion.query("SELECT * FROM usuarios", function (err, result, fields) {
    if (err) throw err;
    res.render("consultar", { usuarios: result }); // Renderizar el archivo usuarios.ejs y pasar los datos como contexto
  });
});

conexion.connect(function (err) {
  if (err) throw err;
  //Select all customers and return the result object:
  conexion.query("SELECT * FROM usuarios", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});


// Agrega esta ruta para manejar la solicitud de obtener usuarios
app.get("/obtener-usuarios", function (req, res) {
  conexion.query("SELECT * FROM usuarios", function (err, result, fields) {
    if (err) {
      res.status(500).send("Error al obtener usuarios");
      return;
    }
    res.json(result);
  });
});


app.delete("/eliminar-usuario/:id", function (req, res) {
  const usuarioId = req.params.id;
  const eliminarQuery = `DELETE FROM usuarios WHERE id = ?`;

  conexion.query(eliminarQuery, [usuarioId], function (err) {
    if (err) {
      res.status(500).send("Error al eliminar el usuario");
    } else {
      res.send("Usuario eliminado con éxito");
    }
  });
});
/* NUEVO */
app.get("/usuario/:id", (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM usuarios WHERE id = ?";
  conexion.query(query, [userId], (err, result) => {
    if (err) {
      res.status(500).send("Error al obtener datos");
    } else {
      res.json(result[0]); // Asumiendo que el ID es único y queremos el primer resultado
    }
  });
});

app.put("/usuario/:id/actualizar", (req, res) => {
  const userId = ":id";
const updateRoute = `/usuario/${userId}/actualizar`;
  const usuarioId = req.params.id; // Obtiene el ID del parámetro de la ruta
  const { nombre, nombreUsuario, contrasena, rol } = req.body; // Datos que se van a actualizar
  console.log("Datos para actualización:", {
    nombre,
    nombreUsuario,
    contrasena,
    rol,
  });  
  console.log("ID para actualización:", usuarioId);  // Verificar ID
  // Consulta de actualización usando el ID del usuario
  const updateQuery = `
    UPDATE usuarios
    SET nombre = ?, nombreUsuario = ?, contrasena = ?, rol = ?
    WHERE id = ?
  `;
  
  // Valores para la consulta de actualización
  const updateValues = [nombre, nombreUsuario, contrasena, rol, usuarioId];
  
  // Ejecutar la consulta de actualización
  conexion.query(updateQuery, updateValues, (err) => {
    if (err) {
      console.error("Error al actualizar usuario:", err);
      return res.status(500).send("Error al actualizar el usuario");
    }
    res.send("Usuario actualizado con éxito"); // Mensaje de éxito
  });
});
  
/* 
  const userId = req.params.id;
  console.log("Actualizando usuario con ID:", userId); // Verificar ID
  const { nombre, nombreUsuario, contrasena, rol } = req.body;
  console.log("Datos recibidos:", nombre, nombreUsuario, contrasena, rol); // Verificar datos
}); */
/*  */
app.listen(3000, function () {
  console.log("Servidor creado http://localhost:3000");
});
