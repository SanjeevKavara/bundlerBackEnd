class ErrorHandler extends Error{ //creating a class that extends the Error class from nodejs 

    constructor(message,statusCode){
        super(message); //calling the parent constructor with the message parameter 
        this.statusCode = statusCode; //setting the statusCode property of the class to the statusCode parameter
    }
}

export default ErrorHandler;