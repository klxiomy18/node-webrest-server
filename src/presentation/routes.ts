import { Router } from "express";
import { TodoRoutes } from "./todos/routes";


export class AppRoutes {

    static get routes():Router{

        const router = Router();

        router.use('/api/todos', TodoRoutes.routes);
        // router.use('/api/auth', TodoRoutes.routes);
        // router.use('/api/products', TodoRoutes.routes);
        // router.use('/api/clients', TodoRoutes.routes);


   
    return router;

    }
    
}