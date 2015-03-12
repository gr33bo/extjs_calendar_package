Ext.define('CalendarPackage.model.Base', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.Model'
    ],
    //    fields: [{
    //        name: 'id',
    //        type: 'int'
    //    }],
    schema: {
        namespace: 'CalendarPackage.model'
    }
});

Ext.define('CalendarPackage.model.Event', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
            useNull: true
        },
        //{ name: 'calendar_id',              type: 'integer', useNull: true},
        {
            name: 'title',
            type: 'string'
        },
        {
            name: 'start_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s O'
        },
        {
            name: 'end_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s O'
        }
    ]
});

Ext.define('CalendarPackage.view.CalendarMainController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'Ext.window.MessageBox'
    ],
    alias: 'controller.calendarmaincontroller',
    onDatePickerSelect: function(picker, date) {
        console.log("SELECTED " + date);
    },
    onMonthPanelRender: function(monthView) {
        //      var viewModel = this.getViewModel(),
        //          eventsStore = viewModel.getStore("events");
        //  
        //      eventsStore.each(function(record){
        //        console.log(record.data);
        //      });
        console.log(monthView);
    }
});

Ext.define('CalendarPackage.view.CalendarMainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.calendarmainmodel',
    requires: [
        'CalendarPackage.model.Event'
    ],
    stores: {
        events: {
            model: 'CalendarPackage.model.Event',
            autoLoad: true,
            autoSync: false,
            remoteFilter: false,
            remoteSort: false,
            data: [
                {
                    id: 1,
                    title: "RAWR",
                    start_date: "2015-05-01 12:00:00",
                    end_date: "2015-05-02 12:00:00"
                },
                {
                    id: 2,
                    title: "RAWR2",
                    start_date: "2015-05-03 12:00:00",
                    end_date: "2015-05-11 12:00:00"
                }
            ]
        }
    }
});

Ext.define('CalendarPackage.view.DatePickerPanel', {
    extend: 'Ext.panel.Panel',
    alias: [
        'widget.datepickerpanel'
    ],
    requires: [
        'Ext.layout.container.VBox',
        'Ext.picker.Date'
    ],
    minWidth: 215,
    layout: {
        type: 'vbox'
    },
    items: [
        //TODO: Can we highlight dates with events?
        {
            xtype: 'datepicker',
            reference: 'calendarPackageDatePicker',
            listeners: {
                select: 'onDatePickerSelect',
                render: function() {}
            }
        }
    ]
});

