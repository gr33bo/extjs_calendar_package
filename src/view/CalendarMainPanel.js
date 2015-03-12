Ext.define('CalendarPackage.view.CalendarMainPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.calendarmainpanel'],
    requires: [
        'Ext.layout.container.HBox',
        'CalendarPackage.view.DatePickerPanel',
        'CalendarPackage.view.CalendarPanel'
    ],
    
    controller: 'calendarmaincontroller',
    viewModel: {
        type: 'calendarmainmodel'
    }, 
    
    layout: {
      type: 'hbox',      
      align: 'stretch'
    },
        
    defaults: {
        frame: true
    },
    
    items: [
      {
        xtype:'datepickerpanel',
        width: 215
      },
      {
        xtype:'calendarpanel',
        flex: 1
      }
    ]

});
