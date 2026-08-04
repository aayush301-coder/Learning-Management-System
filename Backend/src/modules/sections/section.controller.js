const asyncHandler = require('../../utils/asyncHandler');

const sectionService = require('./section.service');


const getSectionsByCourse = asyncHandler(async (req, res) => {

    const sections = await sectionService.getSectionsByCourse(req.validated.params);

    res.status(200).json({

        success: true,
        message: 'Sections retrieved successfully',
        data: sections,

    });

});


const createSection = asyncHandler(async (req, res) => {

    const section = await sectionService.createSection(req.validated.params, req.validated.body, req.user);

    res.status(201).json({

        success: true,
        message: 'Section created successfully',
        data: section,

    });

});


const updateSection = asyncHandler(async (req, res) => {

    const section = await sectionService.updateSection(req.validated.params, req.validated.body, req.user);

    res.status(200).json({

        success: true,
        message: 'Section updated successfully',
        data: section,

    });

});


const deleteSection = asyncHandler(async (req, res) => {

    const result = await sectionService.deleteSection(req.validated.params, req.user);

    res.status(200).json({

        success: true,
        message: 'Section deleted successfully',
        data: result,

    });

});


module.exports = {
    getSectionsByCourse,
    createSection,
    updateSection,
    deleteSection,
};
