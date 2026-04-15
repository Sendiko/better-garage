const { Op } = require('sequelize');
const { Transaction, Services, Sparepart, User } = require('../database/models');

const statusGroups = {
    booked: ['booked'],
    active: ['received', 'ongoing'],
    completed: ['finished', 'payed']
};

const getDayRange = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

const getBookingTimeClause = (start, end) => ({
    [Op.or]: [
        { bookingTime: { [Op.between]: [start, end] } },
        { bookingTime: null, createdAt: { [Op.between]: [start, end] } }
    ]
});

const buildTransactionQueryOptions = (req) => {
    const baseOptions = {};
    const technicianInclude = {
        model: User,
        as: 'technician',
        attributes: ['id', 'fullName', 'garageId']
    };

    if (req.user.role && req.user.role.name === 'Admin' && req.user.garageId) {
        technicianInclude.where = { garageId: req.user.garageId };
    }

    if (req.user.role && req.user.role.name === 'Technician') {
        baseOptions.technicianId = req.user.id;
    }

    return {
        where: baseOptions,
        include: [
            { model: Services, as: 'services' },
            { model: Sparepart, as: 'spareparts' },
            technicianInclude
        ]
    };
};

const mapTransactionStage = (status) => {
    if (statusGroups.booked.includes(status)) return 'intake';
    if (statusGroups.active.includes(status)) return 'testing';
    if (statusGroups.completed.includes(status)) return 'ready';
    return 'intake';
};

const getDashboardSummary = async (req, res) => {
    try {
        const today = getDayRange(new Date());
        const yesterday = getDayRange(new Date(Date.now() - 24 * 60 * 60 * 1000));
        const options = buildTransactionQueryOptions(req);
        const baseWhere = { ...options.where };
        const include = options.include;

        const revenueToday = await Transaction.sum('grandTotal', {
            where: {
                ...baseWhere,
                status: statusGroups.completed,
                ...getBookingTimeClause(today.start, today.end)
            },
            include
        }) || 0;

        const revenueYesterday = await Transaction.sum('grandTotal', {
            where: {
                ...baseWhere,
                status: statusGroups.completed,
                ...getBookingTimeClause(yesterday.start, yesterday.end)
            },
            include
        }) || 0;

        const revenueChangePercent = revenueYesterday === 0
            ? revenueToday === 0 ? 0 : 100
            : Number((((revenueToday - revenueYesterday) / Math.abs(revenueYesterday)) * 100).toFixed(2));

        const pendingAppointments = await Transaction.count({
            where: {
                ...baseWhere,
                status: 'booked'
            },
            include
        });

        const jobsInProgress = await Transaction.count({
            where: {
                ...baseWhere,
                status: statusGroups.active
            },
            include
        });

        const activeJobs = await Transaction.findAll({
            where: {
                ...baseWhere,
                status: [...statusGroups.active, ...statusGroups.booked]
            },
            include,
            order: [['updatedAt', 'DESC']],
            limit: 3
        });

        const upcomingJobs = await Transaction.findAll({
            where: {
                ...baseWhere,
                status: 'booked'
            },
            include,
            order: [['bookingTime', 'ASC'], ['createdAt', 'ASC']],
            limit: 3
        });

        return res.status(200).json({
            message: 'Dashboard summary retrieved successfully',
            data: {
                revenueToday,
                revenueYesterday,
                revenueChangePercent,
                pendingAppointments,
                jobsInProgress,
                activeJobs,
                upcomingJobs
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        return res.status(500).json({
            message: 'An error occurred while retrieving dashboard summary',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getDashboardActivity = async (req, res) => {
    try {
        const options = buildTransactionQueryOptions(req);
        const activities = await Transaction.findAll({
            where: options.where,
            include: options.include,
            order: [['updatedAt', 'DESC']],
            limit: 6
        });

        const activityFeed = activities.map((transaction) => {
            let title = 'Job updated';
            let description = `Booking ID ${transaction.bookingId}`;

            if (statusGroups.booked.includes(transaction.status)) {
                title = 'New appointment scheduled';
                description = `Appointment for booking ${transaction.bookingId}`;
            } else if (statusGroups.completed.includes(transaction.status)) {
                title = 'Service completed';
                description = `Service finished for booking ${transaction.bookingId}`;
            } else if (statusGroups.active.includes(transaction.status)) {
                title = 'Job in progress';
                description = `Ongoing work for booking ${transaction.bookingId}`;
            }

            const technicianName = transaction.technician ? transaction.technician.fullName : 'Unassigned';
            const serviceNames = transaction.services?.map((service) => service.name).join(', ') || 'No service listed';

            return {
                id: transaction.id,
                title,
                description,
                status: transaction.status,
                technician: technicianName,
                services: serviceNames,
                timestamp: transaction.updatedAt,
                stage: mapTransactionStage(transaction.status)
            };
        });

        return res.status(200).json({
            message: 'Dashboard activity retrieved successfully',
            data: activityFeed
        });
    } catch (error) {
        console.error('Error fetching dashboard activity:', error);
        return res.status(500).json({
            message: 'An error occurred while retrieving dashboard activity',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getDashboardSummary,
    getDashboardActivity
};
