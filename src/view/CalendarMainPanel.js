Ext.define('CalendarPackage.view.CalendarMainPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.calendarmainpanel'],
    requires: [
        'Ext.layout.container.HBox',
        'CalendarPackage.view.DatePickerPanel',
        'CalendarPackage.view.CalendarPanel',
        'CalendarPackage.view.CalendarSelectionPanel'
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
        layout: 'vbox',
        minWidth: 215,
        
        scrollable: 'vertical',
        
        items: [
          {
            xtype:'datepickerpanel'
          },
          {
            xtype: 'calendarselectionpanel',
            hidden: true
          }
          
        ]
      },
      {
        xtype:'calendarpanel',
        flex: 1
      }
    ],
    listeners: {
      render: 'onMainCalendarPanelReady'
    }

});
