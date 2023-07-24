const mongoose = require('mongoose');
const { Schema } = mongoose;


const TasksSchema = new Schema({
    user : {
         type : mongoose.Schema.Types.ObjectId,
          ref: 'user'
    },
    title :  {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true,

    },
    tag : {
        type: String,
        default: "General"
    },
    duedate : {
        type: Date, 
        required : true
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started',
      },
    assignedMembers: [
        {
          type: Schema.Types.ObjectId,
          ref: 'user',
        },
      ],
})


module.exports = mongoose.model('tasks', TasksSchema);
