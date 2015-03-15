Ext.define('CalendarPackage.view.MoreEventsWindow', {
    extend: 'Ext.window.Window',
    alias: ['widget.moreeventswindow'],
    
    requires: [
      "Ext.view.View"
    ],
    
    reference: 'extraEventsWindow',
    
    width: 200,
    maxHeight: 400,
    autoScroll: true,
    
    closable: true,
    closeAction: 'hide',
    constrain: true,
    
    draggable: false,
    resizable: false,
    
    cls: 'extra-events-window',
    padding: '5 0 5 0',
    items: [
      {
        xtype: 'dataview',
        reference: 'extraEventsView',
        tpl: new Ext.XTemplate(
            '<tpl for=".">',
               '<div class="more-event {[this.getClasses(values)]}" {[this.getInlineStyle(values)]}>{[this.getTitle(values)]}</div>',
            '</tpl>',
            {
              getInlineStyle: function(values){
                if(values[this.eventAttributes["allDayAttribute"]]){
                  return "style='background: #306da6;'";
                } else if(values.length > 60*60*24*1000) {
                  return "style='background: #86a723;'";
                } else {
                  return '';
                }
              },
              getClasses: function(eventValues){
                var classes = ["event-cell-"+eventValues.id, "event-cell"];

                var eventStartDate = eventValues[this.eventAttributes["startDateAttribute"]];
                var eventEndDate = eventValues[this.eventAttributes["endDateAttribute"]];
                var extraEventsDate = this.extraEventsDate;

                var checkStartEnd = false;
                if(eventValues[this.eventAttributes["allDayAttribute"]]){
                  classes.push("all-day-cell");
                  checkStartEnd = true;
                } else if(Ext.Date.format(eventStartDate, 'Y-m-d') != Ext.Date.format(eventEndDate, 'Y-m-d')) {
                  classes.push("multi-day-cell");
                  checkStartEnd = true;
                }
                
                if(checkStartEnd){
                  if(Ext.Date.format(eventStartDate, 'Y-m-d') == Ext.Date.format(extraEventsDate, 'Y-m-d')){
                    classes.push("event-start-cell");
                  }
                  if(Ext.Date.format(eventEndDate, 'Y-m-d') == Ext.Date.format(extraEventsDate, 'Y-m-d')){
                    classes.push("event-end-cell");
                  }
                }
                

                return classes.join(" ");
              },
              getTitle: function(values){
                var eventStartDate = values[this.eventAttributes["startDateAttribute"]];
                var title = values[this.eventAttributes["titleAttribute"]];
                
                var allDay = values[this.eventAttributes["allDayAttribute"]];
                
                if(!allDay) {
                  var startTime = Ext.Date.format(eventStartDate, 'g:i a');
                  return startTime + " " + title;
                }
                
                return title;
              }
            }            
        ),
        itemSelector: 'div.more-event',
        bind: {
          store: '{extra_events}'
        },
        
        setTplItems: function(){
          var containerWindow = this.up();
          
          this.tpl.extraEventsDate = containerWindow.extraEventsDate;
          this.tpl.eventAttributes = containerWindow.eventAttributes;
        }
      }
    ]
    
});