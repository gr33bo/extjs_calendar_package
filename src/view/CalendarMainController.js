Ext.define('CalendarPackage.view.CalendarMainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.window.MessageBox',
        'CalendarPackage.model.Event',
        "CalendarPackage.view.MoreEventsWindow",
        "CalendarPackage.view.EditEventWindow"
    ],

    alias: 'controller.calendarmaincontroller',
    
    onDayCellClick: function(event, htmlTarget){
      var htmlElem = Ext.get(htmlTarget);
      if(!htmlElem.hasCls("week-day")){
        htmlElem = htmlElem.parent();
      }
      var htmlId = htmlElem.id;
      
      var myDate = new Date();
      myDate.setTime(parseInt(htmlId.replace("date-cell-", "")));
      
      this.newEvent(myDate);
    },
    
    onEmptyCellClick: function(event, htmlTarget){
      var parentTable = Ext.get(htmlTarget).findParent("table.week-day");
      var classList = parentTable.classList;
      var dateClass = classList[0];
      
      
      var myDate = new Date();
      myDate.setTime(parseInt(dateClass.replace("week-day-table-", "")));
      
      this.newEvent(myDate);
    },
    
    newEvent: function(date){
      var viewModel = this.getViewModel();
      
      var newEvent = new CalendarPackage.model.Event({title:'new event', start_date: date});
      viewModel.setData({theEvent: newEvent});
      
      viewModel.setData({createMode:true});
      this.showEditEventWindow("New");
    },
    
    showEditEventWindow: function(newOrEdit){
      var eventWindow = this.lookupReference("editEventWindow"),
          calendarContainer = this.lookupReference("calendarContainerPanel");
  
      if(!eventWindow){
          eventWindow = Ext.create("CalendarPackage.view.EditEventWindow", {
            constrainTo: calendarContainer
          });
          
          calendarContainer.add(eventWindow);
      }
      
      eventWindow.setTitle(newOrEdit+" Event");
      
      eventWindow.show();
    },
    
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
    eventsStoreDataChanged: function(store, records){
      var monthView = this.lookupReference("monthPanel");
      if(monthView){
        this.onMonthPanelResize(monthView);
      }
    },
    eventsStoreFilterChange: function(store, records){
      var monthView = this.lookupReference("monthPanel");
      if(monthView){
        this.onMonthPanelResize(monthView);
      }
    },
    
    onMoreEventClick: function(view, record){
      var viewModel = this.getViewModel();
      viewModel.setData({theEvent: record});
      
      this.lookupReference("extraEventsWindow").hide();
      
      viewModel.setData({createMode:false});
      this.showEditEventWindow("Edit");
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
        viewModel.setData({theEvent: eventRecord});      
      
        viewModel.setData({createMode:false});
        this.showEditEventWindow("Edit");
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
        
        var extraEventsWindow = this.lookupReference("extraEventsWindow");
        if(!extraEventsWindow) {
          var calendarContainer = this.lookupReference("calendarContainerPanel");
          extraEventsWindow = Ext.create("CalendarPackage.view.MoreEventsWindow", {
            constrainTo: calendarContainer
          });
          
          
          var viewModelData = viewModel.getData(),
              eventAttributes = viewModelData["eventAttributes"];
              
          extraEventsWindow.eventAttributes = eventAttributes;
          
          calendarContainer.add(extraEventsWindow);
          
        }
        
        var targetXY = targetElem.getXY();
        targetXY[0] = targetXY[0] - 200;
        targetXY[1] = targetXY[1] - 50;
        
        var tableParent = targetElem.findParentNode('table');
        var dateClass = tableParent.classList[0];
        
        var myDate = new Date();
        myDate.setTime(parseInt(dateClass.replace("week-day-table-", "")));

        extraEventsWindow.extraEventsDate = myDate;
       
        extraEventsWindow.setTitle(Ext.Date.format(myDate, "M j, Y"));
        
        var dataView = this.lookupReference("extraEventsView");
        if(dataView){
          dataView.setTplItems();
        }
        
        extraEventsStore.removeAll();
        
        extraEventsStore.add(extraEvents);
        
        
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
    
    onMainCalendarPanelReady: function(panel){
      var viewModel = this.getViewModel(),
          calendarsStore = viewModel.getStore("calendars");
  
      if(calendarsStore.data.items.length > 0){
        var checkboxes = [];
       
        calendarsStore.each(function(calendarRecord){
          var checkboxObj = {
            boxLabel: calendarRecord.get('name'),
            inputValue: calendarRecord.get('id'),
            checked: true
          };
          var backgroundColor = calendarRecord.get("background_color")
          if(backgroundColor && backgroundColor.trim() != ""){
            checkboxObj.style = "color: "+calendarRecord.get("background_color")+";";
          }
          checkboxes.push(checkboxObj);
        });
        this.lookupReference("calendarSelectionCheckboxes").add(checkboxes);
        this.lookupReference("calendarSelectionPanel").show();
        //load events store for calendars
      } else {
        //load events store, no calendar filter
      }
    },
    onMonthPanelResize: function(monthView){
      if(monthView){
        var viewModel = this.getViewModel(),
            eventsStore = viewModel.getStore("events"),
            viewModelData = viewModel.getData(),
            eventAttributes = viewModelData["eventAttributes"];
        
        
        var viewModel = this.getViewModel(),
            calendarStore = viewModel.getStore("calendars");
        
        eventsStore.each(function(eventRecord){
        
          if(eventRecord.get("calendar_id")){
            var calendarRecord = calendarStore.getById(eventRecord.get("calendar_id"));
            eventRecord.set("background_color", calendarRecord.get("background_color"));
          }
        });
        
        monthView.setEvents(eventsStore, eventAttributes); 
        monthView.drawEvents(eventAttributes);
      }
      
    },
    
    onCalendarSelectionChange: function(checkboxGroup) {
      var calendarIds = checkboxGroup.getValue()["calendar_ids[]"];
      
      if(typeof(calendarIds) == "number"){
        calendarIds = [calendarIds];
      }
      
      var viewModel = this.getViewModel(),
          eventsStore = viewModel.getStore("events");
  
      eventsStore.clearFilter();
      eventsStore.filterBy(function(record){
        if(calendarIds){
          return calendarIds.indexOf(record.get("calendar_id")) != -1;          
        } else {
          return false;
        }
      });
      
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
    },
    
    //TODO: These 2 methods need to go in controller for eventWindow
    onAllDayChange: function(checkbox){
      var startDateField = this.lookupReference("startDateField");
      var endDateField = this.lookupReference("endDateField");
      if(!checkbox.getValue()){
        startDateField.showTimeField();
        endDateField.showTimeField();
      } else {
        startDateField.hideTimeField();
        endDateField.hideTimeField();
      }
    },
    onEventCalendarChange: function(combobox){
      var viewModel = this.getViewModel(),
          calendarStore = viewModel.getStore("calendars");
  
      var calendarRecord = calendarStore.getById(combobox.getValue());
      
      var dot = combobox.el.down(".calendar-dot");
      if(calendarRecord){
        dot.dom.style.backgroundColor = calendarRecord.get("background_color");
      } else {
        dot.dom.style.backgroundColor = "transparent";
      }
    },
    
    onEventSave: function(){
      console.log("ON SAVE")
      var viewModel = this.getViewModel(),
          eventRecord = viewModel.getData()["theEvent"],
          eventsStore = viewModel.getStore("events");

//      eventsStore.commitChanges();
//     console.log(eventRecord.get("length"));
     eventRecord.commit();
//     console.log(eventRecord.get("length"));
//     
//     var monthView = this.lookupReference("monthPanel");
//     this.onMonthPanelResize(monthView);
//     
//     this.lookupReference("editEventWindow").close();
//      console.log(eventRecord.data);
    },
    
    onEventCreate: function(){
      var viewModel = this.getViewModel(),
          eventRecord = viewModel.getData()["theEvent"],
          eventsStore = viewModel.getStore("events");
  console.log(eventRecord);
      eventsStore.add(eventRecord);
      
          
    },
    
    onEventCancel: function(){
      var viewModel = this.getViewModel(),
          eventRecord = viewModel.getData()["theEvent"];
     
     eventRecord.reject();
     
     this.lookupReference("editEventWindow").close();
    },
    
    onStartDateChange: function(startDateField, newVal){
      var viewModel = this.getViewModel(),
          viewModelData = viewModel.getData(),
          eventRecord = viewModelData["theEvent"],
          eventAttributes = viewModelData["eventAttributes"],
          endDateField = this.lookupReference("endDateField");
      if(newVal){
        endDateField.setMinValue(newVal);
      }
    },
    
    onEndDateChange: function(endDateField, newVal){
      var viewModel = this.getViewModel(),
          viewModelData = viewModel.getData(),
          eventRecord = viewModelData["theEvent"],
          eventAttributes = viewModelData["eventAttributes"],
          startDateField = this.lookupReference("startDateField");
  
      if(newVal){
        startDateField.setMaxValue(newVal);
      }
      
    }
});