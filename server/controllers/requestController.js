const { validationResult } = require('express-validator');
const HelpRequest = require('../models/HelpRequest');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const { createNotification } = require('../utils/notify');

const populateOptions = [
  { path: 'requesterId', select: 'firstName lastName email phone profileImage location' },
  { path: 'volunteerId', select: 'firstName lastName email phone profileImage location' },
];

// ----------------------------------------------------------
// @desc    Create a help request (Requester only)
// @route   POST /api/requests
// @access  Private / Requester
// ----------------------------------------------------------
const createRequest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const {
      title,
      description,
      category,
      urgency,
      location,
      contactName,
      contactPhone,
      requiredDate,
    } = req.body;

    const payload = {
      title,
      description,
      category,
      urgency,
      location,
      contactName,
      contactPhone,
      requiredDate,
      requesterId: req.user.id,
      status: 'Pending',
    };

    if (req.file) payload.image = `/uploads/${req.file.filename}`;

    const request = await HelpRequest.create(payload);
    // no notification to self on creation — spec lists 'request_created' only for reference
    // Optionally notify admin (skip for first version)
    const populated = await request.populate(populateOptions);

    res.status(201).json({
      success: true,
      message: 'Help request created successfully',
      request: populated,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Get all requests (Admin) or available (Volunteer)
// @route   GET /api/requests
// @access  Private
// ----------------------------------------------------------
const getRequests = async (req, res, next) => {
  try {
    const {
      status,
      category,
      urgency,
      location,
      search,
      sort,
      mine,
      assigned,
      available,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // ---- Role-based scoping ----
    if (req.user.role === 'requester') {
      query.requesterId = req.user.id;
    } else if (req.user.role === 'volunteer') {
      if (assigned === 'true') {
        query.volunteerId = req.user.id;
      } else if (available === 'true') {
        query.status = 'Pending';
        query.volunteerId = null;
        query.requesterId = { $ne: req.user.id };
      } else if (mine === 'true') {
        query.volunteerId = req.user.id;
      } else {
        query.status = 'Pending';
        query.volunteerId = null;
      }
    }

    // ---- Filters ----
    if (status) query.status = status;
    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (location) query.location = { $regex: location, $options: 'i' };

    // ---- Search (title + description only, per spec) ----
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // ---- Sorting ----
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'urgency') {
      // Urgency order: Urgent > High > Medium > Low
      // Simple approach: sort by a virtual priority via `.sort` on createdAt fallback
      // Better: use a small in-memory sort after fetching (still no aggregation pipeline)
      sortOption = { createdAt: -1 }; // we'll re-sort by urgency below
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [requestsRaw, total] = await Promise.all([
      HelpRequest.find(query)
        .populate(populateOptions)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      HelpRequest.countDocuments(query),
    ]);

    // Manual urgency re-sort (only for current page — lightweight, no aggregation)
    let requests = requestsRaw;
    if (sort === 'urgency') {
      const weight = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      requests = [...requestsRaw].sort(
        (a, b) => (weight[b.urgency] || 0) - (weight[a.urgency] || 0)
      );
    }

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
// ----------------------------------------------------------
const getRequestById = async (req, res, next) => {
  try {
    const request = await HelpRequest.findById(req.params.id).populate(populateOptions);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Access control
    const uid = String(req.user.id);
    const isRequester = String(request.requesterId?._id) === uid;
    const isVolunteer = request.volunteerId && String(request.volunteerId._id) === uid;
    const isAdmin = req.user.role === 'admin';
    const isOpenToVolunteers =
      req.user.role === 'volunteer' && request.status === 'Pending' && !request.volunteerId;

    if (!isRequester && !isVolunteer && !isAdmin && !isOpenToVolunteers) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Update request (Requester owner only, and only while Pending)
// @route   PUT /api/requests/:id
// @access  Private / Requester owner
// ----------------------------------------------------------
const updateRequest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const request = await HelpRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (String(request.requesterId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'You can only edit your own requests' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be edited',
      });
    }

    const allowed = [
      'title',
      'description',
      'category',
      'urgency',
      'location',
      'contactName',
      'contactPhone',
      'requiredDate',
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) request[field] = req.body[field];
    });

    if (req.file) {
      if (request.image && request.image.startsWith('/uploads/')) {
        const old = path.join(__dirname, '..', request.image);
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      request.image = `/uploads/${req.file.filename}`;
    }

    await request.save();
    const populated = await request.populate(populateOptions);

    res.status(200).json({
      success: true,
      message: 'Request updated',
      request: populated,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Cancel request (Requester owner)
// @route   PATCH /api/requests/:id/cancel
// @access  Private / Requester owner
// ----------------------------------------------------------
const cancelRequest = async (req, res, next) => {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (String(request.requesterId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (['Completed', 'Cancelled'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${request.status.toLowerCase()} request`,
      });
    }

    request.status = 'Cancelled';
    request.cancelledAt = new Date();
    await request.save();

    // Notify the assigned volunteer (if any)
    if (request.volunteerId) {
      await createNotification({
        userId: request.volunteerId,
        message: `The request "${request.title}" you accepted was cancelled by the requester.`,
        type: 'request_cancelled',
        link: `/dashboard/requests/${request._id}`,
        requestId: request._id,
      });
    }

    // Confirm to requester
    await createNotification({
      userId: request.requesterId,
      message: `You cancelled "${request.title}".`,
      type: 'request_cancelled',
      link: `/dashboard/requests/${request._id}`,
      requestId: request._id,
    });

    const populated = await request.populate(populateOptions);
    res.status(200).json({ success: true, message: 'Request cancelled', request: populated });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Delete request permanently (Requester owner, only if Cancelled or Pending)
// @route   DELETE /api/requests/:id
// @access  Private / Requester owner
// ----------------------------------------------------------
const deleteRequest = async (req, res, next) => {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (String(request.requesterId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (!['Pending', 'Cancelled'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: 'Only pending or cancelled requests can be deleted',
      });
    }

    if (request.image && request.image.startsWith('/uploads/')) {
      const old = path.join(__dirname, '..', request.image);
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }

    await request.deleteOne();
    res.status(200).json({ success: true, message: 'Request deleted' });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Volunteer accepts a request
// @route   PATCH /api/requests/:id/accept
// @access  Private / Volunteer
// ----------------------------------------------------------
const acceptRequest = async (req, res, next) => {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (String(request.requesterId) === String(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot accept your own request',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept a request with status "${request.status}"`,
      });
    }

    if (request.volunteerId) {
      return res.status(400).json({
        success: false,
        message: 'This request has already been assigned',
      });
    }

    request.volunteerId = req.user.id;
    request.status = 'Accepted';
    request.acceptedAt = new Date();
    await request.save();

    await createNotification({
      userId: request.requesterId,
      message: `${req.user.firstName} ${req.user.lastName} accepted your "${request.title}" request.`,
      type: 'request_accepted',
      link: `/dashboard/requests/${request._id}`,
      requestId: request._id,
    });

    await createNotification({
      userId: req.user.id,
      message: `You've been assigned to "${request.title}".`,
      type: 'request_assigned',
      link: `/dashboard/requests/${request._id}`,
      requestId: request._id,
    });

    const populated = await request.populate(populateOptions);
    res.status(200).json({
      success: true,
      message: 'Request accepted successfully',
      request: populated,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Volunteer updates status (Accepted → In Progress → Completed)
// @route   PATCH /api/requests/:id/status
// @access  Private / Assigned volunteer
// ----------------------------------------------------------
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['In Progress', 'Completed'];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status can only be updated to: ${allowed.join(', ')}`,
      });
    }

    const request = await HelpRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (!request.volunteerId || String(request.volunteerId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned volunteer can update progress',
      });
    }

    // Forward-only transitions
    const order = ['Accepted', 'In Progress', 'Completed'];
    if (order.indexOf(status) <= order.indexOf(request.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot move from "${request.status}" to "${status}"`,
      });
    }

    request.status = status;
    if (status === 'Completed') request.completedAt = new Date();
    await request.save();

    if (status === 'In Progress') {
    await createNotification({
      userId: request.requesterId,
      message: `${req.user.firstName} started working on "${request.title}".`,
      type: 'request_started',
      link: `/dashboard/requests/${request._id}`,
      requestId: request._id,
    });
  }

  if (status === 'Completed') {
    await createNotification({
      userId: request.requesterId,
      message: `Your "${request.title}" request has been completed. 🎉`.replace(' 🎉', ''),
      type: 'request_completed',
      link: `/dashboard/requests/${request._id}`,
      requestId: request._id,
    });
  }

    const populated = await request.populate(populateOptions);
    res.status(200).json({ success: true, message: 'Status updated', request: populated });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Requester stats (counts + totals)
// @route   GET /api/requests/stats/me
// @access  Private / Requester
// ----------------------------------------------------------
const getMyStats = async (req, res, next) => {
  try {
    const uid = req.user.id;

    const [
      total,
      pending,
      accepted,
      inProgress,
      completed,
      cancelled,
    ] = await Promise.all([
      HelpRequest.countDocuments({ requesterId: uid }),
      HelpRequest.countDocuments({ requesterId: uid, status: 'Pending' }),
      HelpRequest.countDocuments({ requesterId: uid, status: 'Accepted' }),
      HelpRequest.countDocuments({ requesterId: uid, status: 'In Progress' }),
      HelpRequest.countDocuments({ requesterId: uid, status: 'Completed' }),
      HelpRequest.countDocuments({ requesterId: uid, status: 'Cancelled' }),
    ]);

    // Category breakdown for chart
    const byCategory = await HelpRequest.aggregate([
      { $match: { requesterId: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        accepted,
        inProgress,
        active: accepted + inProgress,
        completed,
        cancelled,
      },
      byCategory,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Volunteer stats
// @route   GET /api/requests/stats/volunteer
// @access  Private / Volunteer
// ----------------------------------------------------------
const getVolunteerStats = async (req, res, next) => {
  try {
    const uid = req.user.id;

    const [available, accepted, inProgress, completed] = await Promise.all([
      HelpRequest.countDocuments({
        status: 'Pending',
        volunteerId: null,
        requesterId: { $ne: uid },
      }),
      HelpRequest.countDocuments({ volunteerId: uid, status: 'Accepted' }),
      HelpRequest.countDocuments({ volunteerId: uid, status: 'In Progress' }),
      HelpRequest.countDocuments({ volunteerId: uid, status: 'Completed' }),
    ]);

    const totalAssigned = accepted + inProgress + completed;

    // Category breakdown for the volunteer's work
    const byCategory = await HelpRequest.aggregate([
      { $match: { volunteerId: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        available,
        assigned: totalAssigned,
        accepted,
        inProgress,
        active: inProgress,
        completed,
      },
      byCategory,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Admin global stats + chart data
// @route   GET /api/requests/stats/admin
// @access  Private / Admin
// ----------------------------------------------------------
const getAdminStats = async (req, res, next) => {
  try {
    const User = require('../models/User');

    const [
      totalUsers,
      totalVolunteers,
      totalRequesters,
      totalAdmins,
      activeUsers,
      totalRequests,
      pending,
      accepted,
      inProgress,
      completed,
      cancelled,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'volunteer' }),
      User.countDocuments({ role: 'requester' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ isActive: true }),
      HelpRequest.countDocuments(),
      HelpRequest.countDocuments({ status: 'Pending' }),
      HelpRequest.countDocuments({ status: 'Accepted' }),
      HelpRequest.countDocuments({ status: 'In Progress' }),
      HelpRequest.countDocuments({ status: 'Completed' }),
      HelpRequest.countDocuments({ status: 'Cancelled' }),
    ]);

    // Requests by category
    const byCategory = await HelpRequest.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Requests by status
    const byStatus = await HelpRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Requests by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const byMonthRaw = await HelpRequest.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Fill missing months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: d.toLocaleString('en', { month: 'short' }),
        count: 0,
      });
    }
    byMonthRaw.forEach((row) => {
      const slot = months.find(
        (m) => m.year === row._id.year && m.month === row._id.month
      );
      if (slot) slot.count = row.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          volunteers: totalVolunteers,
          requesters: totalRequesters,
          admins: totalAdmins,
          active: activeUsers,
        },
        requests: {
          total: totalRequests,
          pending,
          accepted,
          inProgress,
          active: accepted + inProgress,
          completed,
          cancelled,
        },
      },
      charts: {
        byCategory: byCategory.map((c) => ({ name: c._id, value: c.count })),
        byStatus: byStatus.map((s) => ({ name: s._id, value: s.count })),
        byMonth: months.map((m) => ({ name: m.label, value: m.count })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// @desc    Admin delete any request (remove inappropriate)
// @route   DELETE /api/requests/:id/admin
// @access  Private / Admin
// ----------------------------------------------------------
const adminDeleteRequest = async (req, res, next) => {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.image && request.image.startsWith('/uploads/')) {
      const old = path.join(__dirname, '..', request.image);
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }

    await request.deleteOne();
    res.status(200).json({ success: true, message: 'Request removed by admin' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  cancelRequest,
  deleteRequest,
  acceptRequest,
  updateStatus,
  getMyStats,
  getVolunteerStats,
  getAdminStats,
  adminDeleteRequest,
};