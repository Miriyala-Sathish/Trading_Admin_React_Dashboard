import GenericSubscribers from './GenericSubscribers';

const TotalPaid = () => {
  return (
    <GenericSubscribers
      apiEndpoint="http://localhost:5600/api/total-paid-subscribers"
      fieldPrefix="_total_paid"
      title="Total Paid Subscribers"
      subtitle="A comprehensive overview of total paid subscribers."
      searchPlaceholder="Search paid subscribers..."
      addButtonText="Add New Subscriber"
      sectionClass="total-paid"
    />
  );
};

export default TotalPaid;