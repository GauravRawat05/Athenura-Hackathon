/**
  adminReport.service.js
  Contains the core business rules for adminReport.
 */

class AdminReportService {
  async listReports({ page = 1, limit = 20, type, status }) {
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0
      }
    }
  }

  async getReportById(reportId) {
    return {
      _id: reportId,
      name: null,
      type: null,
      description: null,
      status: 'draft',
      schedule: null,
      createdAt: null,
      updatedAt: null
    }
  }

  async createReport({ name, type, description, schedule, filters }) {
    return {
      _id: null,
      name,
      type,
      description,
      status: 'draft',
      schedule: schedule || null,
      filters: filters || {},
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async updateReport(reportId, updateData) {
    return {
      _id: reportId,
      ...updateData,
      updatedAt: new Date()
    }
  }

  async runReport(reportId) {
    return {
      reportId,
      executedAt: new Date(),
      outputUrl: null,
      resultSummary: {
        recordCount: 0,
        rows: []
      }
    }
  }

  async deleteReport(reportId) {
    return true
  }
}

const adminReportService = new AdminReportService()
export default adminReportService
