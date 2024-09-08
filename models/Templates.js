const { Schema, model } = require('mongoose');

const TemplateSchema = Schema({

    template_week: {
        type: Object,
        // required: true
    },
    template_bss_week: {
        type: Object,        
    },
    template_calendarbp: {
        type: Object,
        // required: true
    },
    // end: {
    //     type: Date,
    //     required: true
    // },
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Usuario',
    //     required: true
    // }

});

TemplateSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});



module.exports = model('Template', TemplateSchema );

