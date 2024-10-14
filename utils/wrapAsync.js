    module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

/**
 * Its primary purpose is to simplify error handling in asynchronous code, especially when using async/await.
 * 
 * `fn`: This is the asynchronous function you want to wrap. It's usually a route handler in an Express.js application.
 * `req`, `res`, `next`: These are the usual parameters passed to Express middleware functions.
 * `.catch(next)`: If the asynchronous function (fn) throws an error, it's caught and passed to `next()`, which is typically the error-handling middleware in Express.
 * 
 * What wrapAsync Does:
 * When you write asynchronous code using async/await, you often need to handle errors using try/catch blocks. 
 * This can become repetitive and make the code less readable. The wrapAsync function helps by automatically catching errors 
 * and passing them to the next middleware or error handler in an Express.js application
 * 
 * This approach helps reduce boilerplate code and ensures that any errors in your asynchronous functions are properly handled 
 * without needing to manually wrap each function in a try/catch block.
 */