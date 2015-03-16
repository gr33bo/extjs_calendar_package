Ext.define('Ext.ux.form.DateTimeField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.datetimefield',
    
    requires: [
        'Ext.form.field.Date',
        'Ext.form.field.Time',
        'Ext.form.Label'
    ],
    mixins: {
        field: 'Ext.form.field.Field'
    },
    
    dateFormat: 'n/j/Y',    
    
    timeFormat: Ext.Date.use24HourTime ? 'G:i' : 'g:i A',
    
    timeIncrement: 30,
    
    allowBlank: true,
    
    minDate: null,
    
    maxDate: null,
    
    minTime: null,
    
    maxTime: null,
    
    dateFieldWidth: 100,
    
    timeFieldWidth: 100,
    
    visibleTimeField: true,
    
    layout: {
      type: 'hbox'
    },
    
    items: [
      
    ],
    
    initComponent: function() {
        var me = this;

        var dateField = this.getDateFieldConfig();
        var timeField = this.getTimeFieldConfig();


        me.callParent(arguments);
        this.add(dateField);
        this.add(timeField);
        me.initRefs();
    },
    
    initRefs: function() {
        var me = this;
        me.dateField = me.down('datefield');
        me.timeField = me.down('timefield');
//        me.toLabel = me.down('#' + me.id + '-to-label');

//        me.startDate.validateOnChange = false;
    },
    
    getDateFieldConfig: function(){
      var cfg = {
            xtype: 'datefield',
            format: this.dateFormat,
            maxValue: this.maxDate,
            minValue: this.minDate,
            allowBlank: this.allowBlank,
            hideLabel: true,
            width: this.dateFieldWidth,
            listeners: {
                'blur': {
                    fn: function(){
//                        this.onFieldChange('date', 'start');
                    },
                    scope: this
                }
            }
        };
        
        return cfg;
        
      
    },
    
    getTimeFieldConfig: function(){
      var cfg = {
            xtype: 'timefield',
            hidden: this.visibleTimeField === false,
            labelWidth: 0,
            hideLabel: true,
            width: this.timeFieldWidth,
            format: this.timeFormat,
            allowBlank: this.allowBlank,
            increment: this.timeIncrement,
            maxValue: this.maxTime,
            minValue: this.minTime,
            listeners: {
                'select': {
                    fn: function(){
//                        this.onFieldChange('time', 'start');
                    },
                    scope: this
                }, 
                
                'blur': {
                    fn: function(){
//                        this.onFieldChange('time', 'start');
                    },
                    scope: this
                }
            }
        };
        
        return cfg;
      
    },
    setValue: function(v){
        if(!v) {
            this.dateField.setValue(null);
            this.timeField.setValue(null);
            return;
        } else if(Ext.isDate(v)){
            this.setDT(v);
        } else {
            this.dateField.setValue(null);
            this.timeField.setValue(null);
            return;          
        }
    },
    setDT: function(dt){
        if(dt && Ext.isDate(dt)){
            this.dateField.setValue(dt);
            this.timeField.setValue(Ext.Date.format(dt, this.timeFormat));
            return true;
        }
    },
    
    hideTimeField: function(){
      this.timeField.hide();
      this.timeField.disable();
    },
    
    showTimeField: function(){
      this.timeField.enable();
      this.timeField.show();
    }
});