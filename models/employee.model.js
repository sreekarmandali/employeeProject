const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Employee = new Schema({
    name: {
        type: String,
        unique: true,
        min: 6,
        max: 15
    },
    department: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    salary: {
        type: Number,
        min: 30000,
        max: 1200000
    },
    date: {
        type: Date,
        default: Date.now()
    }
   
})

module.exports = mongoose.model('Employee', Employee);

