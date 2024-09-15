import { Request, Response } from "express";
import { prisma } from "../../config/data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { CreateTodo, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";

// const todos = [
//     {id:1, text:'Buy milk', completedAt: new Date()},
//     {id:2, text:'Buy potatoes', completedAt: null},

// ];

export class TodoController {

    private handleError = (res: Response, error: unknown) => {
        if(error instanceof CustomError){
            res.status(error.statusCode).json({error: error.message});
            return;
        }else if(error === 'Text property is required'){
            res.status(400).json({error});
            return; 
        }
        res.status(500).json({error: 'Internal server error - checks logs'});

    }

    constructor(
        private readonly todoRepository: TodoRepository
    ){}

    public getTodos = (req:Request, res:Response) => {
        new GetTodos(this.todoRepository)
        .execute()
        .then(todos => res.json(todos))
        .catch(error => this.handleError(res,error))
    }

    public getTodoById = async (req:Request, res:Response) => {
        const id =+ req.params.id;

        new GetTodo(this.todoRepository)
        .execute(id)
        .then(todo => res.json(todo) )
        .catch(error => this.handleError(res,error))
    }

    public createTodo = async (req:Request, res:Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if(error)return this.handleError(res,error);

        new CreateTodo(this.todoRepository)
        .execute(createTodoDto!)
        .then(todo => res.status(201).json(todo) )
        .catch(error => this.handleError(res,error))
    }
    public updateTodo = async  (req:Request, res:Response) => {

        const id =+ req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        if(error) return this.handleError(res,error)

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then(todo => res.json(todo) )
            .catch(error => this.handleError(res,error))

    }

    public deleteTodo = async (req:Request, res:Response) => {
        const id =+ req.params.id;
        new DeleteTodo(this.todoRepository)
        .execute(id)
        .then(todo => res.json(todo) )
        .catch(error => this.handleError(res,error))
    }

}