const { Pool } = require('pg');

const pool = new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    password: '0706029188_Zam',
    database: 'hollywood',
    port: 5432
});

//endpoint para obtener todos los actores
async function getPeliculas(req, res) {
    try {
        const client = await pool.connect();
        console.log('Connexión Exitosa');
        const result = await pool.query('SELECT * FROM peliculas');
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener las peliculas' });
    }
}

module.exports = { getPeliculas }