import { env } from "process";
import { ApiResponse } from "../Wrappers/ApiResponse";

export class ApiResponseValidationFilter{
    private readonly _isDevelopment: boolean;
    private readonly _logger: Console;

    constructor(){
        this._isDevelopment = env.NODE_ENV === "development" || env.NODE_ENV === "test";
        this._logger = console;
    }

    public handleResponse<T>(response: any): ApiResponse<T>{
        if(response instanceof ApiResponse){
            return response;
        }
        if('isFailure' in response && response.isFailure){
            return ApiResponse.fail([response.getError()]);
        }

        if(this._isDevelopment){
            throw new Error(
                `O retorno não está no padrão ApiResponse. Tipo retornado:${typeof response}`
            );
        }

        this._logger.warn(
            "Resposta fora do padão ApiResponse. Encapsulando automaticamente."
        );
        
        return ApiResponse.Ok<T>(response.getValue());
    }
}
