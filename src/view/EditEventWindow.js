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
            xtype: 'container',
            padding: 10,
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
                margin: '0 0 0 0',
                items: [
                  {
                    xtype: 'datetimefield',
                    fieldLabel: "Start",
                    reference: 'startDateField',
                    itemId: "a",
                    bind: {
                      value: '{theEvent.start_date}'
                    },
                    listeners: {
                      change: 'onStartDateChange'
                    }
                  },
                  {
                    xtype: 'datetimefield',
                    fieldLabel: "End",
                    margin: '0 0 0 20',
                    reference: 'endDateField',
                    bind: {
                      value: '{theEvent.end_date}'
                    },
                    listeners: {
                      change: 'onEndDateChange'
                    }
                  }
                ]
              },
              {
                xtype: 'container',
                layout: 'hbox',
                items: [
                  {
                    xtype: 'combobox',
                    fieldLabel: 'Calendar',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    allowBlank: false,
                    cls: 'calendar-selector',
                    width: '45%',
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
                  },

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
                    },
                    margin: '25 0 0 20'
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
                  hidden: '{createMode}'//,
    //              disabled: '{!validIncidentForms}'
                }
              },
              {
                text: 'Create',
                formBind: true,
                listeners: {
                  click: 'onEventCreate'
                },
                bind: {
                  hidden: '{!createMode}'
                }
              },
              {
                text: 'Cancel',
                listeners: {
                  click: 'onEventCancel'
                }
              },
              {
                text: 'Delete Event',
                listeners: {
                  click: 'onEventDelete'
                },
                bind: {
                  hidden: '{createMode}'
                }
              },
              '->'
            ]
          }
        ]
      }
    ]
    
});