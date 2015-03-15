Ext.define('CalendarPackage.view.EditEventWindow', {
    extend: 'Ext.window.Window',
    alias: ['widget.editeventwindow'],
    
    requires: [
      "Ext.form.Panel"
    ],
    
    reference: 'editEventWindow',
    
    maxHeight: 400,
    scrollable: "vertical",
    
    closable: true,
    closeAction: 'hide',
    constrain: true,
    
    draggable: false,
    resizable: false,
    width: 500,
    
    padding: '10',
    items: [
      {
        xtype: 'form',
         
        fieldDefaults: {
          labelAlign: 'top',
          labelWidth: 200,
          anchor: '100%',
          margin: '0 0 10px 0',
          labelSeparator: ''
        },
        items: [
          {
            xtype: 'textfield',
            fieldLabel: 'Title',
            bind: {
              value: '{theEvent.title}'
            }
          }
        ]
      }
    ]
    
});