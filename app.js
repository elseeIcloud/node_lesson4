const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Task = require('./models/task');

const app = express();

app.use(bodyParser.json());

sequelize
    .sync()
    .then(() => {
        console.log('Соединение с базой данных установлено');
    })
    .catch((err) => {
        console.error('Ошибка подключения к базе данных:', err);
    });

// Получить список задач (Read)
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json({ tasks });
    } catch (err) {
        console.error('Ошибка при получении задач:', err);
        res.status(500).send('Ошибка при получении задач');
    }
});

// Создать новую задачу (Create)
app.post('/tasks', async (req, res) => {
    const newTask = req.body.task;
    try {
        const task = await Task.create(newTask);
        res.json({ task });
    } catch (err) {
        console.error('Ошибка при создании задачи:', err);
        res.status(500).send('Ошибка при создании задачи');
    }
});

// Обновить существующую задачу (Update)
app.put('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body.task;
    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).send('Задача не найдена');
        }
        await task.update(updatedTask);
        res.json({ task });
    } catch (err) {
        console.error('Ошибка при обновлении задачи:', err);
        res.status(500).send('Ошибка при обновлении задачи');
    }
});

// Удалить задачу (Delete)
app.delete('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).send('Задача не найдена');
        }
        await task.destroy();
        res.status(204).send();
    } catch (err) {
        console.error('Ошибка при удалении задачи:', err);
        res.status(500).send('Ошибка при удалении задачи');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
