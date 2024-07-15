const { Pool } = require('pg');

const pool = new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    password: '0706029188_Zam',
    database: 'hollywood',
    port: 5432
});

//endpoint para obtener todos los actores
async function getActores(req, res) {
    try {
        const client = await pool.connect();
        const result = await pool.query('SELECT * FROM actores');
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los actores' });
    }
}

//endpoint para obtener actor por ID
async function getActorById(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM actores WHERE cod_act = $1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.json(result.rows);
        } else {
            res.status(400).json({ error: 'No se encontró el actor' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener actor' });
    }
}

//endpoint para ingresar un actor
async function createActor(req, res) {
    const { cod_act, nom_act, nom_rea_act, fec_nac_act, fec_mue_act, naciona_act } = req.body;

    // Validar y convertir fechas
    const formattedFecNacAct = fec_nac_act ? new Date(fec_nac_act) : null;
    const formattedFecMueAct = fec_mue_act ? new Date(fec_mue_act) : null;

    const query = 'INSERT INTO actores (cod_act, nom_act, nom_rea_act, fec_nac_act, fec_mue_act, naciona_act) VALUES ($1, $2, $3, $4, $5, $6) returning *';
    const values = [cod_act, nom_act, nom_rea_act, formattedFecNacAct, formattedFecMueAct, naciona_act];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        res.status(201).json({
            message: 'Actor ingresado correctamente',
            actor: result.rows
        });
    } catch (error) {
        console.error('Error al crear el actor:', error);
        res.status(500).json({ error: 'Error al crear el actor' });
    }
}


//endpoint para actualizar un actor
async function updateActor(req, res) {
    const { id } = req.params;
    const { cod_act, nom_act, nom_rea_act, fec_nac_act, fec_mue_act, naciona_act } = req.body;

    // Validar y convertir fechas
    const formattedFecNacAct = fec_nac_act ? new Date(fec_nac_act) : null;
    const formattedFecMueAct = fec_mue_act ? new Date(fec_mue_act) : null;

    const query = 'UPDATE actores SET cod_act = $1, nom_act = $2, nom_rea_act = $3, fec_nac_act = $4, fec_mue_act = $5, naciona_act = $6 WHERE cod_act = $7 returning *';
    const values = [cod_act, nom_act, nom_rea_act, formattedFecNacAct, formattedFecMueAct, naciona_act, id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.json({
                message: 'Actor actualizado correctamente',
                actor: result.rows
            });
        } else {
            res.status(400).json({ error: 'No se encontró el actor' });
        }
    } catch (error) {
        console.error('Error al actualizar actor:', error);
        res.status(500).json({ error: 'Error al actualizar actor' });
    }
}


//endpoint para eliminar un actor
async function deleteActor(req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM actores WHERE cod_act = $1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.json({ message: 'Actor eliminado correctamente' });
        } else {
            res.status(400).json({ error: 'No se encontró el actor' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al eliminar actor' });
    }
}

module.exports = {
    getActores,
    getActorById,
    createActor,
    updateActor,
    deleteActor
}