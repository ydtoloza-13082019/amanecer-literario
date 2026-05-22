class AdminDashboardController {
  constructor(adminDashboardService) {
    this.adminDashboardService = adminDashboardService;
    this.index = this.index.bind(this);
  }

  async index(req, res, next) {
    try {
      const dashboard = await this.adminDashboardService.obtenerDashboard(req.query);
      res.status(200).json(dashboard);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminDashboardController;
