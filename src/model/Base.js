Ext.define('CalendarPackage.model.Base', {
    extend: 'Ext.data.Model',

    requires: [
      'Ext.data.Model'
    ],
//    fields: [{
//        name: 'id',
//        type: 'int'
//    }],

    schema: {
        namespace: 'CalendarPackage.model'//,
//        proxy: {
//            url: '{prefix}/{entityName:uncapitalize}',
//            pageParam: '',
//            startParam: '',
//            limitParam: ''
//        }
    }
});