Ext.define('CalendarPackage.view.MonthPanel', {
    extend: 'Ext.Component',
    alias: [
        'widget.monthpanel'
    ],
    requires: [],
    //      'CalendarPackage.view.templates.Month'
    baseCls: 'calendar-package',
    prevCls: 'previous-month',
    nextCls: 'next-month',
    startDay: 0,
    numDays: 42,
    focusable: true,
    initHour: 12,
    childEls: [
        'innerEl',
        'eventEl'
    ],
    //, 'prevEl', 'nextEl', 'middleBtnEl', 'footerEl'
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
        '<div class="week">',
        '<table class="week-row" cellpadding="0" cellspacing="0">',
        '<tr>',
        '<tpl for="days">',
        '{#:this.isEndOfWeek}',
        '<td class="week-day"></td>',
        '</tpl>',
        '</tr>',
        '</table>',
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
                return end ? '</tr></table></div><div class="week"><table class="week-row" cellpadding="0" cellspacing="0"><tr>' : '';
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],
    initComponent: function() {
        var me = this,
            clearTime = Ext.Date.clearTime;
        me.value = clearTime(new Date());
        me.value = clearTime(new Date(2015,4,12));
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
        //      me.textNodes = me.eventEl.query('tbody td div');
        me.fullUpdate(me.value);
        this.fireEvent("monthpanelrender", this);
    },
    //me.eventEl.set({ 'aria-labelledby': me.monthBtn.id });
    //        me.mon(me.eventEl, {
    //            scope: me,
    //            mousewheel: me.handleMouseWheel,
    //            click: {
    //                fn: me.handleDateClick,
    //                delegate: 'div.' + me.baseCls + '-date'
    //            }
    //        });
    fullUpdate: function(date) {
        var me = this,
            cells = me.cells.elements,
            textNodes = me.textNodes,
            disabledCls = me.disabledCellCls,
            eDate = Ext.Date,
            i = 0,
            extraDays = 0,
            newDate = +eDate.clearTime(date, true),
            today = +eDate.clearTime(new Date()),
            min = me.minDate ? eDate.clearTime(me.minDate, true) : Number.NEGATIVE_INFINITY,
            max = me.maxDate ? eDate.clearTime(me.maxDate, true) : Number.POSITIVE_INFINITY,
            ddMatch = me.disabledDatesRE,
            ddText = me.disabledDatesText,
            ddays = me.disabledDays ? me.disabledDays.join('') : false,
            ddaysText = me.disabledDaysText,
            format = me.format,
            days = eDate.getDaysInMonth(date),
            firstOfMonth = eDate.getFirstDateOfMonth(date),
            startingPos = firstOfMonth.getDay() - me.startDay,
            previousMonth = eDate.add(date, eDate.MONTH, -1),
            prevStart, current, disableToday, tempDate, setCellClass, html, cls, formatValue, value;
        if (startingPos < 0) {
            startingPos += 7;
        }
        days += startingPos;
        prevStart = eDate.getDaysInMonth(previousMonth) - startingPos;
        current = new Date(previousMonth.getFullYear(),previousMonth.getMonth(),prevStart,me.initHour);
        //
        //        if (me.showToday) {
        //            tempDate = eDate.clearTime(new Date());
        //            disableToday = (tempDate < min || tempDate > max ||
        //                (ddMatch && format && ddMatch.test(eDate.dateFormat(tempDate, format))) ||
        //                (ddays && ddays.indexOf(tempDate.getDay()) != -1));
        //
        //            if (!me.disabled) {
        //                me.todayBtn.setDisabled(disableToday);
        //            }
        //        }
        //
        setCellClass = function(cellIndex, cls) {
            var cell = cells[cellIndex];
            value = +eDate.clearTime(current, true);
            //            // store dateValue number as an expando
            cell.firstChild.dateValue = value;
            //            if (value == today) {
            //                cls += ' ' + me.todayCls;
            //                cell.firstChild.title = me.todayText;
            //                
            //                // Extra element for ARIA purposes
            //                me.todayElSpan = Ext.DomHelper.append(cell.firstChild, {
            //                    tag: 'span',
            //                    cls: Ext.baseCSSPrefix + 'hidden-clip',
            //                    html: me.todayText
            //                }, true);
            //            }
            //            if (value == newDate) {
            //                me.activeCell = cell;
            //                me.eventEl.dom.setAttribute('aria-activedescendant', cell.id);
            //                cell.setAttribute('aria-selected', true);
            //                cls += ' ' + me.selectedCls;
            //                me.fireEvent('highlightitem', me, cell);
            //            } else {
            //                cell.setAttribute('aria-selected', false);
            //            }
            //
            //            if (value < min) {
            //                cls += ' ' + disabledCls;
            //                cell.setAttribute('aria-label', me.minText);
            //            }
            //            else if (value > max) {
            //                cls += ' ' + disabledCls;
            //                cell.setAttribute('aria-label', me.maxText);
            //            }
            //            else if (ddays && ddays.indexOf(current.getDay()) !== -1){
            //                cell.setAttribute('aria-label', ddaysText);
            //                cls += ' ' + disabledCls;
            //            }
            //            else if (ddMatch && format){
            //                formatValue = eDate.dateFormat(current, format);
            //                if(ddMatch.test(formatValue)){
            //                    cell.setAttribute('aria-label', ddText.replace('%0', formatValue));
            //                    cls += ' ' + disabledCls;
            //                }
            //            }
            if (cls) {
                cell.className = cell.className + " " + cls;
            }
        };
        for (; i < me.numDays; ++i) {
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
            if (html == "1" || i == 0) {
                var myDate = Ext.clone(current);
                html = Ext.Date.format(myDate, 'M j, Y');
            } else if (i != 0) {
                html = Ext.Date.format(current, 'j');
            }
            currentCell.id = "date-cell-" + current.getTime();
            html = "<span class='date'>" + html + "</html>";
            currentCell.innerHTML = html;
            setCellClass(i, cls);
        }
    },
    setEvents: function() {},
    listeners: {
        monthpanelrender: "onMonthPanelRender"
    }
});

Ext.define('CalendarPackage.view.CalendarPanel', {
    extend: 'Ext.panel.Panel',
    alias: [
        'widget.calendarpanel'
    ],
    requires: [
        'CalendarPackage.view.CalendarMainController',
        'CalendarPackage.view.CalendarMainModel',
        'CalendarPackage.view.MonthPanel'
    ],
    items: [
        {
            xtype: 'monthpanel',
            width: '100%',
            height: '100%'
        }
    ]
});

Ext.define('CalendarPackage.view.CalendarMainPanel', {
    extend: 'Ext.panel.Panel',
    alias: [
        'widget.calendarmainpanel'
    ],
    requires: [
        'Ext.layout.container.HBox',
        'CalendarPackage.view.DatePickerPanel',
        'CalendarPackage.view.CalendarPanel'
    ],
    controller: 'calendarmaincontroller',
    viewModel: {
        type: 'calendarmainmodel'
    },
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        frame: true
    },
    items: [
        {
            xtype: 'datepickerpanel',
            width: 215
        },
        {
            xtype: 'calendarpanel',
            flex: 1
        }
    ]
});

Ext.define('CalendarPackage.view.templates.Month', {
    extend: 'Ext.Component',
    requires: [
        'Ext.XTemplate',
        'Ext.Date'
    ],
    initComponent: function() {
        var startDate = new Date();
        var year = me.getYear(new Date().getFullYear() - 4, -4);
        console.log("YEAR:", year);
        //      this.callParent([
        //        'asdf'
        //      ]);
        this.callParent();
    },
    getYear: function(defaultValue, offset) {
        var year = this.value[1];
        offset = offset || 0;
        return year === null ? defaultValue : year + offset;
    }
});

