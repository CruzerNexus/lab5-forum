const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const boardSchema = mongoose.Schema({
    name: String,
    user: {
        type: ObjectId,
        ref: 'User',
      },
},{
    timestamps: true,
    toJSON: {
      virtuals: true,
    }
});

boardSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'board',
    justOne: false,
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;