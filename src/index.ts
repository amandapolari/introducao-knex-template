import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database/knex';

// CONFIGS:
const app = express();
app.use(cors());
app.use(express.json());
app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`);
});

// CONSULTA DE TESTE:

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

// PRÁTICA 1

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

// PRÁTICA 2

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
        res.status(200).send(`Banda ${name} cadastrada com sucesso!`);
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

// PRÁTICA 3

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
            await db.raw(`
                UPDATE bands SET
                id = "${newId || band.id}", name = "${newName || band.name}"
                WHERE id = "${id}"
            `);
        } else {
            res.status(400);
            throw new Error('Id não encontrado!');
        }
        res.status(200).send('Atualização concluída com sucesso!');
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

// => FIXAÇÃO

// 📌 READ:
app.get('/songs', async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`SELECT * FROM songs`);
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

// 📌 CREATE:
app.post('/songs', async (req: Request, res: Response) => {
    try {
        // recebendo infos do body:
        const { id, name, band_id } = req.body;
        // verificando se campos acima não estão vazios:
        if (!id || !name || !band_id) {
            res.status(400);
            throw new Error('id, name ou band_id inválidos!');
        }
        // verificando se o 'band_id' corresponde a algum id de 'bands':
        const [band] = await db.raw(
            `SELECT * FROM bands WHERE id = "${band_id}"`
        );
        if (!band) {
            res.status(400);
            throw new Error(
                'Band_id não corresponde a nenhuma banda existente!'
            );
        }
        // passando na verificação acima vou fazer a inserção no banco de dados:
        await db.raw(`INSERT INTO songs
            VALUES("${id}", "${name}", "${band_id}")
        `);
        // lançando a resposta:
        res.status(200).send(`Música ${name} cadastrada com sucesso`);
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

// 📌 UPDATE:
app.put('/songs/:id', async (req: Request, res: Response) => {
    try {
        // --
        // Relembrando outras formas:
        // const id = req.params.id;
        // const newId = req.body.newId;
        // const newName = req.body.newName;
        // --
        const { id, newId, newName, newBandId } = req.body;
        if (newId !== undefined) {
            // verificando se newId é diferente de string:
            if (typeof newId !== 'string') {
                res.status(400);
                throw new Error('Id deve ser uma string');
            }
            // verificando se newId possui um tamanho diferente de 4 caracteres:
            if (newId.length !== 4) {
                throw new Error('O id deve ter 4 caracteres');
            }
        }
        if (newName !== undefined) {
            // verificando se newName é diferente de string:
            if (typeof newName !== 'string') {
                res.status(400);
                throw new Error('O name deve ser uma string');
            }
            // verificando se newName possui menos de 2 caracteres:
            if (newName.length < 2) {
                throw new Error('O name deve ter no mínimo 2 caracteres');
            }
        }
        if (newId !== undefined) {
            // verificando se newId é diferente de string:
            if (typeof newId !== 'string') {
                res.status(400);
                throw new Error('NewId deve ser uma string');
            }
            // verificando se newId possui menos de 2 caracteres:
            if (newName.length !== 4) {
                throw new Error('O newId deve conter 4 caracteres');
            }
            // verificando se o 'newBandId' corresponde a algum id de 'bands':
            const [band] = await db.raw(
                `SELECT * FROM bands WHERE band_id = "${newBandId}"`
            );
            if (!band) {
                res.status(400);
                throw new Error(
                    'Band_id não corresponde a nenhuma banda existente!'
                );
            }
        }
        // verifica se existe song com o id fornecido para poder editá-lo:
        const [song] = await db.raw(`SELECT * FROM songs WHERE id = "${id}"`);
        if (song) {
            // Se houver song com o id fornecido faz as edições:
            await db.raw(`
            UPDATE songs SET
            id = "${newId || song.id}", name = "${
                newName || song.name
            }", song_id = "${newBandId || song.band_id}"
            WHERE id = "${id}"
            `);
        }
        res.status(200).send('Atualização concluída com sucesso!');
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
