const Expense = require('../models/expense.models.js');
const { buildSchema } = require('graphql');
const expressGraphql = require('express-graphql');
const redis = require('redis');

const schema = buildSchema(`
    type Expense {
        _id: String,
        name: String,
        nominal: Int,
        kategori: String
    }
    type Query {
        expense : [Expense]
        findExpense(id: String!): Expense 
    }
`);

const root = {
    expense: async () => {
        // const client = redis.createClient();
        // var realResult
        // client.get('Expense', async (err, result) => {
        //     if(err) throw err;
        //     if(result) {
        //         const redisExpense = JSON.parse(result);
        //         realResult = result;
        //     }else{
        //         const allExpense = await Expense.find();
        //         const jsonExpense = JSON.stringify(allExpense);
        //         client.set('Expense', jsonExpense);
        //         realResult = allExpense;
        //     }
        // })
        // console.log(realResult);
        // return realResult;
        return await Expense.find({});
    },
    findExpense: async ({ id }) => {
        console.log(await Expense.findById({_id: id}));
        return await Expense.findById({_id: id});
    }
}

const graphql = expressGraphql({
    schema: schema,
    rootValue: root,
    graphiql: true
})

const findExpense = async (req, res) => {
    // const allExpense = await Expense.find({});

    const client = redis.createClient();
        client.get('Expense', async (err, result) => {
            if(err) throw err;
            if(result) {
                const redisExpense = JSON.parse(result);
                res.json(redisExpense);
            }else{
                res.json(Expense.find());
            }
        })
    // res.json(allExpense);
}

const createExpense = async (req, res) => {
    try{
        const newExpense = Expense(req.body);
        const result = await newExpense.save();
        res.json(result);
    }catch(err) {
        res.status(500).json({
            error: err
        });
    }
}

const updateExpense = async (req, res) => {
    try{
        console.log(req.params.id);
        const before = await Expense.findOne({ _id: req.params.id });
        console.log(before);
        await Expense.findByIdAndUpdate({ _id: req.params.id }, req.body);
        const after = await Expense.findById({ _id: req.params.id });
        res.json({ Before: before, After: after });
    }catch(err){
        res.status(500).json({
            error: err
        });
    }
}

const deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete({ _id: req.params.id });
        res.json({ Message: "Done Delete " + req.params.id });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

module.exports = {
    findExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    graphql
}