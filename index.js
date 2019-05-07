// implement your API here
const express = require('express');
const server = express();
const db = require('./data/db.js');
const cors = require('cors');

server.use(express.json());
server.use(cors({ origin: 'http://localhost:3000' }));

const sendUserError = (status, message, res) => {
    res.status(status).json({ errorMessage: message });
    return;
};

// POST request handler for new user
server.post('/api/users', (req, res) => {
    const { name, bio } = req.body;
    if (!name || !bio) {
        sendUserError(400, "Name or bio has no content.", res)
    }
    db.insert({ name, bio })
    .then(response => {
        res.status(201).json(response)
    })
    .catch(error => {
        console.log(error)
        sendUserError(500, "Couldn't add user to DB.", res)
        return;
    })
})

// GET request handler for all users
server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.json({users});
    })
    .catch(error => {
        console.log(error);
        sendUserError(500, 'User information retrieval failed', res);
        return;
    })
})

// GET request handler for specific user by ID
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
    .then(user => {
        if (!user.length) {
            sendUserError(404, 'User not found', res);
            return;
          }
        res.json(user);
    })
    .catch(error => {
        console.log(error);
        sendUserError(500, "Fetching user failed", res);
    })
})

//DELETE handler for specific user by ID
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
    .then(response => {
        if(!response) {
            sendUserError(404, "The user with that ID doesn't exist", res);
            return;
        }
        res.json({ success: `User with id: ${id} removed from system` });
        return;
    })
    .catch(error => {
        console.log(error);
        sendUserError(500, "The user couldn't be removed", res)
    })
})

//PUT request handler for specific user by ID
server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    if (!name || !bio) {
        sendUserError(400, "Name or bio has no content.", res)
    }
    db.update(id, {name, bio})
    .then(response => {
        response ? res.json({ success: `User ${name} was edited` }) : sendUserError(404, "User not found", res);
        return;
    })
    .catch(error => {
        console.log(error);
        sendUserError(500, "Editing user has failed.", res)
    })
})

server.listen(5000, () =>
    console.log('Server listening on port 5000')
)