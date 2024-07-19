//handling the api errors

// When you use this in the constructor,
// you're creating and assigning properties directly to the instance of the class.

class ApiErrorHandler extends Error{
    
    constructor(statusCode,message='Something went wrong!',errors=[],stack=""){
        super(message);
        this.statusCode = statusCode;
        this.data =null;
        this.message=message;
        this.success=false;
        this.errors = errors;

    }
}

export {ApiErrorHandler};

