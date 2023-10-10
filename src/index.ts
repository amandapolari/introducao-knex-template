import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database/knex';

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`);
});

app.get('/ping', async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: 'Pong Easley!' });
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

//PRATICA 1

app.get('/bands', async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`SELECT * FROM bands`);

        res.status(200).send(result);
    } catch (error: any) {
        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

//PRATICA 2

app.post('/bands', async (req: Request, res: Response) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        // const { id, name } = req.body;

        if (!id || !name) {
            //undefined
            res.status(400);
            throw new Error('id ou name invalido!');
        }

        await db.raw(`INSERT INTO bands
            VALUES("${id}", "${name}")
        `);

        res.status(200).send('Banda Cadastrada!');
    } catch (error: any) {
        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

//PRATICA 3

app.put('/bands/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const newId = req.body.newId;
        const newName = req.body.newName;

        //console.log(id, newId, newName);

        if (newId !== undefined) {
            if (typeof newId !== 'string') {
                res.status(400);
                throw new Error('Id deve ser uma string');
            }

            if (newId.length !== 4) {
                throw new Error('O id deve ter 4 caracteres');
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== 'string') {
                res.status(400);
                throw new Error('O name deve ser uma string');
            }

            if (newName.length < 2) {
                throw new Error('O name deve ter no mínimo 2 caracteres');
            }
        }

        const [band] = await db.raw(`SELECT * FROM bands WHERE id = "${id}"`);

        if (band) {
            //undefined
            await db.raw(`
                UPDATE bands SET
                id = "${newId || band.id}", name = "${newName || band.name}"
                WHERE id = "${id}"
            `);
        } else {
            res.status(400);
            throw new Error('Id não encontrado!');
        }

        res.status(200).send('Edição feita com sucesso!');
    } catch (error: any) {
        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});
