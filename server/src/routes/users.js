import express from 'express';
import { UsersController } from '../controllers/UsersControllers';

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const response = await UsersController.getUsers();

        if (response) {
            res.send(response);
        } else {
            res.status(404).send('Not found');
        }
    } catch (error) {
        console.error(error);
    }
});

router.get("/user/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const response = await UsersController.getUserById(id);
        res.send(response);
    } catch (error) {
        console.error(error);
    }
});

router.post("/user", async (req, res) => {
    try {
        const user = req.body;
        const createUser = await UsersController.createUser(user);
        return res.status(200).json(createUser);
    } catch (error) {
        console.error(error);
    }
});

router.delete("/user/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleteUser = await UsersController.deleteUser(id);
        res.send("The user sucessfully deleted");
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;