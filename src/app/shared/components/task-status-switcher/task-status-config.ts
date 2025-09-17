export const TASK_STATUS_CONFIG = {
  defaultStatus: 'New',
  statuses: {
    completed: 'Completed',
    new: 'New',
    incomplete: 'InCompleted',
    cancelled: 'Cancelled'
  },
  eventNames: {
    Completed: 'Completed',
    New: 'New',
    Incomplete: 'InCompleted'
  },
  borderColors: {
    Completed: '#63E6BE', // Green
    New: '#858585', // Gray
    Incomplete: '#ff0000', // Red
    default: '#858585' // Default gray border
  }
};
