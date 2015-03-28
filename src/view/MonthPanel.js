Ext.define('CalendarPackage.view.MonthPanel', {
    extend: 'Ext.Component',
    alias: ['widget.monthpanel'],
    
    requires: [
      'CalendarPackage.view.templates.WeekRow'
//      'CalendarPackage.view.templates.Month'
    ],
    
    reference: 'monthPanel',
    
    cls: 'month-view',
    baseCls: 'calendar-package',
    prevCls: 'previous-month',
    nextCls: 'next-month',
    todayCls: 'today',
    selectedDayCls: 'selected-day',
    
    startDay: 0, 
    numDays: 42, 
    
    focusable: true,
    autoScroll: true,
    
    initHour: 12,
    
    totalEventRowsPerWeek: 1,
    
    weekTablesData: [],
    
    childEls: [
        'innerEl', 'eventEl'//, 'prevEl', 'nextEl', 'middleBtnEl', 'footerEl'
    ],
    
    renderTpl: [
        '<div id="{id}-innerEl" data-ref="innerEl" class="{baseCls}">',
            '<div id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner">',
              '<div class="{baseCls}-header">',
                '<table class="header-row" cellpadding="0" cellspacing="0">',
                  '<tr>',
                    '<tpl for="dayNames">',
                        '<td class="{parent.baseCls}-column-header">{.}</td>',
                    '</tpl>',
                  '</tr>',
                '</table>',
              '</div>', 
              '<div class="days-container">',
                '<div class="week" id="week-{[this.weekNumber()]}">',
                  '<table class="week-row" cellpadding="0" cellspacing="0">',
                    '<tr>',
                      '<tpl for="days">',
                        '{#:this.isEndOfWeek}',
                        '<td class="week-day"></td>',
                      '</tpl>',
                    '</tr>',
                  '</table>',
                  '<div id="week-events-container-{[this.prevWeekNumber()]}"></div>',
                '</div>',
              '</div>',                
          '</div>',
        '</div>',
        {
            firstInitial: function(value) {
                return Ext.picker.Date.prototype.getDayInitial(value);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                
                if(end){
                  var weekNumber = this.weekNumber();
                  var idString = "id='week-"+weekNumber+"'";
                  
                  return '</tr></table><div id="week-events-container-'+(weekNumber-1)+'"></div></div><div class="week" '+idString+'><table class="week-row" cellpadding="0" cellspacing="0"><tr>';
                } else {
                  return "";
                }
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            },
            weekNumber: function(){
              if(!this.weekNum){
                this.weekNum = 0;
              }
              
              this.weekNum += 1;
              return this.weekNum;
            },
            prevWeekNumber: function (){
              return this.weekNum;
            }
        }
    ],

    
    initComponent: function(){
      var me = this,
          clearTime = Ext.Date.clearTime;
  
      var today = new Date();
      today.setDate(15);
  
      me.value = clearTime(today);
      me.value = clearTime(new Date(2015, 4, 15));
      
      me.selectedValue = Ext.clone(me.value);
      
      me.format = Ext.Date.defaultFormat;
      
      me.dayNames = Ext.Date.dayNames;
      me.dayNames = me.dayNames.slice(me.startDay).concat(me.dayNames.slice(0, me.startDay));
       
      this.callParent();
    },
    beforeRender: function() {
      var me = this,
          days = new Array(me.numDays),
          today = Ext.Date.format(new Date(), me.format);
          
      Ext.applyIf(me, {
            renderData: {}
        });
        
       Ext.apply(me.renderData, {
            dayNames: me.dayNames,
            days: days
        });
          
    },
    
    
    onRender: function(container, position) {
      var me = this;

      me.callParent(arguments);

      me.cells = me.el.select('td.week-day');
      
      me.fullUpdate(me.value);
      
    },
    
    setDate: function(newDate){      
      this.selectedValue = Ext.clone(newDate);
      //always go to 15th of selected month
      newDate.setDate(15);
      this.value = Ext.Date.clearTime(newDate);
      
      this.fullUpdate(this.value);
    },
    
    showPrevious: function(){      
      this.value.setMonth(this.value.getMonth()-1);
      
      this.fullUpdate(this.value);
    },
    
    showNext: function(){
      this.value.setMonth(this.value.getMonth()+1);
      
      this.fullUpdate(this.value);             
    },
    
    fullUpdate: function(date) {
        var me = this,
            cells = me.cells.elements,
            eDate = Ext.Date,
            i = 0,
            extraDays = 0,
            today = +eDate.clearTime(new Date()),
            selectedValue = +eDate.clearTime(me.selectedValue),
            days = eDate.getDaysInMonth(date),
            firstOfMonth = eDate.getFirstDateOfMonth(date),
            startingPos = firstOfMonth.getDay() - me.startDay,
            previousMonth = eDate.add(date, eDate.MONTH, -1),
            prevStart, current, disableToday, tempDate, setCellClass, html, cls,
            formatValue, value;

        if (startingPos < 0) {
            startingPos += 7;
        }
        

        days += startingPos;
        prevStart = eDate.getDaysInMonth(previousMonth) - startingPos;

        current = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), prevStart, me.initHour);
        
        setCellClass = function(cellIndex, cls){
            var cell = cells[cellIndex];
            cell.className = "week-day";
            value = +eDate.clearTime(current, true);
            
            // store dateValue number as an expando
            cell.firstChild.dateValue = value;
            if (value == today) {
                cls += ' ' + me.todayCls;
            } else if(value == selectedValue){
              cls += ' ' + me.selectedDayCls;
            }
            
            if(cls){
              cell.className = cell.className + " " + cls;
            }
        };


        //Ext.get() throws error/warning when the element it gets is
        //different from an element it got previously with the same id
        //this stops that error.
        for(; i < me.numDays; ++i) {
          var currentCell = cells[i];
          Ext.get(currentCell).setId("random-id-"+i);
        }
        
        i = 0;
        
        for(; i < me.numDays; ++i) {
          current.setDate(current.getDate() + 1);
          var currentCell = cells[i];

          if (i < startingPos) {
              html = (++prevStart);
              cls = me.prevCls;
          } else if (i >= days) {
              html = (++extraDays);
              cls = me.nextCls;
          } else {
              html = i - startingPos + 1;
              cls = me.activeCls;
          }

          if(html == "1" || i == 0){
            var myDate = Ext.clone(current);
            html = Ext.Date.format(myDate, 'M j, Y');
          } else if(i != 0) {
            html = Ext.Date.format(current, 'j');
          }
          
          var idDate = Ext.clone(current);
          idDate.setHours(0);
          idDate.setMinutes(0);
          idDate.setSeconds(0);
          currentCell.id = "date-cell-"+idDate.getTime();
          html = "<span class='date'>"+html+"</html>";

          currentCell.innerHTML = html;
          setCellClass(i, cls);
        }

    },
    setEvents: function(eventsStore, eventAttributes){

      var weekTables = this.getWeekTableObjects();

      eventsStore.each(function(eventRecord){
        
        var eventStart = eventRecord.get(eventAttributes["startDate"]);
        var eventEnd = eventRecord.get(eventAttributes["endDate"]);
        
        //for each eventRecord
        //figure out the week it belongs in
        var relevantWeeks = Ext.Array.filter(weekTables, function(item){
          return (Ext.Date.between(eventStart, item.weekStart, item.weekEnd)) || 
                  (Ext.Date.between(eventEnd, item.weekStart, item.weekEnd)) ||
                  (eventStart < item.weekStart && eventEnd > item.weekEnd);
        });

        //for each relevant week
        Ext.each(relevantWeeks, function(relevantWeek, i){
          //set slot assignment to null (an event could be slot 1 for first week and slot 2 for 2nd)
          
          
          var slot = null;
          //cycle through each day of the week
          Ext.each(relevantWeek["days"], function(day, i){
            var matches = false;
         
            //check to see if event happens on the given day (wholly or partially)
            if(Ext.Date.isEqual(eventStart, eventEnd)){
              if(Ext.Date.between(eventStart, day["dayStart"], day["dayEnd"])){
                matches = true;
              }
            } else {
              if(Ext.Date.between(day["dayStart"], eventStart, eventEnd) || 
                  Ext.Date.between(day["dayEnd"], eventStart, eventEnd) ||
                   Ext.Date.between(eventStart, day["dayStart"], day["dayEnd"]) ||
                    (eventStart < day["dayStart"] && eventEnd > day["dayEnd"])){
                matches = true;
              }
            }  
            
            //if it does fall on that day
            if(matches){
              //assign a slot for that event for this week, unless one is already assigned
              if(slot === null){
                if(day["eventItems"].length == 0){
                  //if there's nothing in events yet, event goes into first slot
                  slot = 0;
                } else {
                  //cycle through event items until you hit a null slot
                  Ext.each(day["eventItems"], function(eventItem, i){
                    if(!eventItem){
                      slot = i;
                      return false
                    }
                  });
                  
                  //after cycling all events if theres' still no slot assigned, add to the end. 
                  if(slot === null){
                    slot = day["eventItems"].length;
                  }
                }
                
              }
              
              day["eventItems"][slot] = eventRecord.data;
            }
          
          });
        });
      });
      
      
      this.weekTablesData = weekTables;      
      
    },
    
    drawEvents: function(eventAttributes){
  
      var firstWeekRow = Ext.get("week-1");
      var weekRowHeight = firstWeekRow.getHeight();

      this.totalEventRowsPerWeek = parseInt((weekRowHeight-20)/20);
 
      Ext.each(Ext.ComponentQuery.query("weekrow"), function(weekRow){
        weekRow.destroy();
      });
 
      Ext.each(this.weekTablesData, function(singleWeekData, i){

        var hasEvents = false;
        
        Ext.each(singleWeekData["days"], function(day){
          if(day["eventItems"].length > 0){
            hasEvents = true;
            
            if(day["eventItems"].length < this.totalEventRowsPerWeek){
              for(var j = day["eventItems"].length; j < this.totalEventRowsPerWeek; j++){
                day["eventItems"].push(null);
              }
            }
          } else {
            day["eventItems"] = new Array(this.totalEventRowsPerWeek);
          }
        }, this);
        
        var weekRowContainer = Ext.get("week-events-container-"+(i+1));
        weekRowContainer.setHtml("");
        
        if(hasEvents){
          Ext.create("CalendarPackage.view.templates.WeekRow", {
            totalEventRowsPerWeek: this.totalEventRowsPerWeek,
            eventAttributes: eventAttributes,
            data: singleWeekData,
            renderTo: weekRowContainer
          });
        }
       
      }, this);
      
      this.setUpMouseEvents();
    },
    
    
    setUpMouseEvents: function(){
      //get event cell items, add mouse over, mouse click, mouse out event handlers
      var dom = this.el.dom;
      
//      console.log(Ext.dom.Query.select("td.week-day", dom))
//      console.log(Ext.dom.Query.select("table.week-day tbody tr td:not(.event-cell)", dom))
      Ext.each(Ext.dom.Query.select("td.event-cell", dom), function(domElem){
        var elem = Ext.get(domElem);
        elem.on({
            click: this.onEventMouseClick,
            mouseover: this.onEventMouseOver,
            mouseout: this.onEventMouseOut,
            scope: this 
        });
      }, this);
      
      Ext.each(Ext.dom.Query.select("td.week-day", dom), function(domElem){
        var elem = Ext.get(domElem);
        elem.on({
            click: this.onDayCellClick,
            scope: this 
        });
      }, this);
      
      Ext.each(Ext.dom.Query.select("table.week-day tr td:not(.event-cell)", dom), function(domElem){
        var elem = Ext.get(domElem);
        elem.on({
            click: this.onEmptyCellClick,
            scope: this 
        });
      }, this);
    },
    
    onEventMouseClick: function(e, htmlTarget){
      this.fireEvent("onEventMouseClick", e, htmlTarget);
    },
    
    onEventMouseOver: function(e, htmlTarget){
      this.fireEvent("onEventCellOver", e, htmlTarget);
    },
    onEventMouseOut: function(e, htmlTarget){
      this.fireEvent("onEventCellOut", e, htmlTarget);
    },
    
    onDayCellClick: function(e, htmlTarget){
      this.fireEvent("onDayCellClick", e, htmlTarget);
    },
    
    onEmptyCellClick: function(e, htmlTarget){
      this.fireEvent("onEmptyCellClick", e, htmlTarget);
    },
    
    getWeekTableObjects: function(){
      var returnArray = [];
      
      Ext.each([1,2,3,4,5,6], function(i){
        var weekObj = {};
        var weekRow = Ext.get("week-"+i);
        var firstCell = Ext.DomQuery.selectNode("table tbody tr td:first-child", weekRow.el.dom);
        var lastCell = Ext.DomQuery.selectNode("table tbody tr td:last-child", weekRow.el.dom);

        var weekStartDate = new Date(parseInt(firstCell.id.replace("date-cell-", "")));        
        var weekEndDate = new Date(parseInt(lastCell.id.replace("date-cell-", "")));
        weekStartDate.setHours(0);
        weekEndDate.setHours(0);
        weekEndDate.setDate(weekEndDate.getDate()+1);
        weekEndDate.setMinutes(weekEndDate.getMinutes()-1);
        weekEndDate.setSeconds(59);
        
        
        var weekDates = [];
        
        for(var i = 0; i < 7; i++ ){
          var dayObj = {};
          var myDate = Ext.clone(weekStartDate);
          myDate.setDate(weekStartDate.getDate()+i);
          
          var dayEnd = Ext.clone(myDate);
          dayEnd.setDate(myDate.getDate()+1);
          
          dayObj["weekStart"] = i == 0;
          dayObj["dayStart"] = myDate;
          dayObj["dayEnd"] = dayEnd;
          dayObj["eventItems"] = [];
          
          weekDates.push(dayObj);
        }
        
        weekObj["weekStart"] = weekStartDate;
        weekObj["weekEnd"] = weekEndDate;
        weekObj["days"] = weekDates;
        
        returnArray.push(weekObj);
      });  
      
      return returnArray;
    },
    
    listeners: {
      onEventMouseClick: 'onEventCellClick',
      onEventCellOver: 'onEventCellOver',
      onEventCellOut: 'onEventCellOut',   
      onDayCellClick: 'onDayCellClick',    
      onEmptyCellClick: 'onEmptyCellClick',     
      resize: "onMonthPanelResize"//fires on resize AND when ready for first time
    }
    
    
   
}); 