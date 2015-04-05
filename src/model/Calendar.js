Ext.define('CalendarPackage.model.Calendar', {
    extend: 'Ext.data.Model',

    requires: [
      'Ext.data.Model'
    ],
    fields: [
//        { name: 'id',                       type: 'integer', useNull: true},
        { name: 'name',                    type: 'string'},
        { name: 'background_color',        type: 'string'}
    ]
});
