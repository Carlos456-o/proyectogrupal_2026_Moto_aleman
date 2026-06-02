import { Container, Card } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container className="dashboard-container">
      <Card className="dashboard-card">
        <iframe
          title="estaditicas"
          width="100%"
          height="100%"
          src="https://app.powerbi.com/view?r=eyJrIjoiZTI3YjMxMzQtOTE0MC00OGQ4LWJlMTYtNjIzZmMwN2UwZGJlIiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9"
          allowFullScreen="true"
        ></iframe>
      </Card>
    </Container>
  );
};

export default Dashboard;
      