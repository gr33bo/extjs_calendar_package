Ext.define('Ext.ux.form.CalendarDateTimeField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.calendardatetimefield',
    
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
    
    //min and max values are used for the combined fields
    minValue: null,
    
    maxValue: null,
    
    //Range values are used to set max a min ranges for the individual fields
    minDateRange: null,
    
    maxDateRange: null,
    
    minTimeRange: null,
    
    maxTimeRange: null,
    
    dateFieldWidth: 100,
    
    timeFieldWidth: 100,
    
    visibleTimeField: true,
    
    timeOut: null,
    
    validateDateOnly: false,
    
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
            maxValue: this.maxDateRange,
            minValue: this.minDateRange,
            allowBlank: this.allowBlank,
            hideLabel: true,
            width: this.dateFieldWidth,
            listeners: {
                'change': {
                    fn: function(){
                        this.onFieldChange();
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
            maxValue: this.maxTimeRange,
            minValue: this.minTimeRange,
            listeners: {
                'change': {
                    fn: function(){
                        this.onFieldChange();
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
      this.validateDateOnly = true;
    },
    
    showTimeField: function(){
      this.timeField.enable();
      this.timeField.show();
      this.validateDateOnly = false;
    },
    
    getValue: function(){
        var val = this.getDT('start');
        
        return val;
    },

    // private getValue helper
    getDT: function(startend){
        //TODO console log how this function will break
        var time = this.timeField.getValue(),
            dt = this.dateField.getValue();

        // console.log(dt);
        // console.log(time);

        if(Ext.isDate(dt)){
            // console.log('dt');
            dt = Ext.Date.format(dt, this.dateField.format);
        } else {
            // console.log('got null');
            return null;
        }
        if(time && time !== ''){
            // console.log('time');
            time = Ext.Date.format(time, this.timeField.format);
            var val = Ext.Date.parseDate(dt + ' ' + time, this.dateField.format + ' ' + this.timeField.format);
            // console.log(val);
            return val;
        }
        return Ext.Date.parseDate(dt, this.dateField.format);
    },
    
    onFieldChange: function(){
      
      //100ms delay mostly accounts for the initial settings of date and time,
      //as both fields fire change events
      if(this.timeOut){
        clearTimeout(this.timeOut);
      }
      
      this.timeOut = Ext.defer(function(field){
        this.fireEvent('change', this, this.getValue());

        this.publishState('value', this.getValue());
        
        this.validate();
      }, 100, this);
    },
    
    setMinValue: function(val){
      this.minValue = Ext.clone(val);
      this.validate();
    },
    
    setMaxValue: function(val){
      this.maxValue = Ext.clone(val);
      this.validate();
    },
    
    getErrors: function(){
      var errors = [];
      
      if(this.minValue && this.getValue()){     
        if(this.getValue() < this.minValue){
          if(this.validateDateOnly){
              errors.push("Must be greater than "+Ext.Date.format(this.minValue, this.dateFormat));
          } else {      
            errors.push("Must be greater than "+Ext.Date.format(this.minValue, this.dateFormat + " " + this.timeFormat));
          }
        }
      }
      
      if(this.maxValue && this.getValue()){        
        if(this.getValue() > this.maxValue){
          if(this.validateDateOnly){
              errors.push("Must be less than "+Ext.Date.format(this.maxValue, this.dateFormat));
          } else {      
            errors.push("Must be less than "+Ext.Date.format(this.maxValue, this.dateFormat + " " + this.timeFormat));
          }
        }
      }
      
      
      return errors;
    },
    isValid: function() {
      var me = this,
          disabled = me.disabled,
          validate = me.forceValidation || !disabled;
            
        return validate ? me.validateValue(me.getValue()) : disabled;
    },
    validate : function() {
        var me = this,
            isValid = me.isValid();
        if (isValid !== me.wasValid) {
            me.wasValid = isValid;
            me.fireEvent('validitychange', me, isValid);
        }
        return isValid;
    },
    validateValue: function(value) {
      var me = this,
          errors = me.getErrors(value),
          isValid = Ext.isEmpty(errors);
  
      if (isValid) {
        me.clearInvalid();
      } else {
        me.markInvalid(errors);
      }
      return isValid;
    },
//
    markInvalid: function(errors){ 
        // Save the message and fire the 'invalid' event
        var me = this,
            oldMsg = me.getActiveError(),
            active;
            
        me.setActiveErrors(Ext.Array.from(errors));
        active = me.getActiveError();
        if (oldMsg !== active) {
            me.setError(active);
        }
    },
    clearInvalid: function(){ 
      var me = this,
            hadError = me.hasActiveError();
            
        delete me.needsValidateOnEnable;
        me.unsetActiveError();
        if (hadError) {
            me.setError('');
        }
    },
    setError: function(error){
      var me = this,
          msgTarget = me.msgTarget,
          prop;

      if (me.rendered) {
          if (msgTarget == 'title' || msgTarget == 'qtip') {
              prop = msgTarget == 'qtip' ? 'data-errorqtip' : 'title';
              me.getActionEl().dom.setAttribute(prop, error || '');
          } else {
              me.updateLayout();
          }
      }
    },
    
    toggleInvalidCls: function(hasError) {        
        this.timeField.toggleInvalidCls(hasError);
        this.dateField.toggleInvalidCls(hasError);
    },
    
    setValidateDateOnly: function(validateDateOnly){
      this.validateDateOnly = validateDateOnly;
    }
});