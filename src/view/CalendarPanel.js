Ext.define('CalendarPackage.view.CalendarPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.calendarpanel'],
    
    reference: 'calendarContainerPanel',
    
    requires: [
      'CalendarPackage.view.CalendarMainController',
      'CalendarPackage.view.CalendarMainModel',
      'CalendarPackage.view.MonthPanel'
    ],
    
    layout: {
      type: 'card'
    },
    
    tbar: [
      '->',
      {
        text: "<",
        itemId: "previousViewButton",
        listeners: { 
          click: 'changeView'
        }
      },
//      {
//        text: "Day",
//        itemId: "dayViewButton",
//        listeners: { 
//          click: 'changeView'
//        }
//      },
//      {
//        text: "Week",
//        itemId: "weekViewButton",
//        listeners: { 
//          click: 'changeView'
//        }
//      },
      {
        text: "Month",
        itemId: "monthViewButton",
        pressed: true,
        listeners: { 
          click: 'changeView'
        }
      },
      {
        text: ">",
        itemId: "nextViewButton",
        listeners: { 
          click: 'changeView'
        }
      },
      '->'
    ],
    
    items: [
      {
        itemId: "monthView",
        xtype: 'monthpanel',
        width: '100%',
        height: '100%'
      },
      {
        itemId: "weekView",
        xtype: 'panel',
        html: 'Week'
      },
      {
        itemId: "dayView",
        xtype: 'panel',
        html: 'Day'
      }
    ],
}); 