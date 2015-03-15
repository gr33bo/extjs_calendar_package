Ext.define('CalendarPackage.view.CalendarMainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.calendarmainmodel',
    requires: [
      'CalendarPackage.model.Event',
      'CalendarPackage.model.Calendar'
    ], 
    
    data: {
      startDateAttribute: "start_date",
      endDateAttribute: "end_date",
      titleAttribute: "title",
      allDayAttribute: "is_all_day"
    },
    stores: {
      calendars: {
        model: 'Calendar',
        autoLoad: false,
        autoSync: false,
        remoteFilter: false,
        remoteSort: false,
        sorters: [
            {
                property : 'name',
                direction: 'ASC'
            }
        ],
        data: [
          {
            id: 1,
            name: 'Calendar 1',
            background_color: "#3893d3"
          },
          {
            id: 2,
            name: 'Calendar 2',
            background_color: "#ff3737"
          },
          {
            id: 3,
            name: 'Calendar 3',
            background_color: "#cf2fd4"
          }
        ]
        
      },
      extra_events: {
        model: 'Event',
        autoLoad: false,
        autoSync: false,
        remoteFilter: false,
        remoteSort: false,
        sorters: [
            {
                property : 'true_start_date',
                direction: 'ASC'
            },
            {
                property : 'length',
                direction: 'DESC'
            }
        ]
      },
      events: {
          model: 'Event',
          autoLoad: false,
          autoSync: false,
          remoteFilter: false,
          remoteSort: false,
          sorters: [
              {
                  property : 'true_start_date',
                  direction: 'ASC'
              },
              {
                  property : 'length',
                  direction: 'DESC'
              }
          ],
          data: [
            {
              id: 1,
              title: "RAWR1",
              start_date: "2015-05-04 12:00:00",
              end_date: "2015-05-07 12:00:00",
              calendar_id: 1
            },
            {
              id: 2,
              title: "RAWR2",
              start_date: "2015-05-03 12:00:00",
              end_date: "2015-05-11 12:00:00",
              is_all_day: true,
              calendar_id: 1
            },
            {
              id: 3,
              title: "RAWR3",
              start_date: "2015-05-06 12:00:00",
              end_date: "2015-05-06 13:00:00",
              calendar_id: 3
            },
            {
              id: 4,
              title: "RAWR4",
              start_date: "2015-05-06 12:00:00",
              end_date: "2015-05-06 12:00:00",
              is_all_day: true,
              calendar_id: 2
            },
            {
              id: 5,
              title: "RAWR5",
              start_date: "2015-05-03 11:00:00",
              end_date: "2015-05-03 11:00:00",
              is_all_day: true,
              calendar_id: 2
            },
            {
              id: 6,
              title: "RAWR6",
              start_date: "2015-04-26 11:00:00",
              end_date: "2015-05-01 11:00:00",
              is_all_day: true,
              calendar_id: 3
            }
          ],
////          proxy: {
////             type: 'rest',
////             url: '/affiliations',
////              reader: {
////                  type: 'json',
////                  rootProperty: 'rows',
////                  totalProperty: 'total',
////                  messageProperty: 'message',
////                  successProperty: 'success'
////              },
////              writer: {
////                  writeAllFields: false
////              }
////          }
          listeners: {
            load: 'eventsStoreLoaded',
            filterchange: 'eventsStoreFilterChange'
          }
      }
    }
});