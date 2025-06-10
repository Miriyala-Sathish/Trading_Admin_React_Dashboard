import GenericSubscribers from './GenericSubscribers';

const TotalDemo = () => {
  return (
    <GenericSubscribers
      apiEndpoint="http://localhost:5600/api/total-demo"
      fieldPrefix="_total_demo"
      title="Total Demo Subscribers"
      subtitle="A comprehensive overview of total demo subscribers."
      searchPlaceholder="Search demo subscribers..."
      addButtonText="Add New Subscriber"
      sectionClass="total-demo"
    />
  );
};

export default TotalDemo;