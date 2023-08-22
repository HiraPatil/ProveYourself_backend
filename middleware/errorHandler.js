const {constant} = require('../constant/constant')

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch(statusCode) {
            case constant.VALIDATION_ERROR:
                res.json({
                    title : "validation Error",
                    message : err.message,
                    stackTrace : err.stack
                });
                break;
        
                case constant.NOT_FOUND:
                res.json({
                    title : "NOT Found",
                    message : err.message,
                    stackTrace : err.stack
                });
                break;
        
                case constant.UNATHORIZED:
                    res.json({
                        title : "Unauthorized",
                        message : err.message,
                        stackTrace : err.stack
                    });
                    break;

                case constant.FORBIDDEN:
                        res.json({
                            title : "Forbidden",
                            message : err.message,
                            stackTrace : err.stack
                        });
                        break;

            default: 
            res.json({
                title : "Server Error",
                message : err.message,
                stackTrace : err.stack
            });
            break
    }     
  }
  
  module.exports = {errorHandler};