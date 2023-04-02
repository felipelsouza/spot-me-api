import Route from '@ioc:Adonis/Core/Route';
import HealthCheck from '@ioc:Adonis/Core/HealthCheck';

Route.get('/health-check', async ({ response }) => {
  const report = await HealthCheck.getReport();

  return report.healthy ? response.ok({ message: 'Connection is healthy' }) : response.badRequest(report);
});
