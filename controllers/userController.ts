import { Request, Response } from "express";
import pool from "../db/database";

// GET /users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users");
        res.status(200).json(rows);
    }
    catch(err){
      console.error(`Error fetching the users ${err}`)
      res.status(500).json({message : `Internal server error`})
    }
};

export const getUserById = async (req : Request, res : Response): Promise<any> => {
    const {id} = req.params
    try{
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if(rows.length === 0){
            res.json(`User not found`)
        }
        else {
            res.status(200).json(rows);
        }
    }
    catch(err){
      console.error(`Error fetching the user ${err}`)
      res.status(500).json({message : `Internal server error`})
    }
  }

// POST /users
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const { rows } = await pool.query(
            "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
            [name, email]
        );
        res.status(201).json(rows[0]);
    }
    catch(err){
        console.error(`Error creating user ${err}`)
        res.status(500).json({message : `Internal server error`})
    }
};

// PUT /users/:id
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const { rows } = await pool.query(
            "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
            [name, email, id]
        );
        if(rows.length === 0 ){
            res.json(`User not found`)
        } else {
            res.status(200).json(rows[0])
        }
    }
    catch(err){
        console.error(`Error updating the user ${err}`)
        res.status(500).json({message : `Internal server error`})
    }
};

// DELETE /users/:id
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
        if(result.rowCount === 0){
            res.json(`User not found`)
        } else {
            res.status(204).json(`User with id :${id} has been deleted`)
        }
    }
    catch(err){
        console.error(`Error deleting the user ${err}`)
        res.status(500).json({message : `Internal server error`})
    }
};
