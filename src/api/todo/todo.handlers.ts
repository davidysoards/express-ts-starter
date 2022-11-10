import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ParamsWithId } from '../../interfaces';
import { TodoWithId, Todos, Todo } from './todo.models';

export async function findAll(req: Request, res: Response<TodoWithId[]>, next: NextFunction) {
  try {
    const todos = await Todos.find().toArray();
    res.json(todos);
  } catch (err) {
    next(err);
  }
}

export async function findOne(
  req: Request<ParamsWithId, TodoWithId, {}>,
  res: Response<TodoWithId>,
  next: NextFunction,
) {
  try {
    const result = await Todos.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createOne(
  req: Request<{}, TodoWithId, Todo>,
  res: Response<TodoWithId>,
  next: NextFunction,
) {
  try {
    const result = await Todos.insertOne(req.body);
    if (!result.acknowledged) throw new Error('Error inserting todo.');
    res.status(201);
    res.json({ _id: result.insertedId, ...req.body });
  } catch (err) {
    next(err);
  }
}

export async function updateOne(
  req: Request<ParamsWithId, TodoWithId, {}>,
  res: Response<TodoWithId>,
  next: NextFunction,
) {
  try {
    const result = await Todos.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { returnDocument: 'after' },
    );
    if (!result.value) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }
    res.json(result.value);
  } catch (err) {
    next(err);
  }
}

export async function deleteOne(
  req: Request<ParamsWithId, {}, {}>,
  res: Response<{}>,
  next: NextFunction,
) {
  try {
    const result = await Todos.findOneAndDelete({ _id: new ObjectId(req.params.id) });
    if (!result.value) {
      res.status(404);
      throw new Error(`Todo with id "${req.params.id}" not found.`);
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
