export class ReqResponse {
    success: boolean
    statusCode: number
    error: object;
    constructor(success, statusCode, error = null) {
        this.success = success;
        this.statusCode = statusCode;
        if(error){
            this.error = error.toString();
        }
    }
}

export class HealthCheckResponse extends ReqResponse{
    constructor() {
        super(true, 200);
    }
}

export class ErrorCatchedResponse extends ReqResponse{
    constructor(error) {
        super(false, 500,error);
    }
}

export class SuccessJsonResponse extends ReqResponse{
    data: object;

    constructor(json) {
        super(true, 200);
        this.data = json;
    }
}

