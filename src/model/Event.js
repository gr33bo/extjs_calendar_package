Ext.define('CalendarPackage.model.Event', {
    extend: 'CalendarPackage.model.Base',
    fields: [
        { name: 'title',                    type: 'string'},
        { name: 'start_date',               type: 'date', dateFormat: 'Y-m-d H:i:s' },
        { name: 'true_start_date',          type: 'date', convert: function(v, record){
            var startDate = Ext.clone(record.get("start_date"));
            if(record.get("is_all_day")){
              startDate.setHours(0);
              startDate.setMinutes(0);
              startDate.setSeconds(0);
            }
            
            return startDate;
          }},
        { name: 'end_date',                 type: 'date', dateFormat: 'Y-m-d H:i:s'},
        { name: 'length',   calculate: function(data){
            var startDate = data.start_date;
            var endDate = data.end_date;
            var allDay = data.is_all_day;
            
            var length = 0;
            if(allDay){
              length = (Ext.Date.diff(startDate, endDate, Ext.Date.DAY) + 1) * 60*60*24*1000;
            } else {
              length = endDate - startDate;
            }
            
            return length;
              
          
        }},
        { name: 'calendar_id',              reference:'Calendar'},
        { name: 'background_color',         type: 'string'},
        { name: 'is_all_day',               type: 'boolean'}
    ]
});
