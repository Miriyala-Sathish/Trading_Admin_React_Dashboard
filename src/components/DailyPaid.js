import GenericSubscribers from './GenericSubscribers';

const DailyPaid = () => {
  return (
    <GenericSubscribers
      apiEndpoint="http://localhost:5600/api/daily-paid-subscribers"
      fieldPrefix="_daily_paid"
      title="Daily Paid Subscribers"
      subtitle="A comprehensive overview of daily paid subscribers."
      searchPlaceholder="Search paid subscribers..."
      addButtonText="Add New Subscriber"
      sectionClass="daily-paid"
    />
  );
};

export default DailyPaid;