import {
  obtenerTodosClientes,
  obtenerClientePorId,
  obtenerClientePorNit,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from '../modelos/clienteModelo.js';

// Listar todos los clientes
export const listarClientes = async (req, res) => {
  try {
    const clientes = await obtenerTodosClientes();
    res.json({
      ok: true,
      clientes
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener clientes',
      error: error.message
    });
  }
};

// Obtener un cliente por ID
export const obtenerCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await obtenerClientePorId(id);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Cliente no encontrado'
      });
    }

    res.json({
      ok: true,
      cliente
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener el cliente',
      error: error.message
    });
  }
};

// Crear cliente
export const insertarCliente = async (req, res) => {
  try {
    const { nit } = req.body;

    // Verificar si el NIT ya existe
    if (nit) {
      const clienteExiste = await obtenerClientePorNit(nit);
      if (clienteExiste) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El NIT ya está registrado'
        });
      }
    }

    const nuevoCliente = await crearCliente(req.body);

    res.status(201).json({
      ok: true,
      mensaje: 'Cliente creado exitosamente',
      cliente: nuevoCliente
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al crear el cliente',
      error: error.message
    });
  }
};

// Actualizar cliente
export const modificarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nit } = req.body;

    // Verificar si el cliente existe
    const clienteExiste = await obtenerClientePorId(id);
    if (!clienteExiste) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Cliente no encontrado'
      });
    }

    // Verificar si el NIT ya está en uso por otro cliente
    if (nit) {
      const nitExiste = await obtenerClientePorNit(nit);
      if (nitExiste && nitExiste.id !== parseInt(id)) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El NIT ya está en uso'
        });
      }
    }

    const clienteActualizado = await actualizarCliente(id, req.body);

    res.json({
      ok: true,
      mensaje: 'Cliente actualizado exitosamente',
      cliente: clienteActualizado
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar el cliente',
      error: error.message
    });
  }
};

// Eliminar cliente (eliminación lógica)
export const borrarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el cliente existe
    const clienteExiste = await obtenerClientePorId(id);
    if (!clienteExiste) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Cliente no encontrado'
      });
    }

    await eliminarCliente(id);

    res.json({
      ok: true,
      mensaje: 'Cliente eliminado exitosamente (eliminación lógica)',
      id
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al eliminar el cliente',
      error: error.message
    });
  }
};