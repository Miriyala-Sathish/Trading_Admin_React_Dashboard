import GenericSubscribers from './GenericSubscribers';

const DailyDemo = () => {
  return (
    <GenericSubscribers
      apiEndpoint="http://localhost:5600/api/daily-demo"
      fieldPrefix="_daily_demo"
      title="Daily Demo Subscribers"
      subtitle="A comprehensive overview of daily demo subscribers."
      searchPlaceholder="Search demo subscribers..."
      addButtonText="Add New Subscriber"
      sectionClass="daily-demo"
    />
  );
};

export default DailyDemo;