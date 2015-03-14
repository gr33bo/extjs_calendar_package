Ext.define('CalendarPackage.view.CalendarMainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.window.MessageBox',
        "CalendarPackage.view.MoreEventsWindow"
    ],

    alias: 'controller.calendarmaincontroller',
    
    onDatePickerSelect: function(picker, date){
      var monthView = this.lookupReference("monthPanel");
      
      monthView.setDate(date);
      this.onMonthPanelResize(monthView);  
    },
    eventsStoreLoaded: function(store, records){
      var monthView = this.lookupReference("monthPanel");
      if(monthView){
        this.onMonthPanelResize(monthView);
      }
    },
        
    onEventCellClick: function(event, htmlTarget){
      var monthView = this.lookupReference("monthPanel"),
          viewModel = this.getViewModel(),
          eventStore = viewModel.getStore("events");
      
      var targetElem = Ext.get(htmlTarget);
      if(!targetElem.hasCls("event-cell")){
        targetElem = targetElem.parent();
      }
      
      var classList = targetElem.dom.classList;
      
      var idClass = classList[0];
      
      var idClassTest = /event-cell-\d*/;
      var moreClassTest = /more-events-cell/;
      
      
      if(idClassTest.test(idClass)){
        var eventId = parseInt(idClass.replace("event-cell-", ""));
        var eventRecord = eventStore.getById(eventId);
        //show event form window
        console.log(eventRecord);
      } else if(moreClassTest.test(idClass)){
        
        var extraEvents = [];
        var extraEventTest = /extra-event-\d+/;
        
        Ext.each(classList, function(myClass){
          if(extraEventTest.test(myClass)){
            var eventId = parseInt(myClass.replace("extra-event-", ""));
            extraEvents.push(eventStore.getById(eventId));
          }
        });
        
        var extraEventsStore = viewModel.getStore("extra_events");
        extraEventsStore.removeAll();
        
        extraEventsStore.add(extraEvents);
        
        var extraEventsWindow = this.lookupReference("extraEventsWindow");
        if(!extraEventsWindow) {
          var calendarContainer = this.lookupReference("calendarContainerPanel");
          extraEventsWindow = Ext.create("CalendarPackage.view.MoreEventsWindow", {
            constrainTo: calendarContainer
          });
          calendarContainer.add(extraEventsWindow);
          
        }
        
        var targetXY = targetElem.getXY();
        targetXY[0] = targetXY[0] - 200;
        targetXY[1] = targetXY[1] - 50;
        
        var tableParent = targetElem.findParentNode('table');
        var dateClass = tableParent.classList[0];
        
        var myDate = new Date();
        myDate.setTime(parseInt(dateClass.replace("week-day-table-", "")));
       
        extraEventsWindow.setTitle(Ext.Date.format(myDate, "M j, Y"));
        
        extraEventsWindow.showAt(targetXY);
        
        
      }
    },
    
    onEventCellOver: function(event, htmlTarget){
      var monthView = this.lookupReference("monthPanel");
      
      var targetElem = Ext.get(htmlTarget);
      if(!targetElem.hasCls("event-cell")){
        targetElem = targetElem.parent();
      }
      var classList = targetElem.dom.classList;
      
      var idClass = classList[0];
      
      var idClassTest = /event-cell-\d*/;
      var moreClassTest = /more-events-cell/;
      
      if(idClassTest.test(idClass)){
        Ext.each(Ext.dom.Query.select("td."+idClass +" div", monthView.el.dom), function(domElem){
          var elem = Ext.get(domElem);
          elem.addCls("highlighted");
        }, this);
      } else if(moreClassTest.test(idClass)){
        targetElem.child('div').addCls("highlighted");
      }
    },
    
    onEventCellOut: function(event, htmlTarget){
      var monthView = this.lookupReference("monthPanel");
      
      var targetElem = Ext.get(htmlTarget);
      if(!targetElem.hasCls("event-cell")){
        targetElem = targetElem.parent();
      }
      var classList = targetElem.dom.classList;
      
      var idClass = classList[0];
      
      var idClassTest = /event-cell-\d*/;
      var moreClassTest = /more-events-cell/;
      
      if(idClassTest.test(idClass)){
        Ext.each(Ext.dom.Query.select("td."+idClass +" div", monthView.el.dom), function(domElem){
          var elem = Ext.get(domElem);
          elem.removeCls("highlighted");
        }, this);
      } else if(moreClassTest.test(idClass)){
        targetElem.child('div').removeCls("highlighted");
      }
    },
    
    onMonthPanelReady: function(monthView){
      var viewModel = this.getViewModel(),
          eventsStore = viewModel.getStore("events");
  
      eventsStore.sort([
          {
              property : 'true_start_date',
              direction: 'ASC'
          },
          {
              property : 'length',
              direction: 'DESC'
          }
      ]);
      
      var viewModelData = viewModel.getData(),
          eventAttributes = {};
      
      eventAttributes["startDateAttribute"] = viewModelData["startDateAttribute"];
      eventAttributes["endDateAttribute"] = viewModelData["endDateAttribute"];
      eventAttributes["titleAttribute"] = viewModelData["titleAttribute"];
      eventAttributes["allDayAttribute"] = viewModelData["allDayAttribute"];
      
      
      monthView.setEvents(eventsStore, eventAttributes); 
      monthView.drawEvents(eventAttributes);
    },
    onMonthPanelResize: function(monthView){
      if(monthView){
        var viewModel = this.getViewModel(),
            eventsStore = viewModel.getStore("events"),
            viewModelData = viewModel.getData(),
            eventAttributes = {};
    
//        eventsStore.sort([
//            {
//                property : 'true_start_date',
//                direction: 'ASC'
//            },
//            {
//                property : 'length',
//                direction: 'DESC'
//            }
//        ]);
    
        eventAttributes["startDateAttribute"] = viewModelData["startDateAttribute"];
        eventAttributes["endDateAttribute"] = viewModelData["endDateAttribute"];
        eventAttributes["titleAttribute"] = viewModelData["titleAttribute"];
        eventAttributes["allDayAttribute"] = viewModelData["allDayAttribute"];
        
        monthView.setEvents(eventsStore, eventAttributes); 
        monthView.drawEvents(eventAttributes);
      }
      
    },
    
    changeView: function(btn){
      var viewId = btn.itemId.replace("Button", "");
      var calendarContainer = this.lookupReference("calendarContainerPanel"),
          buttonBar = calendarContainer.getDockedItems('toolbar[dock="top"]')[0],
          monthView = this.lookupReference("monthPanel");
      
      var currentActiveItem = calendarContainer.getLayout().getActiveItem();
      if(viewId == 'previousView'){
        currentActiveItem.showPrevious();
        this.onMonthPanelResize(monthView);   
      } else if(viewId == 'nextView'){
        currentActiveItem.showNext();
        this.onMonthPanelResize(monthView);   
      } else {
        calendarContainer.setActiveItem(calendarContainer.down("#"+viewId));
      
        //mark the correct button as pressed
        var buttons = buttonBar.getLayout().getLayoutItems();
        Ext.each(buttons, function(item){
          if(item.xtype == 'button'){
            item.setPressed(item.itemId == btn.itemId); 
          }
        })
      }
    }
});