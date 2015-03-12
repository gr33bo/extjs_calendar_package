Ext.define('CalendarPackage.view.templates.WeekRow', {
    extend: 'Ext.view.View',
    
//    style: "margin-top: 20px",
    cls: "week-events-container",
    tpl: new Ext.XTemplate(
      '<table class="week-day-container">',
        '<tpl for=".">',
          '<tr>',
            '<tpl for="days">',
              '<td>',
                '<table class="week-day" cellpadding="0" cellspacing="0">',
                  '{[this.resetEventsCount()]}',
                  '<tpl for="eventItems">',
                    '<tpl if=".">',
                      
                      '{[this.incrementEventsCount()]}',
                      '<tpl if="this.checkEventCount()">',
                        '<tr>',
                          '<td class="{[this.getClasses(values, parent)]}">',
                            '<div {[this.getInlineStyle(values, parent)]}>',
                              '{[this.getTitle(values, parent)]}',
                            '</div>',
                          '</td>',
                        '</tr>',
                      '<tpl elseif="this.isAtEventRowMax()">',
                        '<tr>',
                          '{[this.getRemainingEvents(parent)]}',
                        '</tr>',
                      '</tpl>',
                    '<tpl else>',
                      '<tr>',
                        '<td>&nbsp;</td>',
                      '</tr>',
                    '</tpl>',
                  '</tpl>',
                '</table>',
              '</td>',
            '</tpl>',
          '</tr>',
        '</tpl>',
      '</table>',
      {
        resetEventsCount: function(){
          this.eventsCount = 0;
        },
        incrementEventsCount: function(){
          this.eventsCount += 1;
        },
        checkEventCount: function(){
          return this.eventsCount < this.totalEventRowsPerWeek;
        },
        isAtEventRowMax: function(){
          return this.eventsCount == this.totalEventRowsPerWeek;
        },
        getRemainingEvents: function(dayValues){
          if(dayValues["eventItems"].length == this.totalEventRowsPerWeek){
            var values = dayValues["eventItems"][this.totalEventRowsPerWeek-1];
            
            
            if(values.length > 60*60*24*1000){
              return "<td class='more-events-cell event-cell extra-event-"+values.id+"'>" +
                       "<div>+1 item</div>"+
                     "</td>";
            } else {
              return '<td class="'+this.getClasses(values, dayValues)+'">'+
                       '<div '+ this.getInlineStyle(values, dayValues)+'>'+
                         this.getTitle(values, dayValues) +
                       '</div>'+
                     '</td>';
            }
            
          } else {
            var totalExtraEvents = dayValues["eventItems"].length-this.totalEventRowsPerWeek+1;
            var extraClasses = [];
            
            Ext.each(dayValues["eventItems"].slice(dayValues["eventItems"].length - totalExtraEvents), function(eventItem){
              extraClasses.push("extra-event-"+eventItem.id);
            });
            
            return "<td class='more-events-cell event-cell "+extraClasses.join(" ")+"'>" +
                     "<div>+"+(dayValues["eventItems"].length-this.totalEventRowsPerWeek+1)+" items</div>"+
                   "</td>";
          }
          
          return '<td></td>';
        },
        getInlineStyle: function(values, dayValues){
          if(values[this.eventAttributes["allDayAttribute"]]){
            return "style='background: #306da6;'";
          } else if(values.length > 60*60*24*1000) {
            return "style='background: #86a723;'";
          } else {
            return '';
          }
        },
        getDayArray: function(){
          return new Array(this.totalEventRowsPerWeek);
        },
        getTitle: function(values, dayValues){
          
          var eventStartDate = values[this.eventAttributes["startDateAttribute"]];
          var dayStart = dayValues["dayStart"];
          if(dayValues['weekStart'] || Ext.Date.format(eventStartDate, 'Y-m-d') == Ext.Date.format(dayStart, 'Y-m-d')){
            if(values[this.eventAttributes["allDayAttribute"]]) {
              return values[this.eventAttributes["titleAttribute"]];
            } else {
              var startDate = values[this.eventAttributes["startDateAttribute"]];

              var startTime = Ext.Date.format(startDate, 'g:i a');

              return startTime + ' ' + values[this.eventAttributes["titleAttribute"]];
            }
          } else {
            return '';
          }
        },
        getStart: function(eventValues){
           var eventStartDate = eventValues[this.eventAttributes["startDateAttribute"]];
           
           return Ext.Date.format(eventStartDate, 'Y-m-d');
        },
        getClasses: function(eventValues, dayValues){
          var classes = ["event-cell-"+eventValues.id, "event-cell"];
          
          var eventStartDate = eventValues[this.eventAttributes["startDateAttribute"]];
          var eventEndDate = eventValues[this.eventAttributes["endDateAttribute"]];
          var dayStart = dayValues["dayStart"];
          var dayEnd = Ext.clone(dayValues["dayEnd"]);
          
          if(eventValues[this.eventAttributes["allDayAttribute"]]){
            classes.push("all-day-cell");
          } else if(Ext.Date.format(eventStartDate, 'Y-m-d') != Ext.Date.format(eventEndDate, 'Y-m-d')) {
            classes.push("multi-day-cell");
          }
          
          if(Ext.Date.format(eventStartDate, 'Y-m-d') == Ext.Date.format(dayStart, 'Y-m-d')){
            classes.push("event-start-cell");
          }
          
          dayEnd.setSeconds(dayEnd.getSeconds() - 1);
          
          if(Ext.Date.format(eventEndDate, 'Y-m-d') == Ext.Date.format(dayEnd, 'Y-m-d')){
            classes.push("event-end-cell");
          }
          
          return classes.join(" ");
        }
      }
    ),
    
    itemSelector: 'td.event-cell',
    emptyText: 'No events available',
    
    listeners: {
      beforerender: function(view){
        view.tpl.totalEventRowsPerWeek = view.totalEventRowsPerWeek;
        view.tpl.eventAttributes = view.eventAttributes;
      }
    }
});