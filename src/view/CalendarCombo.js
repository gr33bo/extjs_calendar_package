Ext.define('CalendarPackage.view.CalendarCombo', {
    extend : 'Ext.form.field.ComboBox',
    alias: ['widget.calendarcombo'],
    
    setCalendarAttributes: function(calendarAttributes){
      this.displayField = calendarAttributes["name"];
      this.tpl = Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '<div class="x-boundlist-item"><span class="color-dot" style="background-color:{'+calendarAttributes["backgroundColor"]+'};"></span> - {'+calendarAttributes["name"]+'}</div>',
        '</tpl>'
      );

      this.displayTpl = Ext.create('Ext.XTemplate','<tpl for=".">' +
          '{[typeof values === "string" ? values : values["' + calendarAttributes["name"] + '"]]}' +
          '<tpl if="xindex < xcount">' + this.delimiter + '</tpl>' +
      '</tpl>');
      
      this.createPicker();
    },
    listeners: {
//      boxready: function(combobox){
//         Ext.core.DomHelper.append(combobox.el.down('.x-form-text-wrap'), {
//            tag: 'div', cls: 'calendar-dot'
//        });
//      }
    }
    
});