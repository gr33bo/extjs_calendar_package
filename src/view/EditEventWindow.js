Ext.define('CalendarPackage.view.EditEventWindow', {
    extend: 'Ext.window.Window',
    alias: ['widget.editeventwindow'],
    
    requires: [
      "Ext.form.Panel",
      'Ext.ux.form.DateTimeField'
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
          },
          {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            items: [
              {
                xtype: 'datetimefield',
                fieldLabel: "Start",
                reference: 'startDateField',
                bind: {
                  value: '{theEvent.start_date}'
                }
              },
              {
                xtype: 'datetimefield',
                fieldLabel: "End",
                margin: '0 0 0 20',
                reference: 'endDateField',
                bind: {
                  value: '{theEvent.end_date}'
                }
              }
            ]
          },
          {
            xtype: 'container',
            layout: 'hbox',
            items: [
              {
                xtype: 'checkbox',
                boxLabel: 'All Day Event',
                inputValue: true,
                uncheckedValue: false,
                bind: {
                  value: '{theEvent.is_all_day}'
                },
                listeners: {
                  change: 'onAllDayChange'
                }
              },
              {
                xtype: 'combobox',
                fieldLabel: 'Calendar',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id',
                allowBlank: false,
                cls: 'calendar-selector',
                bind: {
                  store: '{calendars}',
                  value: '{theEvent.calendar_id}'
                },
                tpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                        '<div class="x-boundlist-item"><span class="color-dot" style="background-color:{background_color};"></span> - {name}</div>',
                    '</tpl>'
                ),
                listeners: {
                  boxready: function(combobox){
                    
                     Ext.core.DomHelper.append(combobox.el.down('.x-form-text-wrap'), {
                        tag: 'div', cls: 'calendar-dot'
                    });
                  },
                  change: 'onEventCalendarChange'
                          
                }
              }
            ]
          }
        ]
      }
    ],
    dockedItems: [
      {
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer', 
        items: [
          '->',
          {
            text: 'Save',
            formBind: true,
            listeners: {
              click: 'onEventSave'
            },
            bind: {
//              hidden: '{creatingNewIncident}',
//              disabled: '{!validIncidentForms}'
            }
          },
          '->'
        ]
      }
    ]
    
});