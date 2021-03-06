Ext.define('CalendarPackage.view.CalendarMainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.calendarmainmodel',
    requires: [
      'CalendarPackage.model.Event',
      'CalendarPackage.model.Calendar'
    ], 
    
    data: {
      eventAttributes: {
        startDate: "start_date",
        endDate: "end_date",
        title: "title",
        allDay: "is_all_day",
        calendarId: "calendar_id",
        backgroundColor: "background_color"
      },
      
      calendarAttributes: {
        name: "name",
        backgroundColor: "background_color"
      },      
      
      eventModel: "CalendarPackage.model.Event",
      calendarModel: "CalendarPackage.model.Calendar",
      
      createMode: false
    },
    stores: {
      calendars: {
        model: 'CalendarPackage.model.Calendar',
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
//          {
//            id: 1,
//            name: 'Calendar 1',
//            background_color: "#3893d3"
//          },
//          {
//            id: 2,
//            name: 'Calendar 2',
//            background_color: "#ff3737"
//          },
//          {
//            id: 3,
//            name: 'Calendar 3',
//            background_color: "#cf2fd4"
//          }
        ]
        
      },
      extra_events: {
        model: 'CalendarPackage.model.Event',
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
          model: 'CalendarPackage.model.Event',
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
//            {
//              id: 1,
//              title: "RAWR1",
//              start_date: "2015-05-04 12:00:00",
//              end_date: "2015-05-07 12:00:00",
//              calendar_id: 1
//            },
//            {
//              id: 2,
//              title: "RAWR2",
//              start_date: "2015-05-03 12:00:00",
//              end_date: "2015-05-11 12:00:00",
//              is_all_day: true,
//              calendar_id: 1
//            },
//            {
//              id: 3,
//              title: "RAWR3",
//              start_date: "2015-05-05 16:00:00",
//              end_date: "2015-05-05 17:00:00",
//              calendar_id: 3
//            },
//            {
//              id: 4,
//              title: "RAWR4",
//              start_date: "2015-05-06 12:00:00",
//              end_date: "2015-05-06 12:00:00",
//              is_all_day: true,
//              calendar_id: 2
//            },
//            {
//              id: 5,
//              title: "RAWR5",
//              start_date: "2015-05-03 11:00:00",
//              end_date: "2015-05-03 11:00:00",
//              is_all_day: true,
//              calendar_id: 2
//            },
//            {
//              id: 6,
//              title: "RAWR6",
//              start_date: "2015-04-26 11:00:00",
//              end_date: "2015-05-01 11:00:00",
//              is_all_day: true,
//              calendar_id: 3
//            }
          ],
          proxy:{
            type: 'memory',
            reader: {
              type: 'json'
            }
          },
          listeners: {
            load: 'eventsStoreLoaded',
            filterchange: 'eventsStoreFilterChange',
            update: 'eventsStoreDataChanged',
            add: 'eventsStoreDataAdded',
            remove: 'eventsStoreDataRemoved'
          }
      }
    }
});