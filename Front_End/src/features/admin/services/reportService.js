import { doctorService } from './doctorService';
import { patientService } from './patientService';
import { sessionService } from './sessionService';

export const reportService = {
  async getOverview() {
    const [doctors, patients, sessions] = await Promise.all([
      doctorService.getAll(),
      patientService.getAll(),
      sessionService.getAll(),
    ]);

    const revenue = sessions
      .filter((s) => s.depositPaid || s.balancePaid || s.status === 'completed')
      .reduce((sum, s) => {
        const amount = (s.depositPaid ? (s.depositAmount || 0) : 0) + (s.balancePaid ? (s.balance || 0) : 0) || s.sessionPrice || 0;
        return sum + (Number(amount) || 0);
      }, 0);

    return {
      doctors: doctors.length,
      patients: patients.length,
      sessions: sessions.length,
      revenue,
    };
  },

  async exportReport(reportType, format) {
    const overview = await this.getOverview();
    return {
      reportType,
      format,
      generatedAt: new Date().toISOString(),
      summary: overview,
      url: '#',
    };
  },
};

export default reportService;
