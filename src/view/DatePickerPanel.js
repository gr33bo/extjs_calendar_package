Ext.define('CalendarPackage.view.DatePickerPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.datepickerpanel'],
    requires: [
        'Ext.layout.container.VBox',
        'Ext.picker.Date'
    ],
    
    minWidth: 215,
    
    layout: {
      type: 'vbox'
    },
    
    items: [ 
      //TODO: Can we highlight dates with events?
      {
        xtype: 'datepicker',
        reference: 'calendarPackageDatePicker',
        listeners: {
          select: 'onDatePickerSelect',
          render: function(){
          //  console.log(this.eventEl)
          }
        }
      }
    ]

});
