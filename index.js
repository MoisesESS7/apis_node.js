const express = require("express");
const app = express();
const connection = require("./database/database");
const Game = require("./database/Game");

connection.authenticate().then(() => {
    console.log("Conectado ao banco de dados...");
}).catch((msgError) => {
    console.log(`Erro de conexão com o banco de dados: ${msgError}`);
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/games", (req, res) => {
    Game.findAll()
        .then(games => {
            if(games){
                res.statusCode = 200;
                res.json(games);
            }else{
                res.sendStatus(404);
            }
        })
        .catch(err => {
            console.error(`Erro ao recuperar dados: ${err}`);
            res.status(500).json({ error: 'Erro ao recuperar dados' });
        });
});

app.get("/game/:id", (req, res) => {
    let gameId = req.params.id;

    if (isNaN(gameId)) {
        res.sendStatus(400);
    } else {
        let id = parseInt(gameId);

        Game.findOne({
            where: { id: id }
        })
        .then(game => {
            if(game){
                res.statusCode = 200;
                res.json(game);
            }else{
                res.sendStatus(404);
            } 
        })
        .catch((err) => {
            console.error(`Erro ao recuperar dados: ${err}`);
            res.status(500).json({ error: 'Erro ao recuperar dados' });
        });
    }
});

app.post("/game", (req, res) => {
    let { title, year, price } = req.body;

    if (!title || !year || !price) {
        res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    } else {
        Game.create({
            title: title,
            year: year,
            price: price
        })
        .then(game => {
            res.status(201).json(game);
        })
        .catch(err => {
            console.error(`Erro ao criar dados: ${err}`);
            res.status(500).json({ error: 'Erro ao criar dados' });
        });
    }
});

app.put("/game/:id", (req, res) => {
    let gameId = req.params.id;
    let { title, year, price } = req.body;

    // Verifica se o ID do jogo é um número válido
    if (isNaN(gameId)) {
        res.status(400).json({ error: 'Id inválido' });
    } else {
        let id = parseInt(gameId);

        // Verifica se o título, ano e preço estão presentes no corpo da solicitação
        if (!title || !year || !price) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes' });
        } else {
            // Busca o jogo no banco de dados pelo ID
            Game.findByPk(id)
            .then(game => {
                if (game) {
                    // Atualiza os dados do jogo
                    game.title = title;
                    game.year = year;
                    game.price = price;

                    // Salva as alterações no banco de dados
                    game.save();
                    res.json(game);
                } else {
                    res.status(404).json({ error: 'Dados não encontrado' });
                }
            })
            .then(updatedGame => {
                if (updatedGame) {
                    res.status(200).json(updatedGame); // Retorna o jogo atualizado com sucesso
                }
            })
            .catch(err => {
                console.error(`Erro ao atualizar dados: ${err}`);
                res.status(500).json({ error: 'Erro ao atualizar dados' });
            });
        }
    }
});

app.delete("/game/:id", (req, res) => {
    let gameId = req.params.id;

    // Verifica se o ID do jogo é um número válido
    if (isNaN(gameId)) {
        res.status(400).json({ error: 'Id inválido' });
    } else {
        let id = parseInt(gameId);

        Game.findByPk(id)
        .then(game => {
            if (game) {
                res.json(game);
                return game.destroy();
            } else {
                res.status(404).json({ error: 'Dados não encontrado' });
            }
        })
        .then(() => {
            // Responde com o código de status 204 (No Content) indicando que o jogo foi deletado com sucesso
            res.status(204).end();
        })
        .catch(err => {
            console.error(`Erro ao deletar dados: ${err}`);
            res.status(500).json({ error: 'Erro ao deletar dados' });
        });
    }
});

app.listen(3000, () => {
    console.log("Api rodando...");
})