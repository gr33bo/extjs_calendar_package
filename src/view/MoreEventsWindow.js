Ext.define('CalendarPackage.view.MoreEventsWindow', {
    extend: 'Ext.window.Window',
    alias: ['widget.moreeventswindow'],
    
    requires: [
      "Ext.view.View"
    ],
    
    reference: 'extraEventsWindow',
    
    width: 200,
    maxHeight: 400,
    autoScroll: true,
    
    closable: true,
    closeAction: 'hide',
    constrain: true,
    
    draggable: false,
    resizable: false,
    
    items: [
      {
        xtype: 'dataview',
        tpl: new Ext.XTemplate(
            '<tpl for=".">',
               '<div class="more-event">{id}</div>',
            '</tpl>'
        ),
        itemSelector: 'div.more-event',
        bind: {
          store: '{extra_events}'
        }
      }
    ]
    
});