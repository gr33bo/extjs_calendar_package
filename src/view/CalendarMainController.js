Ext.define('CalendarPackage.view.CalendarMainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.window.MessageBox' 
    ],

    alias: 'controller.calendarmaincontroller',
    
    colorLuminance: function(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
    },
    
    onDatePickerSelect: function(picker, date){
      var monthView = this.lookupReference("monthPanel");
      
      monthView.setDate(date);
      this.onMonthPanelResize(monthView);  
    },
    eventsStoreLoaded: function(store, records){
      var monthView = this.lookupReference("monthPanel");
      if(monthView){
        this.onMonthPanelReady(monthView);
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
        
        //show extra events
        console.log(extraEvents);
        
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