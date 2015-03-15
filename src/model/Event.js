Ext.define('CalendarPackage.model.Event', {
    extend: 'CalendarPackage.model.Base',
    fields: [
//        { name: 'id',                       type: 'integer', useNull: true},
        //{ name: 'calendar_id',              type: 'integer', useNull: true},
        { name: 'title',                    type: 'string'},
//        { name: 'start_date',               type: 'date', dateFormat: 'Y-m-d H:i:s O'},
//        { name: 'end_date',                 type: 'date', dateFormat: 'Y-m-d H:i:s O'},
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
        { name: 'length',   convert: function(v, record){
            var startDate = Ext.clone(record.get("start_date"));
            var endDate = Ext.clone(record.get("end_date"));
            var length = 0;
            if(record.get("is_all_day")){
              length = (Ext.Date.diff(startDate, endDate, Ext.Date.DAY) + 1) * 60*60*24*1000;
            } else {
              length = record.get("end_date") - record.get("start_date");
            }
            
            return length;
              
          
        }},
        { name: 'calendar_id',              reference:'Calendar'},
        { name: 'background_color',         type: 'string'},
//        { name: 'location',                 type: 'string'},
//        { name: 'notes',                    type: 'string'},
//        { name: 'reminder',                 type: 'string'}, //reminder
//        { name: 'url',                      type: 'integer'},
        { name: 'is_all_day',               type: 'boolean'}//, //is all day
//        { name: 'n',                        type: 'boolean'} //is new
    ]
});
