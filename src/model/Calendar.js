Ext.define('CalendarPackage.model.Calendar', {
    extend: 'CalendarPackage.model.Base',
    fields: [
//        { name: 'id',                       type: 'integer', useNull: true},
        { name: 'name',                    type: 'string'},
        { name: 'background_color',        type: 'string'}
    ]
});
