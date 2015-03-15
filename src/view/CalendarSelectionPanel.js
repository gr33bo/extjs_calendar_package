Ext.define('CalendarPackage.view.CalendarSelectionPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.calendarselectionpanel'],
    
    reference: 'calendarSelectionPanel',
    
    requires: [
      
    ],
    
//    layout: {
//      type: 'vbox'
//    },
    
    title: 'Available Calendars',
    minHeight: 100,
    maxHeight: 300,
    minWidth: 215,
    margin: '10 0 0 0',
    
    
    items: [
      {
        xtype: 'checkboxgroup',
        reference: 'calendarSelectionCheckboxes',
        width: 215,
        layout: 'auto',
        
        defaults: {
          width: '100%',
          name: 'calendar_ids[]',
          margin: '0'
        },
        items: [
        ],
        vertical: true,
        columns: 1,
        
        listeners: {
          change: 'onCalendarSelectionChange'
        }
      }
    ]
}); 