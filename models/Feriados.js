const { Schema, model } = require('mongoose');

const FeriadosSchema = Schema({

    feriados_ar: {
        type: Array,
        required: true
    },
    año: {
        type: String,
        required: true
    }

});

// FeriadosSchema.method('toJSON', function() {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });



module.exports = model('Feriados', FeriadosSchema );

