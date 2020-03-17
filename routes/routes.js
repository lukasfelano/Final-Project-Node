const expense = require('../controller/expense.controller.js')

const routes = (app) => {
    app.get('/test', expense.findExpense);
    app.post('/create', expense.createExpense);
    app.post('/update/:id', expense.updateExpense);
    app.post('/delete/:id', expense.deleteExpense);

    app.use('/graphql', expense.graphql);
}

module.exports = routes;