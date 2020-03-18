const Expense = require('../models/expense.models.js');
const { buildSchema } = require('graphql');
const expressGraphql = require('express-graphql');
const redis = require('promise-redis')();

const schema = buildSchema(`
    type Expense {
        _id: String,
        name: String,
        date: String,
        nominal: Int,
        kategori: String
    }

    type Query {
        expense : [Expense]
        findExpense(id: String!): Expense
        countingMonthly(bulan: String!): Int
    }

    type Mutation {
        createExpense(name:String!, nominal:Int!, kategori:String, date:String): Expense
        updateExpense(id:String!, name:String, nominal:Int, kategori:String, date:String): Expense
        deleteExpense(id:String!): Expense
    }
`);

const root = {
    expense: async () => {
        const client = redis.createClient();
        const data = await client.get('Expense');
        if(data == null){
            const dataJSON = await Expense.find({});
            // client.set('Expense',JSON.stringify(dataJSON));
            client.setex('Expense',60,JSON.stringify(dataJSON));
            return dataJSON;
        }else{
            return JSON.parse(data);
        }
    },

    findExpense: async ({ id }) => {
        // const findexone = await Expense.findById({_id: id});
        // return findexone;
        const client = redis.createClient();
        const data = await client.get(`Expense-${id}`);
        if(data == null){
            const dataJSON = await Expense.findById({_id: id});
            // client.set(`Expense-${id}`,JSON.stringify(dataJSON));
            client.setex(`Expense-${id}`,60,JSON.stringify(dataJSON));
            return dataJSON;
        }else{
            return JSON.parse(data);
        }
    },

    createExpense: async ({name, nominal, kategori, date}) => {
            const newExpense = new Expense({
                name: name,
                nominal: nominal,
                kategori: kategori,
                date: date
            });
            await newExpense.save();
            return newExpense;
    },

    updateExpense: async ({id, name, nominal, kategori, date}) => {
        const dataExpense = Expense.findOne({ _id: id});
        await Expense.findOneAndUpdate({ _id: id }, {
            name: name,
            nominal: nominal,
            kategori: kategori,
            date: date
        });
        return dataExpense;
    },
    
    deleteExpense: async ({ id }) => {
        const dataExpense = await Expense.findOne({_id: id})
        await Expense.deleteOne({ _id: id });
        return dataExpense;
    },

    countingMonthly: async({ bulan }) => {
        const Alldata = await Expense.find({});
        var result = 0;
        for(var i=0; i<Alldata.length ; i++){
            if(Alldata[i].name != null){
                if(Alldata[i].name.toLowerCase().search(bulan.toLowerCase()) >= 0){
                    result += Alldata[i].nominal;
                }
            }
        }
        return result;
    }
}

const graphql = expressGraphql({
    schema: schema,
    rootValue: root,
    graphiql: true
})

const findExpense = async (req, res) => {
    const client = redis.createClient();
        client.get('Expense', async (err, result) => {
            if(err) throw err;
            if(result) {
                const redisExpense = JSON.parse(result);
                res.json(redisExpense);
            }else{
                const data = await Expense.find({});
                const jsonString = JSON.stringify(data);
                client.setex('Expense', 60, jsonString);
                res.json(Expense.find());
            }
        })
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
        const before = await Expense.findOne({ _id: req.params.id });
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