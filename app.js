import express from 'express';
import pkg from 'pg';

const Pool = pkg.Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'express_app',
    password: 'postgres',
    port: 6432
})

pool.connect()
    .then((pool) => {
        console.log('Connection successful')
    })
    .catch((err) => {
        console.error(err)
    })

const app = express(); // Declare a express app.
app.use(express.json()); // Middleware to parse request body.
// Middleware for basic authentication
app.use((req, res, next) => {
    const authToken = req.headers['authorization']

    if (authToken !== 'Basic YWRtaW46bWVvd21peA==') {
        res.status(401).json({ message: 'Access denied' })
    } else {
        next();
    }
});
// Get request to list all calibers
app.get('/eft/ballistics', (req, res, next) => {
    pool.query('SELECT * FROM caliber')
        .then((data) => {
            if (data.rows.length === 0) {
                res.status(404).send('Calibers not found');
            }
            res.status(200).json({ data: data.rows });
        })
        .catch(next)
});
// Get request to list one caliber and it's rounds
app.get('/eft/ballistics/caliber/:calID', (req, res, next) => {
    const calID = Number(req.params.calID);

    pool.query('SELECT * FROM round WHERE caliber_id = $1', [calID])
        .then((data) => {
            if (data.rows.length === 0) {
                res.status(404).send('Caliber not found');
            }
            res.status(200).json({ data: data.rows });
        })
        .catch(next)
});

// Patch request to update a caliber
app.patch('/eft/ballistics/caliber/:calID', (req, res, next) => {
    const calID = Number(req.params.calID);
    const { name } = req.body;
    if (calID.isNaN) {
        res.status(400).json({ message: 'Not Found' })
        return;
    }

    pool.query('UPDATE caliber SET name = COALESCE($1, name) WHERE id = $2 RETURNING *', [name, calID])
        .then((data) => {
            if (data.rows.length == 0) {
                res.sendStatus(404);
                return;
            }
            res.status(200).json({ message: 'Caliber updated successfully.' })
        })
        .catch(next)
});

//Patch request to update a round.
app.patch('/eft/ballistics/round/:roundID', (req, res, next) => {
    const roundID = Number(req.params.roundID);
    const { name } = req.body;
    const dmg = Number(req.body.dmg);
    const caliber_id = Number(req.body.caliber_id);
    const penetration = Number(req.body.penetration);

    if (roundID.isNaN) {
        res.status(400).json({ message: 'Not Found' })
        return;
    }

    pool.query(
        `UPDATE round SET 
            name = COALESCE($1, name),
            dmg = COALESCE($2, dmg),
            caliber_id = COALESCE($3, caliber_id),
            penetration = COALESCE($4, penetration)
        WHERE id = $5 RETURNING *`,
        [name, dmg, caliber_id, penetration, roundID])
        .then((data) => {
            if (data.rows.length == 0) {
                res.sendStatus(404);
                return;
            }
            res.status(200).json({ message: 'Round updated successfully.' })
        })
        .catch(next)
});

// Delete request to delete a caliber
app.delete('/eft/ballistics/caliber/:calID', (req, res, next) => {
    const calID = Number(req.params.calID);

    if (calID.isNaN) {
        res.status(400).json({ message: 'Not Found' })
        return;
    }

    pool.query('DELETE FROM caliber WHERE id = $1', [calID])
        .then(() => {
            res.status(200).json({ message: 'Caliber deleted successfully' });
        })
        .catch(next)
});

// Delete request to delete a round
app.delete('/eft/ballistics/round/:roundID', (req, res, next) => {
    const roundID = Number(req.params.roundID);

    if (roundID.isNaN) {
        res.status(400).json({ message: 'Not Found' })
        return;
    }

    pool.query('DELETE FROM round WHERE id = $1', [roundID])
        .then(() => {
            res.status(200).json({ message: 'Round deleted successfully' });
        })
        .catch(next)
});

// Post request to create a caliber
app.post('/eft/ballistics/caliber', (req, res, next) => {
    const { name } = req.body;
    pool.query('INSERT INTO caliber (name) VALUES ($1)', [name])
        .then((data) => {
            res.status(200).json({ message: 'Caliber created successfully.' })
        })
        .catch(next)
});

// Post request to create a round
app.post('/eft/ballistics/round', (req, res, next) => {
    const { name } = req.body;
    const dmg = Number(req.body.dmg);
    const caliber_id = Number(req.body.caliber_id);
    const penetration = Number(req.body.penetration);
    const dataList = [name, dmg, caliber_id, penetration]
    console.log(penetration);
    for (let i = 0; i < dataList.length; i++) {
        if (isNaN(dataList[i])) {
            res.status(404).json({ message: 'Round created incorrectly. Usage: name, dmg, caliber_id, penetration' })
        }
        return;
    }

    pool.query('INSERT INTO round (name, dmg, caliber_id, penetration) VALUES ($1, $2, $3, $4)', [name, dmg, caliber_id, penetration])
        .then((data) => {
            res.status(200).json({ message: 'Round created successfully.' })
        })
        .catch(next)
});

// Use next middleware to pass errors.
app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
})

app.listen(8001, () => {
    console.log('listening on port ' + 8001);
})