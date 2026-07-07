const asyncHandler = require('../../utils/asyncHandler');
const sectionService = require('./section.service');

const createSection = asyncHandler(async (req, res) => {
    const result = await sectionService.createSection(req.validated.params, req.validated.body, req.user);
    return res.status(201).json({
        success: true,
        message: 'Section Created Successfully',
        data: result
    });
});

const getSectionsByCourse = asyncHandler(async (req, res) => {
    const result = await sectionService.getSectionsByCourse(req.validated.params, req.user);
    return res.status(200).json({
        success: true,
        message: 'Sections Fetched Successfully',
        data: result
    });
});

const getSectionById = asyncHandler(async (req, res) => {
    const result = await sectionService.getSectionById(req.validated.params, req.user);
    return res.status(200).json({
        success: true,
        message: 'Section Fetched Successfully',
        data: result
    });
});

const updateSection = asyncHandler(async (req, res) => {
    const result = await sectionService.updateSection(req.validated.params, req.validated.body, req.user);
    return res.status(200).json({
        success: true,
        message: 'Section Updated Successfully',
        data: result
    });
});

const deleteSection = asyncHandler(async (req, res) => {
    const result = await sectionService.deleteSection(req.validated.params, req.user);
    return res.status(200).json({
        success: true,
        message: result.message
    });
});

module.exports = {
    createSection,
    getSectionsByCourse,
    getSectionById,
    updateSection,
    deleteSection
};
