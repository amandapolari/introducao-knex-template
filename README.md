# Introdução ao Knex - Template de Prática

## Índice

-   [Prática Guiada 1](#prática-guiada-1)

    -   [Enunciado](#enunciado)
    -   [Resolução](#resolução)

-   [Prática Guiada 2](#prática-guiada-2)

    -   [Enunciado](#enunciado-1)
    -   [Resolução](#resoluc3a7c3a3o-1)

-   [Prática Guiada 3](#prática-guiada-3)

    -   [Enunciado](#enunciado-2)
    -   [Resolução](#resoluc3a7c3a3o-2)

-   [Fixação](#fixação)

    -   [Enunciado](#enunciado-3)
    -   [Resolução](#resoluc3a7c3a3o-3)

## Prática Guiada 1

[Voltar ao Topo](#índice)

### Enunciado:

![Alt text](image.png)

### Resolução:

`knex.ts`

```ts
import { knex } from 'knex';

export const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './src/database/introducao-knex.db',
    },
    useNullAsDefault: true,
    pool: {
        min: 0,
        max: 1,
        afterCreate: (conn: any, cb: any) => {
            conn.run('PRAGMA foreign_keys = ON', cb);
        },
    },
});
```

`request.rest`

Criei um arquivo chamado `request.rest` para utilizá-lo como atalho para bater nos endpoints, dentro dele o seguinte código:

```
GET http://localhost:3003/ping
###
```

RESULTADO:
![Alt text](image-5.png)

`index.ts`

```ts
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
```

`request.rest`

```
GET http://localhost:3003/bands
###
```

RESULTADO:
Um array vazio, porque nãa há conteúd e todo arquivo `.db` retorna um array, seja ele vazio o não.

## Prática Guiada 2

[Voltar ao Topo](#índice)

### Enunciado:

![Alt text](image-1.png)

### Resolução:

`index.ts`

```ts
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
```

`request.rest`

```

POST http://localhost:3003/bands
Content-Type: application/json

{
    "id": "b001",
    "name": "Wham!"
}
###

POST http://localhost:3003/bands
Content-Type: application/json

{
    "id": "b002",
    "name": "Depeche Mode"
}
###

POST http://localhost:3003/bands
Content-Type: application/json

{
    "id": "b003",
    "name": "Rammstein"
}
###

```

> ATENÇÃO: MANTER A LINHA EM BRANCO ANTES DA CHAVE!!!

RESULTADO:
![Alt text](image-4.png)

## Prática Guiada 3

[Voltar ao Topo](#índice)

### Enunciado:

![Alt text](image-2.png)

### Resolução:

`index.ts`

```ts
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
```

`resquest.rest`

```
PUT http://localhost:3003/bands/b001
Content-Type: application/json

{
    "newName": "Coldplay"
}
###
```

RESULTADO:
![Alt text](image-6.png)

## Fixação

[Voltar ao Topo](#índice)

### Enunciado:

![Alt text](image-3.png)

### Resolução:
