Ext.define('CalendarPackage.view.templates.WeekRow', {
    extend: 'Ext.view.View',
    
    alias: ['widget.weekrow'],
    
//    style: "margin-top: 20px",
    cls: "week-events-container",
    tpl: new Ext.XTemplate(
      '{[this.resetTitleIds()]}',
      '<table class="week-day-container">',
        '<tpl for=".">',
          '<tr>',
            '<tpl for="days">',
              '<td>',
                '<table class="week-day-table-{[this.getDate(values)]} week-day" cellpadding="0" cellspacing="0">',
                  '<tr><td></td></tr>',
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
        getDate: function(values){
          
          return values.dayStart.getTime();
        },
        resetEventsCount: function(){
          this.eventsCount = 0;
        },
        resetTitleIds: function() {
          this.titleIds = [];
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
                     "<div>+"+totalExtraEvents+" items</div>"+
                   "</td>";
          }
          
          return '<td></td>';
        },
        getInlineStyle: function(values, dayValues){

          if(values[this.eventAttributes["allDay"]]){          
            if(values.background_color){
              return "style='background: "+values[this.eventAttributes["backgroundColor"]]+";'";
            } else {
              return "style='background: #306da6;'";
            }
          } else if(values.length > 60*60*24*1000) {      
            if(values.background_color){
              return "style='background: "+values[this.eventAttributes["backgroundColor"]]+";'";
            } else {
              return "style='background: #86a723;'";
            }
          } else {
            if(values.background_color){
              return "style='color: "+values[this.eventAttributes["backgroundColor"]]+";'";
            } else {
              return '';
            }
          }
        },
        getDayArray: function(){
          return new Array(this.totalEventRowsPerWeek);
        },
        getTitle: function(values, dayValues){
          if(this.titleIds.indexOf(values.id) != -1){
            return "";
          }
          
          var eventStartDate = values[this.eventAttributes["startDate"]];
          var dayStart = dayValues["dayStart"];
          
          if(values[this.eventAttributes["allDay"]]) {
            this.titleIds.push(values.id);
            return values[this.eventAttributes["title"]];
          } else {
            this.titleIds.push(values.id);
            var startDate = values[this.eventAttributes["startDate"]];
            
            var startTime = Ext.Date.format(startDate, 'g:i a');

            return startTime + ' ' + values[this.eventAttributes["title"]];
          }
          
        },
        getStart: function(eventValues){
           var eventStartDate = eventValues[this.eventAttributes["startDate"]];
           
           return Ext.Date.format(eventStartDate, 'Y-m-d');
        },
        getClasses: function(eventValues, dayValues){
          var classes = ["event-cell-"+eventValues.id, "event-cell"];
          
          var eventStartDate = eventValues[this.eventAttributes["startDate"]];
          var eventEndDate = eventValues[this.eventAttributes["endDate"]];
          var dayStart = dayValues["dayStart"];
          var dayEnd = Ext.clone(dayValues["dayEnd"]);
          
          if(eventValues[this.eventAttributes["allDay"]]){
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