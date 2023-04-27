import { Usuario } from "../models/usuario.model";

export interface CargarUsuario {
    ok:boolean,
    total:number;
    usuarios: Usuario[]
}